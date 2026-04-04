# Cloudflare Worker Contact API

This worker receives form submissions and sends email securely without exposing secrets in frontend code.

## 1. Install Wrangler

```bash
npm install -g wrangler
```

## 2. Login

```bash
wrangler login
```

## 3. Configure secrets

From this folder (`Organic/worker`), run:

```bash
wrangler secret put FROM_EMAIL
wrangler secret put TO_EMAIL
wrangler secret put CC_EMAIL
wrangler secret put ALLOWED_ORIGINS
```

Recommended values:

- `FROM_EMAIL`: no-reply@himalyanorganicfarm.com
- `TO_EMAIL`: ashwani12ksp@gmail.com
- `CC_EMAIL`: ashwanigusain@live.com
- `ALLOWED_ORIGINS`: comma-separated origins (example: `http://localhost:5500,https://<username>.github.io,https://himalyanorganicfarm.com`)

## 4. Deploy

```bash
wrangler deploy
```

After deploy, copy Worker URL and append `/api/contact`.

Example:

```text
https://himalyan-organic-contact-api.<subdomain>.workers.dev/api/contact
```

## 5. Update frontend endpoint

Set `CONTACT_API_ENDPOINT` in `Organic/assets/js/main.js` to your deployed URL.

## 6. Local Worker test (optional)

```bash
wrangler dev
```

Then use endpoint:

```text
http://127.0.0.1:8787/api/contact
```
