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

 1. Krok 1. a 2. jsou stejné jako u dev prostředí

 2. Vytvořte produkční build:

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
  id="7"
>
  <p slot="room-description">
    Popis nové místnosti.
  </p>
</Room>
```
### Jak funguje galerie

* `imgSrc`: Cesta k hlavnímu obrázku místnosti.
* `imgCount`: Počet obrázků v galerii místnosti.
* `galeryFolder`: Název složky, kde jsou uloženy obrázky místnosti.

Galerie funguje tak, že se dynamicky načítají obrázky z určené složky (`galeryFolder`). Hlavní obrázek (`imgSrc`) je zobrazen jako první a další obrázky jsou načítány podle počtu (`imgCount`). Cesta k adresáři (`galeryFolder`) je důležitá pro správné načtení všech obrázků místnosti.

### Jak funguje rezervace

1. Rezervace je inicializována funkcí `initReservation` v souboru `Reservation.ts`.
2. Uživatel může přidávat nové místnosti pomocí tlačítka "Přidat místnost". Každá nová místnost je vytvořena funkcí `createNewRoomContent` v souboru `Reservation.helpers.ts`.
3. Při změně výběru místnosti se volá funkce `handleRoomSelectChange`, která aktualizuje počet hostů a možnost oddělených postelí.
4. Místnost lze odstranit pomocí tlačítka "Odebrat pokoj", které volá funkci `handleDeleteRoom`.

Tímto způsobem můžete snadno spravovat místnosti a rezervace na webu Elendris.cz.