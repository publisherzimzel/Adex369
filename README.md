# ADEX369 — Programmatic Advertising & AdTech Consulting

Premium enterprise-grade website for ADEX369, a specialized DSP/SSP/DMP & RTB consulting firm.

## Pages

| Page | File | Description |
|------|------|-------------|
| Homepage | `index.html` | Hero, services, metrics, AI section, process, testimonials, FAQ, blog preview |
| Services | `services.html` | Full service breakdown by category |
| About | `about.html` | Company mission, values, expertise |
| Contact | `contact.html` | Consultation form, Calendly placeholder |
| Blog | `blog.html` | AdTech insights layout with newsletter |

## Quick Start

Open `index.html` in a browser, or serve locally:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080`

## Customization

1. **WhatsApp** — Update `https://wa.me/1234567890` in all HTML files and the floating button
2. **Calendly** — Replace placeholder on `index.html` and `contact.html` with your embed code
3. **LinkedIn** — Update `linkedin.com/company/adex369` URLs
4. **Email** — Primary contact: `santhosh@adex369.com` (see `js/config.js`)
5. **Contact form** — Wire to Formspree, Netlify Forms, or your backend API

## Structure

```
Adex369/
├── index.html
├── services.html
├── about.html
├── contact.html
├── blog.html
├── assets/logo.png
├── css/
│   ├── styles.css
│   └── animations.css
└── js/
    ├── main.js      # Nav, scroll reveal, counters, FAQ, forms
    ├── rtb-viz.js   # Animated RTB bidstream canvas
    └── charts.js    # AI section charts
```

## Features

- Dark theme with cyan/gold brand colors from logo
- Glassmorphism UI, smooth scroll animations
- Live RTB bidding visualization (canvas)
- Animated AI performance charts
- Sticky navigation, mobile-first responsive
- SEO meta tags on all pages
- FAQ accordion, newsletter signup
- WhatsApp floating button
- Calendly integration placeholder

## Tech

Static HTML/CSS/JS — no build step required. Fast loading, easy to deploy on Netlify, Vercel, GitHub Pages, or any web host.
