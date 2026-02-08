const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const webappSourceDir = '/Users/sra/Documents/p/tech/mobile/rscubes-expo/webapp-source';
const assetsDir = '/Users/sra/Documents/p/tech/mobile/rscubes-expo/assets/webapp';
const publicDir = '/Users/sra/Documents/p/tech/mobile/rscubes-expo/public';

console.log('Building webpack bundle...');
try {
  process.chdir(webappSourceDir);
  execSync('npx webpack --config webpack.webview.config.js --mode production', {
    stdio: 'inherit'
  });

  console.log('Build complete!');

  const bundleSource = path.join(webappSourceDir, 'dist-webview/renderer.bundle.js');
  const bundleDest = path.join(assetsDir, 'renderer.bundle.js');
  const bundleTxt = path.join(assetsDir, 'renderer.bundle.js.txt');
  const bundlePublic = path.join(publicDir, 'renderer.bundle.js');

  console.log('Copying files...');
  fs.copyFileSync(bundleSource, bundleDest);
  console.log('Copied to assets/webapp/');

  fs.copyFileSync(bundleDest, bundleTxt);
  console.log('Copied as .txt file');

  fs.copyFileSync(bundleDest, bundlePublic);
  console.log('Copied to public/');

  // Verify
  const content = fs.readFileSync(bundleDest, 'utf8');
  if (content.includes('MIRROR: toggleMirrorCube called')) {
    console.log('SUCCESS: New logging code found in bundle!');
  } else {
    console.log('WARNING: New logging code NOT found in bundle!');
  }

  console.log('Deployment complete!');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
