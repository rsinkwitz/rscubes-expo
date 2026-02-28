# Assets Cleanup - Nicht benötigte Dateien entfernt

## Datum: 8. Februar 2026

---

## ✅ Was wurde gemacht:

### Aufgeräumt in `assets/webapp/`:

**Gelöscht:**
- ❌ `BoxGeometryEnh.js*` (alle Varianten)
- ❌ `CustomControls.js*` (alle Varianten)
- ❌ `OrbitControlsEnh.js*` (alle Varianten)
- ❌ `main.js*` (alle Varianten)
- ❌ `preload.bundle.js*` (alle Varianten)
- ❌ `renderer.js*` (alle Varianten)
- ❌ `renderer.bundle.js.map*` (Source Maps)
- ❌ `renderer.bundle.js` (nicht .txt Version)
- ❌ `9a3651b41d879023c62c68862169f6b3.json*` (Font-JSON)
- ❌ `index-bundled.html`

**Behalten:**
- ✅ `index.html` - Wird von App.js geladen
- ✅ `renderer.bundle.js.txt` - Das JavaScript-Bundle (als .txt für Metro)
- ✅ `textures/` - HDR-Texturen für Mirror Cube
- ✅ `README.md` - Dokumentation

---

## Warum diese Dateien?

### Was die App TATSÄCHLICH verwendet (App.js):

```javascript
// 1. HTML
const htmlAsset = Asset.fromModule(require("./assets/webapp/index.html"));

// 2. JavaScript Bundle (als .txt)
const jsAsset = Asset.fromModule(require("./assets/webapp/renderer.bundle.js.txt"));

// 3. Texturen
require("./assets/webapp/textures/autumn_field_puresky_1k.hdr")
require("./assets/webapp/textures/rosendal_plains_2_1k.hdr")
```

### Was NICHT verwendet wird:

- **Alte Electron-Build-Artefakte:**
  - `renderer.js`, `main.js`, `preload.bundle.js`
  - Diese waren für die Electron-Version
  
- **Einzelne Module:**
  - `BoxGeometryEnh.js`, `CustomControls.js`, `OrbitControlsEnh.js`
  - Jetzt alles in `renderer.bundle.js` gebundled
  
- **Source Maps:**
  - `.map` Dateien für Debugging
  - Nicht nötig in Production
  
- **Duplikate:**
  - `.txt` Kopien von .js Dateien
  - Nur `renderer.bundle.js.txt` wird gebraucht

---

## Vorher / Nachher:

### Vorher:
```
assets/webapp/
├── 9a3651b41d879023c62c68862169f6b3.json
├── 9a3651b41d879023c62c68862169f6b3.json.txt
├── BoxGeometryEnh.js
├── BoxGeometryEnh.js.map
├── BoxGeometryEnh.js.map.txt
├── BoxGeometryEnh.js.txt
├── CustomControls.js
├── CustomControls.js.map
├── CustomControls.js.map.txt
├── CustomControls.js.txt
├── OrbitControlsEnh.js
├── OrbitControlsEnh.js.map
├── OrbitControlsEnh.js.map.txt
├── OrbitControlsEnh.js.txt
├── README.md
├── index-bundled.html
├── index.html
├── main.js
├── main.js.map
├── main.js.map.txt
├── main.js.txt
├── preload.bundle.js
├── preload.bundle.js.map
├── preload.bundle.js.map.txt
├── preload.bundle.js.txt
├── renderer.bundle.js
├── renderer.bundle.js.map
├── renderer.bundle.js.map.txt
├── renderer.bundle.js.txt
├── renderer.js
├── renderer.js.map
├── renderer.js.map.txt
├── renderer.js.txt
└── textures/
```

**33 Dateien** (ohne Texturen)

### Nachher:
```
assets/webapp/
├── README.md
├── index.html
├── renderer.bundle.js.txt
└── textures/
    ├── autumn_field_puresky_1k.hdr
    └── rosendal_plains_2_1k.hdr
```

**4 Dateien** (+ 2 Texturen)

**Gespart: ~29 unnötige Dateien!**

---

## Deployment-Prozess aktualisiert:

### Neuer Workflow:

```bash
# 1. Build
cd webapp-source
npm run build

# 2. Deploy (nur .txt für Metro)
cd ..
cp webapp-source/dist/renderer.bundle.js assets/webapp/renderer.bundle.js.txt

# 3. Deploy für Web (normal .js)
cp webapp-source/dist/renderer.bundle.js public/renderer.bundle.js
```

**Kein .js in assets/webapp mehr - nur .txt für Metro!**

---

## ✅ Vorteile:

1. **Weniger Verwirrung** - Nur die Dateien die tatsächlich verwendet werden
2. **Schnellere Metro-Builds** - Weniger Assets zu verarbeiten
3. **Kleinerer Git-Repo** - Keine redundanten Dateien
4. **Klarere Struktur** - Sofort ersichtlich was gebraucht wird

---

## Deployment-Skript aktualisiert:

`scripts/build-and-deploy-verbose.sh` wurde aktualisiert:
- Kopiert direkt zu `.txt` (kein Zwischenschritt mehr)
- Verifiziert mit `INIT: Cube created` statt `HDR: Starting`
- Klarer Output

---

## Status:

✅ **Assets aufgeräumt**
✅ **Nur benötigte Dateien behalten**
✅ **Deployment-Skript aktualisiert**
✅ **Alles bereit für saubere Builds**
