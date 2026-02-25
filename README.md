# Meme Generator

A single-page web app to create memes: upload or pick images (local file or Unsplash Source), add text or choose trending templates, preview multiple text placements, then download or share.

## Static version (no Node/npm)

Open the static build in a browser with no build step:

1. **Option A:** Open `static/index.html` directly in your browser (double-click or File → Open).  
   Note: Unsplash images may be blocked when opened as `file://` due to CORS. Use Option B if that happens.

2. **Option B:** Serve the `static` folder with any HTTP server, then open the URL, e.g.:
   ```bash
   cd static && python3 -m http.server 8080
   ```
   Then open http://localhost:8080

## React version (Vite)

```bash
npm install
npm run dev
```

Then open the URL shown (e.g. http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Features

- **Upload:** Choose an image from your device or use Unsplash Source (keyword buttons or custom keyword).
- **Text:** Free top/bottom text plus a list of trending meme templates that set image and default text.
- **Preview:** Several placement options (Top, Bottom, Top + Bottom, Center, Top left); click one to select it for export.
- **Share:** Download as PNG or use the Web Share API when available (fallback: download).

No backend or API keys required for v1.

## Deploy to Vercel (public URL)

1. Push this project to **GitHub** (create a repo and push if you haven’t).
2. Go to [vercel.com](https://vercel.com) → **Sign up** / **Log in** (e.g. with GitHub).
3. Click **Add New…** → **Project** → **Import** your GitHub repo.
4. Leave **Root Directory** as the repo root (default).  
   The repo’s `vercel.json` is set to copy the `static` folder into the build output.
5. Click **Deploy**. When it finishes, Vercel gives you a live URL (e.g. `https://meme-generator-xxx.vercel.app`).

**Optional:** In the project’s **Settings → Domains** you can add a custom domain.
