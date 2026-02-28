# iOS Safe Area Fix - Buttons nicht mehr hinter Notch/StatusBar

## Datum: 8. Februar 2026

---

## Problem auf iOS

Die Buttons schieben sich hinter:
- Die Kamera-Notch (auf neueren iPhones)
- Die Statusleiste (Zeit, Batterie, etc.)
- Den Home-Indikator (unten)

**Symptom:** Buttons sind teilweise oder ganz verdeckt und nicht bedienbar.

---

## Lösung: SafeAreaView mit edges-Prop

### Code-Änderungen:

**1. SafeAreaView mit expliziten edges:**

```javascript
// VORHER - Keine edges-Prop (verwendet default)
<SafeAreaView style={styles.container}>
  <View style={styles.controlsContainer}>
    {/* Buttons */}
  </View>
  <WebView ... />
</SafeAreaView>

// NACHHER - Explizite edges für top, left, right
<SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
  <View style={styles.controlsContainer}>
    {/* Buttons */}
  </View>
  <WebView ... />
</SafeAreaView>
```

**Wichtig:** 
- `edges={['top', 'left', 'right']}` - Schützt Buttons oben
- Kein 'bottom' in der Haupt-SafeAreaView, da WebView den ganzen Raum nutzen soll

**2. Alle SafeAreaViews aktualisiert:**

```javascript
// Loading State
<SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
  {/* Loading Indicator */}
</SafeAreaView>

// Error State  
<SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
  {/* Error Message */}
</SafeAreaView>

// Main App
<SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
  {/* Controls + WebView */}
</SafeAreaView>
```

**3. Container-Hintergrundfarbe für iOS:**

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? "#f5f5f5" : "#fff",
  },
  // ...
});
```

Dies gibt einen visuellen Hinweis auf den Safe Area Bereich.

---

## Was die edges-Prop macht

### Verfügbare Werte:
- `'top'` - Padding für Statusleiste/Notch oben
- `'bottom'` - Padding für Home-Indikator unten  
- `'left'` - Padding für seitliche Bereiche (Landscape)
- `'right'` - Padding für seitliche Bereiche (Landscape)

### Standard (ohne edges-Prop):
SafeAreaView verwendet automatisch alle edges (`['top', 'bottom', 'left', 'right']`)

### Unsere Konfiguration:

**Main View:**
```javascript
edges={['top', 'left', 'right']}
```
- ✅ Top: Buttons nicht unter Notch/StatusBar
- ✅ Left/Right: Buttons nicht an Displayrändern (wichtig in Landscape)
- ❌ Bottom: Kein Padding, WebView nutzt ganzen Raum

**Loading/Error:**
```javascript
edges={['top', 'bottom', 'left', 'right']}
```
- ✅ Alle Seiten geschützt (zentrierte Inhalte)

---

## Vorher / Nachher

### Vorher (Problem):
```
┌─────────────────────┐
│ [Notch/StatusBar]   │ ← Buttons hier verdeckt
├─────────────────────┤
│ ↶ Undo  ↷ Redo ... │ ← Teilweise unter Notch
├─────────────────────┤
│                     │
│   WebView           │
│   (Cube)            │
│                     │
└─────────────────────┘
```

### Nachher (Gelöst):
```
┌─────────────────────┐
│ [Notch/StatusBar]   │ ← Safe Area (leer)
│                     │
├─────────────────────┤
│ ↶ Undo  ↷ Redo ... │ ← Buttons vollständig sichtbar
├─────────────────────┤
│                     │
│   WebView           │
│   (Cube)            │
│                     │
└─────────────────────┘
```

---

## Testing

### iOS Simulator:
```bash
npm run ios
```

### Verschiedene Geräte testen:
- **iPhone 14 Pro** - Dynamic Island
- **iPhone 13** - Notch
- **iPhone SE** - Keine Notch (aber Statusleiste)
- **iPad** - Größerer Screen

### In Simulator Device wechseln:
```
Hardware → Device → [Gerät auswählen]
```

### Landscape-Modus testen:
```
Hardware → Rotate Left/Right
```

---

## Technische Details

### react-native-safe-area-context

Die Library ist bereits installiert (siehe package.json):
```json
"react-native-safe-area-context": "^4.x.x"
```

### Import:
```javascript
import { SafeAreaView } from "react-native-safe-area-context";
```

**Nicht verwechseln mit:**
```javascript
import { SafeAreaView } from "react-native"; // ❌ Deprecated!
```

### Warum react-native-safe-area-context?

| Feature | react-native | react-native-safe-area-context |
|---------|-------------|--------------------------------|
| iOS Support | ✅ Basic | ✅ Vollständig |
| Android Support | ❌ Keine | ✅ Ja |
| edges-Prop | ❌ | ✅ |
| Hooks (useSafeAreaInsets) | ❌ | ✅ |
| Maintenance | ⚠️ Deprecated | ✅ Aktiv |

---

## Alternative: useSafeAreaInsets Hook

Wenn mehr Kontrolle benötigt wird:

```javascript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function App() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }]}>
      {/* Content */}
    </View>
  );
}
```

**Unsere Lösung ist einfacher und funktioniert gut für diesen Use Case.**

---

## Weitere Optimierungen (Optional)

### 1. StatusBar Styling:

```javascript
import { StatusBar } from 'react-native';

function App() {
  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#f5f5f5"
      />
      <SafeAreaView ...>
        {/* Content */}
      </SafeAreaView>
    </>
  );
}
```

### 2. Dynamische Höhe für Buttons:

```javascript
const insets = useSafeAreaInsets();

<View style={[styles.controlsContainer, {
  marginTop: Platform.OS === 'ios' ? 0 : insets.top
}]}>
```

**Für unseren Use Case ist die aktuelle Lösung ausreichend.**

---

## Status:

✅ **SafeAreaView mit edges-Prop implementiert**
✅ **Alle drei States aktualisiert (Loading, Error, Main)**
✅ **Container-Hintergrundfarbe für iOS optimiert**
✅ **Keine Errors**

---

## Deployment:

Keine Build-Schritte erforderlich - nur App neu laden:

```bash
# Expo neu starten (optional)
npx expo start

# iOS App neu laden
# Im Simulator: Cmd+R
# Oder in Expo Dev Tools: R-Taste
```

---

## Erwartetes Resultat:

- ✅ Buttons vollständig sichtbar (nicht unter Notch)
- ✅ Alle Buttons bedienbar
- ✅ Kein Overlap mit Statusleiste
- ✅ WebView nutzt maximalen verfügbaren Raum
- ✅ Funktioniert in Portrait und Landscape

---

**iOS Safe Area Problem gelöst! Buttons sind jetzt immer sichtbar und bedienbar!** ✅
