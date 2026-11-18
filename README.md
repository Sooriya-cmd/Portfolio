# Sky Street — 3D Portfolio

An interactive, responsive, scroll-driven portfolio website inspired by stylized 3D worlds, cartoon utility streetscapes, and playful storytelling.

## Features
- **Data-Driven Core:** All personal text, skills, experience, project showcases, links, and guide messages are centralized in `src/config/content.json`.
- **Progressive Architecture:** Single persistent WebGL canvas for the 3D environment paired with fully accessible semantic HTML overlays.
- **Accessible & Responsive:** Screen-reader friendly, keyboard navigable, reduced-motion compliant, with a complete standalone Non-3D / No-WebGL fallback mode.
- **Customizable:** Pre-configured with 8 original local SVG project placeholders and beginner-friendly customization instructions.

---

## Tech Stack
- **Bundler & Tooling:** Vite (Vanilla JavaScript ES Modules)
- **3D Graphics:** Three.js
- **Motion & Scroll Choreography:** GSAP + ScrollTrigger + Lenis smooth scrolling
- **Styling:** Modern CSS with custom properties and responsive viewport units (`svh`/`dvh`)

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Build output is saved to the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## Project Structure
```
port/
├── index.html                   # Semantic HTML root & accessible UI anchors
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── README.md                    # Project documentation
├── CUSTOMIZATION.md             # Beginner-friendly guide to personalize content
├── public/                      # Static assets
│   ├── favicon.svg              # Mascot bird favicon
│   ├── og-image.svg             # Social sharing preview image
│   ├── images/
│   │   └── projects/            # 8 local SVG project previews (project-01 to 08)
│   ├── models/                  # Optional GLB models
│   └── audio/                   # Optional ambient background audio tracks
└── src/
    ├── main.js                  # Application entry point & UI binding
    ├── config/
    │   ├── content.json         # SINGLE SOURCE OF TRUTH for all personal content
    │   ├── theme.js             # Color palette, halftone, and quality settings
    │   └── path.js              # Camera path milestones and chapter intervals
    └── styles/
        ├── main.css             # Design tokens, reset, halftone overlay
        └── ui.css               # Framed panels, navigation, buttons, mascot guide
```

---

## Personalizing the Portfolio
To replace the placeholder names, projects, and images with your own work, follow the step-by-step instructions in **[CUSTOMIZATION.md](CUSTOMIZATION.md)**.
