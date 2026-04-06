@AGENTS.md

# Portfolio Website — Ashish Maharjan

## Overview

Personal portfolio and resume website for Ashish Maharjan (DevOps Engineer). Converted from a static HTML/CSS site (Aerial by HTML5 UP template) into a dynamic Next.js application with modern UI components, WebGL animations, and interactive effects.

**Domain:** ashishmaharjan.com
**Deployment Target:** Vercel or GitHub Pages (static export to `out/`)

## Tech Stack

- **Framework:** Next.js 16.2.2 (App Router, TypeScript)
- **Styling:** Tailwind CSS 4 + shadcn/ui (base-ui primitives, NOT Radix)
- **Animations:** Framer Motion, motion (from `motion/react`), Three.js (WebGL shaders), Canvas 2D
- **Icons:** Font Awesome 7 (`@fortawesome/react-fontawesome`), react-icons (`react-icons/si`, `react-icons/fa`), lucide-react
- **Fonts:** Source Sans 3 via `next/font/google`
- **Toasts:** Sonner
- **Theming:** next-themes (dark mode default)
- **Build:** Turbopack (dev), static export configured (`output: "export"` in next.config.ts)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: font, ThemeProvider, TooltipProvider, SmoothCursor
│   ├── globals.css             # Tailwind, shadcn theme vars, keyframes (incl. diamond-rotate), custom CSS
│   ├── page.tsx                # Entry/splash: welcome screen → spiral → "Enter"
│   ├── home/page.tsx           # Main portfolio page (tunnel bg, animated name, icon cloud)
│   └── resume/page.tsx         # Resume page (dotted surface background)
├── components/
│   ├── ui/                     # shadcn + custom UI components
│   │   ├── accordion.tsx       # shadcn (base-ui)
│   │   ├── animated-shiny-text.tsx # Gradient shimmer text with hover glow (available, not active on home)
│   │   ├── animated-text.tsx   # Letter-by-letter spring pop with gradient underline (home page name)
│   │   ├── badge.tsx           # shadcn (base-ui)
│   │   ├── button.tsx          # shadcn (base-ui) — uses `render` prop, NOT `asChild`
│   │   ├── card.tsx            # shadcn (base-ui)
│   │   ├── dotted-surface.tsx  # Three.js animated particle wave (resume bg)
│   │   ├── etheral-shadow.tsx  # SVG filter animated shadow (unused, available)
│   │   ├── gradient-text.tsx   # Animated gradient text (unused, available)
│   │   ├── icon-cloud.tsx      # Canvas 3D sphere of rotating tech icons (home page)
│   │   ├── liquid-text.tsx     # Morphing/liquid text with SVG threshold filter (home page roles)
│   │   ├── magic-text-reveal.tsx # Particle-based text reveal (available, not active on home)
│   │   ├── matrix-text.tsx     # Matrix rain text effect (available)
│   │   ├── minimalist-hero.tsx # Hero section with photo and overlay text (home page)
│   │   ├── morphing-text.tsx   # Older morphing text component (available)
│   │   ├── neon-rgbtext-effect.tsx # WebGL RGB chromatic aberration text (available, not active on home)
│   │   ├── orbiting-skills.tsx # 3-ring orbiting DevOps skill icons (available, replaced by icon-cloud)
│   │   ├── portfolio-text.tsx  # Animated letter replacement with spinning diamond (available)
│   │   ├── progress.tsx        # shadcn (base-ui)
│   │   ├── radar-effect.tsx    # Radar sweep animation (available)
│   │   ├── reveal-text.tsx     # Spring-animated letter reveal with hover images (available)
│   │   ├── separator.tsx       # shadcn (base-ui)
│   │   ├── shader-animation.tsx # Generic shader animation wrapper (available)
│   │   ├── shader-lines.tsx    # Shader-based line effect (available)
│   │   ├── sheet.tsx           # shadcn (base-ui)
│   │   ├── smooth-cursor.tsx   # Spring-physics custom cursor, replaces native cursor site-wide
│   │   ├── social-icons.tsx    # Social media icon links (home page)
│   │   ├── spiral-animation.tsx # Canvas spiral: plays once → freeze → drift (entry page)
│   │   ├── tabs.tsx            # shadcn (base-ui)
│   │   ├── tooltip.tsx         # shadcn (base-ui) — uses `render` prop, NOT `asChild`
│   │   └── tunnel-hero.tsx     # WebGL shader tunnel (home page bg, speed: delta * 0.333)
│   ├── AnimatedBackground.tsx  # Legacy — no longer used
│   ├── Sidebar.tsx             # Legacy — removed from home, still importable
│   ├── SpotlightCard.tsx       # Mouse-tracking spotlight effect wrapper
│   ├── ThemeProvider.tsx       # next-themes client wrapper
│   └── TypingText.tsx          # Typing/deleting text animation (available, replaced by liquid-text on home)
├── data/
│   └── resume.ts               # All resume content (contact, jobs, skills, education)
└── lib/
    └── utils.ts                # cn() utility (clsx + tailwind-merge)

public/
├── images/bg.jpg               # Legacy background image
├── ace.png                     # Profile photo (minimalist hero)
├── Ashish_Resume.pdf           # Downloadable resume PDF
```

## Routes & User Flow

### Entry Page (`/`)
Three-phase splash screen:
1. **Welcome (0–2.5s):** Black screen, "Welcome to / ASHISH MAHARJAN / Portfolio" fades in centered
2. **Move (2.5s):** Text glides up to the top of the screen (1.5s ease), then fades out
3. **Spiral (4s+):** Canvas spiral animation plays once — stars form spiral, disperse outward, camera flies through. At 72% of the timeline, animation freezes and stars drift gently. "Enter" button fades in.
4. **Enter:** Click triggers 1.5s fade-to-black, full page navigation to `/home`

### Home Page (`/home`)
- **Background:** WebGL tunnel shader (dynamically scales to any screen size/orientation, speed: `delta * 0.333`)
- **Name:** AnimatedText component — letter-by-letter spring pop animation, gradient underline (indigo → purple → pink)
- **Role titles:** MorphingText (liquid-text) — liquid/gooey morph between "AI-Native DevOps Engineer", "DevSecOps Platform Architect", "Cloud Migration & Reliability Lead", "CI/CD Specialist & Pipeline Architect", "Infrastructure Automation Engineer". Font size: 25px, centered via viewport-width breakout
- **Description:** Tagline paragraph below morphing text
- **Stats cards:** 5 spotlight cards with hover tracking (Years Experience, Cloud Platforms, Apps Migrated, Platform Engineering, CI/CD Pipelines)
- **Nav icons:** Social icons (LinkedIn, Dice, GitHub, Resume) with tooltips
- **Minimalist Hero:** Photo section with overlay text ("build.", "ship.")
- **CTA:** "View Full Resume" button
- **Icon Cloud:** 23 tech icons in a 3D rotating sphere (Docker, K8s, AWS, Terraform, Jenkins, Ansible, GitHub Actions, GitHub, Python, Linux, Git, Bash, Anthropic, OpenAI, Gemini, n8n, Zapier, Vercel, Claude Code, Windsurf, Codex, Cursor IDE, Lovable). Sphere radii: 450 vertical, 550 horizontal. Icon size: 50px on 1200px canvas. Hover scale: 3.5x with 28px tooltip labels
- **Projects:** 4 placeholder project cards (coming soon)
- **Footer:** Copyright at bottom
- **Scale:** All content sections scaled to 0.995 (0.5% smaller) via `scale-[0.995]` on individual sections (not the outer wrapper, to avoid breaking fixed-position tunnel)
- Fades in with Framer Motion on load (1.2s)

### Resume Page (`/resume`)
- **Background:** Three.js dotted surface (animated particle wave)
- **Name:** RevealText component
- **Skills:** Tabbed view — "Overview" (spotlight cards) and "Proficiency" (progress bars)
- **Experience:** Accordion — click to expand/collapse each job
- **Education:** Card with badge
- **Actions:** Print/Save as PDF, Download PDF buttons

## Global Features

### Smooth Cursor
- Component: `smooth-cursor.tsx`, mounted in root `layout.tsx`
- Replaces native cursor with spring-physics animated arrow SVG on all pages
- Hides native cursor via injected global CSS rule (`* { cursor: none !important }`) to prevent double cursors on interactive elements
- Desktop only — disabled on touch devices via `(any-hover: hover) and (any-pointer: fine)` media query
- Rotates in direction of movement, scales down slightly during fast motion

## Key Architecture Decisions

### shadcn/ui uses base-ui (NOT Radix)
Components do NOT support `asChild` prop. Use `render` prop instead:
```tsx
// WRONG:
<Button asChild><a href="...">Link</a></Button>

// CORRECT:
<Button render={(props) => <a {...props} href="...">Link</a>} />
```
When rendering a non-`<button>` element via `render`, add `nativeButton={false}` to suppress the base-ui warning.

### Spiral animation lifecycle
- Plays once (not looping) — uses `requestAnimationFrame` with delta time, no GSAP
- Freezes at `driftSwitchTime` (72%) — stars hold position and drift slowly outward
- 2-second smoothstep crossfade from spiral frame to drift frame
- `onComplete` callback fires at freeze point to trigger Enter button
- Entry page controls: welcome → move → spiral phases via React state

### Navigation between pages
- **Entry → Home:** `window.location.href` (full page navigation) — ensures spiral canvas and all WebGL resources are fully destroyed
- **Home → Resume:** Next.js `<Link>` (client-side navigation)
- **Resume → Home:** Next.js `<Link>` (client-side navigation)

### Page transitions
- Entry page: 1.5s `ease-in-out` fade-to-black on exit, spiral stays alive during fade
- Home page: Framer Motion `opacity: 0 → 1` over 1.2s on mount

### Tunnel shader — dynamic screen filling
- UV coordinates normalized by `min(width, height)` so tunnel extends past all edges
- Ring radius computed from screen diagonal: `baseRadius = halfDiag / 6.25 * 1.3`
- 128 tunnel layers for dense coverage on large screens
- Listens for both `resize` and `orientationchange` events
- Speed controlled by `delta * 0.333` (1.5x slower than original)

### Scale applied per-section, not on outer wrapper
- `scale-[0.995]` is applied to `<main>`, `<section>`, and `<footer>` elements individually
- NOT on the outer `<motion.div>` — applying `transform` to the outer wrapper creates a new stacking context that breaks `position: fixed` on the tunnel canvas

### Icon Cloud rendering
- Icons rendered onto offscreen canvases at 50px, displayed on a 1200px canvas (high-DPI sharp rendering)
- Sphere uses Fibonacci distribution for even spacing
- Hit-testing uses inverse projection for hover detection
- Tooltip labels rendered directly on canvas (28px bold font, dark pill background)

### Hydration safety
- OrbitingSkills: icons only render after `mounted` state (avoids SSR `Math.cos`/`Math.sin` mismatch)
- DottedSurface: waits for `mounted` + `resolvedTheme` before Three.js init
- `<html>` and `<body>` have `suppressHydrationWarning` for browser extension attributes

### Framer Motion typing
Ease values require `as const` assertion to satisfy strict types:
```tsx
transition: { duration: 0.6, ease: "easeOut" as const }
transition: { type: "spring" as const, stiffness: 200, damping: 15 }
```

### MorphingText (liquid-text) configuration
- Base component had `text-[40pt]` and `lg:text-[6rem]` and `max-w-screen-md` removed to allow className overrides
- Inner spans use `text-center` for alignment
- SVG threshold filter (`feColorMatrix` with `255 -140` alpha values) creates the liquid/gooey morph effect
- Wrapper uses `w-screen relative left-1/2 -ml-[50vw]` to break out of narrow `inline-flex` parent and center on viewport

## Resume Data

All resume content lives in `src/data/resume.ts`. To update job history, skills, contact info, or education, edit this single file.

## Commands

```bash
npm run dev      # Start dev server (Turbopack) on localhost:3000
npm run build    # Production build (static export to /out)
npm run start    # Serve production build
npm run lint     # Run ESLint
```

## Deployment

### GitHub Pages
Build produces static HTML in `out/`. Deploy via GitHub Actions workflow that runs `npm run build` and publishes the `out/` directory. No `basePath` needed if using root domain (ashishmaharjan.com via CNAME).

### Vercel
Zero config — connect repo, Vercel auto-detects Next.js. Can optionally remove `output: "export"` to enable SSR/edge features.

## Performance Notes

- Spiral animation: 2000 stars, 50 trail length, freezes at 72% (no infinite loop)
- Dotted surface: 1200 particles (30x40), no antialias, DPR capped at 2
- Tunnel: GPU fragment shader (128 layers), speed `delta * 0.333`
- Icon cloud: 23 icons on 1200px canvas, 50px icon size, sphere radii 450/550
- Spotlight cards: `contain: layout style` and `will-change` for GPU compositing
- Visibility API pauses Three.js and tunnel animations when tab is hidden
- Smooth cursor: `requestAnimationFrame`-throttled pointer tracking, spring physics via `motion/react`
- Custom thin scrollbar styling
- Content sections scaled 0.995 individually (avoids breaking fixed-position tunnel)
