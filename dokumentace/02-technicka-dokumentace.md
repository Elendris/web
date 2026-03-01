# Elendris — Technická dokumentace přepisu z Astro na HTML/CSS/JS

Kompletní technická dokumentace přepisu webu Penzion Elendris z Astro frameworku na čisté HTML/CSS/JS se zachováním veškeré funkčnosti, přístupnosti, SEO a responsivity.

---

## 1. Přehled projektu

| Položka | Stávající | Cíl |
|---|---|---|
| Framework | Astro 5.x | Žádný (čisté HTML) |
| CSS preprocessing | SCSS → PostCSS | Čistý CSS (bez buildstep) |
| i18n | astro-i18next + i18next | Statické HTML soubory na jazyk |
| Galerie/lightbox | @fancyapps/ui (Fancybox) | Vanilla JS lightbox (~50 ř.) |
| Google Maps | @googlemaps/js-api-loader | Přímý `<script>` tag + lazy-load |
| Build toolchain | pnpm + Astro build | Není (přímý deploy) |
| CI/CD | GitHub Actions + Astro build | GitHub Actions → přímý deploy `public/` |
| Backend | PHP (`send-email.php`, `send-flat-email.php`) | Beze změn |

---

## 2. Struktura výstupních souborů

```
public/
├── index.html                      ← redirect → /cs/
├── cs/
│   └── index.html                  ← hlavní stránka (CZ)
├── en/
│   └── index.html                  ← hlavní stránka (EN)
├── byt/
│   └── index.html                  ← stránka pronájmu bytu
├── css/
│   └── style.css                   ← přepsaný CSS (bez SCSS/PostCSS)
├── js/
│   ├── navigation.js               ← sticky nav, burger menu, lang switch
│   ├── rooms.js                    ← room dialogy + lightbox galerie
│   ├── reservation.js              ← rezervační formulář, AJAX, honeypot
│   ├── map.js                      ← Google Maps lazy-load
│   └── flat-contact.js             ← modal formuláře na stránce /byt
├── images/                         ← beze změn (AVIF/WebP/SVG)
├── favicons/                       ← beze změn
├── send-email.php                  ← beze změn
├── send-flat-email.php             ← beze změn
├── sitemap.xml                     ← aktualizovat URL
├── robots.txt                      ← nový statický soubor
└── .htaccess                       ← beze změn
```

---

## 3. Data a obsah

### 3.1 Meta a SEO

#### Česká verze (`/cs/`)
```html
<title>Elendris - Ubytování u kostela</title>
<meta name="description" content="Ideální volba jak pro pracovní pobyty, tak pro rodinné výlety">
<meta name="keywords" content="ubytování Brno, hotel, pokoje, rezervace, rodinný, obchodní, cestování">
<link rel="canonical" href="https://elendris.cz/cs/">
<link rel="alternate" hreflang="cs" href="https://elendris.cz/cs/">
<link rel="alternate" hreflang="en" href="https://elendris.cz/en/">
<link rel="alternate" hreflang="x-default" href="https://elendris.cz/cs/">
```

#### Anglická verze (`/en/`)
```html
<title>Elendris - Accommodation near the church</title>
<meta name="description" content="The ideal choice for both business stays and family trips">
<meta name="keywords" content="accommodation Brno, hotel, rooms, reservation, family, business, travel">
```

#### Stránka bytu (`/byt/`)
```html
<title>Pronájem vybaveného bytu Brno-Slatina | Krátkodobý pronájem</title>
<meta name="description" content="Hledáte krátkodobé ubytování v Brně? Nabízíme moderní, plně vybavený byt 3+1 k pronájmu v Brně-Slatině. Ideální pro firmy, kolegy nebo rodiny na pracovní cestě. Minimální délka 4 noci.">
<meta name="keywords" content="krátkodobý pronájem bytu Brno, vybavený byt Brno Slatina, ubytování pro firmy Brno, pronájem bytu na měsíc, firemní ubytování, byt pro pracovníky Brno">
```

### 3.2 Schema.org JSON-LD (hlavní stránky)

```json
{
  "@context": "https://schema.org",
  "@type": "BedAndBreakfast",
  "name": "Elendris",
  "description": "Ideální volba jak pro pracovní pobyty, tak pro rodinné výlety",
  "url": "https://elendris.cz",
  "telephone": "+420731177318",
  "email": "info@elendris.cz",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Řípská 1162/20",
    "addressLocality": "Brno-Slatina",
    "postalCode": "627 00",
    "addressCountry": "CZ"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 49.17764,
    "longitude": 16.69207
  },
  "priceRange": "1200-2500 CZK/noc"
}
```

### 3.3 Data pokojů

| ID | CS název | EN název | Obrázků | Cena/noc | Vana |
|---|---|---|---|---|---|
| 1 | Jednolůžkový pokoj | Single Room | 3 | 1 200 Kč | Ne |
| 2 | Dvoulůžkový pokoj | Double Room | 2 | 1 600 Kč | Ne |
| 3 | Třílůžkový pokoj | Triple Room | 3 | 2 100 Kč | Ne |
| 4 | Rodinný pokoj | Family Room | 2 | 2 500 Kč | Ne |
| 5 | Rodinný pokoj s kuchyňským koutem | Family Room with Kitchenette | 2 | 2 500 Kč | Ne |
| 6 | Pokoj s vanou | Room with Bathtub | 3 | 1 600 Kč | **Ano** |

**Cesty k obrázkům:** `/images/rooms/room-{id}/room-{id}-{n}.avif`
(room-1: 3 obrázky, room-2: 2, room-3: 3, room-4: 2, room-5: 2, room-6: 3)

**Vybavení pokojů (všechny):** Wi-Fi, klimatizace, nápoj po příchodu, snídaně do pokoje
**Pouze pokoj 6 navíc:** Prostorná koupelna s vanou, základní hygienický set, fén

### 3.4 Google Maps

- **Map ID:** `1fe75d9e7f76ee36`
- **API Key:** `AIzaSyCxLnuRF4MRFg7MErCYXcdroyHYeLYUUfo`

**Markery:**

| Místo | Lat | Lng | Obrázek | Odkaz |
|---|---|---|---|---|
| Elendris | 49.17764 | 16.69207 | `/images/map/elendris.avif` | — |
| BRuNO family park | 49.1816 | 16.668712 | `/images/map/bruno.avif` | brunofamilypark.cz |
| Golf Austerlitz | 49.15901 | 16.86439 | `/images/map/austerlitz.avif` | agrt.cz |
| Historické centrum Brna | 49.194828 | 16.60857 | `/images/map/brno.avif` | gotobrno.cz |
| Moravský kras | 49.30782 | 16.69971 | `/images/map/moravskykras.avif` | moravskykras.net |

**Responsive středy mapy:**
- `≤ 1024px`: `{ lat: 49.60918, lng: 16.66541 }`, zoom 10
- `≤ 1366px`: `{ lat: 49.20818, lng: 16.46286 }`, zoom 11
- `≤ 1920px`: `{ lat: 49.20818, lng: 16.35286 }`, zoom 11
- `> 1920px`: `{ lat: 49.229709, lng: 16.54870 }`, zoom 12

---

## 4. Detailní implementace JS modulů

### 4.1 `js/navigation.js`

**Funkce:**
- Sticky navigace: `IntersectionObserver` sleduje `<nav>` — při scroll mimo viewport přidá `data-sticky="true"` na `.menu` (pouze ≥ 768px)
- Burger menu: `#menuBtn` toggleuje `data-open` na `.menu` a na tlačítku
- Zavření menu kliknutím na odkaz: všechny `.menu > li > a`
- Lang switch: `#langSwitchBtn` toggleuje `data-open` na `.lang-switch__popover`
- Klávesnice: `Escape` zavře burger menu i lang switch popover

**Klíčové atributy:**
```html
<nav>
<ul class="menu" data-sticky="false" data-open="false">
<button id="menuBtn" aria-expanded="false" aria-controls="mainMenu">
<button class="lang-switch__btn" aria-expanded="false">
<ul class="lang-switch__popover" data-open="false">
```

### 4.2 `js/rooms.js`

**Funkce:**
- Klik na `.card` → `dialog.showModal()` pro `#dialog-{id}`
- Tlačítko `.detail__close` → `dialog.close()`
- `dialog.cancel` event → `dialog.close()` (Escape)
- Klik na backdrop (mimo `::backdrop`) → `dialog.close()`
- **Lightbox (náhrada Fancybox):**
  - Klik na `.gallery__item` → otevře lightbox dialog se správným obrázkem
  - Prev/next tlačítka + šipky klávesnice + swipe gesta (TouchEvent API)
  - Zavření: Escape, klik na overlay, tlačítko ×
- Tlačítko `[data-reservation][data-room-id]` → zavře room dialog, otevře `.reservation`

**HTML struktura galerie (statická — bez Fancybox `data-*`):**
```html
<div class="gallery" data-room-id="1">
  <button class="gallery__item" data-img-index="0" aria-label="Zobrazit galerii">
    <img src="/images/rooms/room-1/room-1-1.avif" alt="Jednolůžkový pokoj" loading="lazy">
    <span class="gallery__item-btn" aria-hidden="true"><svg class="icon"><use href="#icon-gallery"></use></svg></span>
  </button>
  <div class="detail__hidden-pics" hidden>
    <img data-src="/images/rooms/room-1/room-1-2.avif" alt="Jednolůžkový pokoj">
    <img data-src="/images/rooms/room-1/room-1-3.avif" alt="Jednolůžkový pokoj">
  </div>
</div>
```

### 4.3 `js/reservation.js`

**Funkce:**
- Otevření: `[data-reservation]` → `.reservation` dialog; `data-room-id` předvyplní pokoj
- Zavření: `#reservationClose`, `#cancelBtn`, klik na backdrop
- `#addRoom` → dynamicky přidá řádek s `<select>` (pokoj) + `<input type="number">` (hosté)
- `.btn--remove-room` → odebere řádek pokoje
- Honeypot: `#reservation-website` — pokud vyplněno, fake úspěch bez odeslání
- Submit: `fetch` POST na `/send-email.php` s `FormData`
- Úspěch: redirect `?reservated=true` → otevře `#successDialog`
- Kontrola `?reservated=true` při DOMContentLoaded

**Selectbox možnosti pokojů (CS):**
```
1 → Jednolůžkový pokoj
2 → Dvoulůžkový pokoj
3 → Třílůžkový pokoj
4 → Rodinný pokoj
5 → Rodinný pokoj s kuchyňským koutem
6 → Pokoj s vanou
```

### 4.4 `js/map.js`

**Funkce:**
- `IntersectionObserver` sleduje `#map` — při vstupu do viewportu spustí lazy load
- Fallback: `scroll` event nebo 3s timeout
- Dynamicky vytvoří `<script>` tag s Google Maps API URL
- `initMap()`: inicializuje mapu, přidá markery, InfoWindow na klik, responsive středy

### 4.5 `js/flat-contact.js`

**Funkce:**
- `[data-flat-contact]` → `dialog.showModal()`
- Zavření: tlačítko, backdrop, Escape
- Honeypot: skryté pole `name="website"`
- Submit: `fetch` POST na `/send-flat-email.php`
- Stavy: loading (disable tlačítek), úspěch, chyba
- Focus trap v dialogu

---

## 5. CSS strategie

### Co zachovat ze stávajícího `style.css`:
- Všechny CSS custom properties — `--color-*`, `--shadow-*`, `--dialog_pad-*` atd.
- CSS Layers: `@layer base, components, modules, utilities`
- Všechna media queries: 560px, 768px, 1024px, 1366px, 1440px, 1920px
- Animace (keyframes: `showNav`, `showImg`, `animLargeImg`, `fadeIn`)
- Container queries
- Backdrop-filter styly

### Co přidat:
```css
/* Skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  background: #000;
  color: #fff;
  padding: .5rem 1rem;
  z-index: 9999;
}
.skip-link:focus { top: 0; }

/* Focus visible */
:focus-visible {
  outline: 3px solid #df8681;
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Fonty:** `system-ui, -apple-system, sans-serif` — žádné Google Fonts.

---

## 6. SVG Icon sprite

Inline SVG sprite vložen jako první element v `<body>` (`aria-hidden="true"`, `display:none`).

| ID | Použití |
|---|---|
| `map` | Kontaktní sekce — adresa |
| `waze` | Tlačítko Waze navigace |
| `lang` | Lang switch tlačítko |
| `chevron-down` | Lang switch rozbalovač |
| `close` | Zavřít dialogy |
| `gallery` | Tlačítko galerie v room dialogu |
| `wifi` | Vybavení pokoje |
| `clima` | Vybavení pokoje |
| `bath` | Vybavení pokoje (jen pokoj 6) |
| `drink` | Vybavení pokoje |
| `food` | Vybavení pokoje |
| `parking` | About sekce — tile |
| `grill` | About sekce — tile |
| `coffee` | About sekce — tile |
| `kitchen` | About sekce — tile |
| `bus` | About sekce — tile |
| `phone` | Dock tlačítko |
| `plus` | Přidat pokoj v rezervaci |
| `minus` | Odebrat pokoj v rezervaci |
| `arrow-right` | Odkaz tlačítka |
| `external-link` | Odkaz v map info window |

Použití v HTML:
```html
<svg class="icon" aria-hidden="true"><use href="#icon-wifi"></use></svg>
```

---

## 7. Kostra HTML stránky (`cs/index.html`)

```
<html lang="cs">
  <head>
    meta charset, viewport, title, description, keywords
    canonical, hreflang (cs, en, x-default)
    Open Graph tagy
    Schema.org JSON-LD (BedAndBreakfast)
    <link rel="stylesheet" href="/css/style.css">
    favicons
  </head>
  <body>
    skip link → #main
    SVG sprite (inline, display:none)
    <nav aria-label="Hlavní navigace">
      logo, burger btn (#menuBtn), <ul id="mainMenu">, lang-switch, dock phone link
    </nav>
    <header>
      h1, perex, tlačítka (Rezervovat, Více informací)
    </header>
    <main id="main">
      <section id="about" aria-labelledby="about-title">
      <section id="flat-promo" aria-labelledby="flat-promo-title">
      <section id="rooms" aria-labelledby="rooms-title">
        6× <button class="card" id="card-{n}" aria-haspopup="dialog">
      </section>
      <section id="contact" aria-labelledby="contact-title">
        <address>, Waze/GMaps links, <div id="map">
      </section>
    </main>
    <footer>copyright, autor</footer>
    6× <dialog class="detail" id="dialog-{n}" aria-modal="true">
    <dialog class="reservation" aria-modal="true">
    <dialog id="successDialog" aria-modal="true">
    <dialog id="lightbox" aria-modal="true">
    <script src="/js/navigation.js" defer>
    <script src="/js/rooms.js" defer>
    <script src="/js/reservation.js" defer>
    <script src="/js/map.js" defer>
  </body>
</html>
```

---

## 8. GitHub Actions — nový workflow

Nahradit `.github/workflows/static.yml`:

```yaml
name: Deploy static content to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'public'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```

---

## 9. Archivace Astro zdrojáků

Větev `astro-archive` vytvořena a pushnutá ✅

Po ověření funkčnosti smazat z `main`:
- `src/`
- `astro.config.mjs`
- `package.json`
- `pnpm-lock.yaml`
- `postcss.config.cjs`
- `tsconfig.json`

---

## 10. Pořadí implementace

1. ✅ Dokumentace — `dokumentace/` složka vytvořena
2. CSS — přepsat `public/css/style.css` (zachovat + přidat a11y)
3. `cs/index.html` — hlavní česká stránka (kompletní)
4. `en/index.html` — anglická verze
5. `js/navigation.js`
6. `js/rooms.js` + lightbox
7. `js/reservation.js`
8. `js/map.js`
9. `byt/index.html`
10. `js/flat-contact.js`
11. `index.html` — redirect
12. `robots.txt` + `sitemap.xml`
13. GitHub Actions — update workflow
14. Cleanup — smazat Astro toolchain z `main`
