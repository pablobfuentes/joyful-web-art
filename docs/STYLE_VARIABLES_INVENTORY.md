# Style Variables Inventory

**Last updated:** 2026-03-03  
**Source:** `src/config/style-registry.ts`  
**Editor:** Every variable below is editable in the Registry Editor at `/registry-editor` under the **Style** tab for each section (General tab for palette, fonts, radius, shadows, gradients).

**Purpose:** Map every stylized element to a registry path. The Registry Editor exposes these so that palette indices, section backgrounds, card colors, dividers, and image paths can be changed without editing code.

---

## 1. Palette (position-based)

Colors are stored in `styles.general.palette` as a matrix; each cell is identified by **index** (0, 1, 2, …). No semantic names in schema; name/comment are display-only in the UI.

**Current CSS variables → proposed palette indices** (for initial defaults; same color can appear in multiple roles):

| Index | Current CSS var / usage | Used by (tags for modal) |
|-------|-------------------------|---------------------------|
| 0 | `--background` (page, cards, inputs) | Page background, Footer bg, Login bg, Card bg, Input bg |
| 1 | `--foreground` (body text, headings) | Body text, Hero heading, Section titles, Footer titles, Nav link text |
| 2 | `--primary` (buttons, accents, ring) | Primary CTA fill, Navbar bar, Hero primary button, Step badge, Final CTA button, Footer hover, Pricing border (popular) |
| 3 | `--primary-foreground` (text on primary) | Button text on primary, Navbar bar text |
| 4 | `--secondary` (secondary buttons, accents) | Hero secondary accent, Doodles, Hero badge "Directo de Seúl" |
| 5 | `--secondary-foreground` | Text on secondary |
| 6 | `--muted` / `--muted-foreground` | Muted backgrounds, descriptions, labels |
| 7 | `--accent` (mint/teal accent) | Doodles, Pricing card accent (mint), Compatibility accent |
| 8 | `--peach` | Hero section bg, Nav link hover, WaveDivider (hero→why), Why→How, WhatYouReceive→Past, Pricing→FAQ, Final→Footer |
| 9 | `--peach-strong` | Problem section, HowItWorks→Compatibility, PastEditions→Experience, Testimonials→Pricing, FAQ→Final, Final CTA section bg, WaveDividers |
| 10 | `--lavender` | Problem card 2, HowItWorks card 2, WaveDividers (HowItWorks→Compatibility, Pricing→FAQ, FAQ→Final) |
| 11 | `--mint` | Problem card 3, HowItWorks card 4, PastEditions section bg, Experience section bg, WaveDivider (PastEditions→Experience) |
| 12 | `--sunshine` | HowItWorks card 4, Pricing badge, Pricing card accent (sunshine badge) |
| 13 | `--card` / `--card-foreground` | Card surfaces, Pricing cards |
| 14 | `--border` / `--input` | Borders, inputs, Footer input border |
| 15 | `--destructive` | Error message bg (Login, etc.) |
| 16 | `--bubblegum` | (Available; used in gradient-candy) |

Gradients and shadows reference the above (e.g. gradient-warm = primary + secondary). They can stay as computed from palette indices in the schema.

---

## 2. Global (General tab)

| Registry path | Description | Current source |
|---------------|-------------|----------------|
| `styles.general.palette` | Position-based color matrix (rows, cols, cells: { hex, name?, comment? }) | index.css HSL vars above |
| `styles.general.fonts.display` | Font family name for headings | tailwind: Playfair Display |
| `styles.general.fonts.body` | Font family name for body | tailwind: DM Sans |
| `styles.general.fonts.importUrl` | Optional Google Fonts or custom URL | index.css @import |
| `styles.general.radius.default` | Global border radius (e.g. rem) | --radius: 1rem |
| `styles.general.shadow.soft` | Shadow token | --shadow-soft |
| `styles.general.shadow.card` | Shadow token | --shadow-card |
| `styles.general.shadow.cardHover` | Shadow token | --shadow-card-hover |
| `styles.general.shadow.playful` | Shadow token | --shadow-playful |
| `styles.general.gradient.warm` | Gradient (from palette indices) | --gradient-warm |
| `styles.general.gradient.soft` | Gradient | --gradient-soft |
| `styles.general.gradient.candy` | Gradient | --gradient-candy |

---

## 3. Layout / Page

| Registry path | Description | Component / location |
|---------------|-------------|----------------------|
| `styles.page.background` | Main page background palette index | Index.tsx wrapper `bg-background` |

---

## 4. Nav

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.nav.bar.background` | Announcement bar (gradient) | Navbar top bar |
| `styles.nav.bar.textColor` | Bar text palette index | Navbar |
| `styles.nav.logo.font` | Logo font (display) | Navbar |
| `styles.nav.link.textColor` | Nav link default | Navbar |
| `styles.nav.link.hoverBackground` | Nav link hover bg palette index | Navbar |
| `styles.nav.link.hoverText` | Nav link hover text palette index | Navbar |
| `styles.nav.cta.borderRadius` | Button roundness | Navbar Get Started / Log In |

---

## 5. Hero

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.hero.section.background` | Section bg palette index | HeroSection `bg-peach` |
| `styles.hero.section.patternOpacity` | Pattern overlay opacity | bg-pattern-skincare opacity-60 |
| `styles.hero.badge.background` | "Skincare Coreano" badge bg | palette (primary) |
| `styles.hero.badge.textColor` | Badge text | primary-foreground |
| `styles.hero.badge.borderRadius` | Badge roundness | rounded-full |
| `styles.hero.quote.fontSize` | Rotating quote size | text-lg |
| `styles.hero.quote.textColor` | Quote color | text-foreground/70 |
| `styles.hero.heading.fontSize` | H1 size | text-5xl md:text-7xl |
| `styles.hero.heading.fontFamily` | display | font-display |
| `styles.hero.heading.textColor` | palette index | foreground |
| `styles.hero.description.textColor` | palette index | muted-foreground |
| `styles.hero.primaryButton.background` | gradient-warm | gradient-warm |
| `styles.hero.primaryButton.textColor` | primary-foreground | |
| `styles.hero.primaryButton.borderRadius` | rounded-full | |
| `styles.hero.secondaryButton.borderColor` | palette index | primary |
| `styles.hero.secondaryButton.background` | background/80 | |
| `styles.hero.secondaryButton.textColor` | primary |
| `styles.hero.secondaryButton.borderRadius` | rounded-full |
| `styles.hero.footer.textColor` | foreground/80 |
| `styles.hero.image.path` | Hero image URL/path | hero-skincare.jpg |
| `styles.hero.image.width` | e.g. full | w-full |
| `styles.hero.image.height` | h-[450px] md:h-[520px] |
| `styles.hero.image.borderRadius` | rounded-3xl |
| `styles.hero.image.borderWidth` | border-4 |
| `styles.hero.image.borderColor` | palette index (background) |
| `styles.hero.divider.style` | wavy | wave1 |
| `styles.hero.divider.topColorIndex` | palette index (peach) |
| `styles.hero.divider.bottomColorIndex` | palette index (background) |

---

## 6. Why (ProblemSection)

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.why.section.background` | Section bg | (background) |
| `styles.why.card[i].background` | Card bg palette index | bg-peach, bg-lavender, bg-mint |
| `styles.why.card[i].accentColor` | Number/accents | text-primary, text-secondary, text-accent |
| `styles.why.card.borderRadius` | rounded-3xl |
| `styles.why.card.shadow` | shadow-playful |
| `styles.why.ctaButton.*` | CTA at bottom | gradient-warm, rounded-full |
| `styles.why.divider.style` | blob |
| `styles.why.divider.topColorIndex` | background |
| `styles.why.divider.bottomColorIndex` | peach-strong |
| `styles.why.images` | problem-1, problem-2, problem-3 (path, size, border) | |

---

## 7. How It Works

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.howItWorks.section.background` | peach-strong |
| `styles.howItWorks.stepCard[i].circleBackground` | bg-peach, bg-lavender, bg-mint, bg-sunshine |
| `styles.howItWorks.stepCard.imageSize` | w-64 h-64 md:w-72 md:h-72 |
| `styles.howItWorks.stepCard.badgeBackground` | gradient-warm |
| `styles.howItWorks.divider.style` | wave2 |
| `styles.howItWorks.divider.topColorIndex` | peach-strong |
| `styles.howItWorks.divider.bottomColorIndex` | lavender |
| `styles.howItWorks.images` | step-1..4 (path, size, border) | |

---

## 8. Compatibility Test

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.compatibilityTest.section.background` | Section bg palette index | CompatibilityTestSection |
| `styles.compatibilityTest.triggerButton.backgroundIndex` | Trigger button fill | |
| `styles.compatibilityTest.triggerButton.textColorIndex` | Trigger button text | |
| `styles.compatibilityTest.triggerButton.borderRadius` | Button radius | |
| `styles.compatibilityTest.questionCard.backgroundIndex` | Question panel background | |
| `styles.compatibilityTest.resultCard.backgroundIndex` | Result panel background | |
| `styles.compatibilityTest.divider.style` | wave1, wavy2, sawtooth, blob | |
| `styles.compatibilityTest.divider.topColorIndex` | Divider top color | |
| `styles.compatibilityTest.divider.bottomColorIndex` | Divider bottom color | |

---

## 9. What You Receive

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.whatYouReceive.section.background` | peach |
| `styles.whatYouReceive.divider.style` | blob |
| `styles.whatYouReceive.divider.topColorIndex` | peach |
| `styles.whatYouReceive.divider.bottomColorIndex` | background |

---

## 10. Past Editions

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.pastEditions.section.background` | background |
| `styles.pastEditions.divider.style` | zigzag |
| `styles.pastEditions.divider.topColorIndex` | background |
| `styles.pastEditions.divider.bottomColorIndex` | mint |

---

## 11. Experience

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.experience.section.background` | mint |
| `styles.experience.divider.style` | wave2 |
| `styles.experience.divider.topColorIndex` | mint |
| `styles.experience.divider.bottomColorIndex` | sunshine |

---

## 12. Testimonials

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.testimonials.section.background` | sunshine |
| `styles.testimonials.divider.style` | wave1 |
| `styles.testimonials.divider.topColorIndex` | sunshine |
| `styles.testimonials.divider.bottomColorIndex` | peach-strong |

---

## 13. Pricing

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.pricing.section.background` | peach-strong |
| `styles.pricing.card.background` | background |
| `styles.pricing.card.borderColor` | by plan accent (lavender, primary, mint) |
| `styles.pricing.card.borderRadius` | rounded-3xl |
| `styles.pricing.card.shadow` | shadow-playful |
| `styles.pricing.badge.background` | sunshine (e.g. "Más popular") |
| `styles.pricing.ctaButton.*` | gradient-warm, rounded-full |
| `styles.pricing.divider.style` | blob |
| `styles.pricing.divider.topColorIndex` | peach-strong |
| `styles.pricing.divider.bottomColorIndex` | lavender |

---

## 14. FAQ

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.faq.section.background` | lavender |
| `styles.faq.divider.style` | wave2 |
| `styles.faq.divider.topColorIndex` | lavender |
| `styles.faq.divider.bottomColorIndex` | peach-strong |

---

## 15. Final CTA

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.finalCta.section.background` | peach-strong |
| `styles.finalCta.heading.fontSize` | text-4xl md:text-6xl |
| `styles.finalCta.ctaButton.*` | gradient-warm, rounded-full |
| `styles.finalCta.divider.style` | wave1 |
| `styles.finalCta.divider.topColorIndex` | peach-strong |
| `styles.finalCta.divider.bottomColorIndex` | background |

---

## 16. Footer

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.footer.section.background` | background |
| `styles.footer.heading.textColor` | foreground |
| `styles.footer.link.textColor` | muted-foreground |
| `styles.footer.link.hoverColor` | primary |
| `styles.footer.input.borderColor` | border-peach → palette index |
| `styles.footer.bottomBar.borderColor` | border-peach |

---

## 17. Auth pages (Login, Register, ForgotPassword, ResetPassword)

| Registry path | Description | Component |
|---------------|-------------|-----------|
| `styles.login.page.background` | background |
| `styles.login.heading.fontSize` | text-2xl |
| `styles.login.error.background` | destructive/10 |
| `styles.login.error.textColor` | destructive |
| (Same pattern for register, forgotPassword, resetPassword) | |

---

## 18. Dashboard, Checkout, Account

| Registry path | Description |
|---------------|-------------|
| `styles.dashboard.page.background` | background |
| `styles.checkout.*` | Section bg, buttons, form styles as needed |
| `styles.account.*` | Placeholder |

---

## 19. WaveDivider variants (map to section divider.style)

| style value | Current variant | SVG path key |
|-------------|------------------|--------------|
| wavy | wave1 | wave1 |
| wavy2 | wave2 | wave2 |
| sawtooth | zigzag | zigzag |
| blob | blob | blob |

Section-owned: each section’s `styles.<section>.divider` has `style`, `topColorIndex`, `bottomColorIndex`. Index.tsx (or a wrapper) reads section divider from registry and passes to WaveDivider.

---

## 20. Images (asset path, size, border)

| Registry path | Current asset | Notes |
|---------------|---------------|-------|
| `styles.hero.image.path` | hero-skincare.jpg | path or URL |
| `styles.why.card[0].image.path` | problem-1.jpg | |
| `styles.why.card[1].image.path` | problem-2.jpg | |
| `styles.why.card[2].image.path` | problem-3.jpg | |
| `styles.howItWorks.step[0..3].image.path` | step-1.jpg … step-4.jpg | |

Each image entry: `path`, `width`, `height` (or aspectRatio), `borderWidth`, `borderColorIndex`, `borderRadius`.

---

## Registry Editor coverage

- **Content (text):** All user-facing strings are in `src/config/app-registry.ts` and appear in the Registry Editor **Content** tab per section. See `docs/WEBSITE_TEXT_CONTENT.md` for the full path list.
- **Style:** All style variables above live in `src/config/style-registry.ts` and are editable in the Registry Editor **Style** tab (General + per-section). Section keys: `general`, `page`, `nav`, `hero`, `why`, `howItWorks`, `compatibilityTest`, `whatYouReceive`, `pastEditions`, `experience`, `testimonials`, `pricing`, `faq`, `finalCta`, `footer`, `login`, `register`, `forgotPassword`, `resetPassword`, `dashboard`, `checkout`, `account`.
- **No hardcoding:** Components must read from the registries (or context that merges localStorage overrides with the registry). Add new variables only in the appropriate registry and, if needed, in the Editor’s section controls; then update this inventory and `WEBSITE_TEXT_CONTENT.md` as needed.
