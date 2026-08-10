import type { Metadata } from 'next';
import StaticPage from '@/components/layout/StaticPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Terms of Service',
  description: 'Terms and conditions governing your use of GenZ Live — the digital news and media platform.',
});

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Service" subtitle="Please read these terms carefully before using GenZ Live" lastUpdated="August 2026">
      <p>By accessing or using <strong>genz-live.com</strong>, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>

      <h2>1. Use of the Service</h2>
      <p>GenZ Live grants you a limited, non-exclusive, non-transferable license to access and use our content for personal, non-commercial purposes. You may not reproduce, redistribute, or commercially exploit any content without explicit written permission.</p>

      <h2>2. User Conduct</h2>
      <ul>
        <li>You must not use the platform to spread misinformation or harmful content</li>
        <li>You must not attempt to hack, scrape, or disrupt our infrastructure</li>
        <li>You must not impersonate GenZ Live or its staff</li>
        <li>Comments and user submissions must comply with our Community Guidelines</li>
      </ul>

      <h2>3. Intellectual Property</h2>
      <p>All content published on GenZ Live — including articles, images, videos, logos, and design — is the intellectual property of GenZ Live Media or its content partners. Unauthorized reproduction is prohibited.</p>

      <h2>4. Third-Party Links</h2>
      <p>Our platform may contain links to external websites. GenZ Live is not responsible for the content or practices of any third-party site and we encourage you to review their terms and privacy policies.</p>

      <h2>5. Disclaimers</h2>
      <p>Content on GenZ Live is provided for informational purposes only. We strive for accuracy but do not guarantee that all information is complete, current, or error-free. Nothing on this site constitutes financial, legal, or medical advice.</p>

      <h2>6. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, GenZ Live shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform or inability to access it.</p>

      <h2>7. Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms. Material changes will be communicated via the website.</p>

      <h2>8. Contact</h2>
      <p>For legal inquiries, contact us at <a href="mailto:legal@genz-live.com">legal@genz-live.com</a>.</p>
    </StaticPage>
  );
}
