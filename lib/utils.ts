// GenZ Live — Shared Utility Functions

/**
 * Format a number to human-readable string (e.g. 1200 → "1.2k")
 */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

/**
 * Slugify a string for URL use
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Strip HTML tags from a content string (for excerpt generation)
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '');
}

/**
 * Generate a plain-text excerpt from HTML content
 */
export function getExcerpt(html: string, maxLength = 120): string {
  const plain = stripHtml(html).trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trim() + '…';
}

/**
 * Simple class name concatenation helper
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
