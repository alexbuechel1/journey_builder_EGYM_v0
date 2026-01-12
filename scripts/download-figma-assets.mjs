#!/usr/bin/env node

/**
 * Script to download Figma assets and store them locally
 * Run with: node scripts/download-figma-assets.mjs
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const iconsDir = join(projectRoot, 'public', 'icons');

// Map of icon names to their Figma URLs
const iconMap = {
  // Sidebar icons
  'settings': 'https://www.figma.com/api/mcp/asset/d60d1a44-1e27-4b50-8234-72f4b81c6316',
  'inbox': 'https://www.figma.com/api/mcp/asset/b80c2cda-be49-4efa-9bd1-861d4221ee6e',
  'analytics': 'https://www.figma.com/api/mcp/asset/b916e88a-bdd7-4cb7-b9a9-434186465403',
  'fitness-hub': 'https://www.figma.com/api/mcp/asset/e4746f72-816f-4988-99a3-f33975680713',
  'smart-strength': 'https://www.figma.com/api/mcp/asset/771e4beb-3743-4fc7-ab86-53e18e1c28e2',
  'smart-flex': 'https://www.figma.com/api/mcp/asset/c95a07f8-e6e2-48e6-a575-461c8c6f193e',
  'smart-cardio': 'https://www.figma.com/api/mcp/asset/e6afe3a6-0124-425b-95f7-6ca590f6f5a8',
  'member-app': 'https://www.figma.com/api/mcp/asset/3b2f8287-396a-4dba-9506-2ed337d8ea18',
  'trainer-app': 'https://www.figma.com/api/mcp/asset/fe4bba30-1429-4db8-9b3d-d48feac2c6cf',
  'support': 'https://www.figma.com/api/mcp/asset/19e7cb49-6634-4ba6-8a29-95dec61c21e4',
  'education': 'https://www.figma.com/api/mcp/asset/1c4320b4-d37e-4771-808f-8c94cccfa487',
  'marketing': 'https://www.figma.com/api/mcp/asset/f6d9f18a-601c-4b1e-864f-5416afaa3d2c',
  
  // SideNav icons
  'home': 'https://www.figma.com/api/mcp/asset/d60d1a44-1e27-4b50-8234-72f4b81c6316',
  'technology': 'https://www.figma.com/api/mcp/asset/6fd6198d-edc6-440b-a063-bfd1daa11c55',
  'wellpass': 'https://www.figma.com/api/mcp/asset/6b6f80e1-f59e-479e-83bf-99cf29f7a68a',
  
  // Header icons
  'egym-logo': 'https://www.figma.com/api/mcp/asset/c5ae0abe-a05f-4f2b-8caa-c33a1d7f01f1',
  'gym-avatar': 'https://www.figma.com/api/mcp/asset/72599d18-e0a0-47ed-875f-7bfef53a6587',
  'user-avatar': 'https://www.figma.com/api/mcp/asset/72599d18-e0a0-47ed-875f-7bfef53a6587',
};

async function downloadAsset(url, filename) {
  try {
    console.log(`Downloading ${filename}...`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download ${filename}: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const filepath = join(iconsDir, filename);
    
    // Check content type to determine file extension
    const contentType = response.headers.get('content-type') || '';
    let finalFilename = filename;
    if (contentType.includes('svg')) {
      finalFilename = filename.replace(/\.(png|jpg|jpeg)$/i, '.svg');
    } else if (contentType.includes('png')) {
      finalFilename = filename.replace(/\.(svg|jpg|jpeg)$/i, '.png');
    }
    
    const finalFilepath = join(iconsDir, finalFilename);
    await writeFile(finalFilepath, Buffer.from(buffer));
    console.log(`✓ Downloaded ${finalFilename}`);
    return finalFilename;
  } catch (error) {
    console.error(`✗ Failed to download ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  // Create icons directory if it doesn't exist
  if (!existsSync(iconsDir)) {
    await mkdir(iconsDir, { recursive: true });
    console.log('Created icons directory');
  }

  console.log('Downloading Figma assets...\n');
  
  let successCount = 0;
  let failCount = 0;
  const downloadedFiles = {};

  for (const [name, url] of Object.entries(iconMap)) {
    // Use .png as default, but the function will correct it based on content-type
    const filename = `${name}.png`;
    const downloadedFilename = await downloadAsset(url, filename);
    if (downloadedFilename) {
      successCount++;
      downloadedFiles[name] = downloadedFilename;
    } else {
      failCount++;
    }
  }
  
  // Output mapping for reference
  console.log('\nDownloaded files:');
  for (const [name, filename] of Object.entries(downloadedFiles)) {
    console.log(`  ${name} -> ${filename}`);
  }

  console.log(`\n✓ Completed: ${successCount} successful, ${failCount} failed`);
  console.log(`\nAssets saved to: ${iconsDir}`);
  console.log('\nNext step: Update your code to use local paths like "/icons/filename.png"');
}

main().catch(console.error);

