# Offline Three.js Web-App Integration

## ✅ Was wurde implementiert:

1. **App.js** - Lädt jetzt die gebündelte HTML-Datei (`index-bundled.html`) offline
2. **assets/webapp/** - Ordner für deine Web-App-Dateien
3. **scripts/bundle-html.js** - Script zum Bündeln der HTML mit allen JS-Dateien inline
4. **app.json** - Konfiguriert, um alle Assets zu bündeln
5. **metro.config.js** - Metro Bundler-Konfiguration für zusätzliche Asset-Typen

## 📦 So funktioniert es:

### Schritt 1: Kopiere deine dist-Dateien
```bash
cp -r /pfad/zu/deinem/dist/* ./assets/webapp/
```

### Schritt 2: Erstelle die gebündelte HTML-Datei
```bash
npm run bundle
```

Dieses Script:
- Liest die `index.html`
- Findet alle `<script src="...">` Tags
- Lädt die JavaScript-Dateien und fügt sie inline ein
- Erstellt `index-bundled.html` mit allem inline

### Schritt 3: Starte die App
```bash
npm start
```

Dann:
- Drücke `w` für Web
- Drücke `a` für Android (oder scanne QR-Code mit Expo Go)
- Drücke `i` für iOS (oder scanne QR-Code mit Expo Go)

## 🎯 Warum dieser Ansatz?

React Native's Metro Bundler kann `.js`-Dateien nicht als Assets behandeln, da sie als Quellcode interpretiert werden. Durch das Inline-Einbetten aller JavaScript-Dateien in die HTML umgehen wir dieses Problem komplett.

**Vorteile:**
- ✅ Funktioniert auf Web, iOS und Android
- ✅ Komplett offline - keine Internetverbindung nötig
- ✅ Alle Assets sind in der App gebündelt
- ✅ Einfach zu aktualisieren (neue dist-Dateien kopieren, neu bündeln)

## 📁 Dateistruktur:

```
rscubes-expo/
├── App.js (lädt index-bundled.html)
├── assets/
│   └── webapp/
│       ├── index.html (Original)
│       ├── index-bundled.html (Gebündelt, wird in der App verwendet)
│       ├── renderer.bundle.js
│       ├── *.json
│       └── textures/
│           ├── autumn_field_puresky_1k.hdr
│           └── rosendal_plains_2_1k.hdr
├── scripts/
│   └── bundle-html.js
└── package.json
```

## 🔄 Workflow zum Aktualisieren der Web-App:

1. **Neue dist-Dateien erhalten:**
   ```bash
   cp -r /pfad/zu/neuem/dist/* ./assets/webapp/
   ```

2. **HTML neu bündeln:**
   ```bash
   npm run bundle
   ```

3. **App neu starten:**
   ```bash
   npm start
   ```

## 🔧 Troubleshooting:

### Problem: "Cannot find module './assets/webapp/index-bundled.html'"
- **Lösung:** Führe `npm run bundle` aus, um die gebündelte HTML-Datei zu erstellen

### Problem: WebView zeigt leere Seite
- **Lösung:** Prüfe die Konsole (React Native Debugger oder `expo start` Terminal)
- Stelle sicher, dass alle Asset-Pfade relativ sind (`./` statt `/`)

### Problem: Texturen werden nicht geladen
- **Lösung:** Prüfe, dass die Texture-Dateien im `assets/webapp/textures/` Ordner sind
- Füge neue Texture-Dateien in der App.js zur `textureFiles`-Array hinzu

### Problem: "Asset not registered"
- **Lösung:** Stelle sicher, dass alle Assets in `app.json` unter `assetBundlePatterns` erfasst sind
- Standardmäßig ist `"assets/**/*"` konfiguriert

## 📱 Platform-spezifische Hinweise:

### Web:
- Lädt `/assets/webapp/index-bundled.html` direkt vom Dev-Server
- Hot-Reload funktioniert (nach erneutem Bündeln)

### iOS/Android:
- Kopiert alle Assets beim ersten Start ins Document-Verzeichnis
- Verwendet `expo-file-system` und `expo-asset`
- Assets werden gecacht - bei Änderungen App neu installieren oder Cache löschen

## 🚀 Build für Production:

```bash
# Android APK
eas build --platform android

# iOS IPA
eas build --platform ios

# Web
expo build:web
```

Alle Assets werden automatisch in den Build eingebunden!

## 💡 Tipps:

1. **Große Assets optimieren:** Komprimiere Texturen und minimiere JavaScript, um die App-Größe zu reduzieren
2. **Versionierung:** Füge eine Versionsnummer in die HTML ein, um zu prüfen, welche Version geladen ist
3. **Debugging:** Verwende `console.log` in der WebView - sie erscheinen im React Native Terminal
4. **Content Security Policy:** Die CSP in der HTML erlaubt `unsafe-inline` - notwendig für inline Scripts
