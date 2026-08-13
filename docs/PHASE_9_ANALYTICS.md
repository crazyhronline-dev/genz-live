# 📈 GenZ Live Newsroom Growth, SEO Intelligence & Editorial Analytics Manual

## 📌 Overview & Purpose

The **GenZ Live Newsroom Growth, SEO Intelligence & Editorial Analytics Platform** equips editors and managers with story performance tracking, traffic velocity trends, headline quality evaluation, author/category analytics, content decay detection, internal link suggestions, technical SEO health monitoring, and IndexNow status.

---

## 🧭 Dashboard Navigation Guide

1. **Master Analytics Dashboard (`/admin/analytics`)**:
   - Total published stories, today's publication count, total audience views, top categories.
   - **Trending Recommendations**: Highlights articles with high traffic velocity for Trending or Breaking news status.
   - **Content Decay Intelligence**: Identifies older evergreen articles experiencing traffic decline and suggests content refresh opportunities.
2. **Author Performance Analytics (`/admin/analytics/authors`)**:
   - Total published stories, cumulative views, and average views per story per author.
3. **Category Performance Analytics (`/admin/analytics/categories`)**:
   - Category performance metrics and audience distribution.
4. **Technical SEO Health & Indexing Monitor (`/admin/seo`)**:
   - Scans meta titles, meta descriptions, canonical URLs, image alt tags, NewsArticle JSON-LD, internal links, sitemaps (`sitemap.xml`, `news-sitemap.xml`), RSS (`rss.xml`), and IndexNow status.

---

## 🔒 Security, Privacy & Search Console Setup

- **Role-Based Authorization**: Protected server-side. Only `SUPER_ADMIN`, `ADMIN`, and `EDITOR` roles can access growth analytics.
- **Privacy & Anonymization**: Individual reader identities are never exposed or collected.
- **Google Search Console API Configuration**:
  To connect live Search Console API data into `/admin/analytics`, set:
  ```env
  GSC_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
  GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
  ```
  If unconfigured, the dashboard displays **Internal Analytics** cleanly without error.
