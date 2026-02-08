# Button-Layout Anpassung - Web vs Mobile

## Datum: 8. Februar 2026 (Update: Reihenfolge geändert)

---

## Anforderung:

- **Web:** Alle Buttons in EINER Zeile
- **Mobile (Android/iOS):** Buttons in ZWEI Zeilen
- **Reihenfolge:** Shapes zuerst (3x3, 2x2, Pyra, Mirror), dann Actions (Undo, Redo, Shuffle)
- **Mobile Umbruch:** Nach Mirror (Button #4)

---

## Button-Reihenfolge:

1. **3x3** - Morph zu 3x3 Cube
2. **2x2** - Morph zu 2x2 Cube
3. **Pyra** - Morph zu Pyramorphix
4. **🪞 Mirror** - Toggle Mirror Cube
5. **↶ Undo** - Letzte Aktion rückgängig
6. **↷ Redo** - Aktion wiederherstellen
7. **🎲 Shuffle** - Würfel mischen

**Gruppierung:**
- **Shapes** (1-4): Würfelformen
- **Actions** (5-7): Aktionen

---

## Implementierung:

### Web - Eine Zeile (7 Buttons):

```javascript
<View style={styles.buttonRowSingle}>
  <TouchableOpacity>3x3</TouchableOpacity>
  <TouchableOpacity>2x2</TouchableOpacity>
  <TouchableOpacity>Pyra</TouchableOpacity>
  <TouchableOpacity>🪞 Mirror</TouchableOpacity>
  <TouchableOpacity>↶ Undo</TouchableOpacity>
  <TouchableOpacity>↷ Redo</TouchableOpacity>
  <TouchableOpacity>🎲 Shuffle</TouchableOpacity>
</View>
```

**Layout:**
```
┌───────────────────────────────────────────────────────────────┐
│ 3x3 │ 2x2 │ Pyra │ 🪞 Mirror │ ↶ Undo │ ↷ Redo │ 🎲 Shuffle │
└───────────────────────────────────────────────────────────────┘
```

### Mobile - Zwei Zeilen (4 + 3 Buttons):

```javascript
<View style={styles.controlsContainer}>
  {/* Zeile 1: Shapes */}
  <View style={styles.buttonRow}>
    <TouchableOpacity>3x3</TouchableOpacity>
    <TouchableOpacity>2x2</TouchableOpacity>
    <TouchableOpacity>Pyra</TouchableOpacity>
    <TouchableOpacity>🪞 Mirror</TouchableOpacity>
  </View>
  {/* Zeile 2: Actions */}
  <View style={styles.buttonRow}>
    <TouchableOpacity>↶ Undo</TouchableOpacity>
    <TouchableOpacity>↷ Redo</TouchableOpacity>
    <TouchableOpacity>🎲 Shuffle</TouchableOpacity>
  </View>
</View>
```

**Layout:**
```
┌──────────────────────────────┐
│ 3x3 │ 2x2 │ Pyra │ 🪞 Mirror │  Zeile 1: Shapes (4)
├──────────────────────────────┤
│ ↶ Undo │ ↷ Redo │ 🎲 Shuffle │  Zeile 2: Actions (3)
└──────────────────────────────┘
```

---

## Styles:

### buttonRow (Mobile):
```javascript
buttonRow: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 4,
}
```

**Verwendung:** Zwei separate Zeilen auf Mobile

### buttonRowSingle (Web):
```javascript
buttonRowSingle: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",      // ← Erlaubt Umbruch falls Platz nicht reicht
  marginVertical: 4,
}
```

**Verwendung:** Eine Zeile auf Web (mit flexWrap als Fallback)

---

## Begründung:

### Reihenfolge (Shapes → Actions):

**Warum zuerst Shapes?**
- ✅ **Häufigste Aktion:** Nutzer wechseln oft zwischen verschiedenen Würfelformen
- ✅ **Primäre Funktion:** Die App zeigt verschiedene Cube-Typen
- ✅ **Visuell prominenter:** Erste Buttons fallen zuerst auf
- ✅ **Logischer Flow:** Erst Form wählen, dann damit arbeiten

**Actions danach:**
- Undo/Redo/Shuffle sind sekundäre Aktionen
- Werden nach der Form-Auswahl benötigt
- Weniger häufig als Form-Wechsel

### Web (Desktop):
- ✅ **Mehr Platz horizontal** - Alle 7 Buttons passen in eine Zeile
- ✅ **Kompakter** - Weniger vertikaler Platz für Buttons
- ✅ **Mehr Platz für Cube** - iframe kann größer sein
- ✅ **Shapes zuerst sichtbar** - Links = wichtiger (Links-nach-Rechts-Leserichtung)

### Mobile (Phone/Tablet):
- ✅ **Logische Gruppierung:**
  - Zeile 1: **Shapes** (3x3, 2x2, Pyra, Mirror) - 4 Buttons
  - Zeile 2: **Actions** (Undo, Redo, Shuffle) - 3 Buttons
- ✅ **Bessere Bedienbarkeit** - Buttons sind größer und einfacher zu treffen
- ✅ **Shapes oben** - Wichtigste Funktion zuerst (Oben-nach-Unten-Hierarchie)

---

## Testing:

### Web:
```bash
npm run web
```

**Erwartung:**
- ✅ Alle 7 Buttons in einer Zeile
- ✅ Buttons horizontal zentriert
- ✅ Bei sehr schmalen Browsern: flexWrap ermöglicht Umbruch

### Android:
```bash
npm run android
```

**Erwartung:**
- ✅ Zeile 1: 3x3, 2x2, Pyra, Mirror (4 Buttons)
- ✅ Zeile 2: Undo, Redo, Shuffle (3 Buttons)

### iOS:
```bash
npm run ios
```

**Erwartung:**
- ✅ Zeile 1: 3x3, 2x2, Pyra, Mirror (4 Buttons)
- ✅ Zeile 2: Undo, Redo, Shuffle (3 Buttons)
- ✅ SafeArea-Insets berücksichtigt

---

## Responsive Verhalten:

### Web auf schmalen Bildschirmen:
- `flexWrap: "wrap"` ermöglicht automatischen Umbruch
- Buttons bleiben zentriert
- Funktioniert auf Tablets und kleinen Laptops

### Mobile in Landscape:
- Mehr horizontaler Platz verfügbar
- Buttons bleiben in 2 Zeilen (explizite Gruppierung)
- Bessere Bedienbarkeit als automatischer Umbruch

---

## Vorher / Nachher:

### Vorher (alte Reihenfolge):

**Web + Mobile:**
```
Zeile 1: ↶ Undo │ ↷ Redo │ 🎲 Shuffle │ 3x3
Zeile 2: 2x2 │ Pyra │ 🪞 Mirror
```

### Nachher (neue Reihenfolge - Shapes zuerst):

**Web (eine Zeile):**
```
│ 3x3 │ 2x2 │ Pyra │ 🪞 Mirror │ ↶ Undo │ ↷ Redo │ 🎲 Shuffle │
```

**Mobile (zwei Zeilen):**
```
Zeile 1: 3x3 │ 2x2 │ Pyra │ 🪞 Mirror
Zeile 2: ↶ Undo │ ↷ Redo │ 🎲 Shuffle
```

---

## Zusammenfassung:

| Plattform | Zeilen | Buttons pro Zeile | Stil | Reihenfolge |
|-----------|--------|-------------------|------|-------------|
| **Web** | 1 | 7 | `buttonRowSingle` | Shapes → Actions |
| **Android** | 2 | 4 + 3 | `buttonRow` | Shapes oben, Actions unten |
| **iOS** | 2 | 4 + 3 | `buttonRow` | Shapes oben, Actions unten |

---

## Status:

✅ **Web:** Eine Zeile mit allen Buttons (Shapes → Actions)
✅ **Mobile:** Zwei Zeilen (Shapes oben, Actions unten)
✅ **Reihenfolge:** 3x3, 2x2, Pyra, Mirror, Undo, Redo, Shuffle
✅ **Styles:** buttonRowSingle für Web hinzugefügt
✅ **Responsive:** flexWrap als Fallback
✅ **Testing:** Bereit zum Testen auf allen Plattformen

---

**Button-Layouts sind jetzt plattform-spezifisch optimiert!** ✅
