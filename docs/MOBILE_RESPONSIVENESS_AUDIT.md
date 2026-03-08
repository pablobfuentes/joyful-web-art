# Mobile Responsiveness Audit

**Date:** 2025-03-06  
**Goal:** Make the site adapt correctly on 320px–414px and tablet without breaking desktop.

---

## 1. Audit Summary

### Viewport
- **index.html:** Already has `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`. No change.

### Critical issues (must fix)
| Area | Issue | Impact |
|------|--------|--------|
| **Navbar** | Links and auth (Log in / Get started / Account / Log out) are in `hidden md:flex`. Below 768px only the logo is visible; no hamburger or mobile menu. | **Critical** – users cannot navigate or log in on phone. |
| **AdminCustomers** | Wide table with many columns; no horizontal scroll wrapper. | Horizontal page scroll on small screens. |
| **AdminLayout** | Nav items (Overview, Customers, Registry Editor) in a single row; can overflow on narrow widths. | Clipped or wrapped awkwardly. |
| **TestimonialsSection** | `containerSize` = 440px on mobile (from useIsMobile); orbiting carousel container exceeds 320px/375px viewport. | Horizontal overflow. |
| **ExperienceSection** | Step content has `maxWidth: "calc(50% - 2rem)"`; on mobile (single column) this restricts width to half viewport. | Narrow, hard-to-read text on small screens. |

### Moderate issues (should fix)
| Area | Issue | Proposed fix |
|------|--------|----------------|
| **HeroSection** | Heading `text-5xl` on small screens may be large on 320px. | Add `text-4xl sm:text-5xl md:text-7xl`. |
| **HowItWorksSection** | StepCard uses fixed `w-64 h-64` (256px); can squeeze on 320px. | Use `w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72` or max-w-full. |
| **CompatibilityTestSection** | Yes/No buttons in single row with `gap-4`; on 320px can be tight. | Stack on xs: `flex-col sm:flex-row`, or ensure min tap size 44px. |
| **FinalCTASection** | `py-32` heavy on mobile. | `py-16 md:py-32`. |
| **PricingSection** | Card padding `p-8` on all screens. | `p-6 sm:p-8` on cards. |
| **ProblemSection** | Title `text-4xl md:text-6xl`. | Add `text-3xl sm:text-4xl md:text-6xl` for 320px. |

### Implementation changelog (applied 2025-03-06)

- **Navbar:** Added mobile menu (Sheet from right) with hamburger trigger; nav links and auth in sheet; min tap height 44px in sheet; container `px-4 sm:px-6`.
- **AdminCustomers:** Wrapped table in `overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0`, table `min-w-[800px]`.
- **AdminLayout:** Header `flex-col sm:flex-row`, nav `flex-wrap`.
- **TestimonialsSection:** Capped orbit container size with `useState` + `useEffect` (resize) to `min(baseContainerSize, window.innerWidth - 32)`.
- **ExperienceSection:** Step content uses `max-w-full md:max-w-[calc(50%-2rem)]` (no inline maxWidth).
- **HeroSection:** Title `text-4xl sm:text-5xl md:text-7xl`.
- **ProblemSection:** Title `text-3xl sm:text-4xl md:text-6xl`.
- **HowItWorksSection:** Step image container `w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 max-w-full`.
- **CompatibilityTestSection:** Buttons wrapper `flex-col sm:flex-row gap-3 sm:gap-4`; buttons `min-h-[44px]`.
- **FinalCTASection:** `py-16 md:py-32`, `px-4 sm:px-6`.
- **PricingSection:** Card padding `p-6 sm:p-8`.

**Build:** `npm run build` succeeds. Manual testing at 320×568, 375×667, 390×844, 414×896, and tablet recommended.

### Minor / already OK
- **FooterSection:** grid stacks on mobile; bottom bar already `flex-col md:flex-row`.
- **WaveDivider:** `w-full`, responsive height; OK.
- **PastEditionsSection:** Mobile `flex-col`, cards `h-40`; OK.
- **Dashboard, Checkout, Login, Register, Privacy, Terms:** Use `max-w-*` and `px-4`; verify no overflow and touch targets.
- **WhatYouReceiveSection:** Progressive grid; OK.
- **FAQSection:** Single column; OK.

### Tables and wide content
- **AdminCustomers:** Wrap `<Table>` in `<div className="overflow-x-auto">` and give table `min-w-[800px]` or similar so it scrolls horizontally on small screens instead of forcing page scroll.
- **AdminCustomerDetail:** Tabs and content; ensure tabs wrap or scroll on small.

---

## 2. Implementation Plan (ordered checklist)

1. **Navbar – mobile menu**
   - Use existing `useIsMobile` (768px) or `useState` + media query.
   - Below `md`: show hamburger (Menu icon); hide main nav and auth buttons.
   - On hamburger click open Sheet (side right) with: nav links (Pricing, FAQ, etc.) + Log in / Get started or Account / Log out.
   - Preserve desktop layout (no Sheet, no hamburger) at `md` and up.
   - **Files:** `src/components/Navbar.tsx`. Dependencies: `Sheet`, `SheetContent`, `SheetTrigger` from `@/components/ui/sheet`; Menu from `lucide-react`.

2. **AdminLayout – responsive nav**
   - Allow nav to wrap or reduce to icons-only on very small screens; or add a simple drawer for admin nav below sm.
   - **Option A:** `flex-wrap gap-1` and allow text to wrap.
   - **Option B:** Below `sm` use hamburger + Sheet for admin nav links.
   - **Files:** `src/pages/admin/AdminLayout.tsx` (or shared `AdminLayout` component path).

3. **AdminCustomers – table scroll**
   - Wrap table in `<div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">` (or similar) and set `<Table className="min-w-[800px]">` so table scrolls horizontally on small screens.
   - **Files:** `src/pages/admin/AdminCustomers.tsx`.

4. **TestimonialsSection – cap container size**
   - Compute container size as `Math.min(containerSize, window.innerWidth - 32)` or use CSS: wrapper `max-w-[min(440px,calc(100vw-2rem))] mx-auto` and use 100% for the orbit container so it never exceeds viewport.
   - **Files:** `src/components/TestimonialsSection.tsx`.

5. **ExperienceSection – step content width**
   - Remove or override `maxWidth: "calc(50% - 2rem)"` on mobile. Use class e.g. `max-w-full md:max-w-[calc(50%-2rem)]` or inline style only on `md+`.
   - **Files:** `src/components/ExperienceSection.tsx`.

6. **HeroSection – heading scale**
   - Change title to `text-4xl sm:text-5xl md:text-7xl` (or equivalent).
   - **Files:** `src/components/HeroSection.tsx`.

7. **ProblemSection – title scale**
   - Add `text-3xl sm:text-4xl md:text-6xl` for main title.
   - **Files:** `src/components/ProblemSection.tsx`.

8. **HowItWorksSection – step card size**
   - Replace fixed `w-64 h-64` with responsive classes `w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72` (or use max-w-full and aspect).
   - **Files:** `src/components/HowItWorksSection.tsx`.

9. **CompatibilityTestSection – buttons**
   - Use `flex flex-col sm:flex-row gap-3` for Yes/No; ensure buttons have min-height 44px for touch.
   - **Files:** `src/components/CompatibilityTestSection.tsx`.

10. **FinalCTASection – padding**
    - Use `py-16 md:py-32` for main CTA section.
    - **Files:** `src/components/FinalCTASection.tsx`.

11. **PricingSection – card padding**
    - Use `p-6 sm:p-8` on pricing cards.
    - **Files:** `src/components/PricingSection.tsx`.

12. **Global**
    - Ensure no component uses fixed widths that exceed 100vw; use `max-w-full` where needed.
    - Verify containers use `px-4 sm:px-6` and `container mx-auto` without min-width that causes overflow.

---

## 3. Testing requirements (after implementation)

- Test at: 320×568, 375×667, 390×844, 414×896, and one tablet width (e.g. 768×1024).
- For each: no clipped text, no overflowing containers, no broken alignment, no inaccessible buttons, no overlapping layers, no horizontal page scroll (except intentional table scroll in Admin).

---

## 4. Flagged items (cannot fully fix without redesign)

- **TestimonialsSection orbiting carousel:** On very small screens (320px) the orbit design may still feel cramped even with capped size; consider flagging as “best-effort on 320px” or future redesign to a simple stacked list on xs.
- **Admin table:** Horizontal scroll is the standard pattern; no redesign needed, but small screens will scroll the table.
