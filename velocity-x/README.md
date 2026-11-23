# VELOCITY X — Experience The Future of Driving

A premium, cinematic **3D animated car showroom** built as three hand-written files:
`index.html` · `style.css` · `script.js`.

Dark charcoal-and-navy palette, neon cyan / violet / orange accents, glassmorphism,
a real WebGL supercar in the hero, and a second interactive 3D studio further down
the page. **Every library, font and decoder is vendored locally — the site runs with
zero network access.**

---

## Run it

No build step, no bundler, no dependencies to install.

```bash
# from this directory
python3 -m http.server 8080
# → http://localhost:8080
```

Any static file server works (`npx serve`, `php -S`, nginx, GitHub Pages). Opening
`index.html` directly via `file://` will **not** work: ES modules and `fetch()` of the
`.glb` model are blocked by the browser's same-origin policy for local files.

---

## What's inside

| Path | Purpose |
| --- | --- |
| `index.html` | Semantic structure, SVG icon sprite, preloader, 12 sections, 2 dialogs |
| `style.css` | Design tokens, glass/neon system, 1280 / 1080 / 760 / 560 / 420 breakpoints |
| `script.js` | Car data, Two Three.js stages, grid + filters, modals, compare, booking, carousel |
| `assets/images/` | 11 cars, 6 categories, 4 backgrounds, 4 avatars — full + `-sm` variants |
| `assets/fonts/` | Orbitron, Inter, Barlow Condensed (woff2) + `fonts.css` |
| `assets/models/ferrari.glb` | Draco-compressed Ferrari 458 used in both 3D stages |
| `vendor/` | Three.js r160 core, OrbitControls, GLTFLoader, DRACOLoader, postprocessing, decoders |

### Sections

Preloader → sticky nav → **3D hero** → marquee → categories → collection (9 cars,
filterable) → **3D studio** → compare → offers → test-drive booking → why Velocity X →
about + counters → testimonials → newsletter → footer.

### Interactions

3D orbit / zoom / colour-swap, mouse parallax, 3D card tilt, scroll reveals, animated
counters, live search (`Ctrl`/`Cmd` + `K`), 2–3 car comparison with best-value
highlighting, validated booking form with demo confirmation, carousel, toast
notifications, back-to-top.

> The booking form and newsletter are **front-end demos** — nothing is sent anywhere.

### Accessibility & performance

Semantic landmarks, labelled controls, focus-visible rings, `prefers-reduced-motion`
respected, forced-colors fallback, DPR-capped renderers, lazy-built 3D stage,
`decoding="async"` + `loading="lazy"` on imagery.

---

## Using a different 3D model

Drop a `.glb` into `assets/models/` and update one constant in `script.js`:

```js
const MODEL_URL = 'assets/models/ferrari.glb';
```

Draco-compressed models work out of the box — the decoder path is already wired:

```js
dracoLoader.setDecoderPath('./vendor/draco/');
```

### What happens when 3D can't run

The 3D stage is a progressive enhancement. On boot the page checks for a usable WebGL
context; if there isn't one — blocked GPU, driver blocklist, remote desktop, disabled
hardware acceleration — it skips the model download entirely and swaps in transparent
photographic cutouts (`hero-car-cut.webp`, `stage-car-cut.webp`). The same fallback
fires if the `.glb` fails to download, if the renderer produces no pixels within
1.6 s, or if the GPU context is lost mid-session.

The fallback is never a blank canvas: the hero and studio still show a car, the
swatches still respray it (via CSS `hue-rotate`), and the page never waits on the
model — boot completes in about a second either way. You can tell which mode you are
in because the fallback has no "Drag to orbit" hint.

---

## Tech

HTML5 · CSS3 (Grid + Flexbox, custom properties, `clamp()`) · Vanilla ES modules ·
Three.js r160 · GLTFLoader + DRACOLoader · OrbitControls · RoomEnvironment PMREM.

No frameworks, no build tools, no runtime dependencies beyond the vendored Three.js.
