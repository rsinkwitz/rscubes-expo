#!/bin/bash
# Simple deployment script - Updated after assets cleanup

set -e

echo "Building and deploying WebView bundle..."
echo ""

cd /Users/sra/Documents/p/tech/mobile/rscubes-expo/webapp-source

echo "1. Building with webpack..."
npm run build

if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    exit 1
fi

cd /Users/sra/Documents/p/tech/mobile/rscubes-expo

echo ""
echo "2. Deploying to assets (as .txt for Metro)..."
cp webapp-source/dist-webview/renderer.bundle.js assets/webapp/renderer.bundle.js.txt

echo "3. Deploying to public (for Web)..."
cp webapp-source/dist-webview/renderer.bundle.js public/renderer.bundle.js

echo ""
echo "4. Verifying deployment..."
if grep -q "INIT: Cube created" assets/webapp/renderer.bundle.js.txt; then
    echo "SUCCESS: New code deployed!"
else
    echo "WARNING: Could not verify new code in bundle"
fi

echo ""
echo "Deployment complete!"
echo ""
echo "Next steps:"
echo "  1. Stop Expo (Ctrl+C)"
echo "  2. Clear cache: npx expo start -c"
echo "  3. Reload Android app (R key)"
