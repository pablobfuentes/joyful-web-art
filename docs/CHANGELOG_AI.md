# Changelog (AI-assisted changes)

## [Unreleased]

### Added

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
