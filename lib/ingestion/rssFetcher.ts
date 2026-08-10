// ================================================================
// GenZ Live — RSS/Atom Feed Ingestion Service
// Fetches, parses, normalizes, and sanitizes external news feed items
// Integrated with SSRF Guard protection
// ================================================================

import { safeFetch } from '@/lib/security/ssrfGuard';
import { stripHtml } from '@/lib/sanitizer';
import { computeHash, normalizeUrl, normalizeTitle } from '@/lib/ingestion/deduplicator';

export interface IngestedStoryPayload {
  sourceUrl: string;
  urlHash: string;
  sourceTitle: string;
  titleHash: string;
  sourceDescription?: string;
  sourceAuthor?: string;
  sourcePublishedAt?: Date;
  categorySuggestion?: string;
}

/** Parse XML tag inner text safely */
function extractTagContent(xmlText: string, tagName: string): string {
  // Handle CDATA e.g. <title><![CDATA[Headline]]></title>
  const cdataRegex = new RegExp(`<${tagName}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tagName}>`, 'i');
  const cdataMatch = xmlText.match(cdataRegex);
  if (cdataMatch && cdataMatch[1]) {
    return cdataMatch[1].trim();
  }

  const tagRegex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xmlText.match(tagRegex);
  if (match && match[1]) {
    return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim();
  }

  return '';
}

/** Extract attribute value e.g. <link href="..." /> */
function extractAttribute(xmlText: string, tagName: string, attrName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*\\b${attrName}=["']([^"']+)["'][^>]*>`, 'i');
  const match = xmlText.match(regex);
  return match ? match[1].trim() : '';
}

/** Fetch and parse RSS / Atom feed using SSRF Guard */
export async function fetchAndParseFeed(feedUrl: string): Promise<IngestedStoryPayload[]> {
  const response = await safeFetch(feedUrl, { timeoutMs: 12000, maxSizeBytes: 3 * 1024 * 1024 });
  const xmlText = await response.text();

  const items: IngestedStoryPayload[] = [];

  // Match RSS <item> or Atom <entry>
  const itemMatches = xmlText.match(/<(?:item|entry)[\s\S]*?<\/(?:item|entry)>/gi) || [];

  for (const itemXml of itemMatches) {
    const rawTitle = extractTagContent(itemXml, 'title');
    let rawLink = extractTagContent(itemXml, 'link');

    if (!rawLink) {
      rawLink = extractAttribute(itemXml, 'link', 'href');
    }

    if (!rawTitle || !rawLink) continue;

    const cleanTitle = stripHtml(rawTitle);
    const normalizedLink = normalizeUrl(rawLink);
    const rawDesc = extractTagContent(itemXml, 'description') || extractTagContent(itemXml, 'summary') || extractTagContent(itemXml, 'content');
    const cleanDesc = stripHtml(rawDesc).slice(0, 1000); // Store up to 1000 chars max
    const author = stripHtml(extractTagContent(itemXml, 'author') || extractTagContent(itemXml, 'dc:creator'));
    const pubDateStr = extractTagContent(itemXml, 'pubDate') || extractTagContent(itemXml, 'published') || extractTagContent(itemXml, 'updated');
    const category = stripHtml(extractTagContent(itemXml, 'category'));

    let publishedAt: Date | undefined = undefined;
    if (pubDateStr) {
      const parsedDate = new Date(pubDateStr);
      if (!isNaN(parsedDate.getTime())) {
        publishedAt = parsedDate;
      }
    }

    const urlHash = computeHash(normalizedLink);
    const titleHash = computeHash(normalizeTitle(cleanTitle));

    items.push({
      sourceUrl: normalizedLink,
      urlHash,
      sourceTitle: cleanTitle,
      titleHash,
      sourceDescription: cleanDesc || undefined,
      sourceAuthor: author || undefined,
      sourcePublishedAt: publishedAt,
      categorySuggestion: category || undefined,
    });
  }

  return items;
}
