# Mohana Aswath Portfolio

Personal portfolio built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Features

- Responsive sections for about, skills, projects, experience, services, education, certificates, and contact
- Content Creator experience for UniqStack AI (`@uniqstack_ai`)
- LinkedIn, GitHub, and Instagram profile links
- Portfolio content stored in `src/data`
- Optional Supabase integration for projects, certificates, and contact-message backups
- Contact form with an optional external endpoint and a mailto fallback
- GitHub Pages deployment through GitHub Actions

## Local development

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Environment variables

Copy `.env.example` to `.env` only when optional integrations are needed:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_FORM_ENDPOINT=
VITE_FORM_ACCESS_KEY=
```

The site works without Supabase. When Supabase variables are absent or invalid, database-backed project and certificate management is disabled instead of attempting requests with placeholder credentials. The contact form uses the configured endpoint when present and otherwise falls back to email.

## Build and validation

```bash
npm run build
npm audit --omit=dev --audit-level=high
```

`npm run build` type-checks the application, creates the production bundle in `dist/`, and synchronizes the deployable static site to `docs/`.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`. The workflow builds the app and deploys it to GitHub Pages. Optional integration values can be configured as repository Actions variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_FORM_ENDPOINT`
- `VITE_FORM_ACCESS_KEY`

The Vite base path is `/My-portfolio/`, matching the repository name.

## Project structure

```text
src/
  components/   Reusable UI components
  data/         Portfolio content
  lib/          Shared helpers and integrations
  sections/     Portfolio page sections
public/         Static assets copied into the build
docs/           Generated GitHub Pages output
legacy/         Original static-site files kept for reference
```
