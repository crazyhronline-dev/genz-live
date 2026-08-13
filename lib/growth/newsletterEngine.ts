// ================================================================
// GenZ Live — Newsletter Subscription & Retention Engine
// Saves reader email subscriptions with explicit consent.
// ================================================================

import prisma from '@/lib/prisma';

export interface NewsletterSubscribeResult {
  success: boolean;
  message: string;
}

export async function subscribeToNewsletter(email: string, source = 'website'): Promise<NewsletterSubscribeResult> {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please provide a valid email address.' };
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.isActive) {
        return { success: true, message: 'You are already subscribed to GenZ Live updates!' };
      }

      await prisma.newsletterSubscriber.update({
        where: { email: cleanEmail },
        data: { isActive: true, source },
      });

      return { success: true, message: 'Welcome back! Your subscription has been reactivated.' };
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        source,
        isActive: true,
      },
    });

    return { success: true, message: 'Thank you for subscribing to GenZ Live — The Voice of GenZ!' };
  } catch (error) {
    console.error('[subscribeToNewsletter Error]:', error);
    return { success: false, message: 'Unable to process subscription at this time.' };
  }
}
