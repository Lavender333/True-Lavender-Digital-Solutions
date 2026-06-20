# True Lavender Digital Solutions

React/Vite site for True Lavender Digital Solutions with Firebase Auth and Firestore-backed dashboard features.

## Local Setup

Prerequisites:

- Node.js 22 or newer
- npm

Install and run:

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Publish Options

### GitHub Pages

This repo includes `.github/workflows/deploy.yml`.

1. Push changes to `main`.
2. In GitHub, open the repository settings.
3. Go to **Pages**.
4. Set **Source** to **GitHub Actions**.
5. The workflow will publish the `dist` folder automatically.

The Vite build uses relative asset paths, so it works from a GitHub Pages project URL as well as from a custom domain.

### Netlify

Connect the GitHub repo in Netlify and use:

- Build command: `npm run build`
- Publish directory: `dist`

The included `netlify.toml` already sets those values and adds the single-page app fallback.

### Vercel

Import the GitHub repo in Vercel. The included `vercel.json` sets:

- Build command: `npm run build`
- Output directory: `dist`
- Single-page app rewrite to `index.html`

### Firebase Hosting

This repo includes `firebase.json` and `.firebaserc` for the Firebase project currently used by the app.

Deploy hosting:

```bash
npm run deploy:firebase
```

If this is the first time deploying from your machine, sign in first:

```bash
npx firebase-tools login
```

## Firebase Notes

The frontend Firebase config lives in `firebase-config.json`. The current Firestore rules are in `firestore.rules`, but hosting deployment is configured separately so the site can be published without accidentally changing database rules.
