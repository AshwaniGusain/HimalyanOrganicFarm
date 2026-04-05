# Himalyan Organic Farm — Complete Deployment Guide

**Date Created:** April 5, 2026  
**Live Site:** https://himalyanorganicfarm.com  
**GitHub Repo:** https://github.com/ashwanigusain/HimalyanOrganicFarm  
**Cloudflare Worker:** `himalyan-organic-contact-api.ashwani12ksp.workers.dev`

---

## 1. Project Overview

You have built a **single-page B2B website** for selling bulk organic millet grains to businesses. The site is split into two parts:

- **Frontend (Static):** Single HTML file with CSS, JavaScript, and SVG illustrations hosted on GitHub Pages + custom domain
- **Backend (Serverless):** Cloudflare Worker that handles secure email submissions via Resend API

### Key Features

✅ 6-section navigation (Home, About, Products, Gallery, Testimonials, Contact)  
✅ Gallery image slider with navigation controls  
✅ Direct WhatsApp integration (+91 8077725460)  
✅ Contact form with honeypot spam protection  
✅ Himalayan mountain-themed design (green/gold/blue colors)  
✅ Mobile-responsive layout with hamburger menu  
✅ SEO-ready (sitemap, robots.txt, meta tags)  
✅ HTTPS secure domain (himalyanorganicfarm.com)

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                               │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ (1) HTTP/HTTPS GET
               ↓
┌─────────────────────────────────────────────────────────────────┐
│         GITHUB PAGES (Static Site Hosting)                      │
│  https://ashwanigusain.github.io/HimalyanOrganicFarm/           │
│                                                                 │
│  ├─ index.html (all content in one file)                        │
│  ├─ /assets/css/styles.css (mountain theme)                     │
│  ├─ /assets/js/main.js (form + gallery logic)                   │
│  └─ /assets/images/                                             │
│     ├─ hero/*.svg (field, farmers-network)                      │
│     ├─ products/*.svg (finger-millet, barnyard-millet)          │
│     └─ gallery/*.svg (3 Himalayan scenes)                       │
│                                                                 │
│  ✅ CNAME file points: himalyanorganicfarm.com                  │
│  ✅ Custom domain via GoDaddy DNS (A records + CNAME)           │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ (2) Form submission
               │ POST JSON to contact API
               ↓
┌─────────────────────────────────────────────────────────────────┐
│         CLOUDFLARE WORKER (Serverless Backend)                  │
│  https://himalyan-organic-contact-api.ashwani12ksp.workers.dev │
│                                                                 │
│  ├─ CORS validation (checks Origin header)                      │
│  ├─ Honeypot check (no spam bots)                               │
│  ├─ Input sanitization (prevents injection)                     │
│  ├─ Calls Resend API to send email                              │
│  └─ Returns JSON response to frontend                           │
│                                                                 │
│  Config: /Organic/worker/wrangler.toml                          │
│  Code: /Organic/worker/src/index.js                             │
│  Secrets: VERSION_1 deployed with all env vars                  │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ (3) Send email via Resend
               ↓
┌─────────────────────────────────────────────────────────────────┐
│              RESEND EMAIL API                                   │
│  https://api.resend.com/emails                                  │
│                                                                 │
│  ├─ FROM: onboarding@resend.dev                                 │
│  ├─ TO: ashwani12ksp@gmail.com                                  │
│  └─ CC: (currently empty - see Resend Upgrade section)          │
│                                                                 │
│  API Key: re_KUcWg5fs_CzLyUGQK5TZcLkWm9k9Y6FNY                  │
│  (stored securely as Cloudflare Worker secret)                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              YOUR EMAIL INBOX                                   │
│  ashwani12ksp@gmail.com                                         │
│                                                                 │
│  Subject: "New Enquiry from [name] - [business]"                │
│  Body: Contact details + message from website visitor           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Complete Deployment Steps (Already Done)

### Step 1: GitHub Pages Setup
- ✅ Created repo at `github.com/ashwanigusain/HimalyanOrganicFarm`
- ✅ Enabled GitHub Pages in Settings → Pages
- ✅ Added `CNAME` file with `himalyanorganicfarm.com`
- ✅ Added `.nojekyll` to skip Jekyll build (static HTML already ready)

**Files deployed:**
```
Organic/
├─ index.html (single-page app)
├─ CNAME (custom domain config)
├─ .nojekyll (disables Jekyll)
├─ sitemap.xml (SEO)
├─ robots.txt (SEO)
├─ assets/
│  ├─ css/styles.css
│  ├─ js/main.js
│  └─ images/
│     ├─ hero/
│     ├─ products/
│     ├─ gallery/
│     └─ logos/
```

### Step 2: Custom Domain (GoDaddy)
- ✅ Added 4 A records pointing to GitHub Pages IPs:
  ```
  @ A 185.199.108.153
  @ A 185.199.109.153
  @ A 185.199.110.153
  @ A 185.199.111.153
  ```
- ✅ Added CNAME for www subdomain:
  ```
  www CNAME ashwanigusain.github.io
  ```
- ✅ HTTPS auto-provisioned by GitHub Pages (Let's Encrypt cert)

### Step 3: Cloudflare Worker Deployment
- ✅ Created `/Organic/worker/` folder with Node.js project
- ✅ Installed Wrangler CLI (`npm install wrangler`)
- ✅ Logged in to Cloudflare (`wrangler login` → ashwani12ksp@gmail.com)
- ✅ Deployed worker: `npx wrangler deploy`

**Deployment command:**
```powershell
cd Organic/worker
npx wrangler deploy
```

### Step 4: Cloudflare Secrets Setup
Created 5 secrets in Cloudflare Dashboard (Settings → Variables & Secrets):

| Secret | Value |
|--------|-------|
| `RESEND_API_KEY` | `re_KUcWg5fs_CzLyUGQK5TZcLkWm9k9Y6FNY` |
| `FROM_EMAIL` | `onboarding@resend.dev` |
| `TO_EMAIL` | `ashwani12ksp@gmail.com` |
| `CC_EMAIL` | `` (empty) |
| `ALLOWED_ORIGINS` | `http://localhost:5500,https://ashwanigusain.github.io,https://himalyanorganicfarm.com,https://www.himalyanorganicfarm.com` |

**Where to find:** Cloudflare Dashboard → Workers & Pages → himalyan-organic-contact-api → Settings → Variables & Secrets

---

## 4. What is Cloudflare Workers?

**Simple Explanation:** Cloudflare Workers is a **free serverless platform** that runs your code at the edge (on Cloudflare's global server network) with no server maintenance.

### Why You Need It

Without Workers, your website would need:
- ❌ A server running 24/7 (costs $$$)
- ❌ SSL certificates managed manually
- ❌ Rate limiting, DDoS protection all your problem
- ❌ Storing API keys in frontend code (security disaster!)

With Workers:
- ✅ Code runs globally, near your users (fast)
- ✅ Free tier: 100K requests/day (plenty for a small B2B site)
- ✅ **API keys hidden** — stored as secrets, never exposed to browser
- ✅ Automatic HTTPS, caching, rate limiting
- ✅ Pay-as-you-go after free tier ($0.50 per million requests)

### How Your Worker Works

The Worker file (`/Organic/worker/src/index.js`) does this:

```javascript
// 1. Listen for POST requests to /api/contact
export default {
  async fetch(request, env) {
    if (request.method === 'POST' && new URL(request.url).pathname === '/api/contact') {
      
      // 2. Check if origin is allowed (CORS)
      const origin = request.headers.get('Origin');
      if (!env.ALLOWED_ORIGINS.includes(origin)) {
        return new Response('Origin not allowed', { status: 403 });
      }
      
      // 3. Get form data from request body
      const body = await request.json();
      const { name, email, business, message, website } = body;
      
      // 4. Check honeypot (spam protection)
      if (website !== '') {
        return new Response('Spam detected', { status: 400 });
      }
      
      // 5. Call Resend API to send email
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.FROM_EMAIL,
          to: env.TO_EMAIL,
          cc: env.CC_EMAIL,
          subject: `New Enquiry from ${name} - ${business}`,
          html: `<p>Name: ${name}</p>...`
        })
      });
      
      // 6. Return success/error to frontend
      if (emailResponse.ok) {
        return new Response(JSON.stringify({ ok: true, message: 'Email sent!' }));
      } else {
        return new Response(JSON.stringify({ ok: false, message: 'Email failed' }));
      }
    }
  }
};
```

**Flow:**
1. User fills form on website → clicks "Send Enquiry"
2. Frontend JS sends POST with form data to Worker URL
3. Worker validates CORS origin + honeypot
4. Worker sends email via Resend API using the secret key
5. Worker returns JSON response to frontend
6. Frontend shows success/error message

---

## 5. Resend Email API — Why & How It Works

### The Problem Resend Solves

**Before Resend:** Sites sent emails directly from their frontend using Gmail:
```javascript
// ❌ NEVER DO THIS — Gmail will block your account!
const emailResponse = await fetch('https://gmail.com/api/send', {
  headers: {
    'Authorization': 'Bearer YOUR_GMAIL_PASSWORD'  // ← Exposed to hackers!
  }
});
```

**Why this fails:**
- Your Gmail password is visible in the browser
- Hackers steal it instantly and lock your account
- Gmail rate-limits and blocks bulk sends (treats it as spam)

### Resend Solution

Resend is a **transactional email service** (like SendGrid, Mailgun):
- ✅ Designed for apps to send emails securely
- ✅ Free tier: 100 emails/day (perfect for B2B inquiries)
- ✅ Professional email headers (proper SPF/DKIM)
- ✅ Webhooks for bounce tracking (optional)

**Your setup:**
- Resend API Key: `re_KUcWg5fs_CzLyUGQK5TZcLkWm9k9Y6FNY`
- Free domain: `onboarding@resend.dev` (can send to verified email only)
- Your verified account: `ashwani12ksp@gmail.com`

### Resend Limitation & Upgrade Path

**Current limitation:** Free plan with `onboarding@resend.dev` can only deliver to the account owner (`ashwani12ksp@gmail.com`). If you want to CC another email, you need to upgrade.

**To remove this limitation (optional future upgrade):**

1. Go to https://resend.com/domains
2. Add your domain: `himalyanorganicfarm.com`
3. Add Resend's DNS records (follow Resend UI)
4. Verify domain (wait for DNS propagation)
5. Update Worker secrets:
   ```
   FROM_EMAIL = hello@himalyanorganicfarm.com  // (instead of onboarding@resend.dev)
   CC_EMAIL = ashwanigusain@live.com           // (restore CC)
   ```
6. Redeploy: `npx wrangler deploy`

---

## 6. How to Make Changes (Self-Service Guide)

### Change 1: Update Contact Form Fields

**Location:** `/Organic/index.html` lines ~200–230 (form section)

**Example:** Add "Phone Number" field
```html
<!-- Find this section in index.html -->
<label for="name">Your Name</label>
<input type="text" id="name" name="name" required>

<!-- Add after email, before message -->
<label for="phone">Phone Number</label>
<input type="tel" id="phone" name="phone">
```

Then update `/Organic/assets/js/main.js` to include phone in submission:
```javascript
// Find this in main.js (around line 100)
const payload = {
  name: form.querySelector('[name="name"]').value,
  email: form.querySelector('[name="email"]').value,
  business: form.querySelector('[name="business"]').value,
  message: form.querySelector('[name="message"]').value,
  phone: form.querySelector('[name="phone"]').value,  // ← ADD THIS
  website: form.querySelector('[name="website"]').value
};
```

And update the Worker to pass phone to Resend:
```javascript
// In /Organic/worker/src/index.js (around line 30)
const { name, email, business, message, phone, website } = body;

// Add to email HTML body (around line 50)
html: `
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Business:</strong> ${business}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Phone:</strong> ${phone}</p>  <!-- ← ADD THIS -->
  <p><strong>Message:</strong> ${message}</p>
`
```

Redeploy: `cd Organic/worker && npx wrangler deploy`

---

### Change 2: Update Hero Text or Products

**Location:** `/Organic/index.html`

Search for the section you want to change:
- Hero text: Look for `<h1>` and `<p>` in hero section
- Product names: Look for "Finger Millet", "Barnyard Millet"
- Testimonials: Look for quote text
- Prices/specs: Edit the HTML content directly

Edit, then **push to GitHub:**
```powershell
cd path/to/HimalyanOrganicFarm-repo
git add .
git commit -m "Update hero text"
git push
```

Changes live in ~1 minute.

---

### Change 3: Change Colors

**Location:** `/Organic/assets/css/styles.css` lines 1–20

```css
:root {
  --bg: #eef2ee;              /* Light cream background */
  --primary: #2d6a4f;         /* Forest green */
  --primary-dark: #1b4332;    /* Dark green */
  --accent: #e07b39;          /* Orange (buttons) */
  --accent2: #d4a843;         /* Gold (headings) */
  --sky: #b7d5e0;             /* Mountain blue */
}
```

**Example:** Change accent color from orange to purple
```css
--accent: #9b59b6;   /* was #e07b39 */
```

Then push to GitHub. Done!

---

### Change 4: Add New Product/Testimonial

**For a new product:**
1. Add HTML in `/Organic/index.html` (copy a product card, change content)
2. Add/update SVG in `/Organic/assets/images/products/` 
3. Push to GitHub

**For a new testimonial:**
1. Add HTML quote card to testimonials section
2. Push to GitHub

---

### Change 5: Update Email Recipient

**Current setup:** Emails go to `ashwani12ksp@gmail.com`

**To change:**
1. Go to Cloudflare Dashboard → Workers → himalyan-organic-contact-api → Settings → Variables & Secrets
2. Edit secret `TO_EMAIL` → type new email
3. Reopen: `cd Organic/worker && npx wrangler deploy`

---

## 7. Monitoring & Troubleshooting

### Check if Worker is Running

```powershell
# From Organic/worker folder:
npx wrangler tail himalyan-organic-contact-api --format pretty
```

This shows live logs of every request. Check if form submissions appear.

### Test Contact Form (Command Line)

```powershell
$headers = @{
  'Origin' = 'https://himalyanorganicfarm.com'
  'Content-Type' = 'application/json'
}
$payload = @{
  name = 'Test Name'
  email = 'test@example.com'
  business = 'Test Business'
  message = 'Test message'
  website = ''
} | ConvertTo-Json

$response = Invoke-WebRequest `
  -Uri 'https://himalyan-organic-contact-api.ashwani12ksp.workers.dev/api/contact' `
  -Method Post `
  -Headers $headers `
  -Body $payload `
  -UseBasicParsing

$response.StatusCode
$response.Content
```

Expected output:
```
StatusCode: 200
Content: {"ok":true,"message":"Email sent successfully"}
```

### Common Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| **Form shows "API request failed"** | Worker not responding | Check Worker logs with `wrangler tail` |
| **"Origin not allowed" error** | Browser origin not in `ALLOWED_ORIGINS` | Add new origin to Cloudflare secrets + redeploy |
| **Email not arriving** | Resend account not verified | Go to https://resend.com, verify email |
| **Mobile menu transparent** | Backdrop-filter breaking z-index | Already fixed in CSS (lines 706–760) |
| **Images not loading** | SVG paths broken | Check `/assets/images/` folder in repo |

---

## 8. Deployment Checklist

✅ **Frontend (GitHub Pages)**
- [ ] `index.html` — all content, no images hardcoded
- [ ] `/assets/css/styles.css` — compiled, no errors
- [ ] `/assets/js/main.js` — `CONTACT_API_ENDPOINT` updated
- [ ] `/assets/images/` — all SVGs present
- [ ] `CNAME` file — contains `himalyanorganicfarm.com`
- [ ] Pushed to `github.com/ashwanigusain/HimalyanOrganicFarm`

✅ **Cloudflare Worker**
- [ ] `/Organic/worker/wrangler.toml` — config correct
- [ ] `/Organic/worker/src/index.js` — code without errors
- [ ] Secrets uploaded: `RESEND_API_KEY`, `FROM_EMAIL`, `TO_EMAIL`, `CC_EMAIL`, `ALLOWED_ORIGINS`
- [ ] Latest version deployed: `npx wrangler deploy`

✅ **Domain Setup (GoDaddy)**
- [ ] 4 A records pointing to GitHub IPs
- [ ] CNAME for `www` → `ashwanigusain.github.io`
- [ ] DNS propagated (check at dnschecker.org)

✅ **Resend Account**
- [ ] API key created and stored securely
- [ ] Email verified (`ashwani12ksp@gmail.com`)

---

## 9. What You Have Now

### Local Files (for reference):
```
c:\SmartTest2.0\CalltestEnd\
├─ Organic/
│  ├─ index.html (main website)
│  ├─ CNAME (domain config)
│  ├─ sitemap.xml (SEO)
│  ├─ robots.txt (SEO)
│  ├─ assets/
│  │  ├─ css/styles.css (2000+ lines, all styles)
│  │  ├─ js/main.js (form + gallery logic)
│  │  └─ images/
│  │     ├─ hero/ (hero-field.svg, farmers-network.svg)
│  │     ├─ products/ (finger-millet.svg, barnyard-millet.svg)
│  │     ├─ gallery/ (gallery-1/2/3.svg — Himalayan scenes)
│  │     └─ logos/ (logo.svg, favicon.svg)
│  └─ worker/
│     ├─ wrangler.toml (deployment config)
│     ├─ package.json (Node dependencies)
│     └─ src/
│        └─ index.js (Worker code — handles emails)
```

### Live URLs:
- **Primary:** https://himalyanorganicfarm.com
- **GitHub:** https://ashwanigusain.github.io/HimalyanOrganicFarm/
- **Worker:** https://himalyan-organic-contact-api.ashwani12ksp.workers.dev/api/contact

---

## 10. Quick Reference — When You Need to Change Things

| What to Change | File | Action |
|---|---|---|
| **Text content** | `Organic/index.html` | Edit HTML, push to GitHub |
| **Colors/spacing** | `Organic/assets/css/styles.css` | Edit CSS, push to GitHub |
| **Form validation** | `Organic/assets/js/main.js` | Edit JS, push to GitHub |
| **Email recipient** | Cloudflare Dashboard | Update secret, redeploy worker |
| **Email template** | `Organic/worker/src/index.js` | Edit Worker code, run `wrangler deploy` |
| **Image/SVG** | `Organic/assets/images/` | Replace file, push to GitHub |
| **Spam filter** | `Organic/worker/src/index.js` | Edit honeypot check, redeploy worker |
| **Allowed domains** | Cloudflare Dashboard | Update `ALLOWED_ORIGINS` secret, redeploy |

---

## 11. The Main Takeaway: Cloudflare Workers

**Key concept to remember:**

```
Your Website (GitHub Pages)
        ↓
  User submits form
        ↓
  Website sends JSON to Cloudflare Worker
        ↓
  Worker validates + sanitizes data (safe serverless code)
        ↓
  Worker sends email via Resend API (using hidden API key)
        ↓
  Worker returns success/error response
        ↓
  Website shows message to user
```

**Why this is safe & efficient:**
- No server to maintain
- API keys never exposed to browser
- Works globally (Cloudflare edge servers)
- Free up to 100K requests/day
- Automatic HTTPS & rate limiting

---

## 12. Support & Next Steps

**Common next steps:**

1. **Monitor email delivery** → Use `wrangler tail` to check logs
2. **Fix broken links** → Run site from different locations, test forms
3. **Add more products** → Edit HTML + add SVG images → push to GitHub
4. **Upgrade Resend** → Verify domain, restore CC email, upgrade to paid plan
5. **Add analytics** → Install Google Analytics in `<head>` section of index.html
6. **Add newsletter signup** → Create new Worker endpoint + new form field
7. **A/B test colors/text** → Edit CSS/HTML → push → monitor engagement

---

**Last Updated:** April 5, 2026  
**Created by:** AI Assistant for Himalyan Organic Farm  
**Questions?** Check local logs with `wrangler tail` or review this guide.
