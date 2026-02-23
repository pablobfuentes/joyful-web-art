# Registry Editor – Admin Access

- **Route:** `/admin/registry-editor`
- **Protection:** `AdminRoute` requires an authenticated user and `profiles.role = 'admin'`. If not signed in, you are sent to `/login`. If signed in but not admin, you see an **"Admin access required"** screen (with the reason: no profile row or role is not admin) and a link back to home—no silent redirect.

## Editor features

- **General tab:** Color palette (position-based matrix, click to edit hex/name/comment), fonts list (first = default, add/refresh from `public/fonts`), radius, shadows, gradients.
- **Section tabs:** One tab per section/page (Nav, Hero, Why, How It Works, Pricing, FAQ, Login, etc.). Each tab has:
  - **Style:** Section background, divider (style + top/bottom color), and section-specific style controls (e.g. hero heading font/size/color).
  - **Content:** All user-facing text strings from `APP_REGISTRY` for that section. **Each row** shows: **text input** (the copy), **Font family** dropdown, **Font size** dropdown (preset rem values), and **Color** dropdown (palette index). Modifiers are stored per content path and persisted with **Save**.
- **Save / Reset:** In **development**, **Save** writes the full registry (content, style, contentModifiers) to **`public/registry.json`** via a dev-only endpoint (`POST /__registry-save`), then reloads the page so the app loads from the file. In production, Save is not available (no such endpoint). **Reset** restores defaults in the editor only; click **Save** to persist the reset to the file.
- **Export / Import:** **Export** downloads a JSON backup of your current style, content, and modifiers. **Import** loads a previously exported file into the editor (then use **Save** to persist). Use Export after big edits so you can restore if the file is lost.

## Where the registry is loaded from

- **On load:** The app fetches **`/registry.json`** (from `public/registry.json`). If the file exists and is valid, it is used as the single source of content, style, and content modifiers. If the file is missing or the fetch fails (e.g. 404), the app uses built-in defaults from `app-registry.ts` and `style-registry.ts`.
- **Dev only:** Saving from the Registry Editor (dev server) writes to `public/registry.json`. The next load (any browser or tab) will use that file. Production builds do not include the save endpoint; Save in production shows an error.

## Why your saved copy might disappear (and how to prevent it)

If you are **not** using `registry.json` (e.g. no file yet, or production), the app falls back to **localStorage** for backward compatibility. In that case saves go to the **current browser** for the **exact origin**. So your changes can be gone if:

1. **Different URL or port** – You edited on `http://localhost:8080` but today opened `http://localhost:5173` (or the opposite). Each origin has its own localStorage.
2. **Different browser or device** – Chrome and Edge (and another PC) each have separate storage.
3. **Browser data cleared** – “Clear browsing data”, “Clear site data”, or “Clear on exit” for this site removes the keys.
4. **Private / Incognito** – In many browsers, private windows don’t keep localStorage after you close the window.
5. **Reset clicked** – **Reset** in the editor deletes all saved overrides.

**To make sure your edits are positively saved:**

- **Dev + registry.json (recommended):** Run the app in development (`npm run dev`). Use the Registry Editor and click **Save**. The app writes to `public/registry.json` and reloads; any browser or tab opening the app will then load from that file. Commit `public/registry.json` to git if you want the same copy everywhere.
- **Export after important edits:** Use **Export** to download a backup JSON. If the file or storage is ever lost, use **Import** and then **Save** to restore.

## How admin role is set

Admin access is determined by the **Supabase `public.profiles`** table:

- Column: `role` (`text`, one of `'user'` | `'admin'`).
- Default for new users: `'user'` (set by trigger `handle_new_user` in `docs/supabase_phase1_profiles_orders_rls.sql`).

To make a user an admin:

1. **Supabase Dashboard → Table Editor → `profiles`**  
   Find the row by `user_id` (same as `auth.users.id`) and set `role` to `'admin'`.

2. **Or run SQL (Dashboard → SQL Editor):**
   ```sql
   update public.profiles set role = 'admin' where user_id = '<auth-users-uuid>';
   ```

After that, the user can open `/admin/registry-editor` and see the Registry Editor page.

---

## Troubleshooting: 500 when loading /admin/registry-editor

If the app redirects you to home or shows **"Could not verify admin access"** and the browser console has:

`GET .../rest/v1/profiles?... 500 (Internal Server Error)`

then the **profiles** table is missing or its schema/RLS does not match what the app expects.

### 1. Create the table with the correct schema

The app expects `public.profiles` with exactly:

- `user_id` (uuid, primary key, references `auth.users(id)`)
- `role` (text, one of `'user'` or `'admin'`)
- `full_name` (text, nullable)
- `avatar_url` (text, nullable)

Run the full **Phase 1** script in **Supabase Dashboard → SQL Editor**:

- Open **docs/supabase_phase1_profiles_orders_rls.sql**
- Copy and run the whole file (or at least the PROFILES TABLE and RLS sections).

That creates the table, RLS policies, and the trigger that creates a profile when a user signs up.

### 2. If you already have a “profiles” table

If you created a table via Dashboard or another migration, it may use different column names (e.g. `id` instead of `user_id`). The API then can return 500 or empty rows.

- In **Table Editor → profiles**, confirm the columns are **user_id**, **role**, **full_name**, **avatar_url**.
- If not, either:
  - Recreate the table using **docs/supabase_phase1_profiles_orders_rls.sql**, or  
  - Add/rename columns to match and ensure RLS allows `select` for the current user (e.g. `auth.uid() = user_id`).

### 3. Insert or fix your admin row

After the table exists with the correct schema:

```sql
-- If your user has no row yet (e.g. created before the trigger existed):
insert into public.profiles (user_id, role, full_name)
values ('9be04c8d-3b6a-40cc-b06b-3939d590b25a', 'admin', 'Your Name')
on conflict (user_id) do update set role = 'admin';

-- Or to set an existing row to admin:
update public.profiles set role = 'admin' where user_id = '9be04c8d-3b6a-40cc-b06b-3939d590b25a';
```

Use your real `auth.users.id` (e.g. from **Authentication → Users** in the Dashboard).

### 4. Check Supabase logs

In **Supabase Dashboard → Logs → API** (or Postgres), open the failed request and read the error message. It will confirm whether the table is missing, a column is wrong, or an RLS policy is failing.

### 5. Error 42P17 in API log (infinite recursion or undefined object)

If the API log shows **`proxy_status: "PostgREST; error=42P17"`**, check the response body. Common cases:

- **`"infinite recursion detected in policy for relation \"profiles\""`** — The policy **profiles_select_admin** selects from `profiles` inside a policy on `profiles`, so Postgres re-applies RLS and recurses. **Fix:** run **docs/fix_profiles_rls_42p17.sql** (drops that policy; see §6 below).
- **Undefined object** — A referenced table/column/function does not exist. Follow the steps under "Do this" below.

**Do this:**

1. **Confirm the table exists**  
   In **SQL Editor** run:
   ```sql
   SELECT * FROM public.profiles LIMIT 1;
   ```
   - If you get **"relation \"profiles\" does not exist"**: create the table by running **docs/supabase_phase1_profiles_orders_rls.sql** (at least the PROFILES TABLE and RLS policies).
   - If the query runs but returns no rows, the table exists; the 42P17 may come from RLS (see step 3).

2. **Confirm column names**  
   The app requests only `user_id` and `role`. In **Table Editor → profiles** check that these columns exist (names exactly `user_id`, `role`). If you use `id` instead of `user_id`, PostgREST can throw 42P17. Fix by adding/renaming columns to match or by recreating the table from the Phase 1 script.

3. **Check RLS policies**  
   Policies on `profiles` can reference other objects (e.g. `get_user_email(uuid)` or other tables). If any of those are missing, the policy evaluation can throw 42P17.  
   - In **SQL Editor** run the full **docs/supabase_phase1_profiles_orders_rls.sql** so that helper functions and policies exist.  
   - Or temporarily run `ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;`, reload `/admin/registry-editor`; if the 500 goes away, re-enable RLS and fix the policy that references the missing object.

### 6. "Infinite recursion detected in policy for relation profiles" or table exists but app gets 500

If the API response body says **infinite recursion detected in policy for relation "profiles"**, the **profiles_select_admin** policy is the cause: it does `EXISTS (SELECT 1 FROM public.profiles ...)` so evaluating the policy triggers the same policy again.

If the table exists and returns rows in SQL Editor but the app still gets 500, use the same fix below.

**Fix: use minimal RLS policies (no self-referential policy)**

Run the script below in **Supabase Dashboard → SQL Editor**, or copy **docs/fix_profiles_rls_42p17.sql** and run it. It drops all current policies on `profiles` and recreates only the ones needed for the app to load your profile and for you to stay admin:

```sql
-- Ensure RLS is on
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove all existing policies on profiles (cleans broken or complex policies)
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- 1) Users can read their own profile (required for /admin/registry-editor to load role)
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- 2) Users can update their own profile (e.g. name)
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Optional: admins can read all profiles (only if you need admin views that list other users)
-- CREATE POLICY "profiles_select_admin"
--   ON public.profiles FOR SELECT
--   USING (
--     EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
--   );
```

Then reload `http://localhost:8081/admin/registry-editor`. The app only needs **profiles_select_own** to fetch your row and see `role = 'admin'`. If the 500 goes away, the problem was one of the old policies (e.g. the self-referential admin policy). You can add **profiles_select_admin** back later if you need admin-only views that read other users’ profiles.

---

## Failsafe / registry-first rule

To keep the editor and the app in sync, follow the **registry-first** rule: new variables go into the registry (and inventory) first; removed features get registry entries removed. Full details: **docs/REGISTRY_EDITOR_FAILSAFE.md** and **docs/PLAN_REGISTRY_EDITOR.md** §6.
