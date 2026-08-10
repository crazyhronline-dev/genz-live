# GenZ Live — Hostinger Production Deployment Guide

> **Written for Non-Technical Founders**  
> Follow these simple step-by-step instructions to deploy **GenZ Live** to Hostinger Business Shared Hosting.

---

## 📋 Pre-Deployment Checklist

Before you start, make sure you have:
1. Access to your **Hostinger hPanel** (`hpanel.hostinger.com`).
2. Your domain **`genz-live.com`** connected to Hostinger with SSL (HTTPS) enabled.
3. Your **GitHub repository** URL: `https://github.com/crazyhronline-dev/genz-live.git`.

---

## 🚀 Step 1: Create a MySQL Database on Hostinger

1. Log in to **Hostinger hPanel**.
2. Go to **Databases** → **Management**.
3. Create a new MySQL database:
   - **Database Name:** `u123456789_genzlive` *(Hostinger auto-prefixes this)*
   - **Database Username:** `u123456789_genzuser`
   - **Password:** *Enter a strong password and save it securely*
4. Note down your full **`DATABASE_URL`** string:
   ```text
   mysql://u123456789_genzuser:YOUR_PASSWORD@127.0.0.1:3306/u123456789_genzlive
   ```

---

## 🛠️ Step 2: Set Up Node.js Application on Hostinger

1. In hPanel, navigate to **Websites** → **Node.js**.
2. Click **Create Application**:
   - **Node.js Version:** Select **Node.js 20.x** (or highest 22.x available).
   - **Application Root:** `/public_html` (or `genz-live`)
   - **Application Startup File:** `node_modules/next/dist/bin/next` (or `server.js`)
3. Click **Save**.

---

## 🔑 Step 3: Configure Environment Variables

In the **Environment Variables** section of Hostinger Node.js manager (or inside a `.env` file in your app folder), add these key-value pairs:

```ini
NEXT_PUBLIC_SITE_URL=https://genz-live.com
NEXT_PUBLIC_SITE_NAME=GenZ Live
NEXT_PUBLIC_SITE_TAGLINE=The Voice of GenZ

DATABASE_URL=mysql://u123456789_genzuser:YOUR_PASSWORD@127.0.0.1:3306/u123456789_genzlive
ENABLE_DB_PRISMA=true

AUTH_SECRET=YOUR_RANDOM_LONG_SECRET_KEY_HERE
ADMIN_EMAIL=admin@genz-live.com
ADMIN_PASSWORD=YOUR_SECURE_ADMIN_PASSWORD

CRON_SECRET=YOUR_RANDOM_CRON_SECRET_KEY

AI_PROVIDER=mock
AI_MODEL=gpt-4o-mini
AI_API_KEY=
```

---

## 📦 Step 4: Install Dependencies & Run Database Setup

Open the Hostinger **SSH Terminal** or the Node.js **Console** in hPanel:

1. Clone or pull the latest code from GitHub:
   ```bash
   git clone https://github.com/crazyhronline-dev/genz-live.git .
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Push database schema to MySQL:
   ```bash
   npx prisma db push
   ```
4. Build the production application:
   ```bash
   npm run build
   ```
5. Restart the Node.js application in Hostinger hPanel.

---

## ⏰ Step 5: Configure Hostinger Scheduled Cron Job (RSS Ingestion)

To automatically fetch news wire feeds every 30 minutes:

1. In hPanel, go to **Advanced** → **Cron Jobs**.
2. Select **Custom Cron Job**.
3. Set schedule: `*/30 * * * *` (Every 30 minutes).
4. Command to run:
   ```bash
   curl -s "https://genz-live.com/api/cron/ingest?secret=YOUR_RANDOM_CRON_SECRET_KEY" > /dev/null
   ```

---

## 🔒 Step 6: First Admin Login & Verification

1. Open **`https://genz-live.com/admin/login`**.
2. Enter your credentials (`ADMIN_EMAIL` and `ADMIN_PASSWORD`).
3. Access the **AI Newsroom** at `/admin/ai-newsroom` to manage feeds, inspect stories, and draft articles.

---

## 🔍 Step 7: Verify Production Health & SEO Links

Visit the following URLs in your browser:
- Health Check: `https://genz-live.com/api/health`
- XML Sitemap: `https://genz-live.com/sitemap.xml`
- Google News Sitemap: `https://genz-live.com/news-sitemap.xml`
- RSS 2.0 Feed: `https://genz-live.com/rss.xml`
- Robots file: `https://genz-live.com/robots.txt`
