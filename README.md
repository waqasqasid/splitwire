# SplitWire Tech — Website

Static multi-page website for splitwire.tech. No server, database, or build step needed.

## Folder structure

```
splitwire-website/
├── index.html          Home
├── about.html          About Us
├── services.html       Services (Core / Advanced / Specialized + FAQ)
├── industries.html     Industries
├── contact.html        Contact + service request form
├── 404.html            Page-not-found
├── css/
│   └── style.css       All styles (brand colours are variables at the top)
├── js/
│   └── main.js         Mobile menu, animations, counters, contact form
├── assets/images/
│   ├── logo-mark.svg   Logo icon (recreated — replace with official file)
│   └── favicon.svg     Browser tab icon
├── robots.txt
└── sitemap.xml
```

## Preview locally
Open `index.html` in any browser.

## Deploy
Upload the whole folder to Netlify, Vercel, Cloudflare Pages, GitHub Pages, or your
host's `public_html` folder, then point splitwire.tech at it.

## Editing
- Brand colours and fonts: variables in `:root` at the top of `css/style.css`.
- Header and footer are repeated in each page — update them in all 5 pages.
- Contact form submits into a Google Form (responses land in its linked Google Sheet).
  Set `GFORM_ID` and the `GFORM_FIELDS` entry IDs at the top of the form code in `js/main.js`.

## Before launch
- Replace the recreated logo with the official logo from the brand guidelines.
- Review filled-in copy (Specialized Services, FAQ answers, About "engagements" section).
- Confirm stats and address (ZIP 75001), and add real Facebook/LinkedIn links in the footer.
