# Elendris — Analýza: Astro vs. čisté HTML/CSS/JS

Odborná analýza výhod a nevýhod obou přístupů pro web Penzion Elendris s konkrétním doporučením.

---

## Kontext projektu

Web Penzion Elendris je **informačně-prezentační web malého rozsahu** s těmito charakteristikami:
- **4 statické stránky** (index redirect, cs/, en/, byt/)
- **Žádná dynamická data** — obsah se nemění v reálném čase
- **Backend** pouze pro odesílání e-mailů (PHP, 2 skripty)
- **Žádný admin panel, CMS ani databáze**
- **2 jazyky** — obsah statický, nepřidává se
- **Provoz** — GitHub Pages (statický hosting)
- **Aktualizace obsahu** — velmi vzácné (ceny, texty pokojů)

---

## Varianta A: Ponechat Astro framework

### Výhody

#### Vývojářský komfort
- **Komponentový model** — každá sekce jako `.astro` soubor, snadná údržba při větším týmu
- **TypeScript** nativně — typová bezpečnost
- **Content Collections** — strukturovaná správa obsahu v Markdown souborech
- **CSS scoping** — styly omezené na komponentu, žádné konflikty
- **HMR (Hot Module Replacement)** — rychlý vývoj s okamžitým preview

#### Funkčnost
- **Automatický build pipeline** — minifikace HTML/CSS/JS, tree-shaking
- **Integrovaný i18n** — `astro-i18next` řeší překlady centrálně
- **Image optimization** — Astro Image component (AVIF/WebP automaticky)
- **Sitemap plugin** — automatická generace
- **Snazší rozšiřitelnost** — přidat novou sekci = nový `.astro` soubor

#### Ekosystém
- Podpora React/Vue/Svelte komponent pokud by bylo potřeba
- Aktivní komunita, dokumentace

### Nevýhody

#### Bezpečnostní a údržbářský problém ← **klíčový problém**
- **~15 npm závislostí** — každá je potenciální bezpečnostní riziko
- **Pravidelné updaty** jsou nutné: `astro`, `@astrojs/*`, `i18next`, `@fancyapps/ui`, `@googlemaps/js-api-loader` atd.
- **Breaking changes** — Astro 4→5 vyžadoval přepis kódu; Astro 6 přinese další
- `npm audit` pravidelně hlásí zranitelnosti (GitHub hlásí **21 zranitelností** na repozitáři: 13 high, 5 moderate, 3 low)
- **Supply chain attack** — útok přes npm balíček

#### Provozní komplexita
- **Build krok je nutný** — nelze nasadit přímo, musí proběhnout `pnpm build`
- **Node.js runtime** nutný pro build (verze mismatch může build rozbít)
- **GitHub Actions** musí instalovat ~200 MB node_modules před každým deploym
- Pokud Astro vydá breaking change, deploy se **může rozbít v produkci**
- `pnpm-lock.yaml` je ~2000 řádků, konfliktní při merge

#### Výkon výstupu
- `@fancyapps/ui` přidává ~60 KB JS navíc do produkce
- `@googlemaps/js-api-loader` přidává ~15 KB navíc

---

## Varianta B: Přepis na čisté HTML/CSS/JS

### Výhody

#### Bezpečnost a nulová údržba ← **přímá odpověď na problém**
- **0 npm závislostí** — žádné CVE, žádné `npm audit`, žádné dependency updates
- **Žádný supply chain útok** — není co útočit
- **Žádné breaking changes** — HTML/CSS/JS standard je stabilní 30+ let
- Web bude **fungovat identicky za 10 let** bez jediného zásahu
- Žádný `package.json`, žádný `node_modules`

#### Jednoduchost nasazení
- **Push = deploy** — žádný build krok, GitHub Actions workflow = 15 řádků místo 67
- Nasazení trvá **sekund místo minut**
- Žádný Node.js runtime na CI serveru

#### Přístupnost a SEO
- HTML je přímo čitelné — **screen readery, chatboty, SEO crawlery** vidí zdrojový HTML bez interpretace
- Snazší audit přístupnosti — `validator.w3.org` přímo na souboru
- Chatboty (ChatGPT, Claude) umí číst čisté HTML lépe než framework výstup

#### Výkon
- Lightbox: ~50 řádků vanilla JS vs. ~60 KB Fancybox
- Google Maps: přímý `<script>` tag vs. ~15 KB loader wrapper
- Snížení JS payloadu o ~75 KB (~80 % úspora JS)

### Nevýhody

#### Jednorázová pracnost přepisu
- **Odhadovaný čas:** 12–20 hodin práce
- Nutno ručně duplikovat HTML pro CS a EN verzi

#### Budoucí rozšiřitelnost
- Přidat novou sekci = zkopírovat HTML blok do obou jazykových verzí
- Navigace a footer jsou v každém HTML souboru (duplicita)
- Nový jazyk (DE, PL) = nová kopie celé stránky

---

## Srovnávací tabulka

| Kritérium | Astro | Čisté HTML/JS | Váha |
|---|---|---|---|
| Bezpečnostní riziko | ⚠️ 21 CVE (13 high) | ✅ Nulové | **Vysoká** |
| Údržba (updaty) | ❌ Nutné pravidelně | ✅ Žádné | **Vysoká** |
| Stabilita v čase | ⚠️ Závisí na ekosystému | ✅ Excelentní | **Vysoká** |
| Jednoduchost deployu | ⚠️ Build krok nutný | ✅ Přímý deploy | **Střední** |
| Výkon výstupu | ✅ Dobrý | ✅ Vynikající (-75 KB JS) | **Střední** |
| SEO / přístupnost | ✅ Dobrá | ✅ Vynikající | **Střední** |
| Chatbot čitelnost | ✅ OK | ✅ Optimální | **Střední** |
| Rozšiřitelnost | ✅ Snadná | ⚠️ Manuální duplicita | **Nízká** |
| Jednorázová pracnost | ✅ Hotovo | ❌ 12–20 hod. | **Jednorázová** |

---

## Odborné doporučení

### **Doporučení: Přepsat na čisté HTML/CSS/JS** ✅

#### Zdůvodnění

Web Penzion Elendris je typickým příkladem webu, pro který je Astro **nadměrné řešení** (overengineering). Astro je silný nástroj pro blogy, dokumentaci nebo e-shopy s desítkami stránek a dynamickým obsahem. Pro **4 statické stránky s neměnným obsahem** přináší více nevýhod než výhod.

**Rozhodující argumenty pro přepis:**

1. **Bezpečnostní argument je legitimní a závažný.** GitHub sám upozorňuje na 21 zranitelností (13 high) v závislostech aktuálního repozitáře. Pro produkční web je to nepřijatelné.

2. **Údržbářský argument je ekonomicky opodstatněný.** Čas strávený updaty závislostí je reálný náklad, který přepis permanentně eliminuje.

3. **Výstup obou variant je identický.** Astro generuje statické HTML — prohlížeč dostane totožný výsledek. Přepis neovlivní uživatelský zážitek.

4. **Přepis je jednorázová investice.** 12–20 hodin práce = permanentně nulová údržba na léta dopředu.

5. **Nevýhoda duplicity HTML** je reálná, ale přijatelná. Obsah se mění vzácně.

#### Kdy by doporučení bylo opačné

Ponechat Astro by bylo správné, pokud by:
- Web měl > 20 stránek nebo plánované výrazné rozšíření
- Obsah se měnil denně/týdně (blog, novinky)
- Tým více vývojářů pracoval současně
- Byl plánován blog, CMS nebo admin rozhraní
- Byl plánován nový jazyk v blízké době

---

## Rizika přepisu a jejich mitigace

| Riziko | Pravděpodobnost | Dopad | Mitigace |
|---|---|---|---|
| Chybí funkce po přepisu | Nízká | Střední | Validační checklist (viz `03-validacni-checklist.md`) |
| Regrese v přístupnosti | Nízká | Střední | WCAG audit před spuštěním |
| SEO propad | Velmi nízká | Střední | URL struktura zachována, hreflang zachován |
| Formuláře nefungují | Nízká | Vysoká | PHP backend beze změn, testování |
| Google Maps nefunguje | Nízká | Nízká | API klíč přenesen, logika zachována |
| Ztráta Astro zdrojáků | Nulová | Vysoká | Větev `astro-archive` vytvořena ✅ |

---

## Závěr

**Pro Penzion Elendris je přepis na čisté HTML/CSS/JS správné technické rozhodnutí.** Primárním důvodem je eliminace bezpečnostního rizika (21 CVE) a provozní zátěže spojené s npm ekosystémem, přičemž výstupní kvalita webu zůstane stejná nebo se zlepší.

Astro zdrojáky jsou archivovány do větve `astro-archive` pro případ návratu.
