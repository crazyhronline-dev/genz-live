import type { Metadata } from 'next';
import StaticPage from '@/components/layout/StaticPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description: "GenZ Live's privacy policy — how we collect, use, and protect your personal information.",
});

export default function PrivacyPolicyPage() {
  return (
    <StaticPage title="Privacy Policy" subtitle="How we collect, use, and protect your information" lastUpdated="August 2026">
      <p>Your privacy is important to us. This Privacy Policy explains how <strong>GenZ Live</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects, uses, and protects your personal information when you visit <strong>genz-live.com</strong> or interact with our services.</p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Usage Data</strong> — Pages visited, time spent, referring URLs, and browser/device information</li>
        <li><strong>Account Data</strong> — If you create an account: name, email address, and password (stored encrypted)</li>
        <li><strong>Newsletter Data</strong> — Email address if you subscribe to our newsletter</li>
        <li><strong>Contact Data</strong> — Information you provide when contacting us</li>
        <li><strong>Cookies</strong> — We use cookies to personalize your experience and analyze site traffic</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To deliver, maintain, and improve our news services</li>
        <li>To send you newsletters and updates (only if you opt-in)</li>
        <li>To respond to your support or press inquiries</li>
        <li>To detect and prevent fraud or abuse</li>
        <li>To comply with applicable legal obligations</li>
      </ul>

      <h2>3. Data Sharing</h2>
      <p>We do <strong>not</strong> sell your personal data. We may share information with trusted service providers who assist in delivering our services (e.g., analytics, email delivery), under strict data processing agreements.</p>

      <h2>4. Cookies & Tracking</h2>
      <p>We use first-party cookies and may use Google Analytics for traffic analysis. You can disable cookies in your browser settings, though some features may not function correctly. We respect Do Not Track (DNT) browser signals where technically possible.</p>

      <h2>5. Data Retention</h2>
      <p>We retain your data only as long as necessary to provide the service or as required by law. Newsletter subscribers can unsubscribe at any time using the link in each email.</p>

      <h2>6. Your Rights</h2>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
        <li>Withdraw consent at any time where processing is based on consent</li>
      </ul>

      <h2>7. Contact</h2>
      <p>For privacy-related requests, email us at <a href="mailto:privacy@genz-live.com">privacy@genz-live.com</a>.</p>
    </StaticPage>
  );
}
