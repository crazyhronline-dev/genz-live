# GenZ Live — Non-Technical Founder Deployment Guide (Hostinger Business Shared Hosting)

> **Welcome!**  
> This guide is written specifically for you as the non-technical founder of **GenZ Live**.  
> Every line of code, security rule, database model, and build optimization has been completed and verified by Antigravity.  
> Follow these simple step-by-step instructions to deploy your live platform to Hostinger.

---

## 🎯 OVERVIEW OF THE DEPLOYMENT PROCESS

```mermaid
flowchart LR
    A["1. Log in to Hostinger"] --> B["2. Create Database"]
    B --> C["3. Create Node.js App"]
    C --> D["4. Add Env Variables"]
    D --> E["5. Run SSH Setup"]
    E --> F["6. Add Cron Job"]
    F --> G["7. Launch Site!"]
```

---

## 📍 STEP 1: Log into Hostinger hPanel

1. Open your web browser and go to **[hpanel.hostinger.com](https://hpanel.hostinger.com)**.
2. Sign in with your Hostinger account credentials.
3. Click on **Websites** in the top navigation bar.

* **WHAT TO CLICK:** `Websites` → `Manage` (next to `genz-live.com`).
* **WHAT SUCCESS LOOKS LIKE:** You see your website management dashboard.

---

## 💾 STEP 2: Create Your MySQL Production Database

1. In hPanel left sidebar, go to **Databases** → **Management**.
2. Under **Create a New MySQL Database and Database User**:
   * **Database Name:** Type `genzlive_db` *(Hostinger auto-prefixes this, e.g. `u123456789_genzlive_db`)*.
   * **Database Username:** Type `genzlive_user` *(e.g. `u123456789_genzlive_user`)*.
   * **Password:** Enter a strong password. **Write down your password immediately.**
3. Click **Create**.
4. Note down your full **DATABASE_URL** string format:
   ```text
   mysql://u123456789_genzlive_user:YOUR_PASSWORD@127.0.0.1:3306/u123456789_genzlive_db
   ```

* **WHAT NOT TO CHANGE:** Do not change the host `127.0.0.1` or port `3306`.
* **WHAT SUCCESS LOOKS LIKE:** Green success message "Database created successfully".

---

## ⚙️ STEP 3: Create Node.js Application on Hostinger

1. In hPanel left sidebar, navigate to **Websites** → **Node.js** (or search for `Node.js` in hPanel search bar).
2. Click **Create Application** (or **Configure Node.js**):
   * **Node.js Version:** Select **Node.js 20.x** (or highest available 22.x).
   * **Application Root Directory:** `/public_html` (or `genz-live`)
   * **Application Startup File:** `node_modules/next/dist/bin/next` (or `server.js`)
3. Click **Save**.

---

## 🔑 STEP 4: Add Environment Variables in Hostinger

In the **Environment Variables** panel of your Node.js app settings in Hostinger, add these key-value pairs one by one:

| Environment Variable Key | Exact Value to Enter | Notes / Instructions |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://genz-live.com` | Primary canonical URL |
| `NEXT_PUBLIC_SITE_NAME` | `GenZ Live` | Branding name |
| `NEXT_PUBLIC_SITE_TAGLINE` | `The Voice of GenZ` | Branding tagline |
| `DATABASE_URL` | `mysql://USER:PASS@127.0.0.1:3306/DB` | Enter your full MySQL URL from Step 2 |
| `ENABLE_DB_PRISMA` | `true` | Enables MySQL database mode |
| `AUTH_SECRET` | *(Generate a 32-character random text)* | Keeps your login sessions secure |
| `ADMIN_EMAIL` | `admin@genz-live.com` | Initial admin login email |
| `ADMIN_PASSWORD` | *(Enter a strong admin password)* | Initial admin login password |
| `CRON_SECRET` | *(Generate a random text string)* | Keeps your automated news feed safe |
| `AI_PROVIDER` | `mock` | Change to `openai` if using live OpenAI key |
| `AI_MODEL` | `gpt-4o-mini` | AI newsroom model |
| `AI_API_KEY` | *(Leave empty or enter OpenAI key)* | Server-side secret key |

* **WHAT NOT TO CHANGE:** Do not expose `AUTH_SECRET`, `ADMIN_PASSWORD`, or `DATABASE_URL` anywhere publicly.
* **WHAT SUCCESS LOOKS LIKE:** All 12 variables listed under "Environment Variables".

---

## 🖥️ STEP 5: Connect GitHub & Run Deployment Commands

1. Open Hostinger **SSH Terminal** or the **Web Console** inside hPanel.
2. Run these commands line by line:
   ```bash
   git clone https://github.com/crazyhronline-dev/genz-live.git .
   npm install
   npx prisma db push
   npm run build
   ```
3. After the build succeeds, click **Restart Application** in your Hostinger Node.js dashboard.

* **WHAT SUCCESS LOOKS LIKE:** The terminal shows `✓ Generating static pages (51/51)` and returns to prompt.

---

## ⏰ STEP 6: Configure Hostinger Scheduled Feed Ingestion Cron Job

To automatically fetch news wire feeds every 30 minutes:

1. In hPanel left sidebar, go to **Advanced** → **Cron Jobs**.
2. Select **Custom Cron Job**.
3. Set schedule: `*/30 * * * *` (Every 30 minutes).
4. Command to run:
   ```bash
   curl -s "https://genz-live.com/api/cron/ingest?secret=YOUR_CRON_SECRET" > /dev/null
   ```
   *(Replace `YOUR_CRON_SECRET` with the exact text you set in Step 4)*.

---

## 🌐 STEP 7: Verify Live Platform & Perform Admin First Login

1. Visit **`https://genz-live.com`** in your browser. Confirm the homepage loads with breaking news ticker and category tabs.
2. Visit **`https://genz-live.com/api/health`**. Confirm it returns `{"status":"ok", ...}`.
3. Visit **`https://genz-live.com/admin/login`**. Log in using your `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
4. Navigate to **`https://genz-live.com/admin/ai-newsroom`** to review wire feeds, analyze stories, and generate drafts.
