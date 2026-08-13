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
 * Validates whether a URL is a valid, secure public HTTPS URL belonging to genz-live.com.
 * Strictly rejects localhost, private IPs, HTTP, external domains, scheme injections, and admin paths.
 */
export function isValidIndexNowUrl(inputUrl: string): boolean {
  if (!inputUrl || typeof inputUrl !== 'string') return false;

  let trimmed = inputUrl.trim();

  // Convert relative path to full canonical URL
  if (trimmed.startsWith('/')) {
    trimmed = `${SITE_CONFIG.domain}${trimmed}`;
  }

  // Reject any non-HTTPS scheme (HTTP, file://, javascript:, data:, etc.)
  if (!trimmed.startsWith('https://')) return false;

  try {
    const parsed = new URL(trimmed);
    const canonicalHost = new URL(SITE_CONFIG.domain).hostname.toLowerCase();

    // 1. Strict Hostname Matching
    if (parsed.hostname.toLowerCase() !== canonicalHost) {
      return false;
    }

    // 2. Reject IPv4 / IPv6 / Localhost
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname) || parsed.hostname.includes('[') || parsed.hostname === 'localhost') {
      return false;
    }

    // 3. Reject Credentials or odd ports
    if (parsed.username || parsed.password || (parsed.port && parsed.port !== '443')) {
      return false;
    }

    // 4. Reject Private / Admin / API routes
    const pathname = parsed.pathname.toLowerCase();
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/preview')
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Format relative path or raw string into clean HTTPS canonical URL
 */
export function formatIndexNowUrl(inputUrl: string): string {
  const trimmed = inputUrl.trim();
  if (trimmed.startsWith('/')) {
    return `${SITE_CONFIG.domain}${trimmed}`;
  }
  return trimmed;
}

/**
 * Asynchronously notify IndexNow search engine endpoints about URL changes.
 * Non-blocking: fails gracefully without exposing keys or interrupting workflows.
 */
export async function notifyIndexNow(urls: string | string[]): Promise<boolean> {
  const apiKey = process.env.INDEXNOW_KEY;

  // Silently return false if IndexNow key is not configured in environment
  if (!apiKey || apiKey.trim() === '') {
    return false;
  }

  const canonicalHost = new URL(SITE_CONFIG.domain).hostname;
  const rawArray = Array.isArray(urls) ? urls : [urls];

  // Filter & sanitize valid HTTPS canonical URLs only
  const validUrls = rawArray
    .map(formatIndexNowUrl)
    .filter(isValidIndexNowUrl);

  if (validUrls.length === 0) return false;

  // Deduplicate URLs
  const uniqueUrls = Array.from(new Set(validUrls)).slice(0, 10000); // IndexNow batch cap: 10,000 URLs

  const payload: IndexNowPayload = {
    host: canonicalHost,
    key: apiKey.trim(),
    keyLocation: `${SITE_CONFIG.domain}/${apiKey.trim()}.txt`,
    urlList: uniqueUrls,
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
  } catch {
    console.error('[IndexNow Notification Error]: Submission failed safely');
    return false;
  }
}
