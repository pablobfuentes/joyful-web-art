# Plan – Dashboard Quick Actions & Account Consolidation

## Goal

Consolidate all “account” functionality into the `Dashboard` page and give the **Quick Actions** real, protected destinations (Order history, Subscription, Settings, Notifications), replacing the standalone `/account` page.

---

## Checklist

- [x] 1. Clarify scope and routing
  - [x] 1.1 Confirm all existing `/account` references (`App.tsx`, `Navbar.tsx`, any others).
  - [x] 1.2 Decide canonical routes for Quick Actions (e.g. `/orders`, `/subscription`, `/settings`, `/notifications`).
  - [x] 1.3 Ensure all user-facing copy for new pages lives in `app-registry.ts` (no hardcoded strings in components).

- [x] 2. TDD – Dashboard Quick Actions behavior
  - [x] 2.1 Extend `src/pages/Dashboard.test.tsx` with tests that assert each Quick Action link has a real, non-`#` `href` (initially using chosen paths so tests can fail before wiring).
  - [x] 2.2 Run the Dashboard tests and verify they fail for the correct reason (Quick Actions still point to `#`).

- [x] 3. Registry updates for Quick Actions and new sections
  - [x] 3.1 In `src/config/app-registry.ts`, extend `dashboard` with `orderHistoryHref`, `subscriptionActionHref`, `settingsHref`, and `notificationsHref` matching the chosen routes.
  - [x] 3.2 Add new top-level sections:
    - [x] `orderHistory` – title + subtitle/description + placeholder text.
    - [x] `subscriptionManagement` – title + description for managing the subscription.
    - [x] `settings` – title + copy for account settings and preferences.
    - [x] `notifications` – title + copy for notification preferences.
  - [x] 3.3 Keep copy style consistent with existing dashboard/checkout sections and compatible with Registry Editor.

- [x] 4. Wire Dashboard Quick Actions (GREEN for step 2 tests)
  - [x] 4.1 In `src/pages/Dashboard.tsx`, change each Quick Action `Link` from `to="#"` to `to={data.<correspondingHrefKey>}`.
  - [x] 4.2 Re-run Dashboard tests and confirm all Quick Action tests pass.

- [x] 5. TDD – New pages for each Quick Action
  - [x] 5.1 Add failing tests:
    - [x] `src/pages/OrderHistory.test.tsx`
    - [x] `src/pages/SubscriptionManagement.test.tsx`
    - [x] `src/pages/SettingsPage.test.tsx`
    - [x] `src/pages/NotificationsPage.test.tsx`
  - [x] 5.2 Each test should assert:
    - [x] The page renders a heading from its registry section.
    - [x] The page renders its description/placeholder from the registry.
    - [x] (Optional) The page uses the shared shell (Navbar + padded main + centered content).
  - [x] 5.3 Run these tests and verify they fail before implementation.

- [x] 6. Implement new pages and routes
  - [x] 6.1 Implement page components:
    - [x] `src/pages/OrderHistory.tsx`
    - [x] `src/pages/SubscriptionManagement.tsx`
    - [x] `src/pages/SettingsPage.tsx`
    - [x] `src/pages/NotificationsPage.tsx`
  - [x] 6.2 Each page should:
    - [x] Use `useRegistryContent().getSectionContent("<sectionKey>")`.
    - [x] Use `Navbar` and layout consistent with `Dashboard`.
    - [x] Render title + description/placeholder from registry.
  - [x] 6.3 In `src/App.tsx`, add `ProtectedRoute` entries for:
    - [x] `/orders`
    - [x] `/subscription`
    - [x] `/settings`
    - [x] `/notifications`
  - [x] 6.4 Re-run new page tests and confirm they pass.

- [x] 7. Remove / deprecate standalone Account page
  - [x] 7.1 Remove `/account` route from `App.tsx`.
  - [x] 7.2 In `Navbar.tsx`, update the logged-in user link to route to `/dashboard` instead of `/account`.
  - [x] 7.3 Decommission `src/pages/Account.tsx` and `src/pages/Account.test.tsx`:
    - [x] Either delete them entirely, or
    - [x] Leave a minimal stub clearly marked as unused in docs/changelog.
  - [x] 7.4 Decide how to treat `APP_REGISTRY.account`:
    - [x] Mark as deprecated but keep for history/editor, or
    - [ ] Simplify / remove with a clear note in docs and changelog.

- [x] 8. Regression tests, security review, performance review
  - [x] 8.1 Run relevant unit tests:
    - [x] Dashboard tests.
    - [x] New page tests.
    - [x] Any affected auth/route tests.
  - [x] 8.2 **Security review:**
    - [x] Confirm all new pages are wrapped in `ProtectedRoute`.
    - [x] Confirm they only read user data from `useAuth()` and registry, with no new sensitive operations.
  - [x] 8.3 **Performance review:**
    - [x] Verify new pages are lightweight (static content + shared layout).
    - [x] Confirm no unnecessary network calls or heavy computations are introduced.

- [ ] 9. Visual and responsive verification
  - [ ] 9.1 Manually check `/dashboard` and each new page at key breakpoints (mobile, tablet, desktop).
  - [ ] 9.2 Confirm navigation flow:
    - [ ] Dashboard → Quick Action → Target page → Back to Dashboard or Home.
    - [ ] No dead ends, confusing loops, or missing links.

- [x] 10. Logging and VMP compliance evidence
  - [x] 10.1 Update `workflow/ChangeLog.md` with:
    - [x] Description of Account consolidation and new Quick Action pages.
    - [x] Files touched.
    - [x] Verification summary (tests + manual checks).
  - [x] 10.2 Update `docs/CHANGELOG_AI.md` with:
    - [x] Entry describing Dashboard Quick Actions → dedicated pages and `/account` deprecation.
  - [x] 10.3 Update `docs/VMP_COMPLIANCE_AUDIT.md`:
    - [x] New audit entry for this feature, including:
      - [x] Test file paths.
      - [x] Security review notes.
      - [x] Performance review notes.
  - [x] 10.4 Update `workflow/FAIL_LOG.md` **only if** unexpected failures arise (environmental red/green in TDD does not count as a failure for this log).

