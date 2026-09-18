# Power Design — Master Execution Guide & Codified Principles

> **Repository:** `https://github.com/ItsssssJack/power-design.git`  
> **Location in project:** `./essential/power-design/`  
> **Author:** Jack Roberts  
> **License:** MIT  

---

## 1. What is Power Design?

Power Design is an elite design system and generative skill combining two foundational pillars:
1. **Brand DNA** — Visual tokens (background, foreground, primary accent, display font, corner radius, voice/personality) extracted from live URLs or chosen from 72+ pre-built brand systems (Linear, Stripe, Apple, Vercel, Supabase, Tesla, Airbnb, etc.).
2. **Codified Design Principles** — Research-backed numerical rules with strict thresholds:
   - **20 Rules for Web** (fluid, interactive, indexable responsive applications).
   - **20 Rules for Presentation Decks** (fixed 16:9 frames).

---

## 2. The 20 Codified Web Principles (Numeric Thresholds)

| # | Rule | Core Standard & Numeric Threshold | Research Citation |
|---|---|---|---|
| 1 | **Mobile-first, Capped Measure** | Shell `max-width: 1200–1440px`. Prose `max-width: ≤75ch`. No uncontained edge-to-edge text. Zero horizontal scroll at 320/390/768/1024/1440px. | Ethan Marcotte; Brad Frost |
| 2 | **Content-Driven Breakpoints** | Breakpoints follow content stress (640, 768, 1024, 1280px), never device dimensions. | Brad Frost; Tailwind CSS |
| 3 | **Fluid Type & Space via `clamp()`** | Use CSS `clamp(min, preferred, max)`. Keep `rem` base so browser zoom is preserved. No sudden text jumps across breakpoints. | Utopia (Mudford & Gilyead) |
| 4 | **Body Size & Touch Targets** | Body text ≥16px. Interactive touch targets ≥44×44px with ≥8px physical separation. | Apple HIG; WCAG 2.5.8 |
| 5 | **One Primary CTA per View** | Exactly one visually dominant primary action per viewport. Repeated throughout the page, never reinvented with rival styles. | Steve Krug; Hick's Law |
| 6 | **5-Second Fold Test** | The fold answers *What is this? Who is it for? What do I do next?* within 5 seconds on both phone and laptop. | Nielsen Norman Group; Krug |
| 7 | **Scanning Patterns & Left-Alignment** | F-pattern for text content, Z-pattern for hero sections. Body text left-aligned, never justified or centered in paragraphs. | NN/g eye-tracking; Butterick |
| 8 | **Optimal Reading Measure** | 45–75 characters per line (`max-width: 65ch`) for effortless visual tracking and scanning. | Robert Bringhurst; Butterick |
| 9 | **Vertical Line-Height Rhythm** | Body line-height ≥1.5; Display/headings 1.05–1.2. Rhythm snapped to 8pt base. | WCAG 1.4.12; Bringhurst |
| 10 | **8pt Spacing & Modular Scale** | Spacing ∈ {4, 8, 16, 24, 32, 48, 64, 96, 128}px. One modular typographic ratio (1.25–1.333). | Material Design; Bryn Jackson |
| 11 | **WCAG 2.2 AA Floor** | Contrast ratio ≥4.5:1 on text (aim 7:1 AAA for body). UI components & focus indicators ≥3:1. Never communicate meaning with color alone. | WCAG 2.2 AA / AAA |
| 12 | **Semantic Color Tokens (60-30-10 Split)** | 60% dominant base surface, 30% structural neutral, 10% high-energy accent. Declared via semantic CSS custom properties (`--color-bg`, `--color-fg`, `--color-primary`, `--color-accent`). | Johannes Itten; Refactoring UI |
| 13 | **Five States per Interactive Element** | Default, Hover, Focus-visible (≥2px ring, ≥3:1 contrast), Active (pressed feedback), Disabled. | WCAG 2.4.11; Radix UI |
| 14 | **State Completeness** | Explicitly design empty states, skeleton loading states, and error recovery states. | NN/g; Refactoring UI |
| 15 | **Purposeful Motion** | Duration 150–300ms, cubic-bezier ease-out. GPU-composited transforms (`translate3d`, `scale`, `opacity`) only. Strict `prefers-reduced-motion` compliance. | Material Motion; WCAG 2.3.3 |
| 16 | **Space Reservation (CLS < 0.1)** | Explicit `aspect-ratio`, `width`, and `height` attributes on all images, videos, and dynamic containers to eliminate shift. | web.dev Core Web Vitals |
| 17 | **Performance Budget** | LCP < 2.5s, INP < 200ms. Hero media compressed and preloaded. Max 2 font families. | web.dev; Google 2024 |
| 18 | **Semantic Landmarks & Accessibility** | Landmark structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), visible skip-link, strictly one `<h1>` per page, focus order matches DOM order. | WCAG 1.3.1 / 2.4.1 |
| 19 | **High-Conversion Forms** | Visible persistent labels, inline validation on blur, correct `type` and `autocomplete`, minimal required fields. | Baymard Institute; NN/g |
| 20 | **Meta & SEO Layer** | Title ≤60 chars, Meta Description ≤155 chars, Open Graph image 1200×630, JSON-LD Schema markup. | Open Graph; schema.org |

---

## 3. The 20 Codified Slide Principles (Decks & Pitches)

1. **One Idea Per Slide** (≤10-word headline + one supporting block).
2. **Glanceable in ≤3 Seconds**.
3. **≤7±2 Visual Chunks** (ideal 3–5).
4. **≥40% Whitespace Ratio** (hero slides ≥60%).
5. **5% Edge Safe-Zone** (all sides).
6. **Modular Typographic Scale** (1.25–1.618).
7. **Maximum 4 Type Sizes Per Slide** (≤6 per deck).
8. **Body ≥24px, Title ≥48px**.
9. **Line-height 1.4–1.6 Body, 1.05–1.2 Display**.
10. **Line Length ≤60 Characters**.
11. **WCAG Contrast ≥4.5:1** (aim 7:1 for projector resilience).
12. **60-30-10 Color Split**.
13. **One Accent Per Slide**.
14. **Never Encode Meaning by Hue Alone**.
15. **8pt Grid for All Spacing**.
16. **Align Everything to One 12-Column Grid**.
17. **Proximity:** Related items ≤16px, unrelated items ≥48px.
18. **Data-Ink Ratio ≥80%** (no 3D/gradients/chartjunk).
19. **F-Pattern:** Headline + key visual in top-left band.
20. **One Mode Per Deck:** Presenter mode OR Document mode (never mix).

---

## 4. Brand DNA Extraction & Pre-Built Library

The library contains 72+ pre-built brand files in `./essential/power-design/brands/`:
- **Tech / AI:** Anthropic, OpenAI, Linear, Vercel, Stripe, Cursor, GitHub, Figma, Webflow, Framer, Supabase, Raycast.
- **Finance:** Stripe, Mastercard, Coinbase, Revolut, Wise, Shopify.
- **Luxury / Auto:** Tesla, BMW, Ferrari, Apple, Nike, Airbnb.

### Brand Token Schema (`brand-style.md`):
- `background`: Canvas color (e.g. `#FFFFFF` or `#0A0A0A`).
- `foreground`: Primary text color (e.g. `#0A0A0A` or `#FAFAFA`).
- `accent`: Signature high-energy brand color (e.g. `#E11D2E`).
- `displayFont`: Font family for titles (e.g. `Inter`, `Outfit`, `Plus Jakarta Sans`).
- `radius`: Standard corner curvature (e.g. `16px`, `24px`, `9999px`).
- `voice`: Tone and style guidelines.
