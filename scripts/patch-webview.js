#!/usr/bin/env node

/**
 * Patch-Script: Verschiebt cubeDiv-Initialisierung in die init-Funktion
 * Problem: cubeDiv wird zu früh abgerufen, bevor das DOM fertig geladen ist
 */

const fs = require('fs');
const path = require('path');

const bundledHtmlPath = path.join(__dirname, '../assets/webapp/index-bundled.html');

console.log('🔧 Patching index-bundled.html...');

// Lese die gebündelte HTML
let html = fs.readFileSync(bundledHtmlPath, 'utf8');

// Suche nach "const cubeDiv = document.getElementById('container');"
// und ersetze es durch "let cubeDiv;"
const oldDeclaration = /const cubeDiv = document\.getElementById\('container'\);/g;
const newDeclaration = 'let cubeDiv; // Will be initialized in init()';

if (html.match(oldDeclaration)) {
  html = html.replace(oldDeclaration, newDeclaration);
  console.log('✓ Replaced cubeDiv declaration');
} else {
  console.log('⚠ cubeDiv declaration not found (might already be patched)');
}

// Suche nach "function init() {" und füge die cubeDiv-Initialisierung hinzu
const initFunctionPattern = /(function init\(\) \{[\s\n]*)(if \(cubeDiv\.parentElement)/;

if (html.match(initFunctionPattern)) {
  html = html.replace(
    initFunctionPattern,
    '$1cubeDiv = document.getElementById(\'container\');\n    if (!cubeDiv) {\n        console.error(\'Container element not found!\');\n        return;\n    }\n    $2'
  );
  console.log('✓ Added cubeDiv initialization in init()');
} else {
  console.log('⚠ Could not find init() function to patch');
}

// Schreibe die gepatchte HTML zurück
fs.writeFileSync(bundledHtmlPath, html, 'utf8');
console.log('✓ Patched:', bundledHtmlPath);
console.log('\n✅ Done! The cubeDiv will now be initialized after DOM is ready.');
