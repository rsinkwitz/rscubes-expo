# RS Cubes - Rainer's Rubik's Cube Simulator 🧊

**Status: PRODUCTION READY** 🎉  
_3D Rubik's Cube Simulator mit Three.js und React Native Expo_

<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  <!-- Web -->
  <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
</p>

## ✨ Hauptfeatures

### 🎮 **Cube Simulator**
- 🎲 **Multiple Modi** - 3×3, 2×2, Pyramorphix, Poke-like, Mirror Cube
- 🎨 **Farbvarianten** - Standard Cube Colors, Pyramorphix Colors, Mirror (Silver/Gold)
- 🔄 **Undo/Redo** - Volle History-Navigation
- 🎲 **Shuffle** - Zufällige Würfelzustände
- 🔄 **Reset** - Zurück zum gelösten Zustand

### 📱 **Unified UI System**
- 🎯 **Tap Zones** - Schneller Menü-Zugriff durch Tap auf Bildschirm-Ecken
- 📋 **Kompaktes Menü** - Alle Controls übersichtlich organisiert
- 🔄 **Portrait/Landscape** - Optimiert für beide Orientierungen
- 🌐 **Web + Mobile** - Identisches UI auf allen Plattformen
- 🎨 **Edge-to-Edge** - WebView reicht seamless unter System-Buttons (Android)

### 🎛️ **Controls & Interaktion**
- 🔒 **Camera Lock** - Verhindert versehentliche Kamera-Rotation beim Lösen
- 👁️ **View Toggles** - L/R, Back, Under mit visuellen Status-Indikatoren
- 🔄 **Turn Controls** - Würfel drehen mit Pfeiltasten (↑↓←→)
- 🌀 **Tumble Slider** - 5 Geschwindigkeitsstufen (0-4)
- ⌨️ **Keyboard Shortcuts** - Vollständige Tastatur-Unterstützung
- 📐 **Adaptive Größe** - Perfekte Würfelgröße in Portrait/Landscape

### 🎨 **Rendering & Grafik**
- 💡 **Verbesserte Beleuchtung** - 5 DirectionalLights für optimale Sichtbarkeit
- 🎥 **TrackballControls** - Freie Rotation über 90° hinaus
- 🎯 **Stabile Kamera** - Keine Größenänderung bei Orientation-Wechsel
- 🖼️ **HDR Environment** - Realistische Reflexionen auf Mirror Cube

---

Eine vollständige Rubik's Cube Simulator App mit professionellem UI und allen Features zum Lernen und Lösen von Würfel-Puzzles.

## 🚀 Quick Start

### **Erstmaliges Setup**

```bash
# 1. Installiere Dependencies
npm install

# 2. Build die WebView-App (Three.js Renderer)
npm run build

# 3. Starte die App
npm start
```

### **Entwicklung**

```bash
# Web Development (mit Live-Reload)
npm run web

# Android Development
npm run android

# iOS Development  
npm run ios
```

### **Production Build (Android)**

```bash
# WebView-App neu bauen
npm run build

# Release APK erstellen
cd android && ./gradlew assembleRelease

# APK installieren
adb install -r android/app/build/outputs/apk/release/rscubes-release.apk
```

## 🎛️ UI Controls

### **Menu System**
- **Tap Zones** - Tap auf untere Ecken öffnet das Menü (Indikatoren erscheinen beim Start)
- **F10** - Toggle Menü (Keyboard)
- **ESC** - Schließt Menü
- **F1** - Help Overlay mit allen Keyboard Shortcuts

### **Cube Controls (im Menü)**

#### **Shape** (Morphing zwischen Cube-Typen)
- **3×3** - Standard Rubik's Cube (F2)
- **2×2** - Pocket Cube (F3)
- **Pyramorphix** - Pyramiden-Form (F4)
- **Poke-like** - Alternative Form (F5)
- **Mirror** - Mirror Cube (Taste: 7)
- **Gold Mirror** - Gold statt Silber (Taste: g, nur bei Mirror aktiv)

#### **Actions**
- **↶ Undo** - Letzte Drehung rückgängig (Taste: 9)
- **↷ Redo** - Drehung wiederholen (Taste: 8)
- **🎲 Shuffle** - Zufällige Würfeldrehungen (Taste: F9)
- **🔄 Reset** - Würfel zurücksetzen (Taste: F8)

#### **Turn** (Ganzen Würfel drehen)
- **↑** - X+ Rotation (Taste: x)
- **↓** - X- Rotation (Taste: X, Shift+x)
- **←** - Y+ Rotation (Taste: y)
- **→** - Y- Rotation (Taste: Y, Shift+y)

#### **Look** (Quick View für Solving)
- **L/R** - Links/Rechts Ansicht (Taste: 1, grün = Links aktiv)
- **Back** - Rückseite (Taste: 2, grün = aktiv)
- **Under** - Unterseite (Taste: 3, grün = aktiv)
- **Reset** - Zurück zur Standard-Ansicht (Taste: 0)

#### **View** (Darstellung)
- **Tumble** - Auto-Rotation Slider 0-4 (Taste: t durchläuft Stufen)
- **Turn Letters** - Drehrichtungs-Buchstaben anzeigen (Toggle)
- **Camera Lock** - Kamera fixieren (verhindert versehentliche Rotation beim Solving!)

#### **Colors**
- **Pyra** - Pyramorphix Farbschema (Taste: F6)
- **Cube** - Standard Cube Farben (Taste: F7)

#### **Debug** (Collapsible Section)
- **Wireframe** - Wireframe-Modus (Taste: w)
- **Numbers** - Würfel-Nummern anzeigen (Taste: n)
- **Axes** - Koordinatenachsen (Taste: a)
- **Normals** - Flächennormalen (Taste: 4)

## ⌨️ Keyboard Shortcuts

### **Würfel-Drehungen** (Face Rotations)
- **F, R, U, B, L, D** - Vorderseite, Rechts, Oben, Rückseite, Links, Unten (clockwise)
- **Shift + Buchstabe** - Inverse Drehung (counter-clockwise)
- **Alt/⌥ + Buchstabe** - 2-Layer Rotation

### **Slice Rotations**
- **M** - Middle slice (zwischen L und R)
- **E** - Equatorial slice (zwischen U und D)
- **S** - Standing slice (zwischen F und B)

### **Whole Cube Rotations**
- **X, Y, Z** - Ganzen Würfel drehen um X/Y/Z-Achse
- **Shift + X/Y/Z** - Inverse Richtung

### **Function Keys**
- **F1** - Help Overlay
- **F2-F5** - Cube Shapes (3×3, 2×2, Pyramorphix, Poke)
- **F6-F7** - Color Schemes (Pyra, Cube)
- **F8** - Reset Cube
- **F9** - Shuffle
- **F10** - Toggle Menu
- **F11** - Toggle Fullscreen (Web only)
- **ESC** - Close Menu/Help

### **View & Navigation**
- **0** - Reset View
- **1** - Toggle L/R View
- **2** - Toggle Back View
- **3** - Toggle Under View
- **7** - Toggle Mirror Mode
- **8** - Redo
- **9** - Undo

### **Display Options**
- **t** - Cycle Tumble (0→1→2→3→4→0)
- **w** - Toggle Wireframe
- **a** - Toggle Axes
- **n** - Toggle Numbers
- **g** - Toggle Gold (Mirror mode only)
- **4** - Toggle Normals

## 📱 Mobile Features

### **Touch Controls**
- **Swipe auf Würfel-Fläche** - Slice-Rotation
- **Drag im Hintergrund** - Kamera rotieren (wenn Camera Lock OFF)
- **Pinch** - Zoom
- **Tap auf Ecken** - Menü öffnen

### **Adaptive UI**
- **Portrait** - Würfelgröße z=10 (optimal für vertikalen Bildschirm)
- **Landscape** - Würfelgröße z=5.0 (größerer Würfel für horizontalen Bildschirm)
- **Landscape + Menu** - WebView auf rechte Hälfte begrenzt
- **Edge-to-Edge** - WebView reicht unter System-Navigation-Buttons (Android)

### **Camera Lock** (Wichtig beim Solving!)
- **Problem**: Bei Swipes zum Drehen des Würfels wird manchmal die Kamera gedreht statt der Slice
- **Lösung**: Camera Lock aktivieren → Nur Würfel dreht sich, Kamera bleibt stabil
- **Toggle**: Im Menü unter "View" Section

## 📁 Projekt-Struktur

```
rscubes-expo/
├── App.js                     # Hauptkomponente mit WebView-Integration
├── UnifiedUI.js              # Unified Menu Overlay System
├── app.json                  # Expo Config (inkl. Android statusBar für edge-to-edge)
├── package.json              # Dependencies & Scripts
│
├── webapp-source/            # Three.js Renderer (Source)
│   ├── src/
│   │   ├── renderer.ts      # Hauptlogik für Cube-Simulator
│   │   ├── BoxGeometryEnh.ts
│   │   ├── index.html       # HTML Template
│   │   └── assets/          # Fonts, etc.
│   ├── webpack.config.js    # Build Config
│   └── package.json
│
├── assets/webapp/            # Compiled WebView Assets (deployed)
│   ├── index.html           # HTML Entry Point
│   ├── renderer.bundle.js   # Compiled Three.js App (~3MB)
│   └── textures/            # HDR Environment Maps
│
├── public/                   # Web-spezifische Assets (auto-generated)
│   └── cube.html            # Web Entry Point
│
├── android/                  # Native Android Project
│   └── app/src/main/res/
│       ├── values/styles.xml       # Base Android Styles
│       └── values-v29/styles.xml   # Android 10+ Styles (edge-to-edge!)
│
└── scripts/
    └── build-and-deploy.sh  # Build WebView-App und deploy zu assets/
```

## 🔧 Technologie-Stack

### **Frontend**
- **React Native** 0.81.4 mit **Expo** 54
- **React Native WebView** 13.15.0 für Three.js Integration
- **@react-native-community/slider** für Tumble Control
- **react-native-safe-area-context** für Edge-to-Edge Support

### **3D Rendering (WebView)**
- **Three.js** r145 (Core 3D Library)
- **TrackballControls** für freie Kamera-Rotation
- **GSAP** für smooth Cube-Animations
- **dat.gui** für Debug-Controls
- **RGBELoader** für HDR Environment Maps

### **Build Tools**
- **TypeScript** 5.9.2
- **Webpack** 5.91.0 für WebView-Bundle
- **ts-loader** für TypeScript compilation

## 💡 Tipps zum Lösen

### **Erfolgreich getestet!** 🎉
Die App wurde erfolgreich zum Lösen eines Rubik's Cubes auf Mobile verwendet. Diese Features haben sich bewährt:

1. **Camera Lock aktivieren** ⚠️ WICHTIG!
   - Verhindert versehentliche Kamera-Rotation
   - Orientierung bleibt stabil beim Solving

2. **View Controls nutzen**
   - **L/R, Back, Under** - Schnell andere Seiten inspizieren
   - Grüner Button = aktiver Modus
   - **Reset** - Zurück zur Standard-Ansicht

3. **Turn Controls** (↑↓←→)
   - Ganzen Würfel drehen statt Kamera
   - Besonders nützlich in Camera Lock Modus

4. **Undo/Redo**
   - Bei Fehlern schnell rückgängig machen
   - History bleibt erhalten

5. **Landscape bevorzugen**
   - Größerer Würfel (z=5.0 vs z=10)
   - Menü parallel sichtbar (rechts)
   - Bessere Übersicht

## 🔄 WebView-App aktualisieren

Wenn du den Three.js Renderer änderst:

```bash
# 1. Im webapp-source Verzeichnis arbeiten
cd webapp-source

# 2. Änderungen in src/renderer.ts machen
# ...

# 3. Build und Deploy (führt Webpack aus und kopiert Assets)
cd ..
npm run build

# 4. App neu starten
npm run web      # Für Web
npm run android  # Für Android
```

Das `build-and-deploy.sh` Script:
1. Führt Webpack-Build in `webapp-source/` aus
2. Kopiert Output nach `assets/webapp/` (für React Native)
3. Kopiert Output nach `public/` (für Web)
4. Fügt Cache-Busting-Hash hinzu

## 📝 Wichtige Hinweise

### **Android Edge-to-Edge Rendering**
Die App nutzt edge-to-edge rendering - das WebView reicht unter die System-Navigation-Bar:

**Kritische Dateien:**
- `app.json` - `android.statusBar.translucent: true`
- `android/app/src/main/res/values/styles.xml` - Base Styles
- `android/app/src/main/res/values-v29/styles.xml` - Android 10+ Styles

**Wichtigste Einstellung** (Android 10+):
```xml
<item name="android:enforceNavigationBarContrast">false</item>
```
Verhindert automatischen weißen Balken hinter der Navigation Bar.

### **Cross-Update System**
UI und WebView kommunizieren bidirektional:
- **UI → WebView**: Menü-Actions werden als postMessage gesendet
- **WebView → UI**: State-Updates (Toggle-States) zurück ans UI
- **Synchronisation**: Toggle-Buttons zeigen immer den aktuellen State

### **Build System**
- **WebView-App**: Webpack-Bundle (~3MB) mit Three.js, GSAP, dat.gui
- **Cache-Busting**: Automatischer Hash in Dateinamen für React Native
- **Offline**: Alle Assets sind gebündelt, keine externen Requests

### **Performance**
- Three.js läuft in WebView, nicht als native 3D
- Cube-Animationen mit GSAP (smooth 0.3s transitions)
- HDR Environment Maps für realistische Reflexionen (~2MB)
- TrackballControls für flüssige Kamera-Rotation

## 🐛 Troubleshooting

### **WebView zeigt nichts an**
```bash
# WebView-Assets neu bauen
npm run build

# Cache löschen und App neu starten
cd android && ./gradlew clean
npm run android
```

### **Menu öffnet sich nicht (Android)**
- Tap-Threshold prüfen (10px für versehentliche Drags)
- `adb logcat` für Fehler checken

### **Würfel erscheint klein/groß bei Rotation**
- Ist jetzt stabil durch fixe Kamera-Distanzen
- Portrait: z=10, Landscape: z=5.0
- Bei Problemen: Reset-Button (0-Taste)

### **Edge-to-Edge funktioniert nicht (Android)**
1. `values-v29/styles.xml` vorhanden?
2. `enforceNavigationBarContrast: false` gesetzt?
3. Release-Build gemacht? (`./gradlew assembleRelease`)

## 🔗 Links & Ressourcen

- **Expo Documentation** - [docs.expo.dev](https://docs.expo.dev)
- **React Native WebView** - [github.com/react-native-webview](https://github.com/react-native-webview/react-native-webview)
- **Three.js Docs** - [threejs.org/docs](https://threejs.org/docs/)
- **TrackballControls** - [threejs.org/examples](https://threejs.org/examples/#misc_controls_trackball)

---

## 🎯 Status

✅ **Production Ready**  
✅ **Erfolgreich getestet** auf Samsung Galaxy S20  
✅ **Würfel erfolgreich gelöst** auf Mobile Device  
✅ **Edge-to-Edge funktioniert** seamless  
✅ **Alle Features implementiert** und stabil  

**Version:** 1.0.0  
**Entwickelt:** 2025  
**Plattformen:** Android ✅, Web ✅, iOS (Ready, nicht getestet)
