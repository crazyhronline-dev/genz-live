// ================================================================
// GenZ Live — Lightweight Editorial HTML Sanitizer
// Prevents Stored XSS, script injection, event handler injection,
// and malicious URL schemes (javascript:, data:text/html)
// Compatible with Node.js & Hostinger VPS
// ================================================================

/** Sanitize HTML string to prevent XSS attacks while preserving editorial elements */
export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  let sanitized = rawHtml;

  // 1. Remove dangerous executable tags completely along with their inner content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^>]*>/gi, '');
  sanitized = sanitized.replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '');
  sanitized = sanitized.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');
  sanitized = sanitized.replace(/<base\b[^>]*>/gi, '');

  // 2. Strip inline event handlers (onerror, onload, onclick, onmouseover, etc.)
  sanitized = sanitized.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. Strip dangerous protocol schemes in href/src attributes (javascript:, vbscript:, data:text/html)
  sanitized = sanitized.replace(/(href|src)\s*=\s*["']?\s*(?:javascript|vbscript|data\s*:\s*text\/html):[^"'\s>]+/gi, '$1="#"');

  return sanitized;
}
