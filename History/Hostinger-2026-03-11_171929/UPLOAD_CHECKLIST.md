# Hostinger Upload Checklist

This folder is prepared to be uploaded to Hostinger.

Upload the contents of this `Hostinger` folder into `public_html`.

Do not upload the `Hostinger` folder itself as a nested folder unless you want the site to live under `/Hostinger/`.

## Upload Steps

1. Build the site locally before packaging:
   - `npm run build`
2. Open Hostinger hPanel.
3. Go to `Files` -> `File Manager`.
4. Open `public_html`.
5. If this site is replacing the current site, back up the old files first.
6. Delete the old contents of `public_html` if needed.
7. Upload everything inside this `Hostinger` folder into `public_html`.
8. Confirm these files exist in `public_html` after upload:
   - `index.html`
   - `.htaccess`
   - `assets/`
   - `fonts/` if present
   - other top-level media files if present

## After Upload

1. Open your production URL.
2. Test the homepage.
3. Test direct routes and browser refresh on:
   - `/login`
   - `/register`
   - `/forgot-password`
   - `/reset-password`
4. Confirm styles, images, and fonts load correctly.

## Why `.htaccess` Is Included

This app uses client-side routing with React Router (`BrowserRouter`).

The `.htaccess` file makes Apache serve `index.html` for non-file routes so direct visits like `/login` do not return `404`.

## Supabase Reminder

This site uses build-time Vite variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Those values are baked into the generated build when you run `npm run build` locally.

Hostinger static hosting will not inject them at runtime for this setup.

## Supabase Production URLs To Check

In Supabase Auth settings, make sure your real production domain is allowed.

Recommended entries:

- Site URL: `https://your-domain.com`
- Redirect URL: `https://your-domain.com/reset-password`

If you use both `www` and non-`www`, add both variants.

## Rollback Tip

Before replacing the live site, download a copy of the current `public_html` contents so you can restore quickly if needed.
