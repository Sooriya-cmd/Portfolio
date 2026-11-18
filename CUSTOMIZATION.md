# Sky Street Portfolio — Owner Customization Guide

Welcome! This guide is designed to help you quickly personalize your portfolio with your own name, biography, skills, projects, links, and screenshots without needing advanced coding knowledge.

---

## 1. Quick Start: The One File to Edit

Almost all of your personal details live in a single configuration file:
> 📁 **`src/config/content.json`**

Open `src/config/content.json` in any text editor (VS Code, Notepad, etc.). When you change text inside the quotes `""` and save the file, your changes immediately appear in the browser!

> ⚠️ **Important JSON Rules:**
> - Keep text enclosed in double quotes: `"My Project Name"`.
> - Do not remove commas `,` between list items.
> - Do not add comments or trailing commas.

---

## 2. Personal Information & Bio

Inside `src/config/content.json`, find the `"person"` and `"about"` sections:

```json
"person": {
  "name": "YOUR NAME",
  "handle": "@yourhandle",
  "role": "Creative Developer & 3D Specialist",
  "tagline": "Building playful web worlds and interactive tools",
  "location": "San Francisco, CA",
  "email": "you@example.com",
  "resume": "/resume.pdf"
}
```

* **Name & Role:** Changes the main headline, site header, and meta titles.
* **Email:** When filled, a `GET IN TOUCH` email button appears in the contact section. If left empty `""`, the button is cleanly hidden.
* **Resume:** Place a PDF file in `public/resume.pdf` and set `"resume": "/resume.pdf"`. If left empty `""`, the button is omitted.

### About Paragraphs
Edit `"about"` $\rightarrow$ `"paragraphs"`:
```json
"about": {
  "heading": "ABOUT ME",
  "paragraphs": [
    "Write your introduction here.",
    "Share what you're passionate about, your background, or what you enjoy building."
  ]
}
```

---

## 3. Skills & Experience

### Things You Work With (`"skills"`)
Add, edit, or reorder your skills inside `"skills"` $\rightarrow$ `"items"`:
```json
"skills": {
  "heading": "THINGS I WORK WITH",
  "items": [
    { "name": "THREE.JS & WEBGL", "category": "Graphics" },
    { "name": "REACT / TYPESCRIPT", "category": "Frontend" },
    { "name": "BLENDER 3D", "category": "Modeling" },
    { "name": "UI/UX DESIGN", "category": "Design" }
  ]
}
```

### Experience Timeline (`"experience"`)
Update your career journey or education in `"experience"` $\rightarrow$ `"items"`:
```json
{
  "role": "Senior Creative Developer",
  "organization": "Acme Creative Studio",
  "period": "2023 — PRESENT",
  "summary": "Led development of interactive 3D campaigns and WebGL experiences.",
  "highlights": [
    "Shipped 12 client experiences with 60fps mobile performance.",
    "Integrated custom GLSL shaders and GSAP animations."
  ]
}
```

---

## 4. Replacing the 8 Project Showcases

The portfolio includes **8 projects** (`project-01` through `project-08`).

### Editing Project Details
In `src/config/content.json` under `"projects"`:
```json
{
  "id": "project-01",
  "title": "MY FAVORITE PROJECT",
  "tagline": "A short one-line catchy hook",
  "description": "Explain what this project does, why you built it, and your specific role.",
  "tags": ["Three.js", "WebGL", "TypeScript"],
  "year": "2026",
  "image": "/images/projects/project-01.png",
  "imageAlt": "Screenshot showing the interactive interface",
  "links": {
    "live": "https://my-live-demo.com",
    "repo": "https://github.com/username/project"
  }
}
```

### Adding Your Project Screenshots / Media
1. Save your screenshot or preview image in:
   > 📁 **`public/images/projects/`**
2. **Recommended image format:** `.png`, `.jpg`, `.webp`, or `.svg`.
3. **Recommended aspect ratio:** `16:9` (e.g. `1280 x 720` or `1920 x 1080` pixels).
4. Update the `"image"` field in `content.json` to match the exact filename:
   ```json
   "image": "/images/projects/my-screenshot.png"
   ```
5. **Tip on Links:** If you don't have a live link or a public repository for a project, simply leave it empty `""`:
   ```json
   "links": { "live": "", "repo": "" }
   ```
   The site will automatically hide the button so no broken links appear!

---

## 5. Social Links & Contacts

In `src/config/content.json` under `"socials"`:
```json
"socials": [
  { "label": "GitHub", "url": "https://github.com/yourusername" },
  { "label": "LinkedIn", "url": "https://linkedin.com/in/yourusername" },
  { "label": "X / Twitter", "url": "https://x.com/yourhandle" },
  { "label": "Instagram", "url": "" }
]
```
* Any social item with an empty URL `""` is automatically omitted from display.

---

## 6. Bird Mascot Guide Dialogue

The friendly bird guide in the bottom-left speaks to the visitor throughout their journey! You can customize what it says in `"guide"` $\rightarrow$ `"messages"`:
```json
"guide": {
  "messages": {
    "hero": "Hi, I'm your bird guide! Welcome to Sky Street.",
    "about": "Welcome to About Street! Here is a little about who I am.",
    "skills": "Here are the tools and craft I work with every day.",
    "experience": "A timeline of teams I've contributed to.",
    "projects": "Take a look through eight selected projects.",
    "moreProjects": "More projects and creative experiments are on the way!",
    "contact": "Feel free to drop a line via email or connect on social platforms.",
    "ending": "Thanks for exploring this little world!"
  }
}
```

---

## 7. Changing Visual Theme & Colors

### Theme Configuration
Open **`src/config/theme.js`**:
* **`colors`**: Easily change sky daylight, dusk, and night horizon tones.
* **`halftone`**: Adjust dot overlay opacity (set `enabled: false` if you want a smooth gradient without grain).

### CSS Custom Properties
Open **`src/styles/main.css`** to adjust root CSS variables:
* `--color-cyan-layer` & `--color-pink-layer`: The signature pop-art offset drop-shadow colors.
* `--color-panel-bg`: The warm cream card background color (`#FFFDF9`).

---

## 8. Safe vs Advanced Files

| File | Safe for Beginners? | Purpose |
| :--- | :---: | :--- |
| `src/config/content.json` | ✅ **YES** | All personal text, links, projects, and bio |
| `public/images/projects/*` | ✅ **YES** | Replace preview images and screenshots |
| `src/config/theme.js` | ✅ **YES** | Colors, halftone strength, and quality presets |
| `src/styles/main.css` | ⚠️ *Careful* | Design tokens and CSS custom properties |
| `src/main.js` | 🚫 *Code* | Application logic and event handlers |
| `src/scene/*` | 🚫 *Code* | Three.js 3D world geometry and camera rigging |

---

## 9. Final Pre-Launch Verification Checklist

Before publishing your portfolio:
- [ ] Name, role, tagline, and location updated in `content.json`.
- [ ] Email and resume link updated (or cleared).
- [ ] All 8 projects updated with your own titles, descriptions, and tags.
- [ ] All 8 project preview images replaced and loading without broken icons.
- [ ] Social media links point to your real profiles (or left blank to hide).
- [ ] Tested on desktop and mobile viewports.
- [ ] Run `npm run build` to verify a clean production bundle.
