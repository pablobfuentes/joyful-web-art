# Custom Fonts Directory

Place your custom font files here.

## Supported Formats

- **WOFF2** (recommended) - Best compression, modern browsers
- **WOFF** - Good compression, wide browser support
- **TTF/OTF** - Fallback for older browsers (larger file size)

## How to Add Your Fonts

### Step 1: Copy Font Files

1. Find your font files on your computer (usually in `C:\Windows\Fonts` on Windows or `/Library/Fonts` on Mac)
2. Copy the font files you want to use to this `public/fonts/` directory
3. Recommended naming: `FontName-Regular.woff2`, `FontName-Bold.woff2`, etc.

### Step 2: Add @font-face Declarations

Edit `src/styles/custom-fonts.css` and add your font declarations:

```css
@font-face {
  font-family: 'Your Font Name';
  src: url('/fonts/YourFont-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Your Font Name';
  src: url('/fonts/YourFont-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Step 3: Use in Registry Editor

1. Open the Registry Editor at `/admin/registry`
2. Go to the **General** tab
3. In the **TEXT** panel, find **Font Presets**
4. Edit a preset and change the `family` field to your font name (e.g., `"Your Font Name"`)

## Converting Fonts to WOFF2

If you only have TTF/OTF files, convert them to WOFF2 for better performance:

**Online tools:**
- https://cloudconvert.com/ttf-to-woff2
- https://convertio.co/ttf-woff2/

**Command line (requires Node.js):**
```bash
npm install -g ttf2woff2
ttf2woff2 input.ttf output.woff2
```

## Example Font Structure

```
public/fonts/
  ├── MyFont-Regular.woff2
  ├── MyFont-Bold.woff2
  ├── MyFont-Italic.woff2
  └── MyFont-BoldItalic.woff2
```
