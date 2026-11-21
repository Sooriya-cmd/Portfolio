# EXISTING WEBSITE BUG FIXES & PORTFOLIO CONTENT UPDATE

## ROLE

Act as a senior frontend developer and Three.js debugging specialist.

You are working on my existing portfolio website, **Sky Street**.

I want you to make targeted corrections to the existing website and replace its placeholder portfolio content with my actual information.

This is an UPDATE task, NOT a website redevelopment task.

## IMPORTANT — STRICT SCOPE

Do not rebuild the website.

Do not redesign the website.

Do not introduce new features.

Do not add new pages, sections, navigation items, dashboards, AI tools, interactive systems, or additional UI components beyond the specific changes requested below.

Do not change the existing technology stack or introduce new dependencies.

Preserve the existing:

- Website structure.
- Single-page layout.
- Existing portfolio sections.
- Visual identity.
- Colour palette.
- Typography.
- 3D environment.
- Navigation.
- Existing working interactions.
- Existing animation system.

Only modify what is necessary to complete the explicitly requested bug fixes and portfolio content updates.

**The goal is to improve the existing website, not turn it into a different website.**

---

# PART 1 — FIX THE EXISTING UI BUGS

## 1. Entrance screen

Remove the following existing components:

- START text.
- Play icon.
- Music icon inside the circular START control.
- ENTER WITHOUT SOUND button.
- ENTER WITHOUT 3D button.
- Bottom-right progress indicator.

Keep the existing circular entrance design.

### Bird greeting

- Keep the small bird mascot.
- Display a small speech bubble saying "hi".
- Make the speech bubble appear with a smooth pop-up animation.
- Make the bird's pupils follow the cursor.
- Keep pupil movement constrained within the eyes.
- Ensure smooth, natural movement without jitter.

## 2. Header

Inside the main portfolio:

- Remove the top-right music button.
- Remove the centered "SKY STREET" heading.
- Remove unnecessary spacing reserved for these elements.

Keep the existing top-left hamburger menu and its functionality.

Do not add replacement header buttons.

## 3. Bird spacing and flight animation

Currently, the birds are too close together and sometimes overlap.

Correct their positioning.

### Initial positioning

- Maintain a small visible gap between neighbouring birds.
- Prevent their bodies from touching or intersecting.
- Preserve their original appearance, accessories, and proportions.

### Cursor interaction

When the cursor points towards an individual bird:

1. Detect that particular bird.
2. Trigger its wing-flapping animation.
3. Make it fly independently from its original position.
4. Give each bird a slightly different flight direction.
5. Prevent it from colliding with other birds.
6. Do not move the entire group together.

### Return animation

- After approximately 2–3 seconds, return the bird to its original position.
- Use smooth movement and natural landing.
- Prevent repeated hover events from interrupting ongoing flight animations.
- Ensure birds do not overlap during takeoff, flight, or landing.

On mobile, support a suitable tap interaction.

Do not create additional bird characters.

## 4. Street lamp positioning

- Move the existing street lamp slightly towards the right.
- Preserve its original design, materials, proportions, and lighting.
- Check the positions of nearby objects after moving it.
- Ensure that the lamp does not overlap with boxes, signboards, or traffic signals.

Do not introduce new lamps or environmental objects.

## 5. Boxes and signboards

Some existing boxes and signboards contain too much unnecessary empty space.

- Reduce their width and height according to their actual contents.
- Maintain adequate internal padding.
- Keep text and icons readable.
- Prevent text clipping.
- Maintain their existing design language.

Do not shrink text or remove content to make the boxes smaller.

## 6. Guide character — JIU

Rename the existing bottom-left guide from "GUIDE" to **"JIU"**.

- Remove the NEXT button.
- Remove the existing multi-step tutorial controls.
- Preserve the existing guide message card.
- Keep its bottom-left position.
- Maintain the original bird character.

### Eye tracking

Make JIU's pupils follow the cursor.

- Use smooth movement.
- Keep pupils inside the original eye shapes.
- Preserve its facial expression.
- Avoid unnatural eye movement.

Do not replace JIU or introduce another chatbot or guide system.

## 7. Fix background overlaps

Inspect the supplied screenshots showing the current 3D environment.

Correct the existing positioning problems involving:

- Street lamp.
- Traffic signals.
- Horizontal signboards.
- Vertical signboards.
- Boxes.
- Birds.
- Utility poles.
- Supporting structures.
- Background decorations.

### Requirements

- No unintended object intersections.
- No signboards obstructing other signboards.
- No lamp structures passing through boxes.
- No overlapping bird characters.
- No unnecessary clipping.
- No z-fighting.
- Maintain appropriate visual separation and depth.

Inspect the actual 3D object positions and camera view before changing coordinates.

Do not solve these issues by deleting objects or hiding them.

Do not create a new background environment.

## 8. Hero entrance image

Replace the existing START text and play icon with my uploaded pixel-art developer illustration (`p.png`).

Use the exact supplied image.

It contains:

- A developer sitting with a laptop.
- Headphones.
- A bird companion.
- A pixel-art fantasy environment.

### Required behaviour

- Place the illustration inside the existing circular entrance design.
- Preserve the original image proportions.
- Do not distort or replace the artwork.
- Keep the existing circular design and its cyan and pink borders.
- Make the image clickable.

### Circular opening animation

When I click the developer image:

1. Animate the existing circular frame.
2. Expand the circle outwards.
3. Animate the cyan and pink border layers.
4. Reveal the existing Sky Street portfolio underneath.
5. Complete the transition smoothly.

Implement this interaction using the existing animation framework.

Do not create a separate loading screen or additional transition UI.

---

# PART 2 — UPDATE MY EXISTING PORTFOLIO CONTENT

Replace the current placeholder content with the following actual information.

**Important:** Populate the corresponding sections that already exist in the website. Keep their existing layouts and visual components. Do not create new sections or navigation items just to display information.

## 9. Personal identity

**Name:** Jayasooriya

**Professional title:** AI/ML Engineer & Software Developer

**Tagline:**

"Eager to learn new things, adapt to emerging technologies, and grow through consistent effort."

**Location:** Chennai, India.

Do not show an availability badge.

Use my uploaded pixel-art illustration as the personal avatar.

Keep the bird mascot separate from my personal identity.

## 10. About Me

Use the following introduction:

"I'm a third-year Computer Science and Engineering student specialising in Artificial Intelligence and Machine Learning, aspiring to become a Software Engineer.

The constant emergence of new technologies and ideas sparks my curiosity and motivates me to explore, learn and adapt. I believe in growing through consistent effort, embracing new challenges and continuously improving my technical abilities."

Do not add invented personal information.

## 11. Education

**Institution:** Jerusalem College of Engineering, Chennai.

**Degree:** B.E. Computer Science and Engineering.

**Specialisation:** Artificial Intelligence & Machine Learning.

**Academic year:** Third Year.

**CGPA:** 8.6.

**Expected graduation:** 2028.

**Location:** Chennai, India.

Replace existing education placeholders with these values.

## 12. Technical skills

Use the following categories and technologies.

**Programming**

- C
- C++
- Java
- Python

**Web & Application**

- HTML
- CSS
- Flutter

**AI & Machine Learning**

- Machine Learning
- LLMs
- Agentic AI
- RAG

**Backend & Database**

- Supabase
- Firebase
- SQL

**Developer Tools**

- Git
- GitHub
- VS Code
- Antigravity

Use the existing skills layout.

Do not add proficiency percentages or invented skill ratings.

Do not introduce additional technologies into my general skills list.

## 13. Leadership

Update the existing leadership information with:

**Vice President — IE(I)**

2026–2027.

**Student Member — INTELLIZONE Club**

2025–2026.

Do not represent these as paid employment.

## 14. Achievements and courses

### Academic recognition

- Semester 1 — Topper II.
- Special Prize — Think2Impact, IIT PALS event at Tagore College of Engineering.

### NPTEL courses

- Fundamentals of Generative AI and LLM — Elite.
- Machine Learning.

### Technical participation

- ByteBlaze — 12-hour Hackathon.
- Google's BuildWithAI Bootcamp.
- AMD Slingshot.

Do not include symposium certificates.

Do not invent completion years, awards, or participation results.

Use the existing achievement layout if present.

## 15. Projects — exactly three confirmed projects

Update the existing project cards or project showcase with these three projects.

Replace previous placeholder projects if necessary.

Do not add additional projects.

Do not invent live demos or screenshots.

### **01. MemoryBreaker**

**AI Agent Memory Security Benchmarking Toolkit**

An open-source toolkit for testing AI agent memory systems against persistent, multi-turn memory poisoning attacks.

**Tech Stack:** Python, Ollama, Llama 3.1, Mem0, ChromaDB, Pytest.

**Key Highlights:**

- Simulates multi-turn split-write memory poisoning.
- Compares baseline and guarded experiments.
- Verifies attacks using independent retrieval and canary checks.
- Generates structured experiment and security reports.

**Results:** Baseline and guarded attack success were both 100%. The configured guard recorded zero interventions, showing it did not prevent this tested attack scenario.

[https://github.com/Sooriya-cmd/MemoryBreaker](https://github.com/Sooriya-cmd/MemoryBreaker)

### **02. Nova-Notes**

**3D Spatial Knowledge Graph & Animated Note Vault**

A 3D spatial note-taking application that transforms local folders and knowledge into an interactive visual universe.

**Tech Stack:** React, Three.js, React Force Graph 3D, Tailwind CSS, Zustand.

**Key Highlights:**

- Interactive 3D knowledge graph.
- Local folder and file visualisation.
- Procedural planet shaders and animated explorers.
- Auto-save, search, backlinks and command palette.

[https://github.com/Sooriya-cmd/Nova-Notes](https://github.com/Sooriya-cmd/Nova-Notes)

### **03. ClubHub**

**College Club Management System**

A MERN-stack application for managing college clubs, members, meetings and announcements.

**Tech Stack:** React, Vite, Node.js, Express.js, MongoDB, Mongoose.

**Key Highlights:**

- Member and club management.
- Meeting and announcement management.
- REST API with CRUD operations.
- Modular backend and database architecture.

[https://github.com/Sooriya-cmd/clubhub](https://github.com/Sooriya-cmd/clubhub)

### Project restrictions

- Keep exactly these three projects.
- Replace existing project placeholder content.
- Preserve the existing project presentation layout.
- Do not create project-detail pages.
- Do not introduce new project animations or interactive features.
- Do not create fake screenshots.
- Do not add empty live-demo buttons.
- Keep the GitHub links functional.

## 16. Contact information

Replace the existing contact placeholders with:

**Email:**
[sooriyajaya39@gmail.com](mailto\:sooriyajaya39@gmail.com)

**GitHub:**
[https://github.com/Sooriya-cmd](https://github.com/Sooriya-cmd)

**LinkedIn:**
[https://www.linkedin.com/in/jayasooriya-a-a6b65938b](https://www.linkedin.com/in/jayasooriya-a-a6b65938b)

**LeetCode:**
[https://leetcode.com/u/sooriy_a/](https://leetcode.com/u/sooriy_a/)

Use the existing contact layout.

Do not invent a phone number or social media statistics.

### Resume

My updated resume PDF has not been supplied.

Do not add a fake resume download link or placeholder file.

Only display a resume download option when the actual PDF is available.

## 17. Existing footer

If the website already contains a footer or ending message, update its text to:

"Curiosity starts the journey. Consistency builds the future."

Display:

Jayasooriya — Aspiring Software Engineer.

Use the existing footer design. Do not create a new footer section if one already exists.

---

# PART 3 — IMPLEMENTATION RULES

## 18. Before modifying the project

Inspect the existing codebase.

Identify:

- Entrance screen component.
- Existing developer image assets.
- Bird models and animations.
- Guide component.
- Header component.
- Street lamp and signboard objects.
- Background scene positioning.
- Existing portfolio content and section structure.
- Existing project cards.
- Existing contact section.

Understand how the current implementation works before making changes.

## 19. Strict implementation restrictions

- Reuse the existing code and assets.
- Do not rewrite working components unnecessarily.
- Do not change the framework.
- Do not install unnecessary dependencies.
- Do not introduce new sections.
- Do not add new routes.
- Do not create a new navigation system.
- Do not introduce an AI chatbot.
- Do not add analytics.
- Do not add a terminal.
- Do not add a blog.
- Do not add testimonials.
- Do not add a gallery.
- Do not add achievement statistics or dashboards.
- Do not create new sound features.
- Do not add new decorative 3D objects.
- Do not redesign the website.
- Do not change existing functionality that is unrelated to the requested fixes.

Only implement the explicitly requested changes.

## 20. Testing

After implementation, verify:

- Entrance elements are removed.
- Developer illustration appears correctly.
- Circular opening animation works.
- Entrance bird follows the cursor.
- Main header elements are removed.
- Hamburger menu continues to work.
- JIU has no NEXT button.
- JIU's eyes follow the cursor.
- Birds have proper spacing.
- Individual bird flight and return work.
- Birds do not overlap.
- Street lamp is repositioned.
- Boxes and signboards have suitable dimensions.
- Background overlaps are corrected.
- Personal information is accurate.
- All three project descriptions are correct.
- GitHub, LinkedIn, email, and LeetCode links work.
- Existing sections still function.
- No unrelated functionality has broken.
- The application builds successfully.

Use the supplied screenshots as visual references.

Do not report a fix as complete unless it has been implemented and tested.

---

# FINAL INSTRUCTION

This task has only TWO objectives:

**OBJECTIVE 1:** Fix the existing Sky Street bugs and interactions listed in this prompt.

**OBJECTIVE 2:** Replace the existing placeholder portfolio information with my actual personal, educational, technical, leadership, achievement, project, and contact information.

Do not expand the scope.

Do not introduce features based on your own suggestions.

Do not redesign or rebuild the website.

Keep everything else as it currently is.

**Fix what is broken. Update what is placeholder. Preserve everything that already works.**
