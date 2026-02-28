# Deployment-Anleitung für Mirror Cube Fix

## Problem
Das Bundle wird nicht korrekt aktualisiert, weil `npm run build` die falsche Webpack-Config verwendet.

## Lösung

### Schritt 1: Build durchführen
Öffnen Sie ein Terminal und führen Sie aus:

```bash
cd /Users/sra/Documents/p/tech/mobile/rscubes-expo/webapp-source
npm run build
```

Das sollte jetzt die WebView-Config verwenden (wurde in package.json geändert).

### Schritt 2: Dateien kopieren
```bash
cd /Users/sra/Documents/p/tech/mobile/rscubes-expo

# Kopiere das Bundle
cp webapp-source/dist/renderer.bundle.js assets/webapp/renderer.bundle.js

# Kopiere als .txt (für Metro)
cp assets/webapp/renderer.bundle.js assets/webapp/renderer.bundle.js.txt

# Kopiere zu public (für Web)
cp assets/webapp/renderer.bundle.js public/renderer.bundle.js
```

### Schritt 3: Verifizieren
Prüfen Sie, ob der neue Code im Bundle ist:

```bash
grep "MIRROR: toggleMirrorCube" assets/webapp/renderer.bundle.js
```

Wenn das einen Treffer zeigt, war der Build erfolgreich!

### Schritt 4: App neu laden
- Stoppen Sie die Expo-App
- Starten Sie neu mit `npm start` oder `npx expo start`
- Laden Sie die App auf Android neu

## Erwartete Logs nach dem Mirror-Button-Klick

Wenn alles funktioniert, sollten Sie folgendes sehen:

```
LOG  📱 WebView: mirror() called
LOG  📱 WebView: MIRROR: toggleMirrorCube called, current isMirrorCube: false
LOG  📱 WebView: MIRROR: silverMaterial.color: 12632256
LOG  📱 WebView: MIRROR: silverMaterial.metalness: 1
LOG  📱 WebView: MIRROR: silverMaterial.roughness: 0.05
LOG  📱 WebView: MIRROR: silverMaterial.envMap exists: false/true
LOG  📱 WebView: MIRROR: mirrorMaterials length: 6
LOG  📱 WebView: MIRROR: Animation complete, isMirrorCube: true, isMirrorColors: true
LOG  📱 WebView: APPLY: applyCubeFaces called, isMirrorColors: true
LOG  📱 WebView: APPLY: Calling applyDefaultColors
LOG  📱 WebView: SETFACE: Setting face i1: 0 isMirror: true color: 12632256
```

## Wichtig

**color: 12632256** = hexadezimal 0xc0c0c0 = Silber

Wenn Sie diese Farbe im Log sehen, aber der Würfel ist schwarz, dann liegt das Problem **nicht** am Material, sondern:

1. **Lighting**: Android WebView benötigt Licht um metallic materials zu rendern
2. **Environment Map**: Die HDR-Textur lädt nicht korrekt (envMap exists: false)

## Nächster Schritt

Wenn der Würfel immer noch schwarz ist **trotz korrekter Materialwerte**, müssen wir:

1. **Lighting verstärken** - Mehr/hellere Lichter hinzufügen
2. **Fallback ohne envMap** - Silbernes Material sollte auch ohne HDR-Textur funktionieren
3. **Alternative Material-Properties** - evtl. emissive color hinzufügen

Bitte führen Sie die Schritte 1-4 aus und teilen Sie mir die Log-Ausgabe mit!
