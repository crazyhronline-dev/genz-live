// ================================================================
// GenZ Live — SSRF (Server-Side Request Forgery) Protection Engine
// Blocks access to internal networks, localhost, cloud metadata services,
// private IP ranges, and non-HTTP protocols.
// ================================================================

import dns from 'dns/promises';
import { URL } from 'url';

interface SsrfValidationResult {
  allowed: boolean;
  reason?: string;
  normalizedUrl?: string;
}

/** Check if an IP address belongs to private/internal/reserved subnets */
export function isPrivateIp(ip: string): boolean {
  // IPv6 loopback / local
  if (ip === '::1' || ip === '0:0:0:0:0:0:0:1' || ip.startsWith('fe80:') || ip.startsWith('fc00:') || ip.startsWith('fd00:')) {
    return true;
  }

  // IPv4 mapped IPv6 e.g. ::ffff:127.0.0.1
  const ipv4Match = ip.match(/(?:(?::ffff:)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))/i);
  const cleanIp = ipv4Match ? ipv4Match[1] : ip;

  const parts = cleanIp.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return false; // Not a valid IPv4 string
  }

  const [a, b] = parts;

  // 0.0.0.0/8 (Broadcast/Current network)
  if (a === 0) return true;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 10.0.0.0/8 (Private Network)
  if (a === 10) return true;

  // 172.16.0.0/12 (Private Network: 172.16.0.0 - 172.31.255.255)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16 (Private Network)
  if (a === 192 && b === 168) return true;

  // 169.254.0.0/16 (Link-local / AWS / GCP / Azure Metadata Endpoint 169.254.169.254)
  if (a === 169 && b === 254) return true;

  // 100.64.0.0/10 (Carrier-grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;

  return false;
}

/** Validate external URL for SSRF vulnerabilities before executing HTTP fetch */
export async function validateExternalUrl(urlString: string): Promise<SsrfValidationResult> {
  if (!urlString || typeof urlString !== 'string') {
    return { allowed: false, reason: 'URL string is empty or invalid.' };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlString.trim());
  } catch {
    return { allowed: false, reason: 'Invalid URL format.' };
  }

  // 1. Protocol check: allow only http: and https:
  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    return { allowed: false, reason: `Forbidden protocol scheme: ${parsedUrl.protocol}` };
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // 2. Hostname blocklist check
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.local') ||
    hostname === 'metadata.google.internal'
  ) {
    return { allowed: false, reason: `Forbidden internal hostname: ${hostname}` };
  }

  // 3. DNS resolution check — resolve hostname to IP address to prevent DNS rebinding
  try {
    const addresses = await dns.lookup(hostname, { all: true });

    for (const record of addresses) {
      if (isPrivateIp(record.address)) {
        return { allowed: false, reason: `Host resolves to restricted IP: ${record.address}` };
      }
    }
  } catch {
    return { allowed: false, reason: `Failed to resolve hostname: ${hostname}` };
  }

  return {
    allowed: true,
    normalizedUrl: parsedUrl.toString(),
  };
}

/** Safe fetch wrapper enforcing SSRF validation, size limit, and timeout */
export async function safeFetch(
  urlString: string,
  options: { timeoutMs?: number; maxSizeBytes?: number } = {}
): Promise<Response> {
  const { timeoutMs = 10000, maxSizeBytes = 2 * 1024 * 1024 } = options;

  const validation = await validateExternalUrl(urlString);
  if (!validation.allowed || !validation.normalizedUrl) {
    throw new Error(`SSRF Guard Blocked Request: ${validation.reason}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(validation.normalizedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'GenZLiveNewsroom/1.0 (+https://genz-live.com)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/json, text/html',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    // Validate final redirected URL as well
    if (response.url) {
      const redirectValidation = await validateExternalUrl(response.url);
      if (!redirectValidation.allowed) {
        throw new Error(`SSRF Guard Blocked Redirect: ${redirectValidation.reason}`);
      }
    }

    // Check content length header if present
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
      throw new Error(`Response size (${contentLength} bytes) exceeds maximum limit (${maxSizeBytes} bytes).`);
    }

    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if ((err as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms.`);
    }
    throw err;
  }
}
