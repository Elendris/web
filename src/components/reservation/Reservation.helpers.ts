import { getLangFromUrl, useTranslations } from '../../i18n/utils';

export const createNewRoomContent = (roomCounter: number): HTMLElement => {
  const lang = getLangFromUrl(new URL(window.location.href));
  const t = useTranslations(lang);

  const newRoomContent = document.createElement("div");
  newRoomContent.classList.add("reservation__room");
  newRoomContent.innerHTML = `
    <label class="form-item">
      ${t('reservation.formLabel.selectRoom')}
      <select name="rooms${roomCounter}" required>
        <option value="">-- ${t('reservation.select.placeholder')} --</option>
        <option value="1">${t('reservation.select.room1')}</option>
        <option value="2">${t('reservation.select.room2')}</option>
        <option value="3">${t('reservation.select.room3')}</option>
        <option value="4">${t('reservation.select.room4')}</option>
        <option value="5">${t('reservation.select.room5')}</option>
        <option value="6">${t('reservation.select.room6')}</option>
      </select>
      <svg class="icon icon-chevron-down"><use xlink:href="#icon-chevron-down"></use></svg>
    </label>
    <div id="guestCountContainer${roomCounter}"></div>
    <button type="button" class="deleteRoom btn btn--delete" aria-label="${t('reservation.btn.removeRoom')}" title="${t('reservation.btn.removeRoom')}">
      <svg class="icon icon-delete"><use xlink:href="#icon-delete"></use></svg>
    </button>
    <div id="separateBedsContainer${roomCounter}"></div>
    <hr />
  `;
  return newRoomContent;
};

export const handleRoomSelectChange = (
  newSelect: HTMLSelectElement, 
  guestCountContainer: HTMLElement, 
  separateBedsContainer: HTMLElement, 
  roomCounter: number
) => {
  const lang = getLangFromUrl(new URL(window.location.href));
  const t = useTranslations(lang);

  console.log('Selected value:', newSelect.value);

  if (newSelect.value !== "room1") {
    separateBedsContainer.innerHTML = `
      <label class="check-box">
        <input type="checkbox" value="">
        ${t('reservation.formLabel.separateBeds')}
      </label>
    `;
    console.log('Rendered separate beds checkbox');
  } else {
    separateBedsContainer.innerHTML = '';
    console.log('Cleared separate beds container');
  }

  if (newSelect.value !== "room4" && newSelect.value !== "room5" && newSelect.value !== "room6") {
    guestCountContainer.innerHTML = `
      <label class="form-item">
        ${t('reservation.formLabel.guestCount')}
        <input type="number" min="1" max="10" name="persons${roomCounter}" required />
      </label>
    `;
    console.log('Rendered guest count input');
  } else {
    guestCountContainer.innerHTML = '';
    console.log('Cleared guest count container');
  }
};


export const handleDeleteRoom = (roomRow: HTMLElement, newRoomContent: HTMLElement) => {
  roomRow.removeChild(newRoomContent);
}