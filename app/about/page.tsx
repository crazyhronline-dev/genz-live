import type { Metadata } from 'next';
import StaticPage from '@/components/layout/StaticPage';
import { buildPageMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = buildPageMetadata({
  title: 'About Us',
  description: 'Learn about GenZ Live — the independent digital news and media platform built for the next generation. Our mission, team, and values.',
});

export default function AboutPage() {
  return (
    <StaticPage title="About GenZ Live" subtitle="The Voice of GenZ — Our Story, Mission & Values">
      <div className="section-card">
        <h2 style={{ marginTop: 0 }}>Who We Are</h2>
        <p>
          <strong>GenZ Live</strong> is an independent global digital news and media platform built for a generation that demands authenticity, speed, and depth. We cover World, India, Technology, AI, Business, Markets, Entertainment, Sports, Culture, and the most talked-about trends — without compromise.
        </p>
        <p>
          We are not affiliated with any political party, government, or corporate conglomerate. Our journalism is funded by our community and advertising partners who share our commitment to unbiased reporting.
        </p>
      </div>

      <h2>Our Mission</h2>
      <p>
        To build the world&apos;s most trusted news platform for people under 35 — delivering raw, fact-checked, and engaging stories that matter to the next generation. We believe that complex global events can be reported accurately without being boring, and that world-class journalism should be accessible to everyone.
      </p>

      <h2>What We Cover</h2>
      <ul>
        <li><strong>World News</strong> — Global events, geopolitics, and international affairs</li>
        <li><strong>India</strong> — Politics, economy, culture, and society across India</li>
        <li><strong>Technology</strong> — Gadgets, software, cybersecurity, and the digital world</li>
        <li><strong>Artificial Intelligence</strong> — AI breakthroughs, ethics, and the future of intelligence</li>
        <li><strong>Business</strong> — Startups, entrepreneurship, and the global economy</li>
        <li><strong>Markets</strong> — Stocks, crypto, commodities, and financial news</li>
        <li><strong>Entertainment</strong> — Film, music, streaming, and pop culture</li>
        <li><strong>Sports</strong> — Cricket, football, esports, and athlete stories</li>
        <li><strong>Culture</strong> — Art, fashion, identity, and lifestyle</li>
        <li><strong>Trending</strong> — The most viral stories from around the world</li>
      </ul>

      <h2>Our Platforms</h2>
      <ul>
        <li><strong>Website:</strong> <a href={SITE_CONFIG.domain}>{SITE_CONFIG.domain}</a></li>
        <li><strong>YouTube:</strong> <a href={SITE_CONFIG.youtube.url}>{SITE_CONFIG.youtube.handle}</a> — {SITE_CONFIG.youtube.subscribers}+ Subscribers</li>
        <li><strong>Instagram:</strong> <a href={SITE_CONFIG.social.instagram}>@genzliveofficial</a></li>
        <li><strong>Facebook:</strong> <a href={SITE_CONFIG.social.facebook}>@genzliveofficial</a></li>
      </ul>

      <h2>Our Values</h2>
      <ul>
        <li><strong>Independence</strong> — We answer only to our readers and our editorial standards</li>
        <li><strong>Accuracy</strong> — We verify before we publish. Every time.</li>
        <li><strong>Speed</strong> — Breaking news within minutes, not hours</li>
        <li><strong>Transparency</strong> — We publish corrections openly and honestly</li>
        <li><strong>Inclusion</strong> — Diverse voices, perspectives, and stories from every corner of the world</li>
      </ul>
    </StaticPage>
  );
}
