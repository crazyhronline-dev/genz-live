# 💵 GenZ Live AdSense Readiness Auditor & Quality Gate Manual

## 📌 Architecture Overview

The **GenZ Live AdSense Readiness Auditor** (`lib/adsense/auditor.ts`) automatically audits the website against **30 practical criteria** across 5 categories prior to submitting a Google AdSense application.

> ⚠️ **Disclaimer Notice**: *"This is an internal quality assessment, not a Google approval prediction or guarantee."*
> The system evaluates editorial, technical, legal, and search optimization standards to ensure pre-application compliance.

---

## 📊 30 Audit Checks & Scoring Weighting (Total: 100 Points)

### Category A — Content Quality (30 Points)
1. **CHECK 01 — Original Content Value (5 pts, CRITICAL)**: Ensures articles provide unique editorial commentary and synthesis rather than copied feeds.
2. **CHECK 02 — Copy/Paste Content Scan (3 pts)**: Uses Phase 8 Originality Engine to flag >50% structural phrase overlaps.
3. **CHECK 03 — Source Dependency / Synonym Rewrite (3 pts)**: Flags heavy source phrase dependence for human editor review.
4. **CHECK 04 — AI Editorial Review Workflow (3 pts, CRITICAL)**: Verifies that AI-assisted drafts receive explicit staff editor review before publication.
5. **CHECK 05 — Article Depth & Word Count (3 pts)**: Flags thin articles containing fewer than 200 words.
6. **CHECK 06 — Text Formatting & HTML Hygiene (3 pts)**: Scans for broken paragraphs, placeholder text (`lorem ipsum`), or malformed tags.
7. **CHECK 07 — Factual Verification Quality (3 pts)**: Uses Phase 8 Fact-Checker to detect unverified assertions.
8. **CHECK 08 — Quote Verification Audit (3 pts)**: Ensures direct quotes are attributed to verified primary sources.
9. **CHECK 09 — Statistics & Data Verification (2 pts)**: Verifies numerical, financial, or statistical figures.
10. **CHECK 10 — News Sourcing & Attribution (2 pts)**: Enforces explicit publisher credits when summarizing third-party news.

### Category B — Newsroom Trust / Transparency (20 Points)
11. **CHECK 11 — Staff Authorship Integrity (4 pts, CRITICAL)**: Ensures staff writer profiles are assigned instead of generic "Admin" accounts.
12. **CHECK 12 — Author Profile Pages (4 pts)**: Validates accessible bios and published stories at `/authors/[slug]`.
13. **CHECK 13 — About Publisher Page (4 pts, CRITICAL)**: Validates organization identity and mission at `/about`.
14. **CHECK 14 — Editorial & Ethics Policy (4 pts)**: Validates published standards at `/editorial-policy`.
15. **CHECK 15 — Corrections Policy (4 pts)**: Validates error reporting mechanism at `/corrections-policy`.

### Category C — Trust & Legal (10 Points)
16. **CHECK 16 — Contact Page Accessibility (2 pts, CRITICAL)**: Ensures valid contact forms and email details at `/contact`.
17. **CHECK 17 — Privacy Policy & Cookies (2 pts, CRITICAL)**: Validates privacy policy at `/privacy-policy` covering cookies and ad networks.
18. **CHECK 18 — Terms of Service (2 pts)**: Validates site usage terms at `/terms`.
19. **CHECK 19 — Legal & Editorial Disclaimer (2 pts)**: Validates opinion and financial/health disclaimers at `/disclaimer`.
20. **CHECK 20 — AdSense ads.txt Configuration (2 pts)**: Verifies `ADSENSE_PUBLISHER_ID` status at `/ads.txt`.

### Category D — Technical Quality (20 Points)
21. **CHECK 21 — HTTPS Security & Canonical Scheme (4 pts, CRITICAL)**: Enforces HTTPS URL schemes (`https://genz-live.com`).
22. **CHECK 22 — Mobile Responsiveness & Viewport (4 pts)**: Audits fluid layouts across 375px–1280px screen widths.
23. **CHECK 23 — Site Navigation & Breadcrumbs (4 pts)**: Audits category headers, breadcrumbs, and internal linking.
24. **CHECK 24 — Public Route Health (4 pts)**: Validates clean HTTP 200 status responses for core pages.
25. **CHECK 25 — Robots.txt, XML Sitemaps & RSS Feeds (4 pts, CRITICAL)**: Audits `/robots.txt`, `/sitemap.xml`, `/news-sitemap.xml`, `/rss.xml`.

### Category E — SEO & Indexing (20 Points)
26. **CHECK 26 — Google Search Console API Integration (4 pts)**: Checks Search Console API service account readiness.
27. **CHECK 27 — Canonical Tag Enforcement (4 pts)**: Audits self-referencing canonical meta tags across published stories.
28. **CHECK 28 — NewsArticle JSON-LD Schema (4 pts)**: Validates NewsArticle, NewsMediaOrganization, and BreadcrumbList schemas.
29. **CHECK 29 — Public Search Indexing Audit (4 pts, CRITICAL)**: Ensures public news pages do not accidentally contain `noindex`.
30. **CHECK 30 — Demo & Placeholder Content Scanner (4 pts, CRITICAL)**: Detects "demo" or "test" content in published stories.

---

## 🚦 Readiness Levels & Critical Overrides

- **READY TO APPLY (GREEN)**: 85–100 points, zero critical blockers.
- **ALMOST READY (YELLOW)**: 70–84 points, minor quality improvements recommended.
- **NOT READY (RED)**: 0–69 points OR presence of any Critical Blocker failure.

---

## 💻 Admin CMS Access

Access the master auditor dashboard at:
`https://genz-live.com/admin/adsense-readiness`
