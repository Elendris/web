# Elendris — Validační checklist přepisu HTML/CSS/JS a AI integrace

Checklist ověřuje, že všechny funkce, požadavky a bezpečnostní opatření jsou správně implementovány.
Každou položku označit: ✅ hotovo | ❌ chybí | ⚠️ částečně

---

## 1. Struktura souborů a konfigurace

- [x] `public/index.html` existuje a obsahuje čisté přesměrování na `/cs/` ✅
- [x] `public/cs/index.html` existuje a je validní HTML5 ✅
- [x] `public/en/index.html` existuje a je validní HTML5 ✅
- [x] `public/byt/index.html` existuje a je validní HTML5 ✅
- [x] `public/css/style.css` existuje a obsahuje kompletní styly ✅
- [x] `public/js/navigation.js` existuje ✅
- [x] `public/js/rooms.js` existuje ✅
- [x] `public/js/reservation.js` existuje (včetně AI deep linkingu) ✅
- [x] `public/js/map.js` existuje ✅
- [x] `public/js/flat-contact.js` existuje ✅
- [x] `public/robots.txt` existuje (včetně podpory AI botů) ✅
- [x] `public/sitemap.xml` aktualizováno (obsahuje /cs/, /en/, /byt/) ✅
- [x] `public/llms.txt` a `public/llms-full.txt` vytvořeno pro AI agenty ✅
- [x] `public/openapi.yaml` a `public/.well-known/ai-plugin.json` vytvořeno pro AI / Chatboty ✅
- [x] `.github/workflows/static.yml` aktualizováno (přímý deploy `public/` bez Astro buildu) ✅
- [x] Git větev `astro-archive` vytvořena ✅

---

## 2. HTML validita a struktura

### Všechny HTML stránky
- [x] `<!DOCTYPE html>` na prvním řádku ✅
- [x] `<html lang="cs">` resp. `<html lang="en">` správně nastaven ✅
- [x] `<meta charset="UTF-8">` přítomen ✅
- [x] `<meta name="viewport" content="width=device-width, initial-scale=1.0">` přítomen ✅
- [x] Skip link `<a href="#main" class="skip-link">` je první element v `<body>` ✅
- [x] SVG sprite vložen v `icons.svg` s `<use>` ✅
- [x] Správné pořadí nadpisů (h1 → h2 → h3, žádné přeskočení) ✅
- [x] Pouze jeden `<h1>` na stránku ✅
- [x] `<main id="main">` přítomen ✅
- [x] `<nav aria-label="...">` přítomen ✅

---

## 3. SEO & Schema.org strukturovaná data

### cs/index.html
- [x] `<title>Elendris - Ubytování u kostela</title>` ✅
- [x] `<meta name="description">` přítomen ✅
- [x] `<meta name="keywords">` přítomen ✅
- [x] `<link rel="canonical" href="https://elendris.cz/cs/">` ✅
- [x] `<link rel="alternate" hreflang="cs" href="https://elendris.cz/cs/">` ✅
- [x] `<link rel="alternate" hreflang="en" href="https://elendris.cz/en/">` ✅
- [x] `<link rel="alternate" hreflang="x-default" href="https://elendris.cz/cs/">` ✅
- [x] Open Graph tagy přítomny (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`, `og:locale`) ✅
- [x] Schema.org JSON-LD blok `BedAndBreakfast` s detailní definicí pokojů `HotelRoom` (1–6), cenami, vybaveností a `ReserveAction` ✅

### en/index.html
- [x] `<title>` v angličtině ✅
- [x] `<meta name="description">` v angličtině ✅
- [x] `hreflang` atributy správně nastaveny ✅
- [x] Schema.org JSON-LD kompletně v angličtině včetně pokojů a `ReserveAction` ✅

### byt/index.html
- [x] `<title>Pronájem vybaveného bytu Brno-Slatina | Krátkodobý pronájem</title>` ✅
- [x] `<meta name="description">` přítomen ✅
- [x] Schema.org JSON-LD pro `Apartment` (kapacita, pokoje, plocha 80 m², vybavení) ✅

---

## 4. Přístupnost (WCAG 2.1 AA)

### Navigace
- [x] Skip link funguje — fokus skočí na `#main` po aktivaci ✅
- [x] `<nav>` má `aria-label` ✅
- [x] Burger tlačítko má `aria-expanded` a `aria-controls="mainMenu"` ✅
- [x] `<ul class="menu">` má `id="mainMenu"` ✅
- [x] Lang switch tlačítko má `aria-expanded` a `aria-haspopup` ✅
- [x] Escape zavírá burger menu i lang switch popover ✅

### Dialogy (room detail, rezervace, lightbox, success)
- [x] `<dialog>` nativní element použit ✅
- [x] `aria-modal="true"` přítomen ✅
- [x] Escape zavírá dialog ✅
- [x] Klik na backdrop zavírá dialog ✅

### Formuláře & Obrázky
- [x] Všechna formulářová pole mají přiřazené labely nebo `aria-label` ✅
- [x] Honeypot pole mají `aria-hidden="true"` a `tabindex="-1"` ✅
- [x] Všechny `<img>` mají smysluplné `alt` atributy ✅
- [x] SVG ikony mají `aria-hidden="true"` ✅

---

## 5. Zabezpečení proti spamu a falešným rezervacím (Anti-Spam)

- [x] **No-URL Policy**: Striktní zákaz webových odkazů (`http://`, `https://`, `www.`, `[url]`, `<a href>`) v polích poznámek a jmen ✅
- [x] **Reklamní filtr**: Blokace klíčových slov (kasina, crypto, backlinks, SEO, essay, adult, loans, @telegram) ✅
- [x] **Skriptový filtr**: Blokace azbuky / cyrilice a HTML tagů ✅
- [x] **Time-Trap (časová past)**: Odeslání pod 3 sekundy je detekováno jako bot ✅
- [x] **Honeypot**: Skryté pole zachytávající hloupé roboty ✅
- [x] **IP Rate Limiting**: Max 5 odeslání za 10 minut z 1 IP adresy ✅
- [x] **Validace MX záznamů**: Kontrola existence e-mailové domény přes DNS ✅
- [x] **Validace termínů**: Kontrola, že `from >= dnes`, `to > from` a délka pobytu <= 60 dní ✅
- [x] **Silent Drop (Tichá likvidace)**: Spam vrací falešné 200 OK bez odeslání e-mailu majiteli penzionu ✅

---

## 6. AI, GEO & Chatbot Integrace

- [x] **Standard `llms.txt`**: Stručný a přesný profil pro LLM v rootu `/llms.txt` ✅
- [x] **Rozšířený `llms-full.txt`**: Kompletní profil, ceník pokojů, pravidla a API instrukce v `/llms-full.txt` ✅
- [x] **OpenAPI specifikace**: `openapi.yaml` pro OpenAI/Claude/LangChain integraci ✅
- [x] **AI Plugin manifest**: `.well-known/ai-plugin.json` ✅
- [x] **AI Deep-Linking**: Automatické předvyplnění formuláře z URL (např. `?from=2026-09-01&to=2026-09-05&room=2&guests=2#reservation`) ✅
- [x] **REST JSON API**: Podpora `application/json` a CORS v `send-email.php` i `send-flat-email.php` ✅
- [x] **Robots.txt AI Crawlers**: Explicitní povolení pro GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended atd. ✅
