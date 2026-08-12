# Deploy on Vercel — portfolio.divyanshraj.in

## 1) Push code to GitHub

In `web/` folder:

```bash
git init
git add .
git commit -m "feat: Next.js AI portfolio with Sarvam"
gh repo create divyansh-ai-portfolio --private --source=. --remote=origin --push
```

(Or create repo on github.com and `git remote add origin ...` then `git push -u origin main`.)

## 2) Import on Vercel

1. Open https://vercel.com/new
2. Import the GitHub repo
3. **Root Directory:** leave default (repo is already the Next app)
4. Framework: Next.js (auto)
5. **Environment Variables** (Production + Preview):
   - `SARVAM_API_KEY` = your Sarvam key (optional if Mongo cache is seeded)
   - `MONGODB_URI` = your MongoDB Atlas connection string (**required** for quick-topic cache)
   - `CRON_SECRET` = any long random string (protects Atlas keep-alive cron)
   - `SARVAM_MODEL` = `sarvam-105b` (optional)
   - `SARVAM_API_BASE_URL` = `https://api.sarvam.ai` (optional)
6. Click **Deploy**

Quick Topics (skills / projects / experience / …) are stored in MongoDB after the first answer — later clicks are instant and cost **0 Sarvam tokens**.

**Atlas keep-alive:** Vercel Cron hits `/api/cron/mongo-keepalive` every **5 days** (ping + tiny write) so the free cluster does not auto-pause from inactivity.

## 3) Custom domain: portfolio.divyanshraj.in

### On Vercel
1. Project → **Settings** → **Domains**
2. Add: `portfolio.divyanshraj.in`
3. Vercel will show a DNS target (usually a CNAME to `cname.vercel-dns.com`)

### On GoDaddy (divyanshraj.in)
1. Domain → **DNS** / Manage DNS
2. Add record:
   - **Type:** CNAME
   - **Name:** `portfolio`
   - **Value:** `cname.vercel-dns.com` (use exact value Vercel shows)
   - **TTL:** 1 hour / default
3. Save. Wait 5–30 min for SSL + DNS.

Do **not** point the GoDaddy free “Coming Soon” site at this — Vercel serves the app.

## 4) Verify

- https://your-project.vercel.app
- https://portfolio.divyanshraj.in

Chat should hit same-origin `/api/ask` (no Render).
