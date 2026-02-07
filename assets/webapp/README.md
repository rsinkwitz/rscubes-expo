# WebApp Assets

## So fügst du deine three.js Web-App hinzu:

1. Kopiere alle Dateien aus deinem `dist`-Ordner in diesen Ordner (`assets/webapp/`)
2. Stelle sicher, dass eine `index.html` Datei vorhanden ist
3. Alle referenzierten Assets (JS, CSS, Bilder, etc.) müssen relative Pfade verwenden

## Beispiel-Struktur:
```
assets/webapp/
├── index.html
├── main.js
├── styles.css
├── textures/
│   └── ...
└── models/
    └── ...
```

## Wichtig:
- Verwende relative Pfade in deiner index.html (z.B. `./main.js` statt `/main.js`)
- Die App lädt die index.html offline von diesem Ordner
- Funktioniert auf Web, iOS und Android
