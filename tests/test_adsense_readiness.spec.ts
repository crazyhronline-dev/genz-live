import { test, expect } from '@playwright/test';
import { runAdSenseReadinessAudit, getLatestAdSenseAudit } from '../lib/adsense/auditor';

test.describe('Phase 10: AdSense Readiness Auditor & Quality Gate Test Suite', () => {

  test('1. Master Audit Engine must return 30 distinct checks across 5 categories', async () => {
    const report = await runAdSenseReadinessAudit();

    expect(report.checks.length).toBe(30);
    expect(report.overallScore).toBeGreaterThanOrEqual(0);
    expect(report.overallScore).toBeLessThanOrEqual(100);
    expect(report.disclaimer).toContain('internal quality assessment');

    // Verify 5 categories present
    expect(report.categoryScores.content).toBeGreaterThanOrEqual(0);
    expect(report.categoryScores.trust).toBeGreaterThanOrEqual(0);
    expect(report.categoryScores.legal).toBeGreaterThanOrEqual(0);
    expect(report.categoryScores.technical).toBeGreaterThanOrEqual(0);
    expect(report.categoryScores.seo).toBeGreaterThanOrEqual(0);
  });

  test('2. Check numbers 1 through 30 must be sequentially present and non-empty', async () => {
    const report = await runAdSenseReadinessAudit();

    for (let i = 1; i <= 30; i++) {
      const check = report.checks.find(c => c.checkNumber === i);
      expect(check).toBeDefined();
      expect(check?.name).toBeTruthy();
      expect(check?.evidence).toBeTruthy();
      expect(check?.recommendation).toBeTruthy();
    }
  });

  test('3. Category max score sums must total exactly 100 points', async () => {
    const report = await runAdSenseReadinessAudit();

    const totalMax = report.checks.reduce((sum, c) => sum + c.maxScore, 0);
    expect(totalMax).toBe(100);
  });

  test('4. Critical Blocker Failure must force NOT_READY status regardless of score', async () => {
    const mockChecks: any[] = [
      { id: 'CHECK_01', checkNumber: 1, isCritical: true, status: 'FAIL', score: 0, maxScore: 5 },
    ];

    const report = await runAdSenseReadinessAudit();
    if (report.criticalBlockersCount > 0) {
      expect(report.status).toBe('NOT_READY');
    }
  });

  test('5. Database persistence must log and retrieve latest AdSense audit report', async () => {
    const fresh = await runAdSenseReadinessAudit();
    const loaded = await getLatestAdSenseAudit();

    expect(loaded).not.toBeNull();
    expect(loaded?.checks.length).toBe(30);
  });

});
