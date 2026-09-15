# trez

A birthday website — built for October 8th.

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · GSAP 3 · liquid glass theme in blue.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production
npm run typecheck            # tsc --noEmit
```

---

## Change the words

**Everything the site says lives in one file: [`src/config/site.ts`](src/config/site.ts).**
You should never need to open a component to personalise this.

| Field | What it controls |
| --- | --- |
| `name` | The huge name on the hero, the preloader, and the closing line |
| `tagline` | The line under the name |
| `birthday` | Month + day. Drives the countdown and the "October 8" labels. Months are 1-indexed, so `10` is October |
| `heroWords` | The words that cycle under the hero. Add as many as you like |
| `countdown` | Copy for before the day and for the day itself |
| `reasons` | The card grid. Add or remove entries — the layout adapts |
| `timeline` | The four scenes in the horizontal story section |
| `photos` | Optional gallery (see below) |
| `letter` | The letter. Each string in `paragraphs` becomes its own paragraph |
| `closing` | The cake section's copy, before and after the wish |
| `meta` | Browser tab title and link-preview text |

### Adding photos

The gallery section is hidden until you give it something to show.

1. Drop images into `public/photos/`.
2. List them in `site.photos`:

```ts
photos: [
  { src: "/photos/us-01.jpg", caption: "That night in the rain" },
  { src: "/photos/us-02.jpg", caption: "Before the flight" },
],
```

The section appears on its own, between the story and the cake.

---

## What's on the page

| Section | Notes |
| --- | --- |
| **Preloader** | Counts up, then dissolves into the hero reveal |
| **Hero** | Name split to characters and flipped in with `SplitText`; rotating adjective; pointer-driven lean |
| **Countdown** | Live ticking to the next October 8th, and swaps to a "it's today" state on the day itself |
| **Reasons** | Glass cards revealed in clusters with `ScrollTrigger.batch` |
| **Story** | Pins to the viewport and scrolls sideways on desktop; falls back to a vertical stack under 1024px |
| **Gallery** | Only rendered when `site.photos` has entries |
| **Cake** | Tap each candle to blow it out. The last one fires confetti |
| **Letter** | Resolves word by word as you scroll, with a signature that draws itself |
| **Footer** | One more confetti button, because one is never enough |

---

## How the glass works

The `glass` utility in [`src/app/globals.css`](src/app/globals.css) stacks four things:

1. a blurred, saturated **backdrop** — the liquid underneath
2. a soft internal **tint gradient** — the body of the pane
3. a bright conic **rim**, masked to the 1px border box — the refracting edge
4. a diagonal **specular streak** that drifts across on hover

Where the browser supports filtering a backdrop, `.glass-refract` additionally warps
what's behind the pane using the `feTurbulence` + `feDisplacementMap` filter in
`GlassFilters.tsx`. Browsers that don't support it fall back to the blur and
nothing looks broken.

The background itself is a canvas of seven coloured blobs painted onto a
quarter-size buffer and stretched over the viewport under a CSS blur — the
upscaling is what gives the soft organic edges, and the small buffer is what
keeps it at 60fps on a phone. One blob follows the cursor.

### A note on gradient text

`background-clip: text` only paints against the element that owns the background.
The moment `SplitText` moves each glyph into its own span, a gradient set on the
parent heading stops rendering and the text vanishes. `src/lib/gradientText.ts`
solves it by giving every character the same gradient offset by its own position,
so the seams line up and the word still reads as one continuous sweep.

---

## Accessibility

- Respects `prefers-reduced-motion`: the custom cursor, confetti, background
  drift, cake sway, pointer parallax and every scroll-linked animation switch
  off, and all content renders in its final state.
- Without JavaScript nothing is hidden — the scroll-reveal guard is scoped to a
  `.js` class that only exists once React has mounted.
- Candles are real `<button>`s with per-candle labels. The hero's rotating word
  is a polite live region; the ticking countdown deliberately is not, so it
  never spams a screen reader once a second.

---

## Deploying

Any Next.js host works. The quickest is Vercel:

```bash
npx vercel
```

There are no environment variables and no backend — it's a fully static build.
