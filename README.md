# Pairway — Landing Page

A static, single-page marketing site for **Pairway**, a mobile app that
matches golfers by handicap, pace of play, age, and availability. This site
is download-focused: it introduces the product and directs visitors to the
(not-yet-published) iOS/Android app.

Built with **TypeScript + Vite**, no framework, no backend.

## Getting started

```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # type-check + production build to dist/
npm run preview   # preview the production build locally
```

## Project structure

```
index.html        # all page markup/sections
src/style.css      # all styling (CSS custom properties for the palette)
src/main.ts        # mobile nav, scroll effects, scroll-reveal, avatar fallback
```

## What's a placeholder right now

- **Logo mark** — an original abstract two-circle icon next to the
  "pairway" wordmark (`#icon-logo-mark` in the SVG sprite at the top of
  `index.html`). Not a final brand mark — swap it for real logo artwork
  whenever you have one.
- **Hero app preview, about photo** — dashed-border placeholder blocks.
  Swap these `<div class="placeholder-block">` elements in `index.html`
  for real images/screenshots.
- **Team photos** — `index.html` already points each `#team` avatar at
  `/public/team/<name>.jpg` (`eddie-kim.jpg`, `eric-lee.jpg`,
  `kenneth-such.jpg`). Just drop square photos (roughly 400×400px,
  JPG/PNG) into `public/team/` with those exact filenames and they'll
  appear automatically — no HTML changes needed. Until a file exists,
  that person's initials show instead (handled in `src/main.ts`).
- **App Store / Google Play badges** — the real official badge graphics
  (`public/badges/`), but they link to `#` since the app isn't published.
  Once it's live, point the `href`s in the hero and `#download` section
  at your actual App Store / Google Play listing URLs.
- **Social links** — Facebook/Instagram/LinkedIn icons in the footer link
  to `#` until the real profile URLs exist.

There's currently no Contact section/form on the page (removed — the site
is purely download-focused for now). If you want one back later, a
form-endpoint service like [Formspree](https://formspree.io) or
[Web3Forms](https://web3forms.com) is the easiest no-backend way to
receive submissions.

## Color palette

Defined as CSS custom properties at the top of `src/style.css`:
mostly white/off-white backgrounds (`--color-bg`, `--color-bg-soft`) with a
forest-green accent scale (`--color-green-100` through `--color-green-900`).
Adjust those variables to retheme the whole site.

## Deploying

This builds to a fully static `dist/` folder, so it can be hosted on
Vercel, Netlify, GitHub Pages, Cloudflare Pages, or any static file host —
no server required.
