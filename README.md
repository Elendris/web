# Elendris.cz

## Jak rozběhnout projekt

### Vývojové prostředí (dev)

1. Ujistěte se, že máte nainstalovaný `pnpm`. Pokud ne, nainstalujte si ho pomocí následujícího příkazu:

`npm install -g pnpm`

Více informací naleznete na [oficiálních stránkách pnpm](https://pnpm.io/installation).

2. Nainstalujte závislosti:

`pnpm install`

3. Spusťte vývojový server:

`pnpm start`

### Produkční prostředí (prod)

1.  Krok 1. a 2. jsou stejné jako u dev prostředí

2.  Vytvořte produkční build:

`pnpm build`

3. Spusťte produkční server:

`pnpm preview`

### Přidávání nových místností

1. Otevřete soubor `Rooms.astro`.
2. Přidejte nový komponent `Room` s potřebnými atributy jako `title`, `imgSrc`, `imgCount`, `galeryFolder`, `price` a `id`.

```astro
<Room
  title="Nová místnost"
  imgSrc="./images/rooms/new-room/new-room-1.avif"
  imgCount={3}
  galeryFolder="new-room"
  price={2000}
  id="7">
  <p slot="room-description">
    Popis nové místnosti.
  </p>
</Room>
```

### Jak funguje galerie

- `imgSrc`: Cesta k hlavnímu obrázku místnosti.
- `imgCount`: Počet obrázků v galerii místnosti.
- `galeryFolder`: Název složky, kde jsou uloženy obrázky místnosti.

Galerie funguje tak, že se dynamicky načítají obrázky z určené složky (`galeryFolder`). Hlavní obrázek (`imgSrc`) je zobrazen jako první a další obrázky jsou načítány podle počtu (`imgCount`). Cesta k adresáři (`galeryFolder`) je důležitá pro správné načtení všech obrázků místnosti.

### Jak funguje rezervace

1. Rezervace je inicializována funkcí `initReservation` v souboru `Reservation.ts`.
2. Uživatel může přidávat nové místnosti pomocí tlačítka "Přidat místnost". Každá nová místnost je vytvořena funkcí `createNewRoomContent` v souboru `Reservation.helpers.ts`.
3. Při změně výběru místnosti se volá funkce `handleRoomSelectChange`, která aktualizuje počet hostů a možnost oddělených postelí.
4. Místnost lze odstranit pomocí tlačítka "Odebrat pokoj", které volá funkci `handleDeleteRoom`.

Tímto způsobem můžete snadno spravovat místnosti a rezervace na webu Elendris.cz.

### Jak funguje lokalizace

Lokalizace na webu elendris.cz je řešena následujícím způsobem:

1. **Konfigurace lokalizace**:

   - V souboru `astro.config.mjs` je nastavena výchozí lokalizace a dostupné jazyky:
     ```javascript
     export default defineConfig({
       i18n: {
         defaultLocale: "cs",
         locales: ["en", "cs"],
       },
       // další konfigurace...
     });
     ```

2. **Soubory s překlady**:

   - Překlady jsou uloženy ve složce `i18n` ve formě TypeScript souborů. Každý jazyk má svůj vlastní soubor, například `cs.ts` a `en.ts`:

     ```typescript
     // cs.ts
     export const cs = {
       "nav.home": "Domů",
       "nav.about": "O nás",
       // další překlady...
     };

     // en.ts
     export const en = {
       "nav.home": "Home",
       "nav.about": "About us",
       // další překlady...
     };
     ```

3. **Markdown soubory s obsahem**:

   - Texty, které obsahují markup, jsou psány formou Markdownu a jsou uloženy ve složkách s obsahem, například `cs.md` a `en.md`:

     ```markdown
     ---
     title: Your Title
     ---

     Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure perspiciatis <b>obcaecati</b>, tempore quis quod cupiditate?

     <!-- split -->

     Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure perspiciatis obcaecati, tempore quis quod cupiditate?
     ```

4. **Použití překladů v komponentách (markdown)**:

   #### markdown

   - Překlady jsou načítány a používány v komponentách pomocí funkcí, které získávají jazyk z URL a vrací příslušný překlad. Například v souboru `Rooms.astro`:

     ```astro
     ---
     import Room from "../../components/room/Room.astro";
     import { getCollection } from "astro:content";
     import { getLangFromUrl, useTranslations } from "../../i18n/utils";

     const lang = getLangFromUrl(Astro.url);
     const aboutCollection = await getCollection("rooms");
     const aboutContent = aboutCollection.find((entry) => entry.slug === lang);

     if (!aboutContent) {
       throw new Error(`Content for language ${lang} not found`);
     }

     const { data, body } = aboutContent;
     const { title } = data;

     const [
       description,
       room1Desc,
       room2Desc,
       room3Desc,
       room4Desc,
       room5Desc,
       room6Desc,
     ] = body.split("<!-- split -->");

     const t = useTranslations(lang);
     ---

     <section id={id}>
       <div class="container">
         <h2 class="title">{title}</h2>
         <p class="desc" set:html={description} />
       </div>
       <div class="rooms">
         <Room
           title={t("rooms.room1.title")}
           imgSrc="/images/rooms/room-1/room-1-1.avif"
           imgCount={3}
           galeryFolder="room-1"
           price={990}
           id="1">
           <p slot="room-description" set:html={room1Desc} />
         </Room>
         <!-- další pokoje... -->
       </div>
     </section>
     ```

5. **Použití překladů v komponentách (json)**:

    Překlady jsou načítány a používány v komponentách pomocí funkcí, které získávají jazyk z URL a vrací příslušný překlad:Překlady jsou načítány a používány v komponentách pomocí funkcí, které získávají jazyk z URL a vrací příslušný překlad:

     ```astro
     ---
      import { getLangFromUrl, useTranslations } from '../../i18n/utils';

      const lang = getLangFromUrl(Astro.url);
      const t = useTranslations(lang);
     ---

      <nav>
        <a href="/" title={t('nav.home')}>{t('nav.home')}</a>
        <a href="/about" title={t('nav.about')}>{t('nav.about')}</a>
      </nav>
     ```

Tímto způsobem je zajištěna flexibilita a snadná údržba lokalizovaných textů na webu Elendris.cz.\* `galeryFolder`: Název složky, kde jsou uloženy obrázky místnosti.

Galerie funguje tak, že se dynamicky načítají obrázky z určené složky (`galeryFolder`). Hlavní obrázek (`imgSrc`) je zobrazen jako první a další obrázky jsou načítány podle počtu (`imgCount`). Cesta k adresáři (`galeryFolder`) je důležitá pro správné načtení všech obrázků místnosti.
