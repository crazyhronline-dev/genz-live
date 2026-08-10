# GenZ Live — Non-Technical Founder Deployment Checklist

> **Welcome!**  
> All code development, security hardening, database modeling, and build optimizations have already been completed and verified by Antigravity.  
> Follow this simple checklist when you are ready to launch **GenZ Live** on Hostinger.

---

## ✅ WHAT ANTIGRAVITY HAS ALREADY DONE FOR YOU

- [x] **Full Website & Frontend Built:** Public news portal, categories, search, trending ticker, video hub, and mobile responsive design.
- [x] **Admin CMS & Newsroom Created:** Dashboard, article editor, review queues, author management, and breaking news control.
- [x] **AI-Assisted Newsroom Integrated:** RSS wire ingestion, SSRF protection, duplicate story detection, fact extraction, and AI draft generation.
- [x] **Strict Safety Rules Enforced:** AI cannot automatically publish articles. Initial AI drafts enter `DRAFT` status and require your editorial approval.
- [x] **Technical SEO & Feeds Configured:** XML Sitemap (`/sitemap.xml`), Google News Sitemap (`/news-sitemap.xml`), RSS 2.0 Feed (`/rss.xml`), Schema.org JSON-LD, and robots rules.
- [x] **Security Hardened:** PBKDF2 password security, signed HTTP-only cookies, security headers, XSS sanitization, and rate limiting.
- [x] **Standalone Build Verified:** 100% compiled and tested for Hostinger Shared Hosting Node.js runtime.
- [x] **GitHub Codebase Synchronized:** All changes committed and pushed to `main` branch on GitHub.

---

## 📌 WHAT YOU NEED TO DO NOW (Step-by-Step)

Follow these exact steps when you log in to Hostinger:

### STEP 1: Log in to Hostinger
- Go to **[hpanel.hostinger.com](https://hpanel.hostinger.com)** and sign in.

---

### STEP 2: Create Your MySQL Database
1. In hPanel, go to **Databases** → **Management**.
2. Under **Create a New MySQL Database**, enter:
   - **Database Name:** `genzlive`
   - **Database Username:** `genzuser`
   - **Password:** Create a strong password and save it in a safe place.
3. Click **Create**.
4. Note your full database connection string format:
   `mysql://USERNAME:PASSWORD@localhost:3306/DATABASENAME`

---

### STEP 3: Set Up Your Node.js App in Hostinger
1. In hPanel, navigate to **Websites** → **Node.js**.
2. Click **Create Application**:
   - Select **Node.js 20.x** (or highest available 22.x).
   - Application Root: `/public_html` (or `genz-live`)
3. Click **Environment Variables** and add these values:
   - `NEXT_PUBLIC_SITE_URL` = `https://genz-live.com`
   - `DATABASE_URL` = `mysql://USERNAME:PASSWORD@localhost:3306/DATABASENAME`
   - `ENABLE_DB_PRISMA` = `true`
   - `AUTH_SECRET` = *(Generate any 32-character random text string)*
   - `ADMIN_EMAIL` = `admin@genz-live.com`
   - `ADMIN_PASSWORD` = *(Your chosen secure admin password)*
   - `CRON_SECRET` = *(Generate any random text string)*
   - `AI_PROVIDER` = `mock` *(or `openai` if you have an OpenAI API key)*
   - `AI_API_KEY` = *(Leave blank or enter your OpenAI key)*

---

### STEP 4: Run Initial Deployment Commands in Hostinger Terminal
1. Open Hostinger **SSH Terminal** or Node.js Console.
2. Run these exact commands:
   ```bash
   git clone https://github.com/crazyhronline-dev/genz-live.git .
   npm install
   npx prisma db push
   npm run build
   ```
3. Click **Restart Application** in hPanel.

---

### STEP 5: Add Automatic Feed Ingestion Cron Job
1. In hPanel, go to **Advanced** → **Cron Jobs**.
2. Choose **Custom Cron Job** and set schedule to `*/30 * * * *` (Every 30 minutes).
3. Enter Command:
   ```bash
   curl -s "https://genz-live.com/api/cron/ingest?secret=YOUR_CRON_SECRET" > /dev/null
   ```

---

### STEP 6: Verify Your Live Site & Log In
1. Visit **`https://genz-live.com`** in your web browser.
2. Go to **`https://genz-live.com/admin/login`** and sign in with your admin email and password.
3. Visit `https://genz-live.com/api/health` to confirm system status is **OK**.
