#!/bin/bash
set -e

echo "=== Starting build and deploy ==="

cd /Users/sra/Documents/p/tech/mobile/rscubes-expo/webapp-source

echo "Step 1: Clean old build..."
rm -rf dist-webview/*

echo "Step 2: Building with webpack..."
npm run build

echo "Step 3: Checking if bundle was created..."
if [ -f "dist-webview/renderer.bundle.js" ]; then
    SIZE=$(wc -c < dist-webview/renderer.bundle.js)
    echo "Bundle created: $SIZE bytes"
else
    echo "ERROR: Bundle not created!"
    exit 1
fi

echo "Step 4: Checking for HDR code in bundle..."
if grep -q "HDR: Starting" dist-webview/renderer.bundle.js; then
    echo "SUCCESS: HDR code found in bundle!"
else
    echo "WARNING: HDR code NOT found in bundle!"
fi

cd /Users/sra/Documents/p/tech/mobile/rscubes-expo

echo "Step 5: Copying to assets as .txt (for Metro)..."
cp webapp-source/dist-webview/renderer.bundle.js assets/webapp/renderer.bundle.js.txt
echo "Copied to assets/webapp/renderer.bundle.js.txt"

echo "Step 6: Copying to public (for Web)..."
cp webapp-source/dist-webview/renderer.bundle.js public/renderer.bundle.js
echo "Copied to public/renderer.bundle.js"

echo "Step 7: Verifying deployment..."
if grep -q "INIT: Cube created" assets/webapp/renderer.bundle.js.txt; then
    echo "SUCCESS: NEW code found in deployed bundle!"
else
    echo "ERROR: OLD code in deployed bundle!"
    exit 1
fi

echo ""
echo "=== Deployment complete! ==="
echo "Now:"
echo "1. Stop Expo (Ctrl+C)"
echo "2. Clear cache: npx expo start -c"
echo "3. Reload Android app"
echo "4. Check for HDR logs!"
