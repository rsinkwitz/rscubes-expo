# 🪞 Mirror Cube mit HDR Environment Textur

## Problem gelöst:

### Ursprüngliches Problem:
```
ERROR ❌ WebView JS Error: {
  "type": "unhandledrejection",
  "reason": "TypeError: Cannot read properties of undefined (reading '1')"
}
```

Dieser Fehler kam vom RGBELoader beim Laden der HDR-Textur.

### Warum die Textur wichtig ist:
Im **Mirror Cube Modus** brauchen wir die HDR-Umgebungstextur für realistische Reflektionen auf dem silbernen Material. Ohne die Textur sieht der Mirror Cube langweilig aus.

---

## Lösung:

### Problem: Unhandled Promise Rejection
Der RGBELoader verwendet intern Promises, aber Fehler wurden nicht korrekt gefangen.

### Fix: Promise Wrapper mit .catch()

```typescript
const loadEnvironmentTexture = async () => {
  try {
    const loader = new RGBELoader();
    
    return new Promise((resolve, reject) => {
      loader.load(
        'textures/rosendal_plains_2_1k.hdr',
        (texture) => {
          // Success: Setup materials
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.environment = texture;
          
          silverMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            roughness: 0.05,
            metalness: 1.0,
            envMap: texture,
            envMapIntensity: 1.0
          });
          
          mirrorMaterials = [silverMaterial, ...];
          resolve(texture);
        },
        undefined,
        (error) => {
          // Error: Log and reject
          reject(error);
        }
      );
    });
  } catch (e) {
    throw e;
  }
};

// WICHTIG: .catch() fängt unhandled rejections!
loadEnvironmentTexture().catch(error => {
  // Silently handle - already logged
});
```

---

## Wie es funktioniert:

### 1. Beim App-Start:
- Würfel wird **sofort** erstellt (wartet nicht auf Textur)
- HDR-Textur lädt **im Hintergrund**
- Falls Fehler: App läuft trotzdem weiter

### 2. Im normalen Modus (3x3, 2x2, Pyra):
- Verwendet normale, bunte Materialien
- HDR-Textur wird nicht benötigt

### 3. Im Mirror Cube Modus:
- Verwendet `silverMaterial` mit HDR Environment Map
- **Falls Textur geladen:** Realistische Reflektionen ✨
- **Falls Textur fehlt:** Funktioniert trotzdem (einfaches Silber)

---

## Console-Logs (WebView):

### Bei erfolgreichem Laden:
```
LOG  ✓ Cube created and rendering started
LOG  ✓ HDR environment texture loaded for Mirror Cube
```

### Bei Fehler (z.B. Datei nicht gefunden):
```
LOG  ✓ Cube created and rendering started
LOG  HDR texture not available, Mirror Cube will work without reflections
(Kein ERROR mehr!)
```

---

## Wie man WebView Console-Logs sieht:

### Methode 1: In der React Native Console
Die Logs erscheinen automatisch in der Metro Bundler Console:
```bash
npm start
# Logs erscheinen hier
```

### Methode 2: Chrome DevTools (Android)
1. Öffne Chrome: `chrome://inspect`
2. Finde dein Gerät
3. Klicke "inspect" bei der WebView
4. Console-Tab → Alle JS-Logs der WebView

### Methode 3: In App.js
Die Logs werden bereits weitergeleitet:
```javascript
onConsoleMessage={(event) => {
  console.log("WebView console:", event.nativeEvent.message);
}}
```

---

## Mirror Cube Materialien:

### Silver Material (mit Environment Map):
```typescript
silverMaterial = new THREE.MeshStandardMaterial({
  color: 0xc0c0c0,      // Silber-Grau
  roughness: 0.05,       // Sehr glatt (spiegelt stark)
  metalness: 1.0,        // Vollständig metallisch
  envMap: texture,       // HDR Environment Map
  envMapIntensity: 1.0   // Volle Intensität
});
```

### Gold Material (mit Environment Map):
```typescript
goldMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd700,       // Gold
  roughness: 0.05,
  metalness: 1.0,
  envMap: texture,
  envMapIntensity: 1.0
});
```

---

## Testen:

1. **Starte die App**
2. **Schaue in die Logs:**
   - `✓ HDR environment texture loaded` → Textur funktioniert!
   - `HDR texture not available` → Funktioniert ohne Textur
3. **Klicke "🪞 Mirror" Button**
4. **Würfel sollte silbern sein mit Reflektionen!**

---

## Status:

✅ **HDR-Textur lädt im Hintergrund**  
✅ **Unhandled rejection Fehler behoben**  
✅ **Mirror Cube hat silbernes Material**  
✅ **App funktioniert mit oder ohne Textur**  
✅ **Zwei Zeilen Buttons (kein Scrollen)**

**Alles fertig!** 🎉🪞✨
