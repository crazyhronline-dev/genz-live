import type { Metadata } from 'next';
import StaticPage from '@/components/layout/StaticPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Editorial Policy',
  description: "GenZ Live's editorial standards, guidelines, and the principles that govern how we report the news.",
});

export default function EditorialPolicyPage() {
  return (
    <StaticPage title="Editorial Policy" subtitle="The principles and standards that govern GenZ Live journalism" lastUpdated="August 2026">
      <p>GenZ Live is committed to the highest standards of independent, fact-based journalism. This policy outlines the principles our editorial team follows to ensure accuracy, fairness, and integrity in every story we publish.</p>

      <h2>1. Independence</h2>
      <p>Our editorial decisions are made free from commercial, political, or personal influence. Advertisers and sponsors have no input on editorial content. Our newsroom operates independently from our business team.</p>

      <h2>2. Accuracy & Verification</h2>
      <ul>
        <li>All factual claims must be verified by at least two independent sources before publication</li>
        <li>Breaking news stories will be labeled as developing and updated as facts emerge</li>
        <li>Statistics and data are cited from primary sources</li>
        <li>All quotes are verified and attributed accurately</li>
      </ul>

      <h2>3. Fairness & Balance</h2>
      <p>We aim to present multiple perspectives on complex issues, particularly in political and social coverage. When a subject or organization is mentioned critically, we seek their comment before publication. Opinions are clearly labeled and separated from news reporting.</p>

      <h2>4. Transparency</h2>
      <ul>
        <li>Reporters disclose potential conflicts of interest to their editors</li>
        <li>Sponsored content and paid partnerships are clearly labeled</li>
        <li>AI-assisted tools used in research or production are disclosed where relevant</li>
      </ul>

      <h2>5. Source Confidentiality</h2>
      <p>We protect the identity of confidential sources. Anonymous sources are only used when there is a compelling public interest and no other way to obtain the information. The reason for anonymity will be explained to readers where possible.</p>

      <h2>6. Diversity & Inclusion</h2>
      <p>We are committed to representing diverse voices, perspectives, and communities in our coverage. Our team reflects the global audience we serve.</p>

      <h2>7. Corrections</h2>
      <p>Errors are corrected promptly and transparently. See our <a href="/corrections-policy">Corrections Policy</a> for full details.</p>

      <h2>8. Editorial Complaints</h2>
      <p>Concerns about our editorial coverage may be submitted to <a href="mailto:editorial@genz-live.com">editorial@genz-live.com</a>. All complaints are reviewed by a senior editor within 5 working days.</p>
    </StaticPage>
  );
}
