import type { Metadata } from 'next';
import StaticPage from '@/components/layout/StaticPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Corrections Policy',
  description: 'How GenZ Live handles corrections and updates to published articles. Transparency is a core value of our journalism.',
});

export default function CorrectionsPolicyPage() {
  return (
    <StaticPage title="Corrections Policy" subtitle="How we handle errors and updates to published articles" lastUpdated="August 2026">
      <p>GenZ Live is committed to publishing accurate information. When we make mistakes, we correct them openly and promptly. Transparency in corrections is a core part of our editorial integrity.</p>

      <h2>1. How We Handle Corrections</h2>
      <ul>
        <li><strong>Minor factual errors</strong> (e.g., a misspelled name, wrong date) are corrected immediately and noted at the bottom of the article with a timestamp</li>
        <li><strong>Significant factual errors</strong> are corrected with a clearly labeled correction note at the top of the article explaining what was wrong and what the correct information is</li>
        <li><strong>Substantive errors</strong> that affect the overall meaning of a piece may result in the article being updated or, in rare cases, removed, with an explanation published in its place</li>
      </ul>

      <h2>2. Correction Format</h2>
      <p>All corrections follow this format:</p>
      <div className="section-card" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
        <strong style={{ color: '#f97316' }}>CORRECTION (DD/MM/YYYY):</strong> An earlier version of this article stated [original error]. This has been corrected to [accurate information]. We regret the error.
      </div>

      <h2>3. Reporting an Error</h2>
      <p>If you believe an article contains a factual error, please contact us at <a href="mailto:corrections@genz-live.com">corrections@genz-live.com</a> with:</p>
      <ul>
        <li>The URL of the article in question</li>
        <li>The specific error you have identified</li>
        <li>Evidence or sources supporting the correct information</li>
      </ul>
      <p>We aim to respond to all correction requests within <strong>48 hours</strong>.</p>

      <h2>4. Retractions</h2>
      <p>In rare cases where an article is fundamentally flawed or was published in bad faith, we may issue a full retraction. Retractions are published prominently and the original article is removed or clearly marked as retracted.</p>

      <h2>5. Updates vs. Corrections</h2>
      <p>When we add new information to a developing story, we label it as an <strong>UPDATE</strong>, not a correction. This distinction ensures readers understand the difference between new facts and errors.</p>
    </StaticPage>
  );
}
