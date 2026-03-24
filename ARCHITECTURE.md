# Architecture — Birthday Card

## Stack decisions

| Concern | Choice | Rationale |
|---|---|---|
| Framework | React + Vite | Clean component isolation; animation hooks pattern works well with GSAP context |
| Scroll animation | GSAP + ScrollTrigger | Best-in-class for scrubbed, reversible timelines; widely documented |
| Smooth scroll | Lenis | Lightweight; integrates cleanly with GSAP ticker |
| Styling | Plain CSS + custom properties | No build overhead, no abstraction layer, Cursor produces faster/cleaner output |
| Deployment | Vercel (drag dist/) | Zero config, instant, free for single-use personal sites |

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "gsap": "^3.12",
    "@studio-freight/lenis": "^1.0"
  },
  "devDependencies": {
    "vite": "^5",
    "@vitejs/plugin-react": "^4"
  }
}
```

**Optional (add only if implementing nice-to-haves):**
- `canvas-confetti` — confetti burst on gift reveal completion

---

## File structure

```
birthday-card/
├── public/
│   └── assets/
│       ├── turntable-front.jpg     ← primary reveal image (front 3/4, cover closed)
│       ├── turntable-side.jpg      ← reference / secondary angle
│       └── turntable-open.jpg      ← dust cover open state (optional interaction)
├── src/
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── PersonalMessage.jsx
│   │   └── GiftReveal/
│   │       ├── GiftReveal.jsx      ← section wrapper, owns containerRef, calls useGiftAnimation
│   │       ├── GiftBox.jsx         ← HTML/div present box, exposes layer refs via forwardRef
│   │       └── RecordPlayer.jsx    ← image + post-reveal CSS micro-animations
│   ├── hooks/
│   │   ├── useLenis.js             ← Lenis init + GSAP ticker bridge
│   │   └── useGiftAnimation.js     ← GSAP timeline, accepts layer refs, attaches ScrollTrigger
│   ├── styles/
│   │   ├── tokens.css              ← CSS custom properties (all design tokens)
│   │   └── globals.css             ← reset, body, ambient float keyframes, utility classes
│   ├── App.jsx                     ← section assembly only, no logic
│   └── main.jsx                    ← GSAP plugin registration, app mount
├── index.html
├── vite.config.js
└── package.json
```

---

## Component responsibilities

### `main.jsx`
- Registers GSAP plugins: `gsap.registerPlugin(ScrollTrigger)`
- Mounts React app
- Imports `tokens.css` and `globals.css`

### `App.jsx`
Composes sections in order. No state, no props, no logic.
```jsx
export default function App() {
  return (
    <>
      <Hero />
      <PersonalMessage paragraphs={MESSAGE_PARAGRAPHS} />
      <GiftReveal />
    </>
  )
}
```

### `Hero.jsx`
- Static section, `min-height: 100vh`
- CSS-animated heading and subheading (fade + slide up on mount)
- Renders ambient orb elements as `<span>` tags with randomised inline style durations/delays
- No props, no state

### `PersonalMessage.jsx`
- Accepts `paragraphs: string[]` prop
- Renders each paragraph as `<p>` inside the frosted-glass card container
- Static — no animation, no state

### `GiftReveal.jsx`
- Creates `containerRef` for ScrollTrigger trigger + pin target
- Creates individual `refs` for each animatable layer: `bowRef`, `ribbonHRef`, `ribbonVRef`,
  `flapLeftRef`, `flapRightRef`, `flapFrontRef`, `lidRef`, `playerRef`
- Passes layer refs to `useGiftAnimation()`
- Renders `<GiftBox>` and `<RecordPlayer>` as children, passing refs down

### `GiftBox.jsx`
- Renders the present box as layered `<div>` elements
- Each animatable layer exposes its DOM node via a ref callback or `forwardRef`
- Layer order (DOM, bottom to top): box-body → flap-left → flap-right → flap-front → lid → ribbon-h → ribbon-v → bow
- Applies `perspective: 900px` to wrapper; `transform-style: preserve-3d` to flap layers
- No animation logic in this component

### `RecordPlayer.jsx`
- Renders `<img src="/assets/turntable-front.jpg" loading="lazy" />`
- Accepts `isRevealed: boolean` prop — applies `.revealed` CSS class when true
- `.revealed` class triggers: glow-pulse keyframe animation, optional platter spin overlay
- Exposes ref for GSAP control (opacity, translateY, scale during reveal phase)

### `useGiftAnimation.js`
```js
export function useGiftAnimation({
  containerRef,
  bowRef, ribbonHRef, ribbonVRef,
  flapLeftRef, flapRightRef, flapFrontRef,
  lidRef, playerRef,
  onRevealComplete,  // callback → sets isRevealed: true in parent
  onRevealReverse,   // callback → sets isRevealed: false
}) { ... }
```
- Creates single GSAP timeline with `{ defaults: { ease: "power2.inOut" } }`
- Attaches `ScrollTrigger` with `pin: true`, `scrub: 1`, `end: "+=2000"`
- Calls `onRevealComplete` / `onRevealReverse` via `onComplete` / `onReverseComplete`
- Runs inside `useLayoutEffect` + `gsap.context()`, returns cleanup on unmount

### `useLenis.js`
```js
export function useLenis() {
  // init Lenis
  // gsap.ticker.add((time) => lenis.raf(time * 1000))
  // gsap.ticker.lagSmoothing(0)
  return lenis
}
```
Call once in `App.jsx` or `main.jsx`. Returns the lenis instance for optional programmatic use.

---

## Animation phases — quick reference

| Phase | Timeline position | What happens |
|---|---|---|
| 1 | 0 → 0.25 | Bow fades + shrinks; ribbon strips collapse |
| 2 | 0.25 → 0.55 | Left/right flaps rotate open on Y; front flap rotates on X |
| 3 | 0.55 → 0.72 | Lid translates up and fades out |
| 4 | 0.72 → 1.0 | Record player rises from box, fades in, scales to full size |

All phases are driven by a single scrubbed timeline — reverse is automatic.

---

## Critical implementation notes

### 3D perspective for flap animation
```css
.gift-box-wrapper {
  perspective: 900px;
}
.flap-left, .flap-right, .flap-front {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
```
Without this, `rotateY` / `rotateX` will look flat and broken.

### GSAP context cleanup pattern (use in every component with GSAP)
```js
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // all timeline + ScrollTrigger setup here
  }, containerRef)
  return () => ctx.revert()
}, [])
```

### ScrollTrigger refresh after fonts load
GSAP ScrollTrigger calculates positions at init time. If fonts haven't loaded, measurements
will be wrong. After mounting App:
```js
document.fonts.ready.then(() => ScrollTrigger.refresh())
```

### Mobile scroll distance
On screens narrower than 768px, reduce pinned scroll distance:
```js
const scrollDistance = window.innerWidth < 768 ? 1400 : 2000
// use in end: `+=${scrollDistance}`
```

### Image assets — filename mapping
Save the provided product images with these exact names in `public/assets/`:
| File | Image description |
|---|---|
| `turntable-front.jpg` | Front 3/4 view, dust cover closed, walnut finish |
| `turntable-side.jpg` | Rear/side view showing connections |
| `turntable-open.jpg` | Front view with dust cover open, platter visible |

The primary reveal uses `turntable-front.jpg`. The other two are available for optional states.

---

## Build + deploy

```bash
npm create vite@latest birthday-card -- --template react
cd birthday-card
npm install gsap @studio-freight/lenis
npm run dev       # local development
npm run build     # outputs to dist/
```

Deploy: drag the `dist/` folder to [vercel.com](https://vercel.com) — no config needed.
