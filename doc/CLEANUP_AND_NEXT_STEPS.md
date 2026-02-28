# Assets Cleanup & Bundle Update - ZUSAMMENFASSUNG

## Was wurde gemacht:

### ✅ 1. Assets aufgeräumt
**Vorher:** 33 Dateien in `assets/webapp/`
**Nachher:** 4 Dateien (+ 2 Texturen)

**Gelöscht:**
- Alte Electron-Build-Artefakte (main.js, preload.bundle.js, renderer.js)
- Einzelne Module (BoxGeometryEnh.js, CustomControls.js, OrbitControlsEnh.js)
- Source Maps (.map Dateien)
- Duplikate und .txt Kopien
- renderer.bundle.js.map*
- index-bundled.html

**Behalten:**
- ✅ `index.html`
- ✅ `renderer.bundle.js.txt` (für Metro/Android)
- ✅ `textures/` (HDR-Texturen)
- ✅ `README.md`

### ✅ 2. Deployment-Skripte aktualisiert
- `scripts/deploy-simple.sh` - Neues einfaches Skript
- `scripts/build-and-deploy-verbose.sh` - Aktualisiert
- Beide kopieren nur noch zur .txt Datei

### ✅ 3. Bundle neu deployed
- Aktuelles Bundle kopiert zu `assets/webapp/renderer.bundle.js.txt`

---

## Nächste Schritte - WICHTIG!

### Das Metro-Cache Problem:

Die App.js lädt das Bundle so:
```javascript
const jsAsset = Asset.fromModule(require("./assets/webapp/renderer.bundle.js.txt"));
```

**`require()` wird von Metro gebundled und gecached!**

Deshalb sehen Sie keine neuen Logs - Metro verwendet das alte cached Asset.

### LÖSUNG:

**Sie MÜSSEN Expo mit `-c` neu starten:**

```bash
# 1. Terminal wo Expo läuft: Ctrl+C

# 2. Mit Cache-Clear starten:
npx expo start -c
```

**Das `-c` Flag löscht den Metro-Cache und lädt alle Assets neu!**

### Alternative (wenn -c nicht hilft):

```bash
# Kompletten Cache löschen:
rm -rf node_modules/.cache
rm -rf .expo
npx expo start
```

---

## Was Sie dann sehen sollten:

```
LOG  Loading JS bundle asset...
LOG  JS Asset URI: ...
LOG  JS Asset downloaded, URI: ...
LOG  JS Content size: 2956 KB  <-- Neue Größe
LOG  ✓ Copied: renderer.bundle.js (2956 KB)
LOG  ✓ NEW code found in bundle!  <-- WICHTIG!
```

Und dann beim WebView-Start:
```
LOG  📱 WebView: INIT: Cube created, now loading HDR texture...
LOG  📱 WebView: INIT: Calling loadEnvironmentTexture...
LOG  📱 WebView: HDR: Function called
LOG  📱 WebView: HDR: Creating RGBELoader...
```

---

## Warum hat es bisher nicht funktioniert?

1. ✅ Bundle wurde korrekt gebaut
2. ✅ Bundle wurde nach assets/webapp kopiert
3. ❌ **Metro hat das alte Asset gecached**
4. ❌ App.js lädt das alte gecachte Asset
5. ❌ WebView bekommt alten Code

**Metro-Cache MUSS gelöscht werden mit `-c`!**

---

## Status:

✅ Assets aufgeräumt (29 Dateien gelöscht)
✅ Deployment-Skripte aktualisiert
✅ Bundle neu deployed
⚠️ **Metro-Cache muss gelöscht werden**

---

## Action Required:

```bash
# JETZT:
npx expo start -c
```

Dann Android App neu laden und Logs prüfen!
