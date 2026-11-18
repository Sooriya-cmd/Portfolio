# Antigravity Master Prompt — Bird Street 3D Portfolio

**Reference:** [https://mesq.me/](https://mesq.me/)  
**Project name:** `Sky Street` (placeholder brand; easy to rename)  
**Goal:** Build an original, responsive, scroll-driven 3D portfolio inspired by the visual storytelling of the reference.

---

## 1. Before you start

This prompt is designed for Antigravity. It gives the agent a visual direction, a code architecture, implementation milestones, and a clear hand-off guide so the owner can add their own information later.

### Reference-reading instructions

1. Open **https://mesq.me/** in the browser before writing code. Inspect the initial entry screen, the transition into the 3D world, the About/experience content, several project states, the contact area, and the ending.
2. Inspect the reference at desktop and narrow mobile widths. Scroll both forwards and backwards. Try the visible menu, sound control, dialogue/Next control, and project navigation where available.
3. Use the following visual cues as the design brief:
   - A playful, surreal **bird street** rather than a conventional developer portfolio or a literal driving game.
   - Rounded white bird characters with tiny beaks, expressive faces, blush details, and small accessories perched on suspended wires.
   - A tall purple utility pole with colourful stickers, coloured bands, crossbars, hanging wires, and chunky yellow signal boxes. Keep this as a recurring visual anchor, generally on the right side of the composition.
   - A saturated blue/periwinkle sky that transitions through lavender and pink toward a deep violet night.
   - Thick soft-edged clouds, small floating decorative details, and a subtle grain/halftone finish.
   - Large portfolio panels that sit left or centre, with cream/off-white faces, layered cyan and pink edges, bold condensed labels, small number badges, and clear previous/next controls.
   - A small speech-bubble guide near the lower-left area, plus a simple menu control and a sound toggle near the top corners.
   - A clear narrative progression: introduction, personal information, skills/experience, eight projects, a “more projects” transition, contacts, and a night-time ending.
4. Treat the reference as a **visual and interaction reference**, not as source code or an asset library. Do not assume that its internal technology stack is known. The stack below is our implementation choice.
5. If the live site or any interaction cannot be inspected, say so in your implementation notes. Do not invent unseen wording, links, or behaviour.

### Originality and ownership

- Build a similar *kind* of experience, not a pixel-perfect clone.
- Do not scrape, extract, download, trace, or reuse the reference site's 3D models, textures, images, source code, audio, or personal content.
- Create original procedural 3D assets, original placeholder artwork, and original UI styling. Use only assets supplied by the owner or assets with a licence that permits the intended use.
- Do not use the reference creator's name, biography, projects, social links, or contact details as portfolio content. Use obvious placeholders until the owner replaces them.
- Never invent the owner's real-world identity, education, employment, achievements, project descriptions, or contact details.

---

## 2. How to use this prompt

1. Open an empty project folder in Antigravity and select **Planning mode**.
2. Paste **Part A** in full. Ask Antigravity to inspect the reference and return a build plan with milestones M1–M8. **Do not let it start coding until the plan is approved.**
3. Once the plan is approved, paste the Part B milestone prompts one at a time, in order.
4. After each milestone, run the project, inspect it in the browser, and fix the milestone's issues before continuing.
5. Commit each working milestone to Git. Do not let a later milestone silently rewrite or break an earlier one.
6. At the end, fill in `CUSTOMIZATION.md` if the code structure changed, so the owner always has accurate instructions for personalising the site.

---

# PART A — MASTER PROMPT

Copy everything inside this code block into Antigravity:

```text
You are a senior creative developer, Three.js engineer, interaction designer, and accessibility-minded frontend engineer.

PROJECT
Build a responsive, scroll-driven 3D portfolio website called "Sky Street". The name is a placeholder and must be editable from the configuration.

PRIMARY REFERENCE
https://mesq.me/

FIRST TASK — REFERENCE AUDIT AND PLAN
Before coding, open the reference website and inspect its entry state, 3D scene, major content states, project panels, controls, contact area, and ending. Check desktop and narrow mobile layouts. Scroll forwards and backwards and test visible controls when possible. Write a short reference audit describing only what you actually observed. Separate observed details from your own implementation decisions. If the browser cannot inspect the 3D experience, say so and continue from the visual brief in this prompt without pretending you inspected it.

Then create an implementation plan with milestones M1–M8, the proposed files for each milestone, and the acceptance checks. Do not create or modify project code until the user approves that plan.

CORE EXPERIENCE
The site should feel like entering a small, playful, stylised 3D world. Scrolling moves the camera through a bird-filled utility-street environment. Each part of the journey reveals one chapter of the portfolio. This is a portfolio and storytelling experience — NOT a game. Do not add driving controls, a score, missions, collectibles, or unrelated game mechanics.

The experience includes:
1. An entry/intro screen with a short “mixing the ink” style transition and two clear choices: enter the 3D experience, or continue without 3D. The exact copy must come from content.json.
2. A hero/introduction scene with the owner's name, role, short tagline, and a friendly bird guide.
3. About.
4. Skills.
5. Experience.
6. Eight project showcases.
7. A “More projects coming soon / Stay tuned” transition after the eighth project. Keep this text configurable; do not invent additional projects.
8. Contact and social links.
9. A night-time “The End” scene with a back-to-start action and footer details.

VISUAL DIRECTION — IMPORTANT
Do not make a generic portfolio with a 3D background behind ordinary cards. The scene, panels, and overlays must feel like one designed world.

Composition:
- Keep a tall, sticker-covered purple utility pole as a recurring landmark, usually occupying the right third of the frame.
- Place the main framed portfolio panel mostly on the left or centre-left, with enough negative space to see the 3D environment.
- Use suspended crossbars and curved wires between poles. Perch small bird characters on them.
- Keep the camera framing intentional at every chapter. The important text and project image must remain readable and must not be hidden behind the pole, birds, or wires.
- Do not make a large conventional road ribbon the dominant visual element. A subtle elevated street/path may connect the scene, but the pole, wires, birds, signals, clouds, and content panels are the main visual language.

Characters and props:
- Create original, rounded white bird mascots. Give them compact bodies, small heads, tiny warm-coloured beaks, black expressive eyes, subtle blush cheeks, tiny wings and feet, and optional accessories such as caps, glasses, headphones, or scarves.
- Create a tall purple utility pole with colourful original stickers, small labels, coloured wrap bands, bolts, and crossbars. Use InstancedMesh or batched geometry for repeated static details where it is beneficial.
- Add chunky yellow signal boxes with three circular lenses. The lenses may use simple pixel/dot patterns, arrows, or abstract symbols. Do not copy any exact symbol artwork from the reference.
- Add thick, rounded cloud clusters with soft layered silhouettes and pink/lavender undersides.
- Add small original decorative details such as tiny floating shapes, distant light trails, stars, and sign plates. Keep them purposeful rather than noisy.

Colour and surface treatment:
- Use a rich cobalt/periwinkle blue sky at the beginning, with a soft lavender-to-pink horizon. Progress toward violet dusk and a deep indigo/violet night.
- Use a purple pole, warm yellow signal boxes, cream panel faces, cyan highlights, and hot-pink offset edges/shadows.
- Add a restrained fine-grain or halftone texture over the scene. It should create a printed/illustrated finish without making text or images blurry.
- Use soft toy-like materials, gently bevelled edges, rounded corners, subtle roughness variation, and clean readable silhouettes.
- Avoid generic glassmorphism, neon cyberpunk styling, excessive gradients on UI cards, and overly glossy plastic.

Portfolio panels:
- Build a distinctive large framed panel, normally left/centre-left. Use a warm cream/off-white inner face, layered cyan and pink edge pieces, a small index badge (for example, 04/08), a bold condensed title, and a small external-link label where applicable.
- Use compact, readable body copy. The project image should be large enough to understand at a glance.
- Add previous/next project controls where useful. These controls must work with mouse, touch, and keyboard.
- The panel can be implemented as semantic HTML positioned over the 3D canvas or as a carefully aligned 3D frame with an accessible HTML equivalent. Prefer HTML for text and controls; do not bake essential copy into textures.
- Add a small guide speech bubble near the lower-left. Its copy and Next button are driven by configuration. It must never cover the primary CTA or project controls.

Persistent controls:
- A compact menu button near the top-left opens an accessible chapter menu.
- A sound toggle near the top-right. Audio is OFF by default; never autoplay sound. If no audio file is supplied, the sound control must be hidden or clearly disabled rather than pretending sound exists.
- Show a subtle journey/progress indicator. Keep the interface minimal; do not add a large conventional navbar that competes with the scene.
- Provide a visible way to return to the beginning.

TECH STACK — FIXED
- Vite with vanilla JavaScript ES modules. Do not use React, Next.js, or Tailwind.
- Three.js for the 3D world.
- GSAP + ScrollTrigger for scroll-linked scene timing and UI transitions.
- Lenis for smooth scrolling. Ensure it is correctly synchronised with GSAP's ticker.
- Plain CSS in src/styles/. Use CSS custom properties for all important colours, spacing, type sizes, borders, and motion values.
- Use Google Fonts only if available at runtime, with local/system fallbacks. Suggested pairing: Barlow Condensed (large panel labels/headings) and Inter (body/UI). A rounded display face may be used sparingly for mascot dialogue.
- Use Three.js addons through the supported `three/addons/...` import paths. Keep package versions compatible and commit package-lock.json.
- Use GLTFLoader and DRACOLoader only for owner-supplied `.glb` models placed in public/models/.

PROJECT STRUCTURE
Create a clean, maintainable structure similar to this. You may add small supporting files, but keep the same separation of responsibilities:

sky-street-portfolio/
  index.html
  package.json
  package-lock.json
  vite.config.js
  README.md
  CUSTOMIZATION.md             (REQUIRED owner editing guide — see deliverables)
  public/
    favicon.svg
    og-image.svg
    models/
      .gitkeep
    images/
      projects/
        project-01.svg ... project-08.svg   (original local placeholders)
      ui/
        .gitkeep
    audio/
      .gitkeep
  src/
    main.js
    config/
      content.json             (all personal content and links)
      theme.js                 (visual theme, layout, quality settings)
      path.js                  (camera curve and chapter timing)
    scene/
      createScene.js           (renderer, camera, resize, render lifecycle)
      world.js                 (scene composition and environment groups)
      pole.js                  (pole, stickers, bands, crossbars)
      wires.js                 (sagging cables and attachment points)
      birds.js                 (bird builder, accessories and idle animation)
      signals.js               (yellow signal boxes and lens states)
      clouds.js                (cloud clusters and drift)
      panels3d.js               (optional decorative 3D panel frames only)
      dayNight.js              (sky, fog, lighting, stars and moon)
      cameraRig.js             (scroll progress to camera transform)
    scroll/
      lenis.js
      timeline.js
    ui/
      entryScreen.js           (3D / non-3D entry choices)
      overlay.js               (semantic HTML portfolio content)
      guide.js                 (speech bubble and Next interaction)
      menu.js                  (chapter navigation)
      projectControls.js       (previous/next and project links)
      progress.js              (progress indicator)
      loader.js
    utils/
      device.js                (mobile, WebGL, reduced motion, quality)
      assets.js                (loading manager and asset helpers)
      accessibility.js
    styles/
      main.css
      scene.css
      ui.css

CONTENT SOURCE OF TRUTH
All owner-specific content must live in `src/config/content.json`.
This includes every visible personal detail, portfolio paragraph, skill, experience item, project title/description/year/image/link, contact method, button label, guide dialogue, section label, and footer string.

Rules:
- Do not hardcode personal text, personal URLs, email addresses, project descriptions, or social links in JavaScript or HTML.
- The content JSON must be valid JSON (double quotes, no comments, no trailing commas). Validate it during development.
- Use obvious placeholders such as `REPLACE_WITH_YOUR_NAME`, `YOUR_ROLE`, and empty strings for unknown links. Never invent real personal information.
- If an optional value is empty, hide that element cleanly. Do not render empty buttons, broken links, `undefined`, or placeholder URLs as working links.
- Build all portfolio text as semantic HTML. The 3D canvas is decorative/progressive enhancement and must not be the only place where important content exists.
- Keep the project count data-driven, but initialise the configuration with exactly eight placeholder projects to match the reference's structure. If the owner later adds/removes projects, the UI must handle the array length without breaking.

CONTENT.JSON — REQUIRED DATA SHAPE
Create a valid example JSON file with all these keys populated by clearly marked placeholders:

{
  "site": {
    "title": "Sky Street — REPLACE_WITH_YOUR_NAME",
    "description": "A short portfolio description goes here",
    "url": "",
    "ogImage": "/og-image.svg",
    "themeColor": "#4B55D8",
    "language": "en"
  },
  "person": {
    "name": "REPLACE_WITH_YOUR_NAME",
    "handle": "@YOUR_HANDLE",
    "role": "YOUR_ROLE",
    "tagline": "YOUR_SHORT_TAGLINE",
    "location": "YOUR_LOCATION",
    "email": "",
    "resume": "",
    "avatar": ""
  },
  "entry": {
    "eyebrow": "A LITTLE WORLD OF WORK AND IDEAS",
    "heading": "MIXING THE INK",
    "description": "A short invitation to explore this portfolio.",
    "enter3DLabel": "ENTER THE 3D WORLD",
    "enterWithout3DLabel": "ENTER WITHOUT 3D",
    "soundLabel": "SOUND"
  },
  "hero": {
    "eyebrow": "HELLO, I'M",
    "headline": "REPLACE_WITH_YOUR_NAME",
    "subline": "YOUR_ROLE · YOUR_TAGLINE",
    "scrollHint": "SCROLL TO EXPLORE"
  },
  "about": {
    "heading": "ABOUT ME",
    "paragraphs": ["Replace this with your own introduction."],
    "facts": [
      { "label": "BASED IN", "value": "YOUR_LOCATION" },
      { "label": "FOCUS", "value": "YOUR_INTERESTS" }
    ]
  },
  "skills": {
    "heading": "THINGS I WORK WITH",
    "items": [
      { "name": "YOUR_SKILL_01", "category": "YOUR_CATEGORY" }
    ]
  },
  "experience": {
    "heading": "WHERE I'VE BEEN",
    "items": [
      {
        "role": "YOUR_ROLE",
        "organization": "YOUR_ORGANIZATION",
        "period": "YYYY — YYYY",
        "summary": "Describe your contribution.",
        "highlights": ["A real achievement or responsibility"]
      }
    ]
  },
  "projects": [
    {
      "id": "project-01",
      "title": "YOUR_PROJECT_NAME",
      "tagline": "A short one-line hook",
      "description": "Explain what it does, why you built it, and your contribution.",
      "tags": ["Technology", "Tool"],
      "year": "2026",
      "image": "/images/projects/project-01.svg",
      "imageAlt": "A visual preview of YOUR_PROJECT_NAME",
      "links": { "live": "", "repo": "" }
    }
  ],
  "moreProjects": {
    "heading": "MORE PROJECTS COMING SOON",
    "text": "A short stay-tuned message.",
    "label": "STAY TUNED"
  },
  "contact": {
    "heading": "SAY HELLO",
    "text": "A short invitation to get in touch.",
    "email": "",
    "cta": "LET'S TALK"
  },
  "socials": [
    { "label": "GitHub", "url": "" },
    { "label": "LinkedIn", "url": "" },
    { "label": "Portfolio", "url": "" }
  ],
  "ending": {
    "heading": "THE END",
    "text": "Thanks for stopping by.",
    "footer": "Made with care."
  },
  "guide": {
    "nextLabel": "NEXT",
    "skipLabel": "SKIP",
    "messages": {
      "hero": "A friendly introduction goes here.",
      "about": "A short line introducing the About section.",
      "skills": "A short line introducing the Skills section.",
      "experience": "A short line introducing the Experience section.",
      "projects": "A short line introducing the projects.",
      "moreProjects": "More projects are on the way.",
      "contact": "A short invitation to connect.",
      "ending": "Thanks for exploring this little world."
    }
  },
  "sections": {
    "hero": "START",
    "about": "ABOUT",
    "skills": "SKILLS",
    "experience": "EXPERIENCE",
    "projects": "PROJECTS",
    "moreProjects": "MORE",
    "contact": "CONTACT",
    "ending": "THE END"
  },
  "audio": {
    "enabled": false,
    "ambientTrack": "",
    "soundOnLabel": "TURN SOUND OFF",
    "soundOffLabel": "TURN SOUND ON"
  }
}

When creating the actual file, expand `projects` to eight distinct placeholder objects with IDs `project-01` through `project-08`. Add a sensible starter set of skills and up to three experience placeholders, but do not fill them with invented personal claims.

SCENE AND CAMERA ARCHITECTURE
- Use a single persistent WebGL canvas behind the semantic HTML UI. Canvas: fixed to the viewport, `z-index: 0`; accessible UI: above it.
- Build the world from independent groups so props can be positioned, replaced, or disabled without rewriting the scene.
- Use a configurable Catmull-Rom or equivalent smooth camera path in `src/config/path.js`. The exact control points are an implementation detail to refine against the live reference; do not blindly preserve arbitrary coordinates if they produce poor framing.
- Define each chapter with explicit `start`, `end`, camera position/look target, and panel placement data. Ensure chapter ranges are ordered, non-overlapping, and cover the full 0–1 progress range. The eight project stops must divide the project range evenly.
- The camera should glide smoothly through the world as scroll progress changes. It must be reversible: scrolling up returns to earlier chapters and restores the correct lighting, panel, guide message, and active navigation state.
- Use time-based damping so motion is consistent across different frame rates. Add only a subtle idle camera sway; turn it off for reduced-motion mode.
- Keep the main utility pole consistently framed toward the right third and the main content panel toward the left/centre-left. Adjust camera path and prop positions together rather than fixing the UI with random CSS offsets.
- Use soft fog for depth but do not fog out the active content panel, important mascots, or project images.

Suggested starting chapter ranges (all configurable in `path.js`):
- hero: 0.00–0.08
- about: 0.08–0.17
- skills: 0.17–0.26
- experience: 0.26–0.35
- projects: 0.35–0.78 (split evenly into eight project states)
- moreProjects: 0.78–0.84
- contact: 0.84–0.93
- ending: 0.93–1.00

These are starting values, not a substitute for testing. The camera and UI transitions must feel continuous and should not snap unless the user activates a direct chapter navigation control.

RENDERER AND LIGHTING
- Use `WebGLRenderer` with antialiasing where device capability allows, a capped pixel ratio, sRGB output, and a restrained tone-mapping setup.
- Use a hemisphere/ambient light and one primary directional light for soft toon-style shading.
- Use `MeshToonMaterial` or carefully chosen standard materials for a cohesive cartoon look. Use a small gradient map only when it improves the result; avoid forcing the same material on every surface.
- Prefer fake soft shadows or baked-looking shadow shapes over expensive real-time shadow maps.
- Use a sky background or large back-sided sky sphere with a configurable blue-to-pink gradient.
- Add a subtle grain/halftone overlay using a lightweight shader or CSS texture. Keep the overlay's opacity adjustable in `theme.js` and ensure it does not reduce text contrast.
- Add bloom only if it is very subtle and does not wash out the UI. Do not add heavyweight post-processing just for decoration.

POLE, WIRES, SIGNALS, AND CLOUDS
- Pole: create a tall rounded/cylindrical purple post with crossbars, visible joints, colourful bands, and a varied set of original sticker decals. Avoid repeating the exact same sticker arrangement on every pole.
- Use a reusable pole builder. The number, spacing, side, dimensions, and decoration density must be configurable.
- Wires: use curved Bezier/tube geometry with a natural sag. Add attachment points and vary wire thickness slightly. Avoid visually tangling wires over important text.
- Signals: build rounded yellow housings with three recessed circular lenses. Animate simple abstract lens states and night glow; do not flash aggressively.
- Clouds: build 4–7 rounded lobes per cloud. Vary scale, silhouette, spacing, and underside tint. Use a light drift animation and wrap/recycle clouds without visible popping.
- Use instancing for repeated static geometry. Do not instance objects that need independent animation or interaction unless the implementation supports that cleanly.

BIRD CHARACTERS
- Create `createBird({ bodyColor, beakColor, accessory })` as a reusable builder.
- Include body, head, wings, tail, beak, eyes, subtle cheek/blush shapes, and small feet. Keep the silhouette readable at the expected on-screen size.
- Accessories may include cap, glasses, headphones, scarf, or other small original variations.
- Place birds on wires, crossbars, signs, and selected scene props. Give each one a slightly different pose, scale, accessory, and idle phase.
- Idle animation may include gentle bobbing, small head turns, subtle wing motion, and occasional blinks. Do not animate every bird identically or constantly.
- Keep animation lightweight. Pause or reduce it when the page is hidden or reduced motion is requested.
- Store bird palette and accessory choices in configuration. Support later replacement with owner-supplied `.glb` models while keeping attachment points and camera framing intact.

PROJECT SHOWCASE
- Render one main project at a time in the framed showcase panel. There are eight initial project items.
- Each project has a number badge (`01/08`), title, tagline, description, tags, year, preview image, and optional live/repository links.
- Keep project media independent from the panel frame and pole geometry. Replacing an image must not change the panel dimensions or camera path.
- Load project images lazily near their chapter. Use local SVG placeholders until the owner supplies real images; never show broken-image icons.
- Previous/next controls change project state and navigate to the corresponding scroll position. Mouse, touch, Enter, and Space must work.
- Clicking the preview or title may open the configured live project link. External links open safely in a new tab with appropriate `rel` attributes. Do not render a link button when its URL is empty.
- Keep all project content available in a semantic HTML list for screen readers and non-3D mode.

ENTRY, GUIDE, MENU, AND SOUND
- The entry screen should be an actual usable state, not a loader that blocks the site indefinitely. Offer “Enter the 3D world” and “Enter without 3D”.
- If WebGL is unavailable or 3D is disabled by the user, the non-3D route must show the same content in a polished, readable, responsive page.
- The bird guide's speech bubble displays the configured message for the active chapter. The Next button advances to the next chapter or next project as appropriate. It must not create a second, conflicting scroll system.
- The menu opens a keyboard-accessible list of chapters and scrolls to the selected chapter. It closes after selection and with Escape.
- Sound is opt-in. Do not autoplay audio. Persisting sound preference is optional; if implemented, use a simple, transparent mechanism and make sure the sound toggle reflects the real state.

SCROLL AND ANIMATION
- Use Lenis with GSAP ScrollTrigger. Keep one clear owner for scroll progress to avoid two competing animation loops.
- Typical Lenis/GSAP bridge:
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
- Remove listeners and kill ScrollTriggers during teardown. Avoid duplicate ticker registration after hot reload or re-entry.
- Drive camera, scene lighting, panel visibility, guide dialogue, project index, and active chapter from the same normalised progress value.
- Use smooth fades and small position changes for panel transitions. Do not animate important text so quickly that it becomes hard to read.
- Keep native scrolling and browser history behaviour sensible. The site must not trap the user in a scroll hijack. Keyboard and touch scrolling must work.

DAY-TO-NIGHT ENDING
- Gradually shift the scene from saturated blue/pink daylight to lavender dusk and then deep indigo/violet night across the final chapters.
- Fade in small stars and a softly lit moon near the ending. Adjust fog and ambient/directional light smoothly.
- Give the yellow signal lenses a restrained night glow. Keep the final “THE END” copy, contact links, and back-to-start control legible.
- All colours, transition start/end values, star counts, moon position, and lamp intensity must be configurable in `theme.js` or `path.js`.

RESPONSIVE DESIGN
- Desktop: maintain the layered composition with the pole on the right and showcase panel on the left/centre-left.
- Tablet: reduce decorative clutter, resize the main panel, and keep the important bird/pole silhouette visible.
- Mobile portrait: use a tighter camera crop and a responsive bottom/side panel that does not cover the entire scene. Make controls thumb-friendly. Reduce birds, clouds, stars, pixel ratio, and active lights.
- Mobile landscape: do not assume portrait layout. Recalculate camera framing and panel placement for the shorter viewport.
- Use `svh`/`dvh` where appropriate, account for safe-area insets, and prevent horizontal overflow.
- Never hide essential content on mobile to preserve the desktop composition.

ACCESSIBILITY AND NON-3D FALLBACK
- All important content exists in semantic HTML, not only in WebGL textures or canvas.
- Use landmark elements, correct heading order, meaningful link labels, project image alt text, and a skip link.
- All menu, project, sound, previous/next, and entry controls must be keyboard operable with visible focus states.
- Respect `prefers-reduced-motion`. In reduced-motion mode, disable camera sway, bobbing, drifting clouds, and scroll-linked 3D movement; present a clean static/low-motion version of the content.
- If WebGL is unavailable, show the non-3D portfolio automatically and keep every section and project accessible.
- Ensure readable contrast, especially on pink/cream surfaces and the night scene. Do not rely on colour alone to communicate a button's state.
- Audio is muted by default and must be user-initiated.

PERFORMANCE AND CODE QUALITY
- Aim for smooth 60 fps on a capable laptop and a stable, simplified experience on mid-range phones. Measure before claiming performance targets.
- Cap device pixel ratio; use a lower quality profile on mobile/low-power devices.
- Lazy-load project textures and optional GLB models. Use compressed textures where practical and Draco only when needed.
- Reuse geometries and materials; instance repeated static meshes; dispose of GPU resources when no longer needed.
- Pause or throttle rendering when the tab is hidden. Avoid unnecessary per-frame allocations.
- Keep scene modules focused and functions reusable. Handle load failures with local placeholders and useful warnings.
- No console errors, failed imports, broken image URLs, or dead UI controls in the final build.

REQUIRED DOCUMENTATION — DO NOT SKIP
Create both `README.md` and **`CUSTOMIZATION.md` at the project root**.

`README.md` must explain prerequisites, install/run/build commands, deployment, architecture, and how to test the site.

`CUSTOMIZATION.md` is specifically for the owner who will replace placeholder content with their own details. It must be written in plain, beginner-friendly language and explain exactly:
- Which file to open to change their name, handle, role, tagline, location, bio, skills, and experience.
- Which file/keys to edit for all eight project titles, descriptions, tags, years, screenshots, live links, and repository links.
- How to replace project preview images, including the exact folder, expected filenames, recommended aspect ratio, supported formats, and how to update the `image` field if a filename changes.
- Where to add or remove social links and where to change their email and resume URL/file.
- How to edit entry-screen text, section labels, bird-guide dialogue, contact copy, and ending text.
- How to change colours, fonts, grain strength, scene density, and other visual preferences.
- How to change the camera path and chapter timing safely.
- Where to place optional `.glb` bird models and how to enable them.
- Which values are safe for a beginner to edit, and which source files should not be edited unless they understand the implementation.
- A final checklist to verify links, images, mobile layout, and the production build.

Make `CUSTOMIZATION.md` match the actual code and filenames you created. Do not write a generic guide that points to files or keys that do not exist. If the implementation changes, update the guide in the same milestone.

DELIVERABLES
1. A complete working project. `npm install` followed by `npm run dev` must work.
2. All sections and eight project states must work, including menu navigation and reverse scrolling.
3. A complete accessible non-3D fallback with the same portfolio content.
4. Original local placeholder visuals and no broken image paths.
5. `README.md` and the required root-level `CUSTOMIZATION.md`.
6. A production build that completes without errors.
7. A short final report listing the implemented features, how the owner personalises the site, test results, known limitations, and deployment steps.

ACCEPTANCE CHECKS
Before calling the build complete:
- Test the full journey from entry screen to The End, both forward and reverse.
- Test each menu item and the back-to-start control.
- Test all eight projects, previous/next controls, and optional live/repo links.
- Test empty optional fields and confirm no blank buttons or broken links appear.
- Test sound-off by default and the actual sound-toggle state if audio is supplied.
- Test desktop, tablet, mobile portrait, and mobile landscape.
- Test keyboard-only navigation, visible focus, reduced motion, and the non-3D route.
- Check the browser console and network panel for errors and missing assets.
- Run the production build and a Lighthouse/accessibility check where tools are available. Report actual results; do not invent scores.
- Update README.md and CUSTOMIZATION.md if any filenames, keys, or controls changed.

Start now with the reference audit and the M1–M8 plan only. Wait for approval before coding.
```

---

# PART B — MILESTONE PROMPTS

Paste these one at a time, in order, after the plan is approved.

## M1 — Project skeleton, content, and owner guide

```text
Do M1 only. Create the Vite vanilla-JavaScript project and the folder structure from Part A. Add the dependencies and scripts, and create a valid package-lock.json.

Create src/config/content.json with the full required schema, eight distinct project placeholders (project-01 to project-08), up to three experience placeholders, and a starter set of skill placeholders. Do not invent personal claims or real links. Create local SVG placeholder artwork for all eight project images and point the JSON to those exact files.

Build the semantic HTML content and a simple polished 2D version of the portfolio. Do not build the 3D scene yet. The content must render from content.json, and empty optional links must be hidden cleanly.

Create README.md and the required root-level CUSTOMIZATION.md. The customization guide must point to the real keys, paths, and image files created in this milestone. Include a beginner-friendly instruction for replacing all personal information and all eight project images.

Run npm install, npm run dev, and npm run build. Verify that every section appears, all images load, the browser console is clean, and editing a value in content.json visibly updates the page. Fix issues before finishing M1.
```

## M2 — Base 3D world and scroll camera

```text
Do M2 only. Add the Three.js scene, renderer lifecycle, resize handling, world container, configurable camera path, and cameraRig.js. Add the Lenis + GSAP ScrollTrigger bridge and drive one normalised progress value from 0 to 1.

Create a simple greybox scene first: sky, a placeholder pole on the right, a placeholder panel on the left, and a few camera-path markers. Keep the HTML content readable above the canvas. Add a development-only progress readout and path debug line.

Verify smooth forward and reverse scrolling, menu-to-section jumps, resize behaviour, and no duplicate ticker/listener registration. Keep the path and chapter timing editable in src/config/path.js. Remove the debug line/readout from production mode.
```

## M3 — Bird Street environment and props

```text
Do M3 only. Build the original stylised scene: purple stickered utility pole, crossbars, sagging wires, chunky yellow signal boxes, rounded cloud clusters, and the supporting sky/fog/lighting. Match the reference's playful blue-to-pink illustrated mood, but use original geometry and sticker artwork.

Implement reusable builders in pole.js, wires.js, signals.js, and clouds.js. Use instancing for repeated static details where appropriate. Keep the pole framed on the right and preserve clear space for the left/centre-left portfolio panel.

Add the subtle configurable grain/halftone treatment. Ensure it does not reduce UI readability. Test the scene at desktop, mobile portrait, and mobile landscape sizes before finishing.
```

## M4 — Bird mascots, entry, guide, and menu

```text
Do M4 only. Build the original bird mascot builder with expressive eyes, cheeks, beak, wings, feet, optional accessories, and lightweight idle animations. Place varied birds on the wires and selected props.

Implement the entry screen with working “Enter the 3D world” and “Enter without 3D” actions. Implement the bird guide speech bubble and its configured Next/Skip behaviour. Implement the top-left accessible chapter menu, top-right sound toggle (audio remains off by default), and progress indicator.

All copy must come from content.json. Ensure controls work with mouse, touch, keyboard, and screen readers. Do not add controls that imply non-existent functionality.
```

## M5 — Portfolio chapters and eight projects

```text
Do M5 only. Connect About, Skills, Experience, and Projects to the scene timeline. Create the large cream portfolio panel with cyan/pink layered edges, an index badge, bold condensed title, readable body copy, and working navigation controls.

Show one project at a time for the eight configured items. Add project number, title, tagline, description, tags, year, image and optional live/repo links. Keep project images separate from panel geometry and lazy-load them near their chapter. The previous/next controls must move to the correct project scroll state and work on touch and keyboard.

Create a semantic HTML project list for non-3D and screen-reader access. Hide optional link buttons when the configured URL is empty. Verify all eight projects and image paths.
```

## M6 — More-projects transition, contact, and night ending

```text
Do M6 only. Add the configurable “More projects coming soon / Stay tuned” transition after project 08, followed by Contact and The End. Add the owner's email/social links from content.json and hide any missing contact methods.

Animate the environment from blue/pink daylight through lavender dusk into deep violet night. Add subtle stars, a moon, and restrained signal-lens glow. Make all lighting and transition values configurable. Keep contact information and the ending readable at every size.

Verify the transitions in both scroll directions and ensure the final back-to-start control works.
```

## M7 — Responsive behaviour, fallback, and accessibility

```text
Do M7 only. Refine desktop, tablet, mobile portrait, and mobile landscape. Adjust camera framing and panel position per breakpoint, reduce scene density on low-power/mobile devices, and prevent horizontal overflow.

Implement the complete no-WebGL/non-3D fallback, prefers-reduced-motion behaviour, visible focus states, skip link, semantic navigation, accessible project descriptions, safe-area handling, and correct keyboard interactions. Audio must remain off until explicitly enabled.

Test with keyboard only, reduced motion, no-WebGL mode (or a forced fallback toggle), and all target viewport sizes. Fix issues before finishing.
```

## M8 — Polish, QA, documentation, and deployment

```text
Do M8 only. Polish visual alignment, chapter transitions, loading states, texture quality, and performance. Pause or throttle rendering when the tab is hidden. Dispose resources cleanly and ensure no duplicate listeners are added after reload/re-entry.

Run the full acceptance checklist from Part A. Test npm run build, all eight projects, all links, all local images, forward/reverse scrolling, menu, guide, entry choices, mobile layouts, reduced motion, and the non-3D route. Check console/network errors and run Lighthouse/accessibility checks where available. Report actual results without inventing scores.

Review README.md and CUSTOMIZATION.md against the final code. Correct every file path, JSON key, image filename, and instruction so a beginner can personalise the site without guessing. Prepare the project for a standard Vercel deployment and document the exact steps.
```

---

# PART C — OPTIONAL REFINEMENT PROMPTS

Use these only after the main experience works.

### Make the world more playful

```text
Refine the bird characters and small scene props. Increase variation in poses, accessories, sticker placement, and cloud silhouettes. Keep the established camera framing and UI positions. Do not add random clutter or change the portfolio content.
```

### Make the scroll more cinematic

```text
Refine the camera path and damping so the journey feels smoother and more deliberate. Keep chapter boundaries and direct menu navigation accurate. The camera must remain reversible and must not cause motion sickness or hide the active panel.
```

### Adjust the printed/grain finish

```text
Tune the grain and halftone treatment using the values in theme.js. Keep the effect subtle, consistent, and inexpensive to render. Do not blur text, project screenshots, or focus indicators.
```

### Replace the procedural birds with an owner-supplied model

```text
Replace the procedural bird body with the owner-supplied model at public/models/bird.glb. Keep the current attachment points, scale, facing direction, idle animation, and optional accessories. Use GLTFLoader and DRACOLoader only if the model is compressed that way. Keep the procedural bird as a fallback and update CUSTOMIZATION.md with the exact replacement steps.
```

### Change the theme

```text
Update the visual theme using src/config/theme.js and CSS variables only. Preserve contrast, responsive layout, scene composition, and the established interaction behaviour. Do not scatter new hard-coded colours through component files.
```

---

# PART D — COMMON ISSUES AND FIX PROMPTS

| Problem | Prompt to give Antigravity |
|---|---|
| Scroll feels jumpy or camera lags behind | “Audit the Lenis/GSAP ticker bridge. Ensure there is one Lenis instance, one ticker registration, one ScrollTrigger progress source, and no duplicate listeners.” |
| Scrolling down works but scrolling up does not restore the right state | “Make all scene and UI states derive from the same normalised scroll progress. Remove one-way callbacks and test every chapter in reverse.” |
| The pole hides the project panel | “Fix the camera framing and world-space placement together. Keep the pole in the right third and the panel in the left/centre-left. Do not solve this with arbitrary panel overlap.” |
| Project panel looks generic | “Restore the designed panel language: cream face, cyan and pink layered edges, index badge, bold condensed title, image-first layout, and restrained shadows.” |
| Bird characters look like plain spheres | “Improve the original bird silhouette with a distinct head/body relationship, tiny beak, expressive eyes, blush, wings, tail, feet, and varied accessories.” |
| Text on 3D sign textures is blurry | “Render decorative sign textures at a higher backing resolution and set appropriate texture filtering/anisotropy. Keep essential text in semantic HTML.” |
| Project images are broken | “Check every `projects[].image` path against the actual public folder. Add a local placeholder fallback and update CUSTOMIZATION.md with the correct filenames.” |
| Mobile feels crowded or slow | “Reduce decorative object counts and pixel ratio, simplify lighting, reframe the camera, and make the panel responsive. Keep every section and control usable.” |
| Mobile page jumps when the address bar changes | “Use appropriate `svh`/`dvh` sizing and safe-area insets. Re-test portrait and landscape.” |
| Sound control does nothing | “Hide or disable the sound control when no audio track is configured. When audio exists, make the toggle reflect the actual audio state and keep sound off by default.” |
| Reduced-motion mode still animates | “Audit every camera, bird, cloud, signal, and UI animation against prefers-reduced-motion. Provide a genuinely static/low-motion presentation.” |
| Owner cannot find where to edit personal details | “Update the root CUSTOMIZATION.md with the exact existing JSON keys, image paths, and source files. Do not point to files that do not exist.” |

---

## Final owner hand-off checklist

Before handing over the project, make sure:

- [ ] The owner can update name, role, bio, location, skills, and experience from `src/config/content.json`.
- [ ] The owner can replace all eight project images without editing JavaScript.
- [ ] The owner can add live/repository links and social links safely.
- [ ] Email and resume can be added or omitted without broken UI.
- [ ] Theme and camera settings have clear, documented locations.
- [ ] `CUSTOMIZATION.md` accurately explains every owner-facing edit.
- [ ] The site works in 3D and non-3D modes.
- [ ] The project builds successfully and is ready for deployment.
