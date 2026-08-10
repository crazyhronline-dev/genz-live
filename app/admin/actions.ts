'use server';

import { redirect } from 'next/navigation';
import { getCurrentUser, setAuthCookie, clearAuthCookie, createSessionToken, verifyPassword, hasPermission } from '@/lib/auth';
import { logAuditAction } from '@/lib/auditLogger';
import { sanitizeHtml } from '@/lib/sanitizer';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/rateLimiter';
import prisma from '@/lib/prisma';
import type { ArticleStatus, UserRole } from '@prisma/client';

const isDbEnabled = process.env.ENABLE_DB_PRISMA === 'true';

/** 1. LOGIN ACTION WITH RATE LIMITING */
export async function loginAction(formData: FormData): Promise<void> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string)?.trim();

  if (!email || !password) {
    redirect('/admin/login?error=Please+provide+both+email+and+password.');
  }

  // Rate Limiting Check
  const rateLimitKey = `login_${email}`;
  const rateCheck = checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    redirect('/admin/login?error=Too+many+failed+login+attempts.+Please+wait+15+minutes.');
  }

  if (isDbEnabled) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.isActive) {
        recordFailedAttempt(rateLimitKey);
        redirect('/admin/login?error=Invalid+credentials+or+inactive+account.');
      }

      const isValid = verifyPassword(password, user.password);
      if (!isValid) {
        recordFailedAttempt(rateLimitKey);
        redirect('/admin/login?error=Invalid+credentials.');
      }

      // Reset rate limit on successful authentication
      resetRateLimit(rateLimitKey);

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      const token = createSessionToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      await setAuthCookie(token);
      await logAuditAction({ userId: user.id, action: 'USER_LOGIN', entityType: 'User', entityId: user.id });

      redirect('/admin');
    } catch (err) {
      if ((err as Error).message === 'NEXT_REDIRECT') throw err;
      recordFailedAttempt(rateLimitKey);
      redirect('/admin/login?error=Authentication+failed.');
    }
  }

  // Development Fallback Authentication
  if (process.env.NODE_ENV !== 'production') {
    if (email === 'admin@genz-live.com' || password.length >= 6) {
      resetRateLimit(rateLimitKey);
      const role: UserRole = email.includes('editor') ? 'EDITOR' : email.includes('writer') ? 'AUTHOR' : 'ADMIN';
      const token = createSessionToken({
        id: 'demo-user-1',
        email: email || 'admin@genz-live.com',
        name: email.split('@')[0] || 'GenZ Administrator',
        role,
      });

      await setAuthCookie(token);
      redirect('/admin');
    }
  }

  recordFailedAttempt(rateLimitKey);
  redirect('/admin/login?error=Invalid+credentials.+Use+admin@genz-live.com.');
}

/** 2. LOGOUT ACTION */
export async function logoutAction(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    await logAuditAction({ userId: user.id, action: 'USER_LOGOUT', entityType: 'User', entityId: user.id });
  }
  await clearAuthCookie();
  redirect('/admin/login');
}

/** 3. SAVE / CREATE ARTICLE ACTION WITH INPUT SANITIZATION & AUTHORIZATION */
export async function saveArticleAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const id = formData.get('id') as string | null;
  const title = (formData.get('title') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim();
  const excerpt = (formData.get('excerpt') as string)?.trim() || null;
  const rawContent = (formData.get('content') as string)?.trim() || '';
  const categoryId = formData.get('categoryId') as string;
  const authorId = formData.get('authorId') as string;
  const status = (formData.get('status') as ArticleStatus) || 'DRAFT';
  const featuredImage = (formData.get('featuredImage') as string)?.trim() || null;
  const featuredImageAlt = (formData.get('featuredImageAlt') as string)?.trim() || null;
  const isFeatured = formData.get('isFeatured') === 'on';
  const isTrending = formData.get('isTrending') === 'on';
  const isBreaking = formData.get('isBreaking') === 'on';
  const seoTitle = (formData.get('seoTitle') as string)?.trim() || null;
  const seoDescription = (formData.get('seoDescription') as string)?.trim() || null;

  if (!title || !rawContent) {
    redirect('/admin/articles/new?error=Title+and+content+are+required.');
  }

  // HTML XSS Sanitization
  const content = sanitizeHtml(rawContent);

  // Server-side role permission check
  if ((status === 'PUBLISHED' || status === 'SCHEDULED') && !hasPermission(user.role, ['ADMIN', 'EDITOR'])) {
    redirect('/admin/articles/new?error=Your+role+cannot+publish+directly.');
  }

  // Auto-generate and sanitize slug (alphanumeric and hyphens only)
  if (!slug) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  } else {
    slug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)/g, '');
  }

  if (isDbEnabled) {
    try {
      if (id) {
        // Update
        const existing = await prisma.article.findUnique({ where: { id } });

        // AUTHOR/WRITER role check: can only edit own articles unless EDITOR/ADMIN
        if (!hasPermission(user.role, ['ADMIN', 'EDITOR']) && existing && existing.authorId !== user.id) {
          redirect('/admin/articles?error=Permission+denied:+You+can+only+edit+your+own+articles.');
        }

        const updated = await prisma.article.update({
          where: { id },
          data: {
            title,
            slug,
            excerpt,
            content,
            status,
            categoryId,
            authorId,
            featuredImage,
            featuredImageAlt,
            isFeatured,
            isTrending,
            isBreaking,
            seoTitle,
            seoDescription,
            publishedAt: status === 'PUBLISHED' ? existing?.publishedAt || new Date() : existing?.publishedAt,
          },
        });

        await logAuditAction({ userId: user.id, action: `ARTICLE_UPDATED_${status}`, entityType: 'Article', entityId: updated.id });
      } else {
        // Create
        const created = await prisma.article.create({
          data: {
            title,
            slug,
            excerpt,
            content,
            status,
            categoryId,
            authorId,
            featuredImage,
            featuredImageAlt,
            isFeatured,
            isTrending,
            isBreaking,
            seoTitle,
            seoDescription,
            publishedAt: status === 'PUBLISHED' ? new Date() : null,
          },
        });

        await logAuditAction({ userId: user.id, action: `ARTICLE_CREATED_${status}`, entityType: 'Article', entityId: created.id });
      }
    } catch {
      // Fallback
    }
  }

  redirect('/admin/articles');
}

/** 4. UPDATE ARTICLE STATUS (Approve / Review / Archive / Publish) WITH ROLE CHECK */
export async function updateArticleStatusAction(articleId: string, newStatus: ArticleStatus): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  if ((newStatus === 'PUBLISHED' || newStatus === 'SCHEDULED' || newStatus === 'ARCHIVED') && !hasPermission(user.role, ['ADMIN', 'EDITOR'])) {
    redirect('/admin/articles?error=Permission+denied.');
  }

  if (isDbEnabled) {
    try {
      const existing = await prisma.article.findUnique({ where: { id: articleId } });
      await prisma.article.update({
        where: { id: articleId },
        data: {
          status: newStatus,
          publishedAt: newStatus === 'PUBLISHED' ? existing?.publishedAt || new Date() : existing?.publishedAt,
        },
      });

      await logAuditAction({ userId: user.id, action: `ARTICLE_STATUS_${newStatus}`, entityType: 'Article', entityId: articleId });
    } catch {
      // Fallback
    }
  }

  redirect('/admin/articles');
}
