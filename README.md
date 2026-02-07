# Rubik's Cube Simulator - React Native App ✅

**Status: VOLLSTÄNDIG FUNKTIONSFÄHIG** 🎉  
_3D Rubik's Cube mit Three.js in React Native WebView_

<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  <!-- Web -->
  <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
</p>

## ✨ Features

- 🎲 **3D Rubik's Cube** mit Three.js r164
- 📱 **Touch-Steuerung** - Swipe, Pinch, Rotate
- 🎮 **Native Buttons** - Undo, Redo, Shuffle, Morph
- 🔄 **Multiple Modi** - 3x3, 2x2, Pyramorphix, Mirror Cube
- 📴 **Offline** - Alle Assets lokal
- 🌐 **Cross-Platform** - Android ✅, Web ✅, iOS

---

Eine Expo-App, die einen Three.js-basierten Rubik's Cube Simulator offline in einer WebView lädt.

## 🚀 Quick Start

```bash
# Installiere Dependencies
npm install

# Bündle die HTML-Datei (wichtig!)
npm run bundle

# Für Web: Bereite die public-Assets vor
npm run prepare-web

# Starte die App
npm start
```

Oder für Web direkt:
```bash
npm run web
```

Dann:
- Drücke `w` für Web (oder nutze `npm run web`)
- Scanne den QR-Code mit Expo Go für iOS/Android

## 📱 Features

- ✅ **Offline-fähig** - Alle Assets sind in der App gebündelt
- ✅ **Cross-Platform** - Funktioniert auf Web, iOS und Android
- ✅ **Three.js WebView** - Lädt eine bestehende three.js-Webanwendung
- ✅ **Interaktiv** - Touch-Steuerung, Tastatur-Shortcuts, Morphing zwischen Cube-Typen

## 📁 Projekt-Struktur

```
├── App.js                  # Hauptkomponente mit WebView
├── assets/webapp/          # Three.js Web-App-Dateien (Quelle)
│   ├── index.html         # Original HTML
│   ├── index-bundled.html # Gebündelte HTML (wird verwendet)
│   ├── *.js               # JavaScript-Module
│   └── textures/          # HDR-Texturen
├── public/                 # Statische Assets für Web (automatisch generiert)
│   └── ...                # Kopie von assets/webapp/*
├── scripts/
│   └── bundle-html.js     # Bundling-Script für HTML
└── OFFLINE_SETUP.md       # Detaillierte Dokumentation
```

## 🔄 Web-App aktualisieren

Wenn du die three.js-Webanwendung aktualisieren möchtest:

1. Kopiere neue dist-Dateien:
   ```bash
   cp -r /pfad/zu/neuem/dist/* ./assets/webapp/
   ```

2. Erstelle die gebündelte HTML:
   ```bash
   npm run bundle
   ```

3. Bereite die Web-Assets vor:
   ```bash
   npm run prepare-web
   ```

4. Starte die App neu:
   ```bash
   npm start
   ```

## 📝 Notes

- Die App verwendet `react-native-webview` um die three.js-Anwendung zu laden
- Alle JavaScript-Dateien werden inline in die HTML gebündelt, um Asset-Loading-Probleme zu vermeiden
- Siehe `OFFLINE_SETUP.md` für detaillierte Informationen und Troubleshooting

## 🔗 Links

- [Expo WebView](https://docs.expo.dev/versions/latest/sdk/webview/)
- [Three.js docs](https://threejs.org/docs/)
- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
