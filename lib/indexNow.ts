// ================================================================
// GenZ Live — IndexNow Real-Time Search Engine Notification Utility
// Notifies Bing, Yandex, Naver, and Seznam instantly when an article is
// published, updated, or deleted on genz-live.com.
// ================================================================

import { SITE_CONFIG } from '@/config/site';

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation?: string;
  urlList: string[];
}

/**
 * Asynchronously notify IndexNow search engine endpoints about URL changes.
 * Non-blocking: fails gracefully without interrupting application workflow.
 */
export async function notifyIndexNow(urls: string | string[]): Promise<boolean> {
  const apiKey = process.env.INDEXNOW_KEY;

  // Fail silently if IndexNow key is not configured or in development mode
  if (!apiKey || apiKey.trim() === '') {
    return false;
  }

  const domainHost = 'genz-live.com';
  const urlArray = Array.isArray(urls) ? urls : [urls];

  // Clean and validate URLs
  const validUrls = urlArray
    .map(u => (u.startsWith('http') ? u : `${SITE_CONFIG.domain}${u.startsWith('/') ? '' : '/'}${u}`))
    .filter(u => u.includes('genz-live.com'));

  if (validUrls.length === 0) return false;

  const payload: IndexNowPayload = {
    host: domainHost,
    key: apiKey,
    keyLocation: `${SITE_CONFIG.domain}/${apiKey}.txt`,
    urlList: validUrls,
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return response.ok || response.status === 202;
  } catch (error) {
    console.error('[IndexNow Notification Error]:', error);
    return false;
  }
}
