# FitLab

An editorial-styled, bilingual (English / Hebrew) fitness & diet planner web app.
Built with React + Vite + Tailwind. Designed to deploy to Railway in a few clicks.

![Editorial design palette: cream, ink, rust, forest](public/favicon.svg)

## Features

- **Multi-decade tracks** — programming tuned for 20s, 30s, and 40s
- **Multi-goal selection** — pick up to 3 outcomes (weight loss, muscle, fitness, flexibility); hybrid plans for popular combos like Body Recomposition
- **Three split options** — Full Body × 3, Upper / Lower × 4, Push / Pull / Legs × 3
- **Personalized calorie & macro targets** — Mifflin-St Jeor BMR with activity factor and goal-aware adjustments
- **Exercise swap** — cycle through alternatives matching the same movement pattern
- **Workout completion tracking** — check off exercises, see daily completion
- **4-week progressive overload** — week 4 is a planned deload
- **Rest timer** — floating widget with adjustable duration (30–120s slider) and Web Audio beep
- **Bodyweight log + chart** — track progress against your goal weight
- **Saved plans** — persist plans to localStorage; load any saved plan
- **Print / PDF export** — opens a clean printable view in a new tab
- **Hebrew with RTL** — full UI translation, RTL layout, native Hebrew typography (Noto Serif Hebrew + Heebo)

## Run locally

Requires Node.js 18+ (20+ recommended).

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build for production

```bash
npm run build
npm run preview
```

The `preview` server reads `PORT` from the environment, so it works the same locally and on Railway.

## Deploy to Railway

### Option A — Deploy from GitHub (recommended)

1. **Push this project to GitHub** (see "Push to GitHub" below)
2. Go to [railway.com/new](https://railway.com/new)
3. Click **"Deploy from GitHub repo"**, authorize Railway, pick your `fitlab` repo
4. Railway auto-detects the Vite setup using the included `nixpacks.toml` and `railway.json`
5. After the first build, click the deployment → **Settings → Networking → Generate Domain**
6. Open the generated URL — that's your live FitLab

No environment variables needed. Railway provides `PORT` automatically.

### Option B — Deploy from CLI

```bash
npm install -g @railway/cli
railway login
railway init           # in this project directory
railway up             # uploads source, builds, deploys
railway domain         # generates a public URL
```

### How the deployment works

- `nixpacks.toml` tells Railway to install Node 20, run `npm ci`, then `npm run build`
- `railway.json` sets the start command to `npm run preview`, which serves the built static `dist/` folder
- `vite.config.js` sets `preview.host` to `0.0.0.0` and uses `process.env.PORT` so Railway's port works
- `allowedHosts: true` in the preview config lets Railway's `*.up.railway.app` domain pass through

### Switching to a static-only host (optional)

If you'd rather serve `dist/` from a CDN (Vercel, Netlify, Cloudflare Pages), just point them at this repo and use `npm run build` as the build command and `dist` as the output directory. No other changes needed.

## Push to GitHub

If you don't have this on GitHub yet:

```bash
# from inside the project folder
git init
git add .
git commit -m "Initial FitLab commit"

# create a new empty repo at https://github.com/new (don't initialize with README)
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/fitlab.git
git push -u origin main
```

## Project structure

```
fitlab/
├── public/
│   └── favicon.svg
├── src/
│   ├── FitLab.jsx       ← the main component (~3500 lines)
│   ├── main.jsx         ← entry point + window.storage shim
│   └── index.css        ← Tailwind imports
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── nixpacks.toml        ← Railway build instructions
├── railway.json         ← Railway start command
└── README.md
```

## Notes

- **`window.storage` shim**: FitLab was originally built for the Claude artifact runtime which provides an async `window.storage` API. `src/main.jsx` installs a localStorage-backed shim with the same shape, so persistence works in any browser.
- **Tailwind**: only the standard utility classes are used (no JIT custom values). Most colors are inline styles using a small `PALETTE` object in `FitLab.jsx`.
- **Fonts**: Fraunces, Manrope, Noto Serif Hebrew, and Heebo are loaded from Google Fonts at runtime via a `<style>` tag inside the component.

## License

Personal project. Use it however you like.
