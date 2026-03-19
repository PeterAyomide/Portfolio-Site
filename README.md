# Portfolio Site

Job-focused portfolio for Peter Adegboye, built as a React component with a Three.js animated hero background.

## Stack

- React
- Vite
- Three.js

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## What This Version Improves

- Cleaner hiring flow with clear CTA buttons (email + booking call)
- Service/value section for recruiters and clients
- Mobile navigation toggle for smaller screens
- External links for GitHub, LinkedIn, resume, and project actions
- Better deployment readiness with centralized profile/project data

## Customize Before Deployment

Open [portfolio.jsx](portfolio.jsx) and update these fields:

1. `PROFILE`
- `email`
- `github`
- `linkedin`
- `x`
- `calendly`
- `resume`

2. `projects`
- `liveUrl`
- `repoUrl`
- `caseStudyUrl`
- Optional: project descriptions, metrics, stack tags

3. `services` and `engagementModel`
- Tune this to match your target role (freelance, full-time, contract)

## Deployment Checklist

1. Add real links to all profile and project URLs.
2. Replace placeholder `#` values.
3. Ensure all outbound links open correctly.
4. Verify mobile layout and navigation behavior.
5. Confirm contact email and booking link are live.

## Suggested Hosting

- Vercel
- Netlify
- Cloudflare Pages

## Vercel Deployment

This repo is now Vercel-ready.

When importing to Vercel:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

If your project is already part of a React app, place `portfolio.jsx` in your source folder and render it from your app entry route.
