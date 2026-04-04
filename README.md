# Himalyan Organic Farm - Single Page Website

Lightweight, mobile-friendly, SEO-ready static website for B2B organic millet sourcing.

## Project Structure

- `index.html` - Main single-page site with all sections.
- `assets/css/styles.css` - Styling and responsive layout.
- `assets/js/main.js` - Mobile navigation, gallery slider, and secure enquiry form API call.
- `assets/images/hero/` - Hero and about section images.
- `assets/images/products/` - Product images.
- `assets/images/gallery/` - Gallery slider images.
- `assets/images/testimonials/` - Reserved for testimonial photos.
- `assets/images/logos/` - Logo and favicon.
- `worker/` - Cloudflare Worker secure contact API.
- `robots.txt` - Search crawler rules.
- `sitemap.xml` - Sitemap for search engines.

## Replace Images Safely

The layout is built to handle different image sizes and resolutions.

1. Keep existing file names and replace files in the same folder.
2. Or update the image paths in `index.html`.
3. Any image ratio works because image containers use `object-fit: cover`.
4. For gallery, replace or add images in `assets/images/gallery/` and update slide blocks in `index.html`.

## Quick Content Updates

- Edit headlines, text, product cards, and testimonials in `index.html`.
- Add more products by duplicating a `.product-card` block.
- Add gallery slides by duplicating a `.gallery-slide` block in `index.html`.
- Update email/phone details in the Contact section.

## WhatsApp Direct Enquiry

- Contact section includes a direct WhatsApp chat button.
- Number used: `+91 8077725460`.

## Enquiry Form Setup (Secure Cloudflare Worker)

Frontend now posts to a secure serverless endpoint so sensitive configuration is not exposed in browser code.

1. Open `worker/README.md` and deploy Worker.
2. Configure Worker secrets (`FROM_EMAIL`, `TO_EMAIL`, `CC_EMAIL`, `ALLOWED_ORIGINS`).
3. Update `CONTACT_API_ENDPOINT` in `assets/js/main.js` with deployed Worker URL ending in `/api/contact`.

After this, `Send Enquiry` will use secure API flow.

## GitHub Pages Deployment

1. Push repository to GitHub.
2. Open repository `Settings` > `Pages`.
3. Source: `Deploy from a branch`.
4. Branch: `main` (or your default branch), folder: `/ (root)`.
5. Save and wait for deployment URL.

## Domain Setup (Optional)

If using `himalyanorganicfarm.com`:

1. Add a `CNAME` file in repo root with your domain.
2. Point DNS records to GitHub Pages.
3. Update canonical URL and sitemap URLs if needed.
