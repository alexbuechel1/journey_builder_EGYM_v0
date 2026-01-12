# Asset Management

## Problem
Figma asset URLs expire after 7 days, causing broken images in production.

## Solution
All Figma assets are downloaded and stored locally in `public/icons/` to avoid URL expiry issues.

## How It Works

1. **Download Script**: `scripts/download-figma-assets.mjs`
   - Downloads all Figma assets from their current URLs
   - Saves them as PNG files in `public/icons/`
   - Assets are served statically by Vite from the public folder

2. **Local Paths**: All code uses local paths like `/icons/filename.png`
   - These paths work in both development and production
   - Assets are included in the build and never expire

## Updating Assets

When Figma assets change or you need fresh URLs:

1. **Get new Figma URLs** using the Figma MCP tools
2. **Update the script**: Edit `scripts/download-figma-assets.mjs` with new URLs
3. **Run the download script**:
   ```bash
   npm run download-assets
   ```
4. **Commit the new assets** to git so they're versioned

## Current Assets

All assets are stored in `public/icons/`:
- Sidebar icons (settings, inbox, analytics, etc.)
- Product icons (fitness-hub, smart-strength, member-app, etc.)
- Navigation icons (home, technology, wellpass)
- Header icons (egym-logo, gym-avatar, user-avatar)

## Benefits

✅ **No expiry issues** - Assets are stored locally  
✅ **Version controlled** - Assets are committed to git  
✅ **Fast loading** - Assets served from same domain  
✅ **Easy updates** - Just run the download script when needed

