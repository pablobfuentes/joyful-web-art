# Plan: Login Complete Flow with Supabase

**Date:** 2026-02-18  
**Scope:** Full auth flow (Login, Register, Forgot Password, Reset Password, protected route, Navbar auth state) connected to Supabase.  
**Stack:** Vite + React + TypeScript + React Router + Supabase Auth.  
**Constraints:** VMP — config-driven UI (all copy in `app-registry.ts`), files &lt;300 lines, TDD where applicable.

---

## 1. What I Will Implement

### 1.1 Supabase setup (code only; you provide credentials)
- Add `@supabase/supabase-js` dependency.
- Add `src/lib/supabase.ts`: create Supabase client using `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Add `.env.example` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (no real values).

### 1.2 Auth context and hook
- `src/contexts/AuthContext.tsx`: React context that:
  - Exposes `user`, `loading`, `signIn`, `signOut`, `signUp`, `resetPasswordForEmail`, `updatePassword`.
  - Subscribes to `onAuthStateChange` and sets user/loading.
  - Wraps app in `AuthProvider` and uses Supabase client from `src/lib/supabase.ts`.
- `src/hooks/useAuth.ts`: thin hook that returns `useContext(AuthContext)`.

### 1.3 Pages (copy from `app-registry` / WEBSITE_TEXT_CONTENT)
- **Login** (`/login`): Email + password form, “Remember me” (optional), “Forgot password?” → `/forgot-password`, “Sign In” submit, footer “Don’t have an account? Get Started” → `/register`. Redirect to `/` or `redirect` query param after success.
- **Register** (`/register`): Name (optional), email, password, confirm password. Copy from WEBSITE_TEXT_CONTENT (Create Account, placeholders, errors). Footer “Already have an account? Sign In” → `/login`. Redirect to `/` after signup.
- **Forgot Password** (`/forgot-password`): Email only, “Send Reset Link”. Success: “Check your email” + “Back to Login”. Copy from doc.
- **Reset Password** (`/reset-password`): New password + confirm (Supabase uses hash fragment for token). Success: “Password reset successful” + redirect to `/login`. Copy from doc.
- **Dashboard** (`/dashboard`): Protected. Welcome + user email, simple stats placeholders (Subscription, Next Box, Member Since). Copy from WEBSITE_TEXT_CONTENT. Logout or link back to home.

All UI strings for these pages will live in `app-registry.ts` (new keys: `login`, `register`, `forgotPassword`, `resetPassword`, `dashboard`).

### 1.4 Routing and protection
- **Routes in `App.tsx`:**  
  `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/dashboard`, `*` (NotFound).
- **Protected route:**  
  `src/components/ProtectedRoute.tsx`: if not authenticated and not loading → redirect to `/login?redirect=/dashboard` (or current path); else render children.
- **Dashboard route:**  
  `<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />`.

### 1.5 Navbar auth state
- Navbar reads `useAuth()`: if `user` → show user email/name and “Log Out”; if not → show “Log In” and “Get Started” (existing registry links). Optional loading state to avoid flicker.

### 1.6 Redirect after login
- After successful login: if `?redirect=...` exists and is a path (e.g. `/dashboard`), redirect there; else redirect to `/`.

### 1.7 Style and consistency
- Reuse existing design: same layout patterns, form components (from shadcn/ui if present), gradient CTAs, `font-display`, peach/lavender/mint where it fits. No new design system.

### 1.8 Tests (TDD where applicable)
- At least one test per flow (e.g. Login page renders, form validation or submit mock). Vitest + React Testing Library. Optional: Playwright e2e for “open login → type email/password → submit” (can be added in a follow-up if you want).

### 1.9 Docs and VMP
- Update `docs/CHANGELOG_AI.md` for auth feature.
- If something fails during implementation: log in `docs/FAILURE_LOG.md`.
- No hardcoded user-facing strings in components; all in `app-registry.ts`.

---

## 2. What I Need From You

### 2.1 Supabase project (required)
- **Supabase project:** Create one at [supabase.com](https://supabase.com) if you don’t have it (see `docs/SUPABASE_SETUP.md`).
- **Two values** (you’ll put them in `.env.local` locally; I will only use the names in code and `.env.example`):
  1. **Project URL**  
     - In Supabase: **Settings → API → Project URL**.  
     - Example: `https://xxxxxxxxxxxx.supabase.co`
  2. **Anon (public) key**  
     - In Supabase: **Settings → API → Project API keys → anon public**.  
     - Long string starting with `eyJ...`

You do **not** need to paste the real URL or key here. I only need you to confirm:
- “I have a Supabase project and I’ll add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`”  
  **or**
- “I don’t have a project yet” — then I’ll still implement everything; you’ll add the env vars later when the project exists.

### 2.2 Email auth in Supabase (required for full flow)
- In Supabase: **Authentication → Providers → Email** enabled.
- For “Forgot password” and “Confirm signup” emails to work:
  - Either use Supabase’s built-in email (limited on free tier), or  
  - Configure **Settings → Auth → SMTP** with your own SMTP (optional; you can do this later).

No need to send me SMTP details. Just confirm email provider is enabled so the code paths (sign up, reset password) are valid.

### 2.3 Redirect URLs (optional; I’ll set sensible defaults)
- After login we redirect to `/` or `?redirect=...`.
- If you later use Supabase “Redirect URLs” in the dashboard (e.g. for OAuth or email links), add:
  - `http://localhost:8080` (or your dev port)
  - Your production URL when you have it  
  I won’t add OAuth in this scope unless you ask.

### 2.4 “Forgot password” link on Login page
- Doc says “Forgot password?” links to `#`. I will link it to `/forgot-password` unless you prefer something else.

### 2.5 Register “Get Started” destination
- Doc says Sign Up link “Get Started” links to `/`. I will use `/register` for the register page footer “Get Started” so it goes to sign-up. Confirm or say if you want `/` (e.g. homepage with pricing).

### 2.6 Dashboard and protected routes
- I’ll add one protected route: `/dashboard` (as in your docs). If you want more protected routes now (e.g. `/checkout`, `/account`), list them and I’ll wrap them with `ProtectedRoute`.

---

## 3. What I Don’t Need From You

- No need to paste `.env` or real API keys in the chat.
- No need to configure RLS or database tables for this scope (auth only; dashboard will show only auth user info).
- No need to set up custom email templates in Supabase for the first version (defaults are fine).

---

## 4. Edge Cases I’ll Handle

- **Loading state:** Auth context exposes `loading`; Navbar and `ProtectedRoute` wait for loading to avoid flash of wrong state.
- **Reset password:** Use Supabase’s session from magic link + “Set new password” flow (hash fragment); handle invalid/expired link with message from registry.
- **Form errors:** Show generic messages from registry; optional Zod validation for email/password format.
- **Already logged in:** If user is logged in and visits `/login` or `/register`, redirect to `/` or `?redirect` target.

---

## 5. File / Module Summary

| Item | Path / note |
|------|-------------|
| Supabase client | `src/lib/supabase.ts` |
| Env example | `.env.example` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) |
| Auth context | `src/contexts/AuthContext.tsx` |
| Auth hook | `src/hooks/useAuth.ts` |
| Protected route | `src/components/ProtectedRoute.tsx` |
| Login page | `src/pages/Login.tsx` |
| Register page | `src/pages/Register.tsx` |
| Forgot password | `src/pages/ForgotPassword.tsx` |
| Reset password | `src/pages/ResetPassword.tsx` |
| Dashboard | `src/pages/Dashboard.tsx` |
| Registry copy | `src/config/app-registry.ts` (login, register, forgotPassword, resetPassword, dashboard) |
| App routes | `src/App.tsx` (add routes + AuthProvider) |
| Navbar | `src/components/Navbar.tsx` (useAuth, show user / Log Out vs Log In + Get Started) |

---

## 6. Approval

Once you confirm:

1. You have (or will add) Supabase URL + anon key in `.env.local`, and  
2. Email provider is enabled in Supabase, and  
3. Any choices above (forgot password link, register link, extra protected routes),  

I’ll proceed with implementation and will **not** write code until you give the **Vibe Check** (e.g. “Approved”, “Go ahead”, “Looks good”).
