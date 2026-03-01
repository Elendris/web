# Přepsání webu Elendris z Astro na čisté HTML/CSS/JS

Plán popisuje postup přepsání webu Penzion Elendris z frameworku Astro na statické HTML/CSS/JS soubory bez závislostí na npm ekosystému, se zachováním veškeré funkčnosti, přístupnosti (ARIA/a11y), SEO a responsivity.

---

## Analýza současného stavu

### Stránky
- `/` → redirect na `/cs/`
- `/cs/` – hlavní stránka (CS verze): navigace, header, about, flat-promo, rooms (6 pokojů + dialogy), contact (mapa), rezervační formulář, footer
- `/en/` – totožná struktura v angličtině
- `/byt` – podstránka pronájmu bytu: hero, specs, description, gallery, sidebar s formulářem

### Aktuálně používané JS knihovny (které je třeba nahradit nebo eliminovat)
| Knihovna | Účel | Náhrada |
|---|---|---|
| `@fancyapps/ui` (Fancybox) | Galerie/lightbox v pokojích | Nativní `<dialog>` + vanilla JS lightbox (~50 řádků) |
| `@googlemaps/js-api-loader` | Google Maps | Přímý `<script>` tag s lazy-load přes IntersectionObserver |
| `@astrojs/partytown` | Offload 3rd party scripts | Odpadne s Astrem |
| `astro-i18next` / `i18next` | Překlady | Statické HTML soubory pro každý jazyk |
| `sass` / `postcss` | CSS preprocessing | Čistý CSS s custom properties |
| `typescript` / Astro build chain | Celý build systém | Odpadne |

### Backend
- `send-email.php` a `send-flat-email.php` – **zachovat beze změn** (PHP funguje na serveru)

---

## Výstupní struktura souborů

```
public/                         ← root deployované složky
  index.html                    ← redirect na /cs/
  cs/
    index.html                  ← hlavní CS stránka
  en/
    index.html                  ← hlavní EN stránka
  byt/
    index.html                  ← stránka pronájmu bytu
  css/
    style.css                   ← přepsaný CSS (bez SCSS/PostCSS)
  js/
    navigation.js               ← sticky nav, burger menu, lang switch
    rooms.js                    ← room dialogy + lightbox galerie
    reservation.js              ← rezervační formulář, AJAX, honeypot
    map.js                      ← Google Maps lazy-load
    flat-contact.js             ← modal formuláře na stránce /byt
  images/                       ← beze změn (AVIF/WebP/SVG)
  favicons/                     ← beze změn
  send-email.php                ← beze změn
  send-flat-email.php           ← beze změn
  sitemap.xml                   ← aktualizovat URL
  robots.txt                    ← nový statický soubor
  .htaccess                     ← beze změn
```

**Složky/soubory ke smazání po ověření:**
```
src/                            ← archivováno do větve astro-archive
astro.config.mjs
package.json
pnpm-lock.yaml
postcss.config.cjs
tsconfig.json
convert-heic.js
convert-heic-simple.ps1
convert-images.ps1
```

---

## Kroky implementace

### 1. Dokumentace
- Plán, technická dokumentace, checklist, analýza → `dokumentace/`

### 2. CSS — `public/css/style.css`
- Přepsat výstupy ze SCSS do čistého CSS
- Zachovat všechny CSS custom properties (`--color-*`, `--shadow-*` atd.)
- Přidat CSS pro mobilní responsivitu a dotykové interakce
- Přidat `prefers-reduced-motion` media query
- Přidat skip link styly a focus visible
- Žádné externí fonty (system-ui stack)

### 3. SVG Icon sprite
- `IconSet.astro` zkopírovat jako inline SVG `<defs>` blok do každé HTML stránky

### 4. Hlavní stránky (`cs/index.html`, `en/index.html`)
- Plná HTML5 struktura s `lang` atributy
- **SEO**: `<title>`, meta description, canonical, `hreflang`, Open Graph
- **Schema.org**: JSON-LD `BedAndBreakfast`
- **Accessibility**: skip link, aria atributy, focus trap v dialozích, WCAG 2.1 AA
- **Sekce**: navigace, header, about, flat-promo, rooms (6×), contact, footer, dialogy

### 5. Stránka bytu (`byt/index.html`)
- Zachovat stávající CSS ze `byt.astro`
- Inline JS → externí `flat-contact.js`

### 6. JavaScript moduly
- **`navigation.js`**: sticky nav, burger menu, lang switch, Escape handling
- **`rooms.js`**: room dialogy + lightbox (náhrada Fancybox), swipe gesta
- **`reservation.js`**: dynamické pokoje, AJAX submit, honeypot
- **`map.js`**: Google Maps lazy-load přes IntersectionObserver
- **`flat-contact.js`**: modal formuláře bytu

### 7. Redirect, robots.txt, sitemap.xml
- `index.html` → meta refresh + JS fallback
- Statický `robots.txt`
- Aktualizace `sitemap.xml`

### 8. GitHub Actions — aktualizace workflow
- Odebrat Astro build kroky
- Přímý deploy `public/` složky

### 9. Archivace a cleanup
- Větev `astro-archive` vytvořena ✅
- Po ověření smazat `src/` a build toolchain z `main`

---

## Co se **nemění**
- PHP skripty (`send-email.php`, `send-flat-email.php`)
- Veškerá media (obrázky AVIF/WebP/PNG/SVG)
- `.htaccess`
- Favicons
- Google Maps API klíč a logika
- Obsah (texty, ceny, kontaktní údaje)
- Schema.org JSON-LD struktury

---

## Zjištěné informace

- **Google Maps API klíč**: `AIzaSyCxLnuRF4MRFg7MErCYXcdroyHYeLYUUfo` — z `src/components/map/Map.ts:154`
- **Map ID**: `1fe75d9e7f76ee36`
- **CI/CD**: GitHub Actions + Astro build → přepsat na přímý deploy `public/`
- **Git záloha**: větev `astro-archive` vytvořena a pushnutá ✅
