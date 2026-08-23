# DESIGN SYSTEM & AESTHETICS

## 1. Aesthetic Direction
**Core Style**: Premium Editorial Intelligence, Functional Minimalism, Typography-Driven.

The interface balances the tactile elegance of classic editorial print with the precision of contemporary digital software. It deliberately avoids generic dashboard patterns, cliché purple neon glows, heavy glassmorphism, or gratuitous 3D fluff.

---

## 2. Color Palette & Token System

All color tokens are declared via CSS Custom Properties in `src/styles/theme.css` and bound directly into Tailwind CSS v4 `@theme inline`.

### Theme Tokens Matrix

| Token Name | Dark Mode (Default) | Light Mode | Visual Purpose |
| :--- | :--- | :--- | :--- |
| `--background` | `#101010` | `#f8f6f0` | Deep matte carbon / Warm editorial paper |
| `--foreground` | `#f4f0ea` | `#121212` | High-contrast warm off-white / Crisp charcoal |
| `--card` / `--surface` | `#1b1b1b` / `#141414` | `#ffffff` / `#f0ece1` | Elevated container surface with subtle contrast |
| `--primary` | `#61c5ad` (Mint Emerald) | `#38a38a` (Deep Mint) | Primary interactive actions, highlights, links |
| `--secondary` | `#426fba` (Cobalt Blue) | `#30579e` (Sapphire) | Secondary actions, badges, tags |
| `--accent` | `#984f9f` (Editorial Plum) | `#7b3882` (Deep Plum) | Special editorial callouts, highlights |
| `--paper` | `#efede7` | `#e5e2d8` | High-contrast contrast cards & inverted blocks |
| `--muted` | `#242424` | `#e7e3d8` | Subtle borders, inactive tabs, dividers |
| `--muted-foreground` | `#8a8070` | `#605a4e` | Secondary descriptions, timestamps, subtitles |
| `--destructive` | `#ff5c35` | `#e53935` | Error alerts, delete actions, warnings |
| `--border` | `rgba(255, 255, 255, 0.15)` | `rgba(0, 0, 0, 0.12)` | Clean, understated structural outlines |

---

## 3. Typography Architecture

### Font Stack
1. **Primary Interface Font**: `'Geist'`, system-ui, -apple-system, sans-serif.
   - Clean, geometric grotesk designed for interface legibility, micro-copy, and technical clarity.
2. **Monospace Font**: `'Geist Mono'`, 'JetBrains Mono', monospace.
   - Used for code snippets, metadata tags, metric counters, and keyboard shortcuts.
3. **Editorial Headline Accent**: `'Newsreader'`, Georgia, serif.
   - Used selectively in publication quotes, essay intros, and author notes to impart literary authority.

### Typographic Scale
* `Hero Headline`: `clamp(2.5rem, 6vw, 6.2rem)` with `-0.04em` tracking and `1.05` line height.
* `H1 (Page Title)`: `clamp(2rem, 4vw, 3.5rem)` with `-0.03em` tracking.
* `H2 (Section Heading)`: `clamp(1.5rem, 3vw, 2.25rem)` with `-0.02em` tracking.
* `H3 (Card Title)`: `1.25rem` to `1.5rem` (`leading-snug`).
* `Body Copy`: `1rem` to `1.125rem` with `1.75` line height for sustained reading comfort.
* `Caption / Micro-copy`: `0.75rem` to `0.875rem` (`tracking-wider uppercase` for badges).

---

## 4. Surfaces, Depth & Texture

* **Noise Backdrop**: A lightweight, GPU-accelerated SVG noise backdrop (`GlobalNoiseBackdrop`) prevents flat color banding and imparts tactile depth.
* **Atmospheric Gradients**: Subtle background mesh gradients (`HeroAtmosphere`) provide subtle ambient light without jarring neon colors.
* **Borders & Dividers**: Sub-pixel thin borders (`1px solid var(--border)`) clearly delineate content without heavy drop shadows.
* **Elevation**: Cards use minimal shadow (`shadow-sm` or `shadow-md`), preferring tonal surface elevation (`bg-card`).

---

## 5. Micro-Interactions & Animation Guidelines

* **Principle**: Animation must communicate state or spatial hierarchy, never serve as visual decoration.
* **Button Hovers**: Smooth translation `translate-y-[-1px]` or background lighten over `150ms-200ms` cubic-bezier.
* **Card Hovers**: Subtle border contrast increase and subtle image scale (`scale-[1.02]`), avoiding chaotic bouncy transforms.
* **Page Transitions**: Non-blocking `fadeUp` entrance with staggered children delays (`0.05s - 0.1s`).
* **Interactive Canvas**: Three.js particle canvas responds gently to cursor trajectory with damped physics and automatically pauses when out of viewport.

---

## 6. Forbidden Cliché Tropes
Per project rules, the following design tropes are strictly prohibited:
* No generic dashboard cards when standard editorial layout is appropriate.
* No harsh purple neon text on dark backgrounds.
* No pulsating badge pills above every heading.
* No rainbow CSS text gradient fills on generic paragraphs.
* No icon-stuffed bento boxes with disconnected widgets.
* No nested cards 3 levels deep.
