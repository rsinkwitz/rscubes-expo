#!/bin/bash
set -e

echo "Starting build and deploy..."

# Navigate to webapp-source
cd /Users/sra/Documents/p/tech/mobile/rscubes-expo/webapp-source

echo "Building with webpack..."
npx webpack --config webpack.webview.config.js --mode production

if [ -f "dist-webview/renderer.bundle.js" ]; then
  echo "Build successful!"

  # Copy to assets
  cp dist-webview/renderer.bundle.js ../assets/webapp/renderer.bundle.js
  echo "Copied to assets/webapp/"

  # Copy as txt
  cp ../assets/webapp/renderer.bundle.js ../assets/webapp/renderer.bundle.js.txt
  echo "Copied as txt file"

  # Copy to public
  cp ../assets/webapp/renderer.bundle.js ../public/renderer.bundle.js
  echo "Copied to public/"

  # Verify the new code is there
  if grep -q "MIRROR: toggleMirrorCube called" ../assets/webapp/renderer.bundle.js; then
    echo "SUCCESS: New logging code found in bundle!"
  else
    echo "WARNING: New logging code NOT found in bundle!"
  fi

  echo "Deployment complete!"
else
  echo "ERROR: Bundle file not created!"
  exit 1
fi
