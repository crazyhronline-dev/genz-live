// ================================================================
// GenZ Live — Editorial Alerts Engine
// Generates actionable newsroom alerts for editors.
// ================================================================

import prisma from '@/lib/prisma';

export interface NewsroomAlertItem {
  id: string;
  title: string;
  message: string;
  type: 'TRAFFIC_SPIKE' | 'CONTENT_DECAY' | 'SEO_ERROR' | 'FACT_CHECK_WARNING' | 'INFO';
  articleId?: string;
  createdAt: Date;
}

export async function fetchActiveEditorialAlerts(): Promise<NewsroomAlertItem[]> {
  try {
    const dbAlerts = await prisma.editorialAlert.findMany({
      where: { isDismissed: false },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return dbAlerts.map(a => ({
      id: a.id,
      title: a.title,
      message: a.message,
      type: a.type as NewsroomAlertItem['type'],
      articleId: a.articleId || undefined,
      createdAt: a.createdAt,
    }));
  } catch {
    return [];
  }
}
