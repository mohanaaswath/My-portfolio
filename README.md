# Mohana Aswath – Portfolio (React + TypeScript + Vite + Tailwind)
```
npm install
npm run dev       # local dev server
npm run build     # type-check + production build to dist/
```
- Content lives in `src/data/*.ts`; contact links in `src/lib/asset.ts`.
- Contact form: copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT` (and `VITE_FORM_ACCESS_KEY` for Web3Forms). Without it, the form falls back to a mailto link.
- Deploy: push to `main`, then set Settings > Pages > Source to "GitHub Actions". `base` is `/My-portfolio/` in `vite.config.ts`.
- `legacy/` holds the original static site (unchanged) for reference; delete it once you're happy.
