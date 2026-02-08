#!/bin/bash
# Deploy WebView Bundle Script

cd /Users/sra/Documents/p/tech/mobile/rscubes-expo/webapp-source

echo "Building webapp..."
npm run build

if [ $? -eq 0 ]; then
  echo "Build successful, copying files..."

  # Copy to assets
  cp dist-webview/renderer.bundle.js ../assets/webapp/renderer.bundle.js
  echo "Copied to assets/webapp/"

  # Copy as .txt for Metro
  cp ../assets/webapp/renderer.bundle.js ../assets/webapp/renderer.bundle.js.txt
  echo "Copied as .txt"

  # Copy to public for web
  cp ../assets/webapp/renderer.bundle.js ../public/renderer.bundle.js
  echo "Copied to public/"

  echo "Deployment complete!"
else
  echo "Build failed!"
  exit 1
fi
