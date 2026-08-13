import { test, expect } from '@playwright/test';
import { isValidIndexNowUrl, formatIndexNowUrl } from '../lib/indexNow';

test.describe('IndexNow Security & URL Validation Audit', () => {

  test('Valid GenZ Live HTTPS URLs must pass validation', () => {
    expect(isValidIndexNowUrl('https://genz-live.com/technology/ai-agent-breakthrough')).toBe(true);
    expect(isValidIndexNowUrl('https://genz-live.com/india/delhi-tech-summit')).toBe(true);
    expect(isValidIndexNowUrl('/world/global-climate-summit-2026')).toBe(true);
  });

  test('External domains must be rejected (Anti-Spam & SSRF Protection)', () => {
    expect(isValidIndexNowUrl('https://google.com/search')).toBe(false);
    expect(isValidIndexNowUrl('https://evil-attacker.com/malicious-payload')).toBe(false);
    expect(isValidIndexNowUrl('https://genz-live.com.attacker.com/spoof')).toBe(false);
  });

  test('HTTP URLs must be rejected (Canonical Enforces HTTPS)', () => {
    expect(isValidIndexNowUrl('http://genz-live.com/technology/ai-breakthrough')).toBe(false);
  });

  test('Localhost and Private IP addresses must be rejected (SSRF Protection)', () => {
    expect(isValidIndexNowUrl('http://localhost:3000/admin')).toBe(false);
    expect(isValidIndexNowUrl('https://localhost/technology/test')).toBe(false);
    expect(isValidIndexNowUrl('https://127.0.0.1/admin')).toBe(false);
    expect(isValidIndexNowUrl('https://192.168.1.1/secret')).toBe(false);
    expect(isValidIndexNowUrl('https://10.0.0.1/private')).toBe(false);
  });

  test('Dangerous schemes and malformed URLs must be rejected', () => {
    expect(isValidIndexNowUrl('javascript:alert(1)')).toBe(false);
    expect(isValidIndexNowUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isValidIndexNowUrl('file:///etc/passwd')).toBe(false);
    expect(isValidIndexNowUrl('https://admin:password@genz-live.com/test')).toBe(false);
  });

  test('Admin, API, and internal system paths must be rejected', () => {
    expect(isValidIndexNowUrl('https://genz-live.com/admin/dashboard')).toBe(false);
    expect(isValidIndexNowUrl('https://genz-live.com/api/upload')).toBe(false);
    expect(isValidIndexNowUrl('https://genz-live.com/_next/static/chunk.js')).toBe(false);
  });

  test('URL formatting converts relative paths correctly', () => {
    expect(formatIndexNowUrl('/technology/ai-breakthrough')).toBe('https://genz-live.com/technology/ai-breakthrough');
  });

});
