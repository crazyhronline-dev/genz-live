// ================================================================
// GenZ Live — Administrator & Staff Authentication System
// Secure PBKDF2 password hashing & signed HTTP-only session cookies
// Compatible with Node.js & Hostinger VPS (No Vercel-specific deps)
// ================================================================

import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import type { UserRole } from '@prisma/client';

const AUTH_SECRET = process.env.AUTH_SECRET || 'genz-live-secret-key-change-in-production-2026';
const COOKIE_NAME = 'genz_admin_session';
const PBKDF2_ITERATIONS = 210000; // OWASP recommended iterations

export interface AdminUserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/** 1. Hash Password with PBKDF2 (210,000 Iterations) */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/** 2. Timing-Safe Password Verification */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex');
    const hashBuf = Buffer.from(hash, 'hex');
    const origBuf = Buffer.from(originalHash, 'hex');

    if (hashBuf.length !== origBuf.length) return false;
    return crypto.timingSafeEqual(hashBuf, origBuf);
  } catch {
    return false;
  }
}

/** 3. Sign Token */
function signPayload(payload: string): string {
  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `${payload}.${signature}`;
}

/** 4. Verify & Parse Signed Token with Length Checks */
function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const lastDotIndex = token.lastIndexOf('.');
    if (lastDotIndex === -1) return null;
    const payload = token.slice(0, lastDotIndex);
    const signature = token.slice(lastDotIndex + 1);

    const expectedHmac = crypto.createHmac('sha256', AUTH_SECRET);
    expectedHmac.update(payload);
    const expectedSignature = expectedHmac.digest('hex');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decoded.exp && Date.now() > decoded.exp) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

/** 5. Create Session Cookie Value */
export function createSessionToken(user: { id: string; email: string; name: string; role: UserRole }): string {
  const payloadData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 Hours
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payloadData)).toString('base64url');
  return signPayload(payloadBase64);
}

/** 6. Get Current Authenticated User (Server-Side) */
export async function getCurrentUser(): Promise<AdminUserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const parsed = verifyToken(token);
    if (!parsed || !parsed.id) return null;

    // Direct database validation when DB is enabled
    if (process.env.ENABLE_DB_PRISMA === 'true') {
      const dbUser = await prisma.user.findUnique({
        where: { id: parsed.id as string },
        select: { id: true, email: true, name: true, role: true, isActive: true },
      });

      if (!dbUser || !dbUser.isActive) return null;

      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
      };
    }

    return {
      id: parsed.id as string,
      email: parsed.email as string,
      name: parsed.name as string,
      role: parsed.role as UserRole,
    };
  } catch {
    return null;
  }
}

/** 7. Check User Role Permissions */
export function hasPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') return true;
  return requiredRoles.includes(userRole);
}

/** 8. Set Auth Session Cookie */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
  });
}

/** 9. Clear Auth Cookie (Logout) */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
