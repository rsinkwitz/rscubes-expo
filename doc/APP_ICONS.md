# App Icons - Rainer's Cubes

## Übersicht

Die App hat jetzt ein benutzerdefiniertes Icon mit einem Rubik's Cube Design.

## Icon-Dateien

### Source:
- `assets/icon-source.svg` - SVG-Master-Datei (1024x1024)
  - Editierbar für zukünftige Änderungen
  - Zeigt 3D-Rubik's Cube mit drei sichtbaren Seiten (Gelb, Rot, Blau)
  - Hintergrund: Light Steel Blue (#b0c4de) - passt zum App-Theme

### Generierte PNGs:
- `assets/icon.png` - Haupt-Icon (1024x1024)
- `assets/adaptive-icon.png` - Android Adaptive Icon (1024x1024)
- `assets/splash.png` - Splash Screen (1242x2436)

### Android Icons (automatisch generiert):
```
android/app/src/main/res/
├── mipmap-mdpi/         (48x48)
├── mipmap-hdpi/         (72x72)
├── mipmap-xhdpi/        (96x96)
├── mipmap-xxhdpi/       (144x144)
└── mipmap-xxxhdpi/      (192x192)
```

Jede Größe enthält:
- `ic_launcher.webp` - Standard Icon
- `ic_launcher_foreground.webp` - Adaptive Icon Vordergrund
- `ic_launcher_round.webp` - Rundes Icon

## Design

### Farben:
- **Hintergrund:** Light Steel Blue (#b0c4de)
- **Top Face:** Gold (#FFD700)
- **Right Face:** Red (#FF4444)
- **Front Face:** Blue (#4488FF)
- **Outlines:** Dark Gray (#333)

### Stil:
- 3D isometrische Ansicht des Rubik's Cube
- Drei sichtbare Seiten (Top, Right, Front)
- 3x3 Gitter-Linien auf jeder Seite
- App-Name: "Rainer's Cubes" unten

## Icon-Änderungen

### SVG bearbeiten:
```bash
# 1. Bearbeite das SVG:
open assets/icon-source.svg  # oder mit einem SVG-Editor

# 2. Regeneriere PNGs:
cd assets
rsvg-convert -w 1024 -h 1024 icon-source.svg -o icon.png
rsvg-convert -w 1024 -h 1024 icon-source.svg -o adaptive-icon.png
rsvg-convert -w 1242 -h 2436 icon-source.svg -o splash.png

# 3. Regeneriere Android Icons:
cd ..
npx expo prebuild --platform android --clean

# 4. Rebuild App:
cd android
./gradlew clean assembleRelease
```

### Schnell-Änderung nur für Android:
```bash
# Wenn nur Android-Icons aktualisiert werden sollen:
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

## Icon-Größen-Referenz

### Android:
- **mdpi:** 48x48 (baseline)
- **hdpi:** 72x72 (1.5x)
- **xhdpi:** 96x96 (2x)
- **xxhdpi:** 144x144 (3x)
- **xxxhdpi:** 192x192 (4x)

### iOS:
- **App Store:** 1024x1024
- **iPhone:** 180x180, 120x120, 87x87, 80x80, 60x60, 58x58, 40x40, 29x29
- **iPad:** 167x167, 152x152, 76x76

### Expo Assets:
- **icon.png:** 1024x1024 (Master)
- **adaptive-icon.png:** 1024x1024 (Android foreground)
- **splash.png:** 1242x2436 (Splash screen)

## Verwendete Tools

- **rsvg-convert** - SVG zu PNG Konvertierung
- **expo prebuild** - Automatische Icon-Generierung für native Plattformen

## Status

✅ SVG-Source erstellt
✅ PNG-Icons generiert (icon, adaptive-icon, splash)
✅ Android Icons generiert (alle Größen)
✅ Altes generisches icon.jpg entfernt
✅ app.json konfiguriert

## Nächste Schritte für iOS

Falls iOS Icons benötigt werden:
```bash
npx expo prebuild --platform ios --clean
```

---

**Erstellt:** 9. Februar 2026
**Icon Design:** Rubik's Cube 3D View
**Farb-Schema:** Passt zur App (Light Steel Blue Background)
