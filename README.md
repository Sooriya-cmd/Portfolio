# Sky Street — 3D Portfolio

An original, responsive, scroll-driven 3D portfolio and creative playground built with Three.js, GSAP ScrollTrigger, Lenis, and modern semantic HTML/CSS.

Inspired by the whimsical visual storytelling of stylized bird streetscapes, utility poles, and pop-art comic framing.

---

## 🌟 Key Features

1. **Centralized Data Source:**
   - Every piece of personal information, role, bio, skills, experience, project details, image paths, contact links, and bird guide dialogue is edited in **`src/config/content.json`**.
   - Zero hardcoded personal details in JavaScript or HTML.
2. **Synchronized 3D Camera Rig:**
   - Smooth Catmull-Rom camera spline driven by a unified Lenis + GSAP ScrollTrigger progress loop ($0.0 \rightarrow 1.0$).
   - Fully **reversible**: scrolling up rewinds the camera along the path and restores previous chapter lighting and panels seamlessly.
3. **Signature Visual Language:**
   - Purple stickered utility pole anchoring the right third of the frame.
   - Framed portfolio panels on the left/center-left with cream faces, layered cyan/hot-pink offset borders, and index badges.
   - Catenary sagging wires, chunky yellow signal boxes with animated LED dot-matrix lenses (Heart, Smile, Down-arrows).
   - Dynamic time-of-day progression: Daylight blue $\rightarrow$ Dusk lavender $\rightarrow$ Deep midnight violet with twinkling stars, moon, and disco ball party finale.
   - 7 perched bird mascots with expressive eyes, blush cheeks, and varied accessories (beanies, sunglasses, caps, bowler hats).
4. **Complete Accessible Fallback (Non-3D Mode):**
   - Clean entry choice modal offering both **"START" (3D)** and **"ENTER WITHOUT 3D"**.
   - Automatically falls back to a responsive, high-contrast 2D layout if WebGL is unavailable or if `prefers-reduced-motion` is requested.
   - All 8 projects and content sections are structured as accessible semantic HTML (`<main>`, `<section>`, `<article>`, `<nav>`).

---

## 🛠️ Tech Stack
- **Bundler:** Vite (Vanilla JavaScript ES Modules)
- **3D Engine:** Three.js
- **Scroll & Animation:** Lenis Smooth Scroll + GSAP ScrollTrigger
- **Styling:** Modern CSS with custom properties and viewport-safe units (`dvh`/`svh`)
- **Assets:** Original local SVG project illustrations (zero broken image URLs)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Production Build
```bash
npm run build
```
Optimized static production assets are compiled to the `dist/` directory with code splitting for Three.js and motion libraries.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📦 Deploying to Vercel

Sky Street is ready for instant one-click deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Vercel automatically detects Vite:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. Your site will be live on a global CDN in under a minute!

---

## ✏️ How to Personalize This Site

To replace the placeholder names, projects, skills, and screenshots with your own work, follow the beginner-friendly step-by-step guide in **[CUSTOMIZATION.md](CUSTOMIZATION.md)**.
