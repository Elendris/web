# Elendris — Validační checklist přepisu HTML/CSS/JS

Checklist ověřuje, že všechny funkce a požadavky jsou správně implementovány podle dokumentace.
Každou položku označit: ✅ hotovo | ❌ chybí | ⚠️ částečně

---

## 1. Struktura souborů

- [ ] `public/index.html` existuje a obsahuje redirect na `/cs/`
- [ ] `public/cs/index.html` existuje a je validní HTML5
- [ ] `public/en/index.html` existuje a je validní HTML5
- [ ] `public/byt/index.html` existuje a je validní HTML5
- [ ] `public/css/style.css` existuje
- [ ] `public/js/navigation.js` existuje
- [ ] `public/js/rooms.js` existuje
- [ ] `public/js/reservation.js` existuje
- [ ] `public/js/map.js` existuje
- [ ] `public/js/flat-contact.js` existuje
- [ ] `public/robots.txt` existuje
- [ ] `public/sitemap.xml` aktualizováno (obsahuje /cs/, /en/, /byt/)
- [ ] `.github/workflows/static.yml` aktualizováno (bez Astro build kroků)
- [ ] Git větev `astro-archive` vytvořena ✅

---

## 2. HTML validita a struktura

### Všechny HTML stránky
- [ ] `<!DOCTYPE html>` na prvním řádku
- [ ] `<html lang="cs">` resp. `<html lang="en">` správně nastaven
- [ ] `<meta charset="UTF-8">` přítomen
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1.0">` přítomen
- [ ] Skip link `<a href="#main" class="skip-link">` je první element v `<body>`
- [ ] SVG sprite vložen hned po skip linku, `aria-hidden="true"`, `display:none`
- [ ] Správné pořadí nadpisů (h1 → h2 → h3, žádné přeskočení)
- [ ] Pouze jeden `<h1>` na stránku
- [ ] `<main id="main">` přítomen
- [ ] `<nav aria-label="...">` přítomen

---

## 3. SEO

### cs/index.html
- [ ] `<title>Elendris - Ubytování u kostela</title>`
- [ ] `<meta name="description" content="Ideální volba jak pro pracovní pobyty, tak pro rodinné výlety">`
- [ ] `<meta name="keywords">` přítomen
- [ ] `<link rel="canonical" href="https://elendris.cz/cs/">`
- [ ] `<link rel="alternate" hreflang="cs" href="https://elendris.cz/cs/">`
- [ ] `<link rel="alternate" hreflang="en" href="https://elendris.cz/en/">`
- [ ] `<link rel="alternate" hreflang="x-default" href="https://elendris.cz/cs/">`
- [ ] Open Graph tagy přítomny (`og:title`, `og:description`, `og:url`, `og:type`)
- [ ] Schema.org JSON-LD blok `BedAndBreakfast` přítomen
- [ ] JSON-LD obsahuje: name, description, url, telephone, email, address, geo, priceRange

### en/index.html
- [ ] `<title>` v angličtině
- [ ] `<meta name="description">` v angličtině
- [ ] `hreflang` atributy správně přepnuty
- [ ] JSON-LD v angličtině (nebo bilingvní)

### byt/index.html
- [ ] `<title>Pronájem vybaveného bytu Brno-Slatina | Krátkodobý pronájem</title>`
- [ ] `<meta name="description">` přítomen
- [ ] Schema.org JSON-LD pro byt (`Apartment` nebo `Accommodation`)

---

## 4. Přístupnost (WCAG 2.1 AA)

### Navigace
- [ ] Skip link funguje — fokus skočí na `#main` po aktivaci
- [ ] Skip link viditelný při focus (vizuálně)
- [ ] `<nav>` má `aria-label`
- [ ] Burger tlačítko má `aria-expanded` (hodnota se mění na `true`/`false`)
- [ ] Burger tlačítko má `aria-controls="mainMenu"`
- [ ] `<ul class="menu">` má `id="mainMenu"`
- [ ] Lang switch tlačítko má `aria-expanded` a `aria-haspopup`
- [ ] Všechny navigační prvky dosažitelné klávesnicí (Tab)
- [ ] Escape zavírá burger menu i lang switch popover

### Dialogy (room detail, rezervace, lightbox, success)
- [ ] `<dialog>` element použit (nativní)
- [ ] `aria-modal="true"` přítomen
- [ ] `aria-labelledby` odkazuje na nadpis dialogu
- [ ] Focus trap funguje — Tab cyklí jen v otevřeném dialogu
- [ ] Po zavření dialogu se focus vrátí na původní tlačítko
- [ ] Escape zavírá dialog
- [ ] Klik na backdrop (mimo obsah dialogu) zavírá dialog

### Lightbox
- [ ] `aria-label="Galerie"` na lightbox dialogu
- [ ] Prev/next tlačítka mají `aria-label`
- [ ] Zavřít tlačítko má `aria-label`
- [ ] Klávesnice: šipky ← → pro navigaci, Escape pro zavření
- [ ] Swipe gesta fungují na mobilních zařízeních

### Formuláře
- [ ] Každý `<input>`, `<select>`, `<textarea>` má `<label for="...">` nebo `aria-label`
- [ ] Povinná pole mají `required` atribut
- [ ] Honeypot pole má `aria-hidden="true"` a `tabindex="-1"`
- [ ] Chybové zprávy jsou čitelné screen readerem (`role="alert"` nebo `aria-live`)

### Obrázky
- [ ] Všechny `<img>` mají `alt` atribut
- [ ] Dekorativní obrázky mají `alt=""`
- [ ] SVG ikony mají `aria-hidden="true"`
- [ ] Obrázky v galerii mají popisné `alt` texty

### Barvy a kontrast
- [ ] Text na bílém pozadí: kontrast ≥ 4.5:1
- [ ] Text na barevném pozadí: kontrast ≥ 4.5:1
- [ ] Focus outline je viditelný (≥ 3px, kontrastní barva)

---

## 5. JavaScript funkčnost

### Navigace (`navigation.js`)
- [ ] Sticky nav: menu dostane `data-sticky="true"` při scrollu dolů (desktop ≥ 768px)
- [ ] Sticky nav: menu vrátí `data-sticky="false"` při scrollu zpět nahoru
- [ ] Burger menu: klik toggleuje `data-open` na `.menu` a `#menuBtn`
- [ ] Burger menu: klik na nav odkaz zavře menu
- [ ] Lang switch: klik toggleuje `data-open` na `.lang-switch__popover`
- [ ] Escape zavírá vše otevřené

### Room dialogy (`rooms.js`)
- [ ] Klik na `.card` otevře odpovídající `#dialog-{id}` přes `showModal()`
- [ ] Tlačítko `.detail__close` zavře dialog
- [ ] Escape zavře dialog
- [ ] Klik na backdrop zavře dialog
- [ ] Tlačítko `[data-reservation][data-room-id]` v dialogu: zavře room dialog, otevře rezervaci s předvyplněným pokojem

### Lightbox (`rooms.js`)
- [ ] Klik na `.gallery__item` otevře lightbox se správným obrázkem
- [ ] Lightbox zobrazuje správný obrázek (z galerie daného pokoje)
- [ ] Next/prev tlačítka přepínají obrázky
- [ ] Swipe doleva/doprava přepíná obrázky
- [ ] Klávesa → a ← naviguje
- [ ] Escape zavírá lightbox
- [ ] Klik mimo obrázek zavírá lightbox

### Rezervační formulář (`reservation.js`)
- [ ] Tlačítka `[data-reservation]` otevřou reservation dialog
- [ ] Pokud `data-room-id` přítomen, pokoj se předvyplní v selectu
- [ ] Tlačítko `#addRoom` přidá nový řádek pokoje
- [ ] Tlačítko `.btn--remove-room` odebere řádek pokoje
- [ ] `#reservationClose` a `#cancelBtn` zavřou dialog
- [ ] Klik na backdrop zavře dialog
- [ ] Honeypot: pokud `#reservation-website` vyplněno → přesměruje na `?reservated=true` bez odeslání
- [ ] Formulář odeslán přes `fetch` POST na `/send-email.php`
- [ ] Úspěch: redirect na `?reservated=true`
- [ ] `?reservated=true` v URL otevře `#successDialog` automaticky
- [ ] `#closeSuccessDialog` zavře success dialog

### Google Maps (`map.js`)
- [ ] Mapa se nenačte okamžitě — lazy přes IntersectionObserver
- [ ] Mapa se zobrazí při scrollu ke kontaktní sekci
- [ ] Zobrazí se všech 5 markerů
- [ ] Klik na marker otevře InfoWindow s obrázkem a názvem
- [ ] Markery s odkazem mají "Více informací" link
- [ ] Klik mimo mapu zavře InfoWindow
- [ ] Responsivní centrum mapy: různý zoom/center dle šířky okna
- [ ] Resize okna aktualizuje centrum mapy

### Flat contact form (`flat-contact.js`)
- [ ] Tlačítka `[data-flat-contact]` otevřou flat contact dialog
- [ ] Zavření: tlačítko, backdrop, Escape
- [ ] Honeypot funguje
- [ ] Formulář odeslán přes `fetch` POST na `/send-flat-email.php`
- [ ] Úspěšné odeslání zobrazí success message
- [ ] Chybné odeslání zobrazí error message
- [ ] Loading stav: tlačítka disabled při odesílání

---

## 6. CSS a responsivita

### Breakpointy (ověřit na všech)
- [ ] **320px** — velmi malý telefon: žádný overflow
- [ ] **375px** — iPhone SE: layout použitelný
- [ ] **560px** — breakpoint v CSS: ověřit změny
- [ ] **768px** — hamburger menu, stackovaný layout
- [ ] **1024px** — malý desktop
- [ ] **1366px** — laptop
- [ ] **1440px** — běžný desktop
- [ ] **1920px** — velký monitor

### Responsivní prvky
- [ ] Hamburger menu zobrazeno pod 768px
- [ ] Header: text/tlačítka přizpůsobena na mobile
- [ ] Room cards: grid → stack na mobile
- [ ] Room dialogy: plná výška na mobile
- [ ] Mapa: výška přizpůsobena viewportu
- [ ] Footer: stack na mobile

### Dotykové zařízení
- [ ] Tap cíle (touch targets) ≥ 44×44px
- [ ] Swipe gesta fungují v lightboxu
- [ ] Hover efekty neblokují funkčnost na touch (`@media (hover: hover)`)

### Animace a motion
- [ ] `@media (prefers-reduced-motion: reduce)` přítomen v CSS
- [ ] Animace potlačeny pro uživatele s preferencí reduced motion

### Fonty
- [ ] Použit `system-ui` stack — žádné externí font requests

---

## 7. Obsah (textový)

### cs/index.html
- [ ] Header: "Elendris" + "Ideální volba jak pro pracovní pobyty, tak pro rodinné výlety"
- [ ] About: kompletní text z `src/content/about/cs.md`
- [ ] About tiles: parkování, gril, káva, kuchyňka, MHD (trolejbus 31)
- [ ] FlatPromo sekce přítomna s odkazem na `/byt`
- [ ] Rooms: sekce text z `src/content/rooms/cs.md` (hlavní popis + 6 popisů pokojů)
- [ ] Rooms: všechny názvy pokojů česky
- [ ] Rooms: ceny správně (1200, 1600, 2100, 2500, 2500, 1600 Kč)
- [ ] Contact: adresa (Řípská 1162/20, Brno-Slatina, 627 00)
- [ ] Contact: tel. +420 731 177 318
- [ ] Contact: email info@elendris.cz
- [ ] Contact: Waze + Google Maps tlačítka s funkčními URL

### en/index.html
- [ ] Všechny texty přeloženy do angličtiny
- [ ] Rooms popisy z `src/content/rooms/en.md`
- [ ] About text z `src/content/about/en.md`

### byt/index.html
- [ ] Hero sekce s titulkem
- [ ] Specs (specifikace bytu)
- [ ] Popis bytu
- [ ] Galerie s "Zobrazit více" funkcí
- [ ] Sidebar s ceníkem
- [ ] Flat contact dialog přítomen

---

## 8. Backend integrace

- [ ] `send-email.php` dostupný na serveru na `/send-email.php`
- [ ] `send-flat-email.php` dostupný na serveru
- [ ] Testovací odeslání rezervace — email dorazí na info@elendris.cz
- [ ] Testovací odeslání flat kontaktu — email dorazí
- [ ] Honeypot test: vyplnit skryté pole → fake úspěch (bez odeslání)

---

## 9. Výkon

- [ ] Žádné JS knihovny z CDN (kromě Google Maps API)
- [ ] `defer` na všech `<script>` tazích
- [ ] Obrázky mají `loading="lazy"` (kromě hero/LCP obrázku)
- [ ] Hero obrázek má `fetchpriority="high"`
- [ ] `width` a `height` atributy na obrázcích (prevence CLS)
- [ ] Google Maps API načítán pouze lazy

---

## 10. HTML validátor

- [ ] `cs/index.html` projde bez chyb na validator.w3.org
- [ ] `en/index.html` projde bez chyb na validator.w3.org
- [ ] `byt/index.html` projde bez chyb na validator.w3.org
- [ ] `index.html` (redirect) projde bez chyb

---

## 11. Finální kontrola CI/CD

- [ ] Push na `main` spustí GitHub Actions workflow
- [ ] Workflow deployuje `public/` složku (ne `dist/`)
- [ ] Bez build kroků (`pnpm install`, `pnpm build` odstraněny)
- [ ] Všechny stránky dostupné: `/`, `/cs/`, `/en/`, `/byt/`
- [ ] `/` přesměruje na `/cs/`
- [ ] `https://` funguje (SSL)
- [ ] `robots.txt` dostupný
- [ ] `sitemap.xml` dostupný a obsahuje správné URL
