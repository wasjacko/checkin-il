# checkin — landing page

A private collection of singular residences in Israel.
Built with **React 18 + Vite 5**.

🔗 **Live:** [https://checkin-il.vercel.app](https://checkin-il.vercel.app)

---

## Stack

- React 18 (functional components + hooks)
- Vite 5 (dev server + production build)
- Plain CSS (no framework) — design tokens in `src/styles/global.css`
- Deployed on Vercel

## Quick start

```bash
npm install
npm run dev          # http://localhost:5175
```

## Build

```bash
npm run build        # outputs to dist/
npm run preview      # preview the prod build locally
```

## Project structure

```
src/
├── main.jsx              # entrypoint
├── App.jsx               # page composition
├── styles/global.css     # all CSS (tokens, sections, mobile @media)
├── components/
│   ├── Nav.jsx           # top nav (logo + burger pill)
│   ├── Hero.jsx          # hero image + title + tagline + search
│   ├── SearchBar.jsx     # 3-field search + 3 popovers/bottom-sheets
│   ├── Stats.jsx         # KPI counters with scroll-triggered animation
│   ├── Ultima.jsx        # 5 clip-path cards (desktop) / carousel (mobile)
│   ├── Alternating.jsx   # 4 destination rows (parallax on desktop)
│   ├── EveryRoom.jsx     # editorial statement with highlighted keywords
│   ├── Submit.jsx        # "For host" CTA section
│   ├── Testimonial.jsx   # auto-rotating reviews slider
│   ├── Picks.jsx         # marquee (desktop) / bento grid (mobile)
│   ├── Faq.jsx           # accordion
│   └── Footer.jsx        # logo + columns
└── hooks/
    ├── useReveal.js      # IntersectionObserver fade-in
    ├── useParallax.js    # rAF-throttled scroll-parallax (desktop only)
    └── useHeroZoom.js    # subtle hero scroll-zoom (desktop only)
```

## Notes

- Mobile-first refactor: search modals turn into bottom sheets, parallax
  disabled, font-size 16px on inputs (anti-zoom iOS), touch-action manipulation.
- All `.reveal` elements use a single `IntersectionObserver` + MutationObserver
  (handles HMR / late-mounted elements).
- The `/host/submit` route in the CTA is a placeholder for the future
  submission flow.

## Deploy

The project is wired to Vercel. To redeploy after a change:

```bash
vercel --prod
```
