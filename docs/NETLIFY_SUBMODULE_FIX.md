# Netlify "No url found for submodule .cursor/skills" – Fix

## What happened

Netlify’s Git checkout failed with:

```text
fatal: No url found for submodule path '.cursor/skills' in .gitmodules
```

That means the repo (or branch) Netlify is building has a submodule entry for `.cursor/skills` in `.gitmodules` but no `url`, so the clone/checkout fails.

## What we did in this repo

1. **Added a safe `.gitmodules`**  
   The repo now has a `.gitmodules` file that does **not** define `.cursor/skills` as a submodule. That way, when Netlify builds this repo, it won’t see a broken submodule for `.cursor/skills`.

2. **`.cursor/skills` stays local-only**  
   `.cursor/skills` remains in `.gitignore` and is not tracked as a submodule.

## What you should do

1. **Commit and push** the new `.gitmodules` (and this doc if you want):
   ```bash
   git add .gitmodules docs/NETLIFY_SUBMODULE_FIX.md
   git commit -m "fix(netlify): add safe .gitmodules to avoid broken .cursor/skills submodule"
   git push origin main
   ```

2. **Confirm what Netlify is building**  
   In Netlify: **Site settings → Build & deploy → Build settings** (or **Repository**). Check:
   - **Repository** – Is it exactly this repo (e.g. `joyful-web-art` / WebPage2)?
   - **Branch** – Is it `main` (or the branch you just pushed)?

3. **If the error continues**
   - If Netlify builds **another branch**, run the same fix on that branch (add the same `.gitmodules`, no `.cursor/skills` entry, and push).
   - If Netlify builds a **parent repo** (e.g. GamifiedTracker) that contains WebPage2, the broken `.gitmodules` is in the **parent** repo root. In that repo:
     - Remove the `.cursor/skills` block from `.gitmodules` (or delete `.gitmodules` if that was the only submodule).
     - Run: `git rm --cached .cursor/skills`
     - Commit and push.

4. **Optional**  
   In Netlify, trigger **Clear cache and deploy site** once after pushing the fix.

## If you ever need to remove a submodule (e.g. in another repo)

```bash
git submodule deinit -f .cursor/skills
git rm -f .cursor/skills
# Edit .gitmodules and remove the [submodule ".cursor/skills"] block (or delete .gitmodules if empty)
git add .gitmodules
git commit -m "chore: remove broken .cursor/skills submodule"
git push
```
