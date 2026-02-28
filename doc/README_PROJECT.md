# Rainer's Cubes - Expo Mobile App

Eine React Native (Expo) App, die einen interaktiven 3D Rubik's Cube mit Three.js anzeigt.

## Features

✅ **Interaktiver 3D Rubik's Cube** mit Touch-Steuerung
✅ **Verschiedene Formen:** 3x3, 2x2, Pyramorphix, Mirror Cube
✅ **HDR-Umgebungs-Texturen** für realistische Reflektionen
✅ **Offline-fähig** - alle Assets lokal verfügbar
✅ **Plattformen:** Web, Android, iOS

## Installation

```bash
npm install
```

## Development

### Web (Development)
```bash
npm run web
```

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## Projekt-Struktur

```
rscubes-expo/
├── App.js                  # Hauptkomponente mit WebView
├── app.json               # Expo-Konfiguration
├── assets/
│   └── webapp/            # WebView-Assets
│       ├── index.html     # HTML mit inline console forwarding
│       ├── renderer.bundle.js.txt  # JavaScript Bundle (als .txt für Metro)
│       └── textures/      # HDR-Texturen
├── webapp-source/         # Source-Code für WebView
│   ├── src/
│   │   ├── index.html    # HTML-Template
│   │   └── renderer.ts   # Three.js Cube-Logik
│   └── webpack.config.js
└── scripts/              # Build-Skripte
```

## Build & Deployment

### WebView Bundle bauen:

```bash
cd webapp-source
npm run build
```

### Bundle deployen:

```bash
cd ..
cp webapp-source/dist/renderer.bundle.js assets/webapp/renderer.bundle.js.txt
cp webapp-source/dist/index.html assets/webapp/index.html
```

### App neu starten (mit Cache-Clear):

```bash
npx expo start -c
```

## Technische Details

### Mirror Cube HDR-Reflektionen

Der Mirror Cube verwendet HDR-Umgebungs-Texturen für realistische Reflektionen:

- **XMLHttpRequest** statt fetch() (fetch funktioniert nicht mit file:// in Android/iOS WebView)
- **RGBELoader.parse()** für ArrayBuffer-Parsing
- **iOS-Kompatibilität:** Status 0 wird als Erfolg behandelt (iOS gibt 0 statt 200 für file:// URLs)
- **EquirectangularReflectionMapping** für Umgebungs-Reflektionen
- **MeshStandardMaterial** mit metalness: 1.0 und envMap

#### Plattform-spezifische Besonderheiten:

**Android:**
- XMLHttpRequest mit status 200 für erfolgreiche Ladevorgänge
- Funktioniert out-of-the-box

**iOS:**
- XMLHttpRequest gibt status 0 für file:// URLs (auch bei Erfolg!)
- Code prüft `(status === 200 || status === 0) && buffer.byteLength > 0`
- Funktioniert identisch zu Android trotz status 0

### Console.log Weiterleitung

Inline-Script in index.html leitet alle console.log/warn/error zu React Native WebView weiter:

```html
<script>
  // Console forwarding BEFORE renderer.bundle.js!
  if (window.ReactNativeWebView) {
    const originalLog = console.log;
    console.log = function(...args) {
      originalLog.apply(console, args);
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'log',
        message: args.join(' ')
      }));
    };
  }
</script>
<script src="renderer.bundle.js" defer></script>
```

## Wichtige Dateien

- `App.js` - React Native Hauptkomponente
- `webapp-source/src/renderer.ts` - Three.js Cube-Logik
- `webapp-source/src/index.html` - HTML-Template mit console forwarding
- `assets/webapp/` - Deployed WebView-Assets

## Steuerung

### Touch (Mobile):
- **Drag** - Würfel rotieren/schwenken
- **Buttons** - Verschiedene Aktionen

### Keyboard (Web):
- **L/R/U/D/F/B** - Schichten drehen
- **F2-F8** - Verschiedene Modi (3x3, 2x2, Pyra, Mirror, etc.)
- **F9** - Shuffle
- **9/8** - Undo/Redo
- **1/2/3** - Ansicht wechseln
- **T** - Tumble-Modus

## Deployment

Die App ist offline-fähig. Alle Assets (HTML, JS, Texturen) werden bei App-Start in den Cache kopiert.

## Dokumentation

Siehe `/PROJEKT_ERFOLGREICH.md` für vollständige technische Dokumentation.

## License

Private Project
