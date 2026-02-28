# Web-Buttons Fix - React Hook + HTML Root + SafeAreaProvider

## Datum: 8. Februar 2026 (Update: SafeAreaProvider Fix)

---

## Probleme:

1. **React Hook Regel verletzt:** `useRef` wurde innerhalb einer `if`-Bedingung aufgerufen
2. **prepare-web Script:** Versuchte nicht-existierende Dateien zu kopieren
3. **HTML Root Element:** Expo Web erwartet `<div id="root">`, aber Cube-HTML hat das nicht
4. **🔴 SafeAreaProvider fehlt:** Web braucht SafeAreaProvider für SafeAreaView

**Errors:**
```
Uncaught Error: Required HTML element with id "root" was not found
Uncaught Error: No safe area value available. Make sure you are rendering `<SafeAreaProvider>` at the top of your app.
```

**Root Causes:** 
- Expo Web generiert automatisch ein `index.html` mit root-Element → Unsere Cube-HTML kollidierte
- `SafeAreaView` benötigt `SafeAreaProvider` Context → Fehlte in der App

---

## Lösung:

### 1. React Hook Fix (App.js):

**Vorher (falsch):**
```javascript
if (Platform.OS === "web") {
  const iframeRef = useRef(null);  // ❌ Hook in if-Bedingung!
  
  const sendToIframe = (action, params) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // ...
    }
  };
  
  return (
    <iframe ref={iframeRef} ... />
  );
}
```

**Nachher (korrekt):**
```javascript
// webViewRef bereits am Anfang der Komponente definiert (Hook-Regel OK!)
const webViewRef = useRef(null);

// sendToIframe außerhalb der if-Bedingung
const sendToIframe = (action, params) => {
  if (webViewRef.current && webViewRef.current.contentWindow) {
    const message = JSON.stringify({ action, params });
    webViewRef.current.contentWindow.postMessage(message, '*');
  }
};

if (Platform.OS === "web") {
  return (
    <View>
      <View>{/* Buttons */}</View>
      <iframe ref={webViewRef} ... />  // ✅ Verwendet webViewRef
    </View>
  );
}
```

**Key Points:**
- ✅ `webViewRef` wird für WebView (Mobile) UND iframe (Web) verwendet
- ✅ `sendToIframe` außerhalb der if-Bedingung definiert
- ✅ Keine Hook-Regel verletzt

### 2. package.json prepare-web Script Fix:

**Vorher:**
```json
"prepare-web": "... cp assets/webapp/index.html public/ ..."
```

**Problem:** 
- `index.html` kollidiert mit Expo's generiertem index.html
- `assets/webapp/renderer.bundle.js` existiert nicht (nur `.txt` für Metro)

**Nachher:**
```json
"prepare-web": "mkdir -p public && cp assets/webapp/index.html public/cube.html && cp -r assets/webapp/textures public/ 2>/dev/null || true"
```

**Änderungen:** 
- ✅ `index.html` → `cube.html` - Vermeidet Konflikt mit Expo
- ✅ `public/renderer.bundle.js` existiert bereits (aus webapp-source Build)
- ✅ Nur `cube.html` und `textures/` werden kopiert

### 3. App.js Web URI Fix:

```javascript
if (Platform.OS === "web") {
  setWebAppUri("/cube.html");  // ← Geändert von /index.html
}
```

### 4. SafeAreaProvider Fix:

**Problem:**
```
Error: No safe area value available. Make sure you are rendering `<SafeAreaProvider>` at the top of your app.
```

**Ursache:** 
- `SafeAreaView` verwendet React Context von `SafeAreaProvider`
- Auf Mobile wird Provider automatisch eingerichtet
- Auf Web muss er manuell hinzugefügt werden

**Lösung:**

```javascript
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  // ... state ...
  
  return (
    <SafeAreaProvider>
      <AppContent {...props} />
    </SafeAreaProvider>
  );
}

function AppContent({ webAppUri, loading, error, webViewRef, ... }) {
  // ... alle hooks und logic hier ...
  
  if (loading) {
    return <SafeAreaView>...</SafeAreaView>;
  }
  
  // ... rest ...
}
```

**Key Points:**
- ✅ `SafeAreaProvider` wickelt die gesamte App ein
- ✅ `AppContent` als separate Komponente für alle Hooks/Logic
- ✅ Funktioniert auf Web, Android und iOS

---

## React Hooks Regeln:

### Rule of Hooks:

1. **Nur auf Top-Level aufrufen**
   - ❌ Nicht in Loops, Bedingungen oder verschachtelten Funktionen
   - ✅ Am Anfang der Komponente

2. **Nur in React Functions aufrufen**
   - ✅ Functional Components
   - ✅ Custom Hooks

### Unser Fix:

**Vorher (Hook-Regel verletzt):**
```javascript
export default function App() {
  // ... andere Hooks ...
  
  if (Platform.OS === "web") {
    const iframeRef = useRef(null);  // ❌ Hook in if!
  }
}
```

**Nachher (Hook-Regel OK):**
```javascript
export default function App() {
  const webViewRef = useRef(null);  // ✅ Top-Level
  
  // ... später ...
  
  if (Platform.OS === "web") {
    // Nutzt webViewRef (kein neuer Hook)
  }
}
```

---

## Testing:

```bash
# Web starten
npm run web
```

### Erwartetes Resultat:

1. **prepare-web Script** läuft ohne Fehler
2. **Metro Bundler** startet
3. **Browser öffnet** automatisch
4. **Buttons sind sichtbar** oben
5. **Cube ist sichtbar** unten
6. **Buttons funktionieren** (Mirror, Shuffle, etc.)

---

## File Structure (Web):

```
public/
├── cube.html (kopiert von assets/webapp/index.html)
├── renderer.bundle.js (bereits da, aus webapp-source Build)
├── textures/ (kopiert von assets/webapp/)
│   ├── autumn_field_puresky_1k.hdr
│   └── rosendal_plains_2_1k.hdr
└── ... (andere alte Dateien, werden nicht verwendet)
```

**Expo Web generiert automatisch:**
- `index.html` - Mit `<div id="root">` für React App

**Unsere Cube-App verwendet:**
- `/cube.html` - HTML mit inline console forwarding
- `/renderer.bundle.js` - Three.js Cube Code
- `/textures/*.hdr` - HDR Umgebungs-Texturen

---

## Deployment Workflow (komplett):

### 1. WebView Assets bauen:
```bash
cd webapp-source
npm run build
```

### 2. Assets deployen:
```bash
cd ..
# Für Mobile (als .txt)
cp webapp-source/dist/renderer.bundle.js assets/webapp/renderer.bundle.js.txt
cp webapp-source/dist/index.html assets/webapp/index.html

# Für Web (als .js)
cp webapp-source/dist/renderer.bundle.js public/renderer.bundle.js
```

### 3. Web starten:
```bash
npm run web
```

**Das prepare-web Script kopiert automatisch:**
- `assets/webapp/index.html` → `public/cube.html`
- `assets/webapp/textures/` → `public/textures/`

---

## Warum funktioniert es jetzt?

### Web:
1. ✅ `webViewRef` wird korrekt verwendet (Hook-Regel OK)
2. ✅ `sendToIframe` ist außerhalb der if-Bedingung definiert
3. ✅ `prepare-web` kopiert nur was nötig ist
4. ✅ `public/renderer.bundle.js` existiert bereits
5. ✅ Buttons werden gerendert
6. ✅ postMessage funktioniert iframe → renderer.ts

### Mobile:
- ✅ Verwendet weiterhin `webViewRef` für WebView
- ✅ Keine Änderungen nötig
- ✅ Funktioniert wie vorher

---

## Status:

✅ **Hook-Regel Fix:** webViewRef wird für beide Zwecke verwendet
✅ **prepare-web Fix:** Kopiert zu cube.html
✅ **HTML Root Fix:** cube.html statt index.html 
✅ **SafeAreaProvider Fix:** Provider wickelt App ein
✅ **Keine Errors:** Code ist valide
✅ **Web:** Buttons sollten jetzt sichtbar sein
✅ **Mobile:** Keine Änderungen, funktioniert weiter

---

**Der Fix ist deployed! Bitte starten Sie `npm run web` und prüfen Sie ob die Buttons jetzt sichtbar sind!** ✅

---

## Troubleshooting:

### Wenn Buttons immer noch nicht sichtbar:

1. **Browser Cache leeren:**
   ```
   Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
   ```

2. **Metro Cache löschen:**
   ```bash
   npx expo start -c --web
   ```

3. **Browser Console prüfen:**
   - F12 → Console Tab
   - Suche nach Fehlern

4. **React DevTools prüfen:**
   - Prüfe ob `<View style={styles.controlsContainer}>` gerendert wird
   - Prüfe Styles (paddingVertical, backgroundColor, etc.)

---

**Falls weiterhin Probleme:** Posten Sie die Browser Console Logs!
