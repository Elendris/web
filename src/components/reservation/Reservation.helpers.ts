export const createNewRoomContent = (roomCounter: number): HTMLElement => {
  const newRoomContent = document.createElement("div");
  newRoomContent.innerHTML = `
    <div class="reservation__room">
      <label class="form-item">
        Zvolte pokoj
        <select name="rooms${roomCounter}" required>
          <option value="">-- Vyberte jendu z možnstí --</option>
          <option value="room1">Jednolůžkový pokoj</option>
          <option value="room2">Dvoulůžkový pokoj</option>
          <option value="room3">Třílůžkový pokoj</option>
          <option value="room4">Rodinný pokoj</option>
          <option value="room5">Rodinný pokoj s kuchyňským koutem</option>
          <option value="room6">Pokoj s vanou</option>
        </select>
        <svg class="icon icon-chevron-down"><use xlink:href="#icon-chevron-down"></use></svg>
      </label>
      <div id="guestCountContainer${roomCounter}"></div>
      <button type="button" class="deleteRoom btn btn--delete" aria-label="Odebrat pokoj" title="Odebrat pokoj">
        <svg class="icon icon-delete"><use xlink:href="#icon-delete"></use></svg>
      </button>
      <div id="separateBedsContainer${roomCounter}"></div>
    </div>
    <hr />
  `;
  return newRoomContent;
}

export const handleRoomSelectChange = (newSelect: HTMLSelectElement, guestCountContainer: HTMLElement, separateBedsContainer: HTMLElement, roomCounter: number) => {
  if (newSelect.value === "room4" || newSelect.value === "room5") {
    guestCountContainer.innerHTML = `
      <label class="form-item">
        Počet hostů
        <input type="number" min="1" max="10" name="persons${roomCounter}" required />
      </label>
    `;
  } else {
    guestCountContainer.innerHTML = '';
  }

  if (newSelect.value !== "room1") {
    separateBedsContainer.innerHTML = `
      <label class="check-box">
        <input type="checkbox" value="">
        Oddělené postele
      </label>
    `;
  } else {
    separateBedsContainer.innerHTML = '';
  }
}

export const handleDeleteRoom = (roomRow: HTMLElement, newRoomContent: HTMLElement) => {
  roomRow.removeChild(newRoomContent);
}