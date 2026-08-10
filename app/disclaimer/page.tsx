import type { Metadata } from 'next';
import StaticPage from '@/components/layout/StaticPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Disclaimer',
  description: "Legal disclaimer for GenZ Live's news and media content. Understanding the limitations of our published information.",
});

export default function DisclaimerPage() {
  return (
    <StaticPage title="Disclaimer" subtitle="Important legal notice regarding GenZ Live content" lastUpdated="August 2026">
      <p>The information published on <strong>GenZ Live (genz-live.com)</strong> is provided for general informational and educational purposes only. While we make every effort to ensure accuracy, we make no representations or warranties, express or implied, about the completeness, accuracy, reliability, or suitability of any information on this site.</p>

      <h2>No Professional Advice</h2>
      <p>Nothing on GenZ Live constitutes professional advice of any kind, including but not limited to:</p>
      <ul>
        <li><strong>Financial Advice</strong> — Market reports and investment news are informational only. Always consult a qualified financial advisor before making investment decisions.</li>
        <li><strong>Legal Advice</strong> — Legal news and analysis does not constitute legal counsel. Consult a qualified solicitor for legal advice.</li>
        <li><strong>Medical Advice</strong> — Health-related content is informational only and should not replace consultation with a qualified medical professional.</li>
      </ul>

      <h2>Forward-Looking Statements</h2>
      <p>Some content may include forward-looking statements, predictions, or analysis about future events. These are opinions based on available information at the time of publication and should not be relied upon as predictions of actual outcomes.</p>

      <h2>External Links</h2>
      <p>GenZ Live may contain links to external websites. We are not responsible for the content, accuracy, or practices of any third-party website. The inclusion of a link does not imply our endorsement of that site or its content.</p>

      <h2>User-Generated Content</h2>
      <p>Where user comments or submissions are published, GenZ Live does not necessarily endorse the views expressed. We reserve the right to remove content that violates our community guidelines.</p>

      <h2>Limitation of Liability</h2>
      <p>To the fullest extent permitted by applicable law, GenZ Live shall not be liable for any loss or damage, direct or indirect, arising from your reliance on information published on this website.</p>

      <h2>Changes to This Disclaimer</h2>
      <p>We may update this disclaimer from time to time. Continued use of the site after changes constitutes acceptance of the updated disclaimer.</p>

      <h2>Contact</h2>
      <p>Questions about this disclaimer can be directed to <a href="mailto:legal@genz-live.com">legal@genz-live.com</a>.</p>
    </StaticPage>
  );
}
