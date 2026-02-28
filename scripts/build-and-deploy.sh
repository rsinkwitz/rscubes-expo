#!/bin/bash
set -e

echo "🔨 Building and deploying RS Cubes..."
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 1. Build with webpack
echo "Step 1: Building with webpack..."
cd "$PROJECT_DIR/webapp-source"
npm run build:webview

if [ ! -f "dist/renderer.bundle.js" ]; then
  echo "❌ ERROR: Bundle file not created!"
  exit 1
fi
echo "✓ Webpack build completed"
echo ""

# 2. Copy to assets/webapp (for React Native)
echo "Step 2: Copying to assets/webapp/ (for React Native)..."
mkdir -p "$PROJECT_DIR/assets/webapp"
cp dist/index.html "$PROJECT_DIR/assets/webapp/index.html"
cp dist/renderer.bundle.js "$PROJECT_DIR/assets/webapp/renderer.bundle.js"

# Copy bundle as .txt for Metro bundler with CACHE BUSTING
if command -v python3 &> /dev/null; then
  python3 "$PROJECT_DIR/scripts/cache-bust.py" "$PROJECT_DIR/assets/webapp/renderer.bundle.js" "$PROJECT_DIR/assets/webapp/renderer.bundle.js.txt"
  echo "  ✓ Created renderer.bundle.js.txt with cache-busting"
else
  # Fallback: Add timestamp comment manually
  echo "// Metro cache-bust: $(date +%s)" | cat - "$PROJECT_DIR/assets/webapp/renderer.bundle.js" > "$PROJECT_DIR/assets/webapp/renderer.bundle.js.txt"
  echo "  ✓ Created renderer.bundle.js.txt with timestamp"
fi

# Copy textures if they exist
if [ -d "dist/textures" ]; then
  cp -r dist/textures "$PROJECT_DIR/assets/webapp/"
  echo "  ✓ Copied: index.html, renderer.bundle.js, renderer.bundle.js.txt, textures/"
else
  echo "  ✓ Copied: index.html, renderer.bundle.js, renderer.bundle.js.txt"
fi
echo ""

# 3. Copy to public (for Web)
echo "Step 3: Copying to public/ (for Web)..."
mkdir -p "$PROJECT_DIR/public"
cp "$PROJECT_DIR/assets/webapp/index.html" "$PROJECT_DIR/public/cube.html"
cp "$PROJECT_DIR/assets/webapp/renderer.bundle.js" "$PROJECT_DIR/public/renderer.bundle.js"

if [ -d "$PROJECT_DIR/assets/webapp/textures" ]; then
  cp -r "$PROJECT_DIR/assets/webapp/textures" "$PROJECT_DIR/public/"
  echo "  ✓ Copied: cube.html, renderer.bundle.js, textures/"
else
  echo "  ✓ Copied: cube.html, renderer.bundle.js"
fi
echo ""

echo "✅ Build and deployment complete!"
echo ""
echo "Files ready:"
echo "  - assets/webapp/ (React Native)"
echo "  - public/ (Web)"
