# Elendris.cz — Web penzionu (čisté HTML/CSS/JS)

Statický web pro Penzion Elendris v Brně-Slatině. Web je postaven na čistém **HTML5, CSS3 a Vanilla JavaScriptu** bez použití frameworků a bez npm závislostí.

---

## 📁 Struktura projektu

Veškerý kód webu je umístěn ve složce `public/`:

```text
public/
├── index.html            # Přesměrování na /cs/
├── cs/
│   └── index.html        # Hlavní stránka v češtině
├── en/
│   └── index.html        # Hlavní stránka v angličtině
├── byt/
│   └── index.html        # Stránka nabídky pronájmu bytu 3+1
├── css/
│   └── style.css         # Kompletní CSS styly webu
├── js/
│   ├── navigation.js     # Sticky navigace, burger menu, přepínač jazyků
│   ├── rooms.js          # Nativní dialogy pokojů a lightbox fotogalerie
│   ├── reservation.js    # Rezervační formulář, dynamické pokoje, honeypot
│   ├── map.js            # Google Maps s líným načítáním (IntersectionObserver)
│   └── flat-contact.js   # Poptávkový formulář na stránce bytu
├── images/               # Obrázky, ikony a SVG sprite (icons.svg)
├── favicons/             # Ikony pro záložky a mobilní zařízení
├── robots.txt            # Pravidla pro vyhledávače
├── sitemap.xml           # Mapa stránek
├── send-email.php        # Backend skript pro odesílání rezervací
├── send-flat-email.php   # Backend skript pro odesílání poptávek bytu
└── .htaccess             # Pravidla pro Apache server
```

---

## 🚀 Jak spustit projekt lokálně

Web nevyžaduje žádnou instalaci (`npm install`) ani build (`build`). Stačí spustit libovolný lokální statický HTTP server ve složce `public/`:

### Možnost A: Pomocí Pythonu
```bash
python -m http.server 3000 --directory public
```

### Možnost B: Pomocí Node.js (npx)
```bash
npx serve public
```

### Možnost C: VS Code rozšíření
Otevřete `public/index.html` nebo `public/cs/index.html` přes **Live Server**.

Web bude dostupný na `http://localhost:3000` (příp. `http://localhost:5500` u Live Serveru).

---

## 🚢 Nasazení na produkci (Deploy)

Nasazení probíhá automaticky přes **GitHub Actions** na **GitHub Pages** při pushnutí do větve `main`.
Konfigurace workflow je v souboru `.github/workflows/static.yml` a přímo publikuje obsah složky `public/`.

---

## 📚 Dokumentace k přepisu

V adresáři `dokumentace/` naleznete:
- `01-plan-prepisu.md` – Původní plán a rozpis kroků
- `02-technicka-dokumentace.md` – Technický popis všech komponent a modulů
- `03-validacni-checklist.md` – Validační checklist funkcí a přístupnosti
- `04-analyza-astro-vs-html.md` – Analýza a srovnání Astro vs. HTML