# Changelog (AI-assisted changes)

## [Unreleased]

### Added

- **Fix 502 Bad Gateway on create-checkout-session (Stripe errors visible)**
  - **Failure:** 502 when Stripe threw (e.g. wrong Price ID). Function reads secrets from **Supabase Dashboard**, not `.env.local`. Logged in `docs/FAILURE_LOG.md`.
  - **Changes:** (1) `supabase/functions/create-checkout-session/index.ts`: on Stripe `catch`, return **200** with `{ url: null, error: message }` so the client can show the error. (2) `docs/STRIPE_EDGE_FUNCTION_SETUP.md`: step 9 "If you get 502" — clarify that secrets are in Supabase only; use Price IDs (`price_...`); link to function logs. (3) `docs/FAILURE_LOG.md`: 502 entry added.
  - **Verification:** Redeploy function; set correct Price IDs in Supabase secrets; re-test checkout; error message should appear in UI or in function logs.

- **Fix 401 Unauthorized on create-checkout-session (Stripe Edge Function)**
  - **Failure:** `POST .../functions/v1/create-checkout-session` returned 401; gateway rejected request before function ran. Logged in `docs/FAILURE_LOG.md`.
  - **Changes:** (1) `src/lib/checkout.ts`: explicit `Authorization: Bearer <session.access_token ?? anon_key>` sent on every invoke so the header is always set. (2) `supabase/config.toml`: `[functions.create-checkout-session] verify_jwt = false` so the function accepts calls without JWT verification (function only creates Stripe Checkout session; payment on Stripe). (3) `docs/STRIPE_EDGE_FUNCTION_SETUP.md`: step 8 added for 401 case and redeploy. (4) `docs/FAILURE_LOG.md`: created with root cause, reproduction, fix attempt.
  - **Verification:** User must redeploy for config to apply: `supabase functions deploy create-checkout-session`. Then re-test checkout (gift and logged-in flows).

- **Restore deleted files (Vite import resolution)**
  - `src/config/app-registry.ts`, `src/pages/Checkout.tsx`, and `docs/CHANGELOG_AI.md` had been deleted in the working tree (uncommitted), causing Vite errors: "Failed to resolve import ./pages/Checkout" and "Failed to resolve import @/config/app-registry". Restored all three from Git with `git restore`. Build and dev server now resolve imports. Documented in changelog; no FAILURE_LOG (root cause: accidental/uncommitted deletion; fix: restore from Git).

- **Supabase auth flow (login, register, forgot password, reset password, protected routes)**
  - Supabase client in `src/lib/supabase.ts` (env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
  - `.env.example` with placeholder Supabase env vars.
  - `AuthContext` and `useAuth` hook: `user`, `loading`, `signIn`, `signOut`, `signUp`, `resetPasswordForEmail`, `updatePassword`.
  - `ProtectedRoute`: redirects unauthenticated users to `/login?redirect=<path>`.
  - Auth pages (all copy from `app-registry.ts`): Login, Register, ForgotPassword, ResetPassword.
  - Dashboard (protected): welcome, email/name/member since, subscription/next box placeholders, quick actions, Log Out / Back to Home.
  - Checkout and Account pages (protected placeholders).
  - App routes: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/dashboard`, `/checkout`, `/account`; Dashboard, Checkout, Account wrapped in `ProtectedRoute`.
  - Navbar: when logged in shows user name/email and Log Out; when logged out shows Log In and Get Started (→ `/register`). Nav Get Started href set to `/register`.
  - Login redirect: after sign-in, redirects to `?redirect=` path when present, else `/`.
  - Reset password: reads session from Supabase (recovery link); invalid/expired link shows message and Back to Login.
  - Tests: `src/pages/Login.test.tsx` (render form with app-registry copy, forgot password link); Supabase mocked in test so no env required.

- **Dashboard profile view and edit**
  - App registry: dashboard keys for edit profile (editProfileTitle, editProfileButton, profileNameLabel/Placeholder, saveProfile/saveProfileLoading, cancelEdit, profileUpdatedSuccess, profileUpdateError, changePasswordLabel/changePasswordHref).
  - AuthContext: `updateProfile(fullName)` calling `supabase.auth.updateUser({ data: { full_name } })`.
  - Dashboard: single Account Information card with view mode (email, name, member since, Edit profile button, Change password link) and edit mode (name input, Save, Cancel); success toast on save, inline error on failure; same style (rounded-lg border bg-card, font-display, primary/outline buttons).
  - Tests: `src/pages/Dashboard.test.tsx` (renders welcome and account info, shows Edit profile and Change password; Supabase mocked with session user).
