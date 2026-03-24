# Birthday Card — Implementation Brief

## What this is
A single-page interactive website built as a personal birthday gift. One audience member.
The goal is warm, handcrafted, and memorable — not a template, not a product page.
Prioritise emotional feel and animation smoothness over feature completeness.

---

## Tech stack
- React + Vite
- GSAP + ScrollTrigger (scroll-linked animation)
- Lenis (smooth scroll)
- Plain CSS with custom properties (see tokens below)

---

## Design tokens

Define these in `src/styles/tokens.css` and use them everywhere:

```css
:root {
  /* Colours */
  --colour-lavender:      #E6D6FF;
  --colour-purple-deep:   #4B2E83;
  --colour-purple-mid:    #7B5EA7;
  --colour-purple-light:  #F3ECFF;
  --colour-white:         #FFFFFF;
  --colour-text-dark:     #2A1A4A;
  --colour-text-light:    #F3ECFF;
  --colour-gold-accent:   #D4AF70;

  /* Typography */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body:    'Inter', system-ui, sans-serif;

  /* Spacing */
  --section-padding: clamp(4rem, 10vh, 8rem);
  --max-content-width: 680px;
}
```

Load from Google Fonts: `Playfair Display` (weights 400, 700, 700 italic) and `Inter` (400, 400 italic).

---

## Global styles (globals.css)

- `box-sizing: border-box` reset
- `body`: background `var(--colour-purple-deep)`, colour `var(--colour-text-light)`, font `var(--font-body)`
- `html`: smooth scroll behaviour (Lenis handles this — set `scroll-behavior: auto` to avoid conflict)
- `*`: `margin: 0`, `padding: 0`
- Define `@keyframes float` for ambient orb elements (see Section 1)

---

## Section 1 — Hero

Full viewport height (`min-height: 100vh`). Content centred vertically and horizontally.

### Background
Radial gradient: soft lavender at centre fading to deep purple at edges.
```css
background: radial-gradient(ellipse at 50% 40%, #E6D6FF 0%, #7B5EA7 45%, #4B2E83 100%);
```

### Content
```html
<h1>Happy 38th Birthday ❤️</h1>
<p>For the woman who makes everything better.</p>
```
- `h1`: `var(--font-heading)`, `font-size: clamp(2.8rem, 6vw, 5rem)`, colour `var(--colour-purple-deep)`
- `p`: `var(--font-body)`, italic, `font-size: clamp(1rem, 2.5vw, 1.4rem)`, colour `var(--colour-purple-deep)`, opacity 0.75

### Entry animation (CSS, not GSAP)
Both elements fade in + slide up on page load:
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
h1 { animation: fadeUp 0.9s ease forwards; }
p  { animation: fadeUp 0.9s ease 0.3s forwards; animation-fill-mode: both; }
```

### Ambient orbs
8–10 absolutely positioned `<span>` elements inside the hero. Each is a small blurred circle.
```css
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(18px);
  opacity: 0.35;
  pointer-events: none;
  animation: float var(--duration) ease-in-out infinite alternate;
}
```
`@keyframes float`: gentle translateX + translateY movement (±20–40px range). Randomise
`--duration` (20s–40s) and `animation-delay` (0s–15s) via inline styles.
Colours: mix of `var(--colour-lavender)`, `var(--colour-purple-mid)`, white.
Sizes: 8px–20px diameter.

---

## Section 2 — Personal Message

Background: `var(--colour-purple-deep)` with a subtle `radial-gradient` overlay for depth.

### Card container
```css
.message-card {
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 1.5rem;
  box-shadow: 0 8px 48px rgba(75, 46, 131, 0.4);
  backdrop-filter: blur(8px);
}
```

### Content
- Small decorative element above text: a heart SVG icon (inline, `var(--colour-lavender)`, ~28px)
- `<p>` tags with placeholder text — **content will be replaced manually before launch**
- Placeholder: 3–4 paragraphs of lorem ipsum, ~3 sentences each
- Line-height: 1.85, font-size: 1.05rem, colour: `var(--colour-text-light)`

This section is fully static — no interaction or animation required.

---

## Section 3 — Gift Reveal (core interaction)

This is the centrepiece. A wrapped present sits centred on screen. Scrolling unwraps it to
reveal the Audio-Technica LPW40WN record player. The animation is scroll-scrubbed and fully
reversible — scrolling back up re-wraps the present.

### Section layout
- `min-height: 100vh`, display flex, centred
- The GiftReveal component pins itself via ScrollTrigger `pin: true`
- Scroll distance for the animation: `end: "+=2000"` (2000px of scroll progress drives the timeline)

### Gift box structure

Build the box as HTML `<div>` layers (not a single SVG) for easier GSAP targeting.
Apply `perspective: 900px` to the container and `transform-style: preserve-3d` to flap elements.

**Layer stack (bottom to top in DOM):**

1. `.box-body` — the main box. Rectangle, ~260px × 200px, background: a CSS pattern of
   soft cream/gold diagonal stripes on `var(--colour-purple-mid)`.
   ```css
   background: repeating-linear-gradient(
     45deg,
     var(--colour-purple-mid),
     var(--colour-purple-mid) 12px,
     var(--colour-gold-accent) 12px,
     var(--colour-gold-accent) 14px
   );
   ```

2. `.flap-left`, `.flap-right` — side panels. Same wrapping paper pattern.
   Transform origin: left/right edge respectively. Will rotate open on Y axis.

3. `.flap-front` — front panel. Transform origin: top edge. Will rotate open on X axis.

4. `.box-lid` — slightly wider/taller than the box body. Same wrapping paper pattern.
   Sits exactly on top of the box body.

5. `.ribbon-h`, `.ribbon-v` — two thin `<div>` strips (14px wide), centred on the lid,
   colour: `var(--colour-gold-accent)`, crossing at 90°.

6. `.bow` — SVG bow shape, absolutely centred at the ribbon intersection.
   Two mirrored loop shapes in gold. Approximate with two `<div>` elements rotated ±40deg,
   or inline SVG. ~50px diameter.

### GSAP animation timeline

In `useGiftAnimation.js`, create a single GSAP timeline and attach it to ScrollTrigger:
```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    start: "top top",
    end: "+=2000",
    scrub: 1,
    pin: true,
    anticipatePin: 1,
  }
})
```

Then build the timeline in 4 phases. All values are suggestions — adjust for feel:

**Phase 1 — Bow + ribbon dissolve (timeline 0 → 0.25)**
```js
tl.to(bowRef.current,      { opacity: 0, scale: 0.7, duration: 1 }, 0)
  .to(ribbonHRef.current,  { scaleX: 0, duration: 0.8 }, 0)
  .to(ribbonVRef.current,  { scaleY: 0, duration: 0.8 }, 0.1)
```

**Phase 2 — Wrapping paper opens (timeline 0.25 → 0.55)**
```js
tl.to(flapLeftRef.current,  { rotateY: -115, opacity: 0, duration: 1.2 }, 1)
  .to(flapRightRef.current, { rotateY:  115, opacity: 0, duration: 1.2 }, 1.1)
  .to(flapFrontRef.current, { rotateX:  -95, opacity: 0, duration: 1.2 }, 1.2)
```

**Phase 3 — Lid lifts (timeline 0.55 → 0.72)**
```js
tl.to(lidRef.current, { y: -140, opacity: 0, duration: 1 }, 2.2)
```

**Phase 4 — Record player rises (timeline 0.72 → 1.0)**
```js
tl.fromTo(playerRef.current,
  { y: 80, opacity: 0, scale: 0.88 },
  { y: 0,  opacity: 1, scale: 1, duration: 1.5 },
  3.2
)
```

At `onComplete` (progress = 1.0), add class `revealed` to the player wrapper to trigger
CSS glow animation. Use `onReverseComplete` to remove it.

### Record player component

**Primary image:** `public/assets/turntable-front.jpg` (front 3/4 view, dust cover closed)
Render at `max-width: 420px`, `width: 100%`, `border-radius: 8px`.

**Post-reveal styles (applied via `.revealed` class):**
```css
.record-player-wrapper.revealed img {
  animation: glow-pulse 3s ease-in-out infinite;
  box-shadow: 0 20px 60px rgba(75, 46, 131, 0.6);
}
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 20px 60px rgba(75, 46, 131, 0.6); }
  50%       { box-shadow: 0 20px 80px rgba(180, 140, 255, 0.8); }
}
```

**Optional platter spin:** Position a circular `<div>` overlay on the platter area.
Apply `animation: spin 3s linear infinite` when `.revealed` is active.
This is visual flair — skip if it looks forced.

---

## Responsiveness

Mobile-first. Key adjustments:
- Gift box scales to `min(85vw, 320px)` on mobile
- Hero `h1` uses `clamp()` — no fixed sizes
- Pinned scroll distance on mobile: reduce `end` to `+=1400`
- Message card padding reduces to `1.75rem` on mobile
- Check that 3D flap transforms don't clip on small screens (may need to reduce rotation angle)

---

## Optional enhancements (implement only after core is working)

1. **Confetti burst** — on `onComplete` of the ScrollTrigger, fire `canvas-confetti` with
   purple and gold colours. One-time burst, not looping.

2. **Music toggle** — fixed button bottom-right. `<audio>` element, `autoplay: false`.
   SVG music note icon. Toggles play/pause. Off by default, no autoplay.

3. **Dust cover open state** — at full reveal, offer a subtle "lift cover" micro-interaction
   that swaps `turntable-front.jpg` for `turntable-open.jpg`.

---

## Personal message placeholder (replace before launch)

```jsx
const MESSAGE_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
  "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis.",
]
```

Pass this array as `paragraphs` prop to `PersonalMessage`.

---

## Launch checklist

- [ ] Replace placeholder message paragraphs with real content
- [ ] Confirm turntable images are in `public/assets/` with correct filenames
- [ ] Test scroll animation on mobile (iPhone Safari specifically)
- [ ] Verify animation reverses correctly on scroll-up
- [ ] Check font loading doesn't cause layout shift (add `font-display: swap`)
- [ ] Deploy to Vercel: `npm run build` → drag `dist/` folder to vercel.com
