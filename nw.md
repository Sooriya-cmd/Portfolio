# ANTIGRAVITY MASTER PROMPT
# SKY STREET — ADVANCED EFFECTS INTEGRATION & RESPONSIVE REFINEMENT

**Repository:** https://github.com/Sooriya-cmd/Portfolio

**Live website:** https://sooriya-cmd.github.io/Portfolio/

You are modifying my existing Sky Street portfolio.

Your job is to integrate six supplied React Bits visual components, one custom scroll-triggered animation, improve mobile responsiveness, refine the mascot, correct bird visibility and update the specified content.

This is an enhancement of the existing portfolio.

It is NOT a redesign.

You must inspect the existing source code before making changes.

---

# PART 0 — ABSOLUTE RULES

These rules override every implementation decision.

## A. Preserve the existing portfolio identity

My portfolio has a specific visual language:

- Blue and purple gradient sky.
- Cream/off-white content panels.
- Black/dark typography.
- Cyan outlines.
- Pink offset shadows.
- Yellow chapter badges.
- Barlow Condensed display typography.
- Inter body typography.
- Pop-art-inspired layered borders.
- 3D utility poles, hanging wires, signal lights and bird mascots.

This design must remain unchanged.

## B. STRICT COLOUR PALETTE LOCK

You are NOT permitted to introduce a new colour palette.

Do not introduce:
- Green neon.
- Purple neon effects.
- Random blue gradients.
- Orange or red accent themes.
- New colour combinations.
- Unrelated futuristic colour schemes.

Reuse the colours already defined in the project.

Existing design tokens include:

```css
--color-sky-day-zenith: #3165E0;
--color-sky-day-horizon: #DFD5F5;
--color-sky-dusk-zenith: #5B2B85;

--color-pole-purple: #6745A8;

--color-panel-bg: #FFFDF9;
--color-panel-border: #121324;

--color-cyan-layer: #2EE5EF;
--color-pink-layer: #FF4F92;
--color-yellow-badge: #FFD21F;

--color-text-primary: #121324;
--color-text-secondary: #585A75;
--color-text-inverse: #FFFFFF;
```

Read the actual CSS and theme configuration rather than duplicating colour definitions.

For every new effect, retrieve the existing colour values from the design tokens.

For canvas-based effects, use computed CSS colour values where necessary.

White/translucent white is permitted for the requested glitch shards and existing highlights.

**DO NOT MODIFY THE EXISTING THEME TO MATCH THE NEW EFFECTS. ADAPT THE EFFECTS TO THE EXISTING THEME.**

---

# PART 1 — RESPONSIVE LAYOUT REPAIR

This is the first task to complete.

The Android screenshot demonstrates that the current framed containers occupy too much of the available screen and the text can make the panels unnecessarily tall.

Fix the responsive system across the entire portfolio.

## 1.1 Responsive framed panels

Inspect:

- `.portfolio-container`
- `.portfolio-section`
- `.framed-panel`
- `.panel-title`
- `.panel-subtitle`
- `.panel-body`
- `.btn-group`

Make all content containers dynamically adjust to their parent viewport.

Do not use fixed widths or heights that cause overflow.

Use fluid dimensions with `clamp()`, `min()`, `max()`, `min-width`, `max-width` and responsive breakpoints.

Suggested principles:

```css
.framed-panel {
  width: min(100%, 860px);
  max-width: 100%;
  box-sizing: border-box;
  padding: clamp(18px, 3.5vw, 36px);
}
```

Use appropriate values based on the actual layout.

On mobile:

- Reduce oversized padding.
- Scale headings down.
- Keep paragraph line lengths comfortable.
- Prevent buttons from exceeding the panel width.
- Allow button groups to wrap.
- Maintain readable text sizes.
- Preserve the existing border thickness and cyan/pink shadows.
- Allow panel heights to grow naturally.
- Prevent content from clipping.

Never use `overflow: hidden` as a workaround that cuts off text.

## 1.2 Responsive typography

Use fluid typography.

Suggested ranges:

| Element | Mobile | Desktop |
|---|---:|---:|
| Section heading | 28–38px | 48–72px |
| Body text | 15–17px | 17–20px |
| Section eyebrow | 12–14px | 14–17px |
| Buttons | 13–15px | 15–18px |
| Small instructions | 11–13px | 13–15px |

These are starting ranges, not rigid dimensions.

The actual font sizes must be based on available width.

## 1.3 Mobile assistant

The JIU assistant currently occupies too much of the visible mobile screen.

Make it responsive without deleting it.

Desktop:
- Preserve its existing mascot and speech bubble design.
- Keep its existing position and animations.

Mobile:
- Make the mascot smaller where necessary.
- Reduce the speech bubble width and padding.
- Respect safe-area insets.
- Avoid covering content and project controls.
- Provide a compact collapsed state.
- Allow visitors to expand the message through interaction.

Do not permanently remove JIU on mobile.

## 1.4 Responsive 3D environment

The 3D world must also adapt to aspect ratio.

Do not scale the entire 3D world uniformly if that makes the birds or poles look distorted.

Adjust camera framing and world-space placement appropriately.

## 1.5 Testing

Test:

- 360 × 800
- 390 × 844
- 412 × 915
- 540 × 1180
- 768 × 1024
- 1366 × 768
- 1440 × 900

Check portrait and landscape orientations.

No horizontal scrolling, clipped text, cut-off buttons or overflowing panels.

---

# PART 2 — TECHTEXT EFFECT

**Component:** `TechText`

**Placement:** Section 00 — Hero heading.

Use the supplied TechText source as the implementation reference.

This is not an ordinary typing animation.

It is a canvas-based interactive wordmark effect.

## 2.1 Expected visual behaviour

The hero name should appear in the existing large Barlow Condensed typography.

When the visitor moves the pointer over the name:

1. Detect the active letter.
2. Change the active letter from a solid fill into a dashed vector outline.
3. Show a selection frame around the active letter.
4. Smoothly move the selection frame between letters.
5. Draw a subtle connector/accent around the active letter.
6. Display small square specks around the selected letter.
7. Let the idle sweep reveal move across the wordmark when the pointer is inactive.

When a letter is clicked, use the original click-kick behaviour:

- The selected letter springs upwards.
- A ripple travels through neighbouring letters.
- The moving letter temporarily exposes its outline.
- The letter returns to its original baseline using spring motion.

Do not turn the entire word into a glowing neon effect.

## 2.2 Configuration

Use these as the intended starting settings:

```js
{
  text: "JAYASOORIYA",

  fontFamily: "Barlow Condensed",
  fontWeight: 900,

  fontSize: responsiveFontSize,
  letterSpacing: -0.05,

  align: "left",

  color: existingTextColor,
  accentColor: existingCyanAccent,

  reveal: "letter",
  reach: 150,
  softness: 0.7,

  dashLength: 4,
  dashGap: 2,
  lineStyle: "dashed",
  strokeWidth: 1.5,

  specks: 8,

  selection: true,
  labels: false,

  draggable: false,
  bounce: 0.3,

  clickKick: true,

  intro: "type",
  introDuration: 1.8,

  guides: false,

  sweep: true,
  speed: 0.45
}
```

All colours must be resolved from the existing theme.

### Important restrictions

- Do not display technical labels beside letters.
- Do not show typography measurement guides.
- Do not create a separate panel around the heading.
- Do not change the existing heading alignment.
- Do not make the letters draggable on mobile.
- Keep the original semantic H1 available for accessibility.
- Provide a static text fallback if canvas rendering is unavailable.

On mobile, reduce reach and animation intensity.

Respect `prefers-reduced-motion`.

---

# PART 3 — SPLITFLAPTEXT EFFECT

**Component:** `SplitFlapText`

**Placement:** Directly beneath the Hero role subtitle.

Use the actual supplied split-flap character animation.

The component must retain its mechanical flipping behaviour.

## 3.1 Animation behaviour

Each character must independently flip through intermediate glyphs before reaching its destination character.

The animation should:

1. Display the first phrase during the initial reveal.
2. Start the flip sequence from left to right.
3. Stagger the animation between characters.
4. Complete each character's intermediate flip sequence.
5. Hold the completed phrase.
6. Transition to the next phrase.
7. Repeat continuously.

Suggested phrases:

```js
words={[
  "MACHINE LEARNING",
  "AGENTIC AI",
  "PYTHON & AI",
  "SOFTWARE BUILDER"
]}
```

Use shorter phrases if required to avoid mobile overflow.

## 3.2 Critical visual modification — NO BOXES

I specifically do not want the traditional departure-board tile appearance.

Use:

```js
tileStyle="minimal"
```

The original minimal variant displays bare flipping characters separated by a central hinge line.

Remove all rectangular tile styling.

Explicitly ensure:

- No tile backgrounds.
- No tile borders.
- No rectangular boxes.
- No individual tile shadows.
- No surrounding card.
- No dark departure-board surface.

Keep the character flip and hinge animation.

Suggested configuration:

```js
{
  flipDuration: 0.10,
  stagger: 0.035,
  cycleDelay: 2600,

  charset: "alpha",
  flipsPerChar: 5,

  order: "left",
  align: "left",

  tileStyle: "minimal",

  tileColor: "transparent",
  textColor: "currentColor",

  tileRadius: 0,
  gap: 3,

  glare: 0,
  depth: 0.25,

  loop: true,
  intro: true,
  padTo: 0
}
```

## 3.3 Responsive behaviour

The typography must adapt to the hero panel.

Use a responsive font size around 14–26px according to viewport width.

Do not let the character board determine the width of the hero panel.

Prevent horizontal scrolling.

Keep phrases on one line where possible, and shorten phrases rather than shrinking them to unreadable sizes.

Do not allow screen readers to announce each phrase repeatedly.

---

# PART 4 — LETTERGLITCH EFFECT

**Component:** `LetterGlitch`

**Placement:** Section 02 — Technical Skills.

This is an interactive WebGL2 character-grid effect.

Use the supplied source as the reference for the original behaviour.

## 4.1 Actual visual behaviour

The component should create a grid of monospaced characters inside its container.

The effect consists of:

- Letters displayed at rest.
- Randomized character changes.
- Glitch heat around changing characters.
- Character flickering.
- Soft moving light waves.
- Character scrambling around the mouse.
- A fading interactive pointer trail.
- A horizontal tearing effect on click when enabled.
- An intro sequence that gradually reveals the character grid.

These properties should be retained where applicable.

Do not replace the effect with ordinary falling code or Matrix rain.

## 4.2 Placement

Place the effect inside the existing Skills section as an independent background layer.

The existing skill categories and skill labels must remain foreground content.

The canvas must:

- Occupy only the Skills effect container.
- Stay behind all headings and skill labels.
- Have a transparent background.
- Never intercept pointer interactions.
- Respect the container dimensions.
- Resize correctly.

Use centre fading so the actual text remains easy to read.

## 4.3 Configuration

Use existing portfolio colours instead of the component defaults.

Suggested starting configuration:

```js
{
  glitchColors: [
    existingBlue,
    existingCyan,
    existingPink
  ],

  baseColor: existingDarkText,

  fontSize: 11,
  spacing: 0.65,

  density: 0.55,
  baseOpacity: 0.09,

  glitchAmount: 0.22,
  speed: 0.55,
  flow: 0.2,

  smooth: true,

  interactive: false,
  cursorRadius: 100,

  clickEffect: "none",

  edgeFade: 0.18,
  centerFade: 0.75,

  intro: true,
  lightMode: true
}
```

The values are tuning targets, not permission to change the original design.

Do not use the default green accent from the supplied component.

Do not provide an opaque background colour.

### Performance

The supplied effect uses WebGL2.

- Avoid rendering at unnecessarily high DPR.
- Pause expensive animation when the Skills section is outside the viewport.
- Resume when it becomes visible.
- Dispose of GPU resources properly.
- Provide a static CSS fallback if WebGL2 is unavailable.

Keep the effect subtle enough that the existing skills are always readable.

---

# PART 5 — CROSSHAIR EFFECT

**Component:** `Crosshair`

**Placement:** Section 04 — Actual Projects showcase.

This must be the original interactive pointer-following scanner, not a permanent decorative cross.

## 5.1 Actual behaviour

The crosshair follows the pointer with smooth interpolation.

It consists of:
- One horizontal scanning line.
- One vertical scanning line.
- A configurable gap at the pointer intersection.
- Optional fading towards screen edges.
- Pointer-follow smoothing.
- A circular pulse on click.
- Lock-on brackets around interactive targets.
- An optional glitch response.

When hovering over links or buttons:

1. Detect the target.
2. Identify its bounding rectangle.
3. Display corner brackets around the target.
4. Smoothly animate the lock frame.
5. Remove the lock when the pointer leaves.

The crosshair must not hide the real mouse cursor.

## 5.2 Configuration

```js
{
  color: existingCyanAccent,

  thickness: 1,
  opacity: 0.45,

  lineStyle: "solid",

  gap: 10,
  fade: 0.25,

  smoothing: 0.35,

  showCoordinates: false,

  targetEffect: "lock",

  targetSelector:
    "a, button, [data-crosshair-target]",

  clickPulse: true,

  hideCursor: false,

  blendMode: "normal"
}
```

## 5.3 Container scope

Do not attach this component to the whole viewport.

Attach its container reference specifically to the existing Projects showcase wrapper.

Ensure that:
- The wrapper has position relative.
- The crosshair canvas occupies exactly the wrapper dimensions.
- It uses `pointer-events: none`.
- It does not intercept button clicks.
- It does not interfere with existing project navigation.

Desktop only.

Disable the crosshair on touch devices and retain normal touch controls.

---

# PART 6 — SCROLL EXPAND: CIRCULAR IMAGE REVEAL

**Component:** `ScrollExpand`

**Placement:** The THIRD illustrated image shown in my supplied visual reference.

IMPORTANT: Locate the correct illustration/media element by comparing the supplied reference image with the existing repository. Do not automatically apply this effect to the third project carousel item.

The third reference visual contains the circular illustrated artwork and the small creature above it.

Apply the reveal to that specific image/media area only.

Do not expand the entire website.

## 6.1 Original behaviour to preserve

The supplied component is controlled by scroll progress.

At rest:
- The image is partially clipped.
- The image media is slightly zoomed in.
- A headline can appear over the frame.
- A scroll hint is visible below it.

As scrolling progresses:
- The clip gradually expands.
- The media zoom reduces towards normal scale.
- The headline fades away.
- The scroll hint fades away.
- Overlay content gradually appears.
- The image ultimately takes over its available stage.

Scrolling backwards must reverse the effect.

## 6.2 Convert the shape into a true circle

The supplied component originally uses an inset-based rectangular clip.

Replace that geometry with an actual circular clip.

Implement a custom circular version of the original ScrollExpand behaviour.

At the beginning:

- Display a small circular viewing window.
- Position it precisely at the centre of the media.
- Use a restrained initial radius.
- Preserve the image's aspect ratio.

As scroll progress moves from 0 to 1:

- Increase the circular radius smoothly.
- Calculate the final radius from the actual media width and height.
- Ensure the final radius reaches beyond all four corners.
- Reveal the entire rectangular media area.

Use the following mathematical approach:

```js
const startRadius =
  Math.min(width, height) * 0.14;

const endRadius =
  Math.hypot(width, height) / 2 + 4;

const currentRadius =
  startRadius +
  (endRadius - startRadius) * easedProgress;

frame.style.clipPath =
  `circle(${currentRadius}px at 50% 50%)`;
```

Recalculate dimensions when the container resizes.

Do not use a large border-radius as a substitute for circular clipping.

Do not stretch the image.

## 6.3 Scroll integration

Use the existing scroll architecture:

- Lenis.
- GSAP.
- ScrollTrigger.
- Existing window scroll.

The implementation must not introduce an independent nested scrolling area.

Use the supplied component's window-scroll behaviour.

The effect must remain synchronized with the existing page scrolling.

Do not introduce competing scroll timelines or unwanted page locking.

Suggested starting values:

```js
{
  mediaType: "image",

  startWidth: 42,
  startHeight: 58,

  mediaZoom: 1.25,

  scrollDistance: 1.1,
  holdDistance: 0.2,

  smoothing: 0.1,
  overlayScrim: 0.25,

  useWindowScroll: true,
  enabled: true
}
```

The custom circular clipping replaces the original inset geometry.

## 6.4 Instruction text

Add a medium-visibility instruction near the circular image.

Desktop:

`SCROLL TO REVEAL ↓`

Mobile:

`SWIPE TO REVEAL ↓`

Requirements:
- Use existing typography.
- Use existing colours.
- Avoid a new button design.
- Do not make the text oversized.
- Use moderate opacity.
- Fade the instruction out as the circle expands.

The instruction must explain the interaction without competing with the illustration.

---

# PART 7 — GRADIENT ASCII EFFECT

**Component:** `GradientASCII`

**Placement:** Background of the SAME third illustrated image/media area described in Part 6.

This effect must not appear anywhere else.

## 7.1 Original behaviour

Use the supplied GradientASCII source as the implementation reference.

This is a WebGL2-based ASCII gradient renderer.

Its actual visual behaviour includes:

- A procedural gradient field.
- Multiple selectable shapes.
- Monospaced ASCII character rendering.
- Characters selected according to brightness.
- Character flickering.
- Animated gradient movement.
- Optional flow/noise.
- Character reveal during intro.
- Optional mouse scrambling.
- Optional click-based wave or burst.
- Optional glow and grain.

Do not replace it with an ordinary text paragraph or a static CSS background.

Preserve the ASCII rendering behaviour.

## 7.2 Exact placement restriction

GradientASCII must be confined to the third illustration's background container.

It must NOT appear on:
- The entire page.
- The Hero section.
- Technical Skills.
- Projects 01 and 02.
- Contact.
- The general website background.

## 7.3 Layering

The effect must appear behind the original illustration.

Layer order:

1. Existing media background.
2. GradientASCII canvas.
3. Original illustrated image.
4. ScrollExpand circular clipping.
5. Optional small instructional text.

Preserve the original artwork.

Do not recolour the character or apply ASCII glyphs over its face.

Where the image is opaque, retain the ASCII effect in visible background/negative-space areas of the media stage. Never obscure the main artwork merely to make the effect more noticeable.

## 7.4 Palette

Read the actual CSS tokens and use only existing portfolio colours.

Suggested colour ramp:

- Existing blue sky colour.
- Existing cyan accent.
- Existing lavender horizon.
- Existing purple pole colour.

Resolve their actual computed values at runtime.

Do not use the default unrelated blue/cyan palette supplied in the example.

## 7.5 Configuration

Suggested starting settings:

```js
{
  colors: existingPortfolioColourRamp,

  shape: "eclipse",

  characters: " .:-=+*#@",

  cellSize: 18,
  density: 0.55,

  glyphOpacity: 0.48,
  gradientOpacity: 0.22,

  glow: 0.08,

  depthOfField: 0,
  flicker: 0.08,

  softness: 0.65,
  scale: 1.1,

  flow: 0.2,
  speed: 0.4,

  grain: 0.01,
  variation: 0,

  mouseInteraction: false,

  scrambleRadius: 0.1,
  clickEffect: "none",

  intro: true,
  lightMode: false
}
```

The effect must remain subtle.

Adjust the settings according to the actual media background and preserve the original colour identity.

## 7.6 WebGL performance

This effect uses WebGL2 and must be managed carefully.

- Render only one instance.
- Restrict it to the illustration container.
- Use ResizeObserver.
- Use IntersectionObserver.
- Suspend rendering outside the viewport.
- Cap DPR appropriately.
- Release GPU textures, framebuffers and shaders.
- Clean up all event listeners.
- Provide a graceful fallback.

Do not run unnecessary high-frequency rendering loops.

---

# PART 8 — SCROLL-REACTIVE GLITCH SHARDS

This is a separate custom effect. It is NOT the same as LetterGlitch.

Implement it across the entire website viewport.

## 8.1 Visual appearance

Create thin, sharp, elongated vertical streaks randomly scattered across the viewport.

Each shard should have independently generated properties:

- Random X position.
- Random Y position.
- Random height.
- Random width.
- Slight vertical or diagonal inclination.
- Slight asymmetry.
- Sharp or irregular ends.
- Varying opacity.

They should look like brief digital distortion fragments.

Do not create:
- Falling rain.
- Snow.
- Ordinary glowing particles.
- Star fields.
- Continuous vertical background lines.
- Large rectangular blocks.
- Groups of parallel streaks.

## 8.2 Shard geometry

Generate irregular pointed shapes.

Use CSS polygons or SVG polygon geometry.

Example conceptual shape:

```css
clip-path: polygon(
  48% 0%,
  100% 9%,
  56% 84%,
  30% 100%,
  40% 66%,
  0% 12%
);
```

Vary the shape for individual shards.

The width should generally be around 1–3px, with slightly wider variants used sparingly.

Heights can range from short fragments to longer streaks occupying approximately 5–30% of the viewport height.

Avoid making every shard identical.

## 8.3 Trigger specifically on scroll

The effect must remain invisible or nearly invisible when the user is not scrolling.

Track vertical scroll velocity.

Compute velocity from scroll displacement and elapsed time.

Slow scrolling:
- Spawn fewer shards.
- Use low opacity.
- Use gentle movement.

Fast scrolling:
- Increase the number of shards.
- Increase visibility slightly.
- Increase distortion and movement.
- Allow stronger but brief bursts.

Do not continuously spawn shards while the page is stationary.

## 8.4 Animation lifecycle

When scroll begins:

1. Detect velocity.
2. Calculate the effect intensity.
3. Generate independently positioned shards.
4. Fade them in quickly.
5. Apply subtle positional movement.
6. Add slight horizontal distortion.
7. Let each shard disappear naturally.

When scrolling stops:

- Stop spawning new shards.
- Smoothly fade existing shards.
- Remove completed DOM/SVG elements.
- Reset the animation state.

Use a short fade-out rather than leaving permanent marks on the screen.

## 8.5 Performance

Use a single effect manager.

Use requestAnimationFrame only while active animations exist.

Suggested limits:

- Desktop: around 25–35 simultaneously active shards.
- Mobile: around 8–14 simultaneously active shards.

Adjust dynamically according to viewport size and scroll intensity.

Do not create hundreds of DOM nodes.

GSAP may be used because it is already installed.

Avoid adding another animation dependency.

## 8.6 Visual integration

Use translucent white.

Add only a very subtle white glow.

Do not introduce neon or new accent colours.

Position the effect above the Three.js background but behind all meaningful interface content.

It must not:
- Cover the text.
- Hide the birds.
- Intercept clicks.
- Interfere with the chapter menu.
- Obscure JIU.
- Interfere with project buttons.

Use:

```css
pointer-events: none;
```

Respect reduced-motion preferences.

Reduce intensity on mobile.

Clean up listeners and animation frames properly.

---

# PART 9 — BIRD VISIBILITY IN THE 3D WORLD

This is important.

The existing birds must not become hidden behind the framed content panels.

Inspect the existing:

- `birds.js`
- `world.js`
- `cameraRig.js`
- `createScene.js`
- Relevant scene and camera configuration.

Do not simply change the z-index of the 3D canvas.

The problem is visual positioning and camera framing.

## Required changes

Reposition the existing bird mascots where necessary.

Maintain their original:
- Models.
- Facial details.
- Colours.
- Accessories.
- Expressions.
- Perching behaviour.
- 3D appearance.

Make sure the birds are visible around the framed panels.

Desktop:
- Preserve the existing wire/perching arrangement.
- Keep birds distributed naturally.
- Prevent important birds from sitting directly behind the main panels.

Mobile:
- Recalculate bird positions for narrow aspect ratios.
- Move them into visible areas above, beside or below panels.
- Reduce their size where appropriate.
- Avoid placing their faces beneath a panel.
- Keep them within the visible viewport.
- Preserve appropriate 3D depth.

Do not move the birds in front of important text.

Do not make them overlap navigation controls.

The objective is to make the world feel alive without compromising readability.

---

# PART 10 — CREATURE REFINEMENT

Use the third supplied image as the visual reference.

Identify the small bird-like creature positioned above the circular illustrated artwork.

Refine that existing creature.

## Head shape

Make the head rounder.

The current appearance should be refined into a smoother, more circular shape.

Do not make the head oval, flattened or elongated.

## Eyes

Move both eyes slightly upwards.

Keep:
- The original eye size.
- Eye symmetry.
- Original expression.
- Existing colour.
- Natural spacing.

Do not make the eyes excessively large.

Keep them positioned naturally relative to the beak.

## Beak

Maintain the existing beak style.

Keep it centred beneath the eyes.

## Overall appearance

Preserve the original creature identity.

Maintain its existing white appearance and small facial details.

Do not replace it with a new character.

Do not alter the pixel-art illustration around it.

If the creature is built from CSS or vector geometry, modify its actual shape. If it is a raster asset, make a localised edit while preserving the surrounding artwork.

Keep the mascot responsive and visually consistent at all sizes.

---

# PART 11 — HERO CONTENT UPDATE

Section 00 — Hero.

Replace the existing sentence:

"Eager to learn new things, adapt to emerging technologies, and grow through consistent effort."

With this exact sentence:

"Somewhere between 'I've got an idea' and 'Why isn't this working?'"

Update the appropriate content source rather than hardcoding a second copy.

If the current tagline is shared with the entry screen, introduce a section-specific hero description rather than unintentionally changing other content.

Preserve:
- Existing name.
- Professional role.
- Resume button.
- Scroll-to-explore button.
- Index badge.
- Existing panel styling.

TechText goes on the name.

SplitFlapText goes below the role subtitle.

Do not rearrange the entire Hero section.

---

# PART 12 — REMOVE SECTION 04

Completely remove the existing transition section:

`section-more-projects`

It is the panel currently labelled:

`04 / ??`

Remove:
- The section's framed panel.
- Its heading and description.
- The More Projects CTA.
- The corresponding chapter navigation item.
- Obsolete links.
- References that no longer serve any purpose.

Search the entire repository for references to:
- `section-more-projects`
- `moreProjects`
- `content.moreProjects`
- Chapter mappings.
- Scroll and camera progress mappings.

Update the relevant logic without creating broken references.

Preserve the actual Projects showcase.

**DO NOT DELETE ANY OF THE THREE EXISTING PROJECTS.**

Preserve all project descriptions, images, tags, GitHub links and previous/next controls.

Do not delete any other section.

Adjust the chapter mapping carefully so the 3D camera does not become misaligned after the section is removed.

---

# PART 13 — VANILLA JAVASCRIPT INTEGRATION

IMPORTANT ARCHITECTURAL REQUIREMENT.

The existing portfolio uses:

- Vite.
- Vanilla JavaScript ES Modules.
- Three.js.
- GSAP.
- ScrollTrigger.
- Lenis.
- CSS.

The supplied React Bits components use React hooks.

**Do not migrate the existing portfolio to React.**

Do not install React or ReactDOM.

Instead, adapt the actual supplied component behaviour into compatible JavaScript modules.

Suggested organisation:

```text
src/
  effects/
    techText.js
    splitFlapText.js
    letterGlitch.js
    crosshair.js
    scrollExpand.js
    gradientAscii.js
    scrollGlitchShards.js
    index.js

  styles/
    effects.css
```

This structure is a suggestion. Follow the existing project architecture if another structure is more suitable.

Each effect should have a clear initialization function and appropriate cleanup/disposal function.

For example:

```js
const destroy = initEffect(container, options);

// When the element is removed:
destroy();
```

Preserve original animation behaviour, rather than approximating the effect with unrelated CSS.

Avoid:
- Duplicating animation loops.
- Creating multiple unnecessary canvases.
- Registering duplicate listeners.
- Running animations outside their required containers.
- Modifying unrelated files.
- Introducing unnecessary packages.

## WebGL resource management

Both LetterGlitch and GradientASCII use WebGL2.

The existing Three.js scene also uses WebGL.

Monitor GPU resource usage carefully.

Do not allow hidden effects to continue rendering unnecessarily.

Dispose of textures, framebuffers, shaders, buffers and contexts when an effect is destroyed.

Provide fallbacks where WebGL2 is unavailable.

---

# PART 14 — ACCESSIBILITY

Preserve the existing accessibility implementation.

Requirements:

- Keep semantic headings.
- Keep meaningful image alt text.
- Keep keyboard navigation.
- Do not make canvases the only source of meaningful text.
- Maintain visible keyboard focus.
- Do not make decorative canvases intercept input.
- Respect reduced-motion preferences.
- Avoid constantly updating screen-reader announcements.
- Keep touch interactions usable.
- Preserve the 2D fallback.

For users with reduced motion, show stable content and disable decorative movement where necessary.

---

# PART 15 — EXECUTION ORDER

Do not implement everything blindly in one pass.

Follow this order.

### Phase 1: Inspect

Inspect the repository and all relevant source files.

Check:
- Git branch.
- Git working tree.
- Existing local changes.
- HTML structure.
- Content configuration.
- Section rendering.
- Mobile styles.
- Three.js scene.
- Camera path.
- Project showcase.
- Entry/illustration asset.
- Scroll architecture.

Read the actual supplied React Bits component specifications.

Do not assume a target element without identifying it in the source.

### Phase 2: Responsive repair

Fix:
- Framed panels.
- Typography.
- Button wrapping.
- Image dimensions.
- JIU mobile layout.
- Section spacing.
- 3D composition on small screens.

Test before continuing.

### Phase 3: Content updates

- Replace the Hero tagline.
- Remove Section 04.
- Update chapter mappings.
- Preserve all three projects.

### Phase 4: Effects integration

Implement and verify each effect individually.

1. TechText.
2. SplitFlapText.
3. LetterGlitch.
4. Crosshair.
5. Circular ScrollExpand.
6. GradientASCII.
7. Scroll-Reactive Glitch Shards.

Verify the actual animation behaviour after each integration.

### Phase 5: Mascots and 3D world

- Improve bird visibility.
- Adjust viewport-dependent bird positions.
- Refine the creature's rounded head.
- Raise its eyes slightly.
- Preserve existing expressions and geometry.

### Phase 6: Performance

Check:
- WebGL context usage.
- Memory consumption.
- Animation frame scheduling.
- ResizeObserver cleanup.
- IntersectionObserver cleanup.
- Scroll event cleanup.
- Hidden canvas behaviour.
- Mobile GPU performance.

### Phase 7: Final verification

Run:

```bash
npm run build
```

Resolve all build errors.

Check the browser console.

Check every section and navigation item.

Test all interactions using a real desktop browser and mobile device emulation.

---

# PART 16 — FINAL ACCEPTANCE CHECKLIST

Do not declare the task complete unless these requirements are checked.

## Design

- [ ] Original Sky Street design preserved.
- [ ] No new colour palette.
- [ ] Existing layered borders preserved.
- [ ] Existing typography preserved.

## Responsive

- [ ] Hero content fits on Android.
- [ ] All panels resize naturally.
- [ ] Text does not overflow.
- [ ] Buttons fit.
- [ ] Project media scales correctly.
- [ ] JIU does not cover content.
- [ ] No horizontal scrolling.

## Effects

- [ ] TechText reveals individual letters.
- [ ] TechText selection frame follows the pointer.
- [ ] TechText click-kick works.
- [ ] SplitFlapText flips individual characters.
- [ ] SplitFlapText has no rectangular boxes.
- [ ] LetterGlitch displays an animated character grid.
- [ ] Crosshair locks onto interactive targets.
- [ ] Crosshair click pulse works.
- [ ] ScrollExpand reveals a real circular clip.
- [ ] ScrollExpand follows page scrolling.
- [ ] ScrollExpand reverses when scrolling upwards.
- [ ] GradientASCII appears only behind the third illustration.
- [ ] GradientASCII uses the portfolio palette.
- [ ] Glitch Shards appear only during scrolling.
- [ ] Glitch Shards become stronger with faster scrolling.
- [ ] Glitch Shards fade out when scrolling stops.

## Visuals

- [ ] Birds remain visible around containers.
- [ ] Birds are correctly positioned on mobile.
- [ ] Creature head is rounder.
- [ ] Creature eyes are slightly higher.
- [ ] Existing creature identity is preserved.

## Functionality

- [ ] Three.js environment works.
- [ ] Lenis works.
- [ ] GSAP/ScrollTrigger work.
- [ ] Chapter navigation works.
- [ ] All three projects remain.
- [ ] Repository links work.
- [ ] Resume link works.
- [ ] Contact links work.
- [ ] JIU remains functional.
- [ ] 2D fallback works.
- [ ] Reduced-motion mode works.
- [ ] No console errors.
- [ ] Production build succeeds.

---

# PART 17 — ABSOLUTE GIT STOP CONDITION

This is mandatory.

Do all implementation and testing, but **DO NOT COMMIT YET**.

Do not push.

Do not merge.

Do not deploy.

Do not overwrite the current live GitHub Pages version.

Do not delete the original branch.

Use a dedicated feature branch if appropriate, and preserve any pre-existing uncommitted changes.

When implementation is finished:

STOP.

Show me:

1. A summary of every implemented effect.
2. Files modified.
3. Files created.
4. Desktop screenshots.
5. Android/mobile screenshots.
6. Before-and-after comparisons.
7. Build results.
8. Console results.
9. Git diff.
10. Current branch and working-tree status.

I will personally review the final result.

**Only when I explicitly approve the changes may you commit them.**

Do not interpret task completion as permission to commit.

---

# FINAL INSTRUCTION

My goal is to make Sky Street more interactive and polished without losing the identity that already exists.

Every new effect must look as though it was originally designed for this portfolio.

Do not add unrelated animations.

Do not redesign the website.

Do not change its colours.

Do not remove existing content except the explicitly requested Section 04.

Do not commit before my review.

**PRESERVE THE ORIGINAL. ENHANCE THE EXPERIENCE.**