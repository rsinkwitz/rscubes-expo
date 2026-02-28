# WICHTIG: Bundle-Update funktioniert nicht automatisch!

## Problem:
Das neue Bundle mit HDR-Code wird nicht geladen. Die App verwendet das alte Bundle.

## Lösung - MANUELLE Schritte:

### 1. Öffnen Sie ein Terminal und führen Sie aus:

```bash
cd /Users/sra/Documents/p/tech/mobile/rscubes-expo/webapp-source
rm -rf dist
npm run build
```

**Warten Sie, bis "compiled successfully" erscheint!**

### 2. Prüfen Sie ob das Bundle erstellt wurde:

```bash
ls -lh dist/renderer.bundle.js
```

Sie sollten eine Datei mit ca. 3MB sehen.

### 3. Kopieren Sie die Dateien:

```bash
cd /Users/sra/Documents/p/tech/mobile/rscubes-expo
cp webapp-source/dist/renderer.bundle.js assets/webapp/renderer.bundle.js
cp assets/webapp/renderer.bundle.js assets/webapp/renderer.bundle.js.txt
cp assets/webapp/renderer.bundle.js public/renderer.bundle.js
```

### 4. Prüfen Sie ob der neue Code drin ist:

```bash
grep "HDR: Starting" assets/webapp/renderer.bundle.js
```

Wenn das einen Treffer zeigt: ✅ **Erfolg!**

### 5. Expo neu starten MIT Cache-Clear:

```bash
# Terminal wo Expo läuft: Ctrl+C (stoppen)
# Dann:
npx expo start -c
```

Das `-c` löscht den Cache!

### 6. Android App neu laden:

- Drücken Sie `R` im Expo Terminal
- Oder schließen und öffnen Sie die App neu

### 7. Logs prüfen:

Sie sollten JETZT sehen:
```
LOG  📱 WebView: HDR: Starting HDR texture load...
LOG  📱 WebView: HDR: Base URL: ...
LOG  📱 WebView: HDR: Full texture path: ...
```

---

## Warum funktioniert das automatische Deployment nicht?

- Terminal-Ausgaben werden nicht angezeigt
- Bash-Skripte funktionieren nicht korrekt
- Metro Bundler cached aggressiv

**Deshalb: Bitte führen Sie die Schritte MANUELL aus!**

---

## Checklist:

- [ ] `npm run build` ausgeführt und "compiled successfully" gesehen
- [ ] Bundle-Datei existiert in `dist/`
- [ ] Dateien nach `assets/webapp/` kopiert
- [ ] `grep "HDR: Starting"` zeigt Treffer
- [ ] Expo mit `-c` neu gestartet
- [ ] Android App neu geladen
- [ ] HDR-Logs beim Start sichtbar

**Wenn Sie alle Schritte ausgeführt haben und IMMER NOCH keine HDR-Logs sehen, gibt es ein anderes Problem!**
