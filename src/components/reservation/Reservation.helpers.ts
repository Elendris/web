import { getLangFromUrl, useTranslations } from '../../i18n/utils';

/**
 * Creates a new room content element for the reservation form.
 * @param {number} roomCounter - The counter for the room being added.
 * @returns {HTMLElement} - The new room content element.
 */
export const createNewRoomContent = (roomCounter: number): HTMLElement => {
  const lang = getLangFromUrl(new URL(window.location.href));
  const t = useTranslations(lang);

  const newRoomContent = document.createElement("div");
  newRoomContent.classList.add("reservation__room");
  newRoomContent.innerHTML = `
    <label class="form-item">
      ${t('reservation.formLabel.selectRoom')}
      <select name="rooms[]" required>
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

/**
 * Handles the change event for the room select element.
 * Updates the guest count and separate beds containers based on the selected room.
 * @param {HTMLSelectElement} newSelect - The select element for the room.
 * @param {HTMLElement} guestCountContainer - The container for the guest count input.
 * @param {HTMLElement} separateBedsContainer - The container for the separate beds checkbox.
 * @param {number} roomCounter - The counter for the room being added.
 */
export const handleRoomSelectChange = (
  newSelect: HTMLSelectElement, 
  guestCountContainer: HTMLElement, 
  separateBedsContainer: HTMLElement, 
  roomCounter: number
) => {
  const lang = getLangFromUrl(new URL(window.location.href));
  const t = useTranslations(lang);

  console.log('Selected value:', newSelect.value);

  if (newSelect.value !== "1") {
    separateBedsContainer.innerHTML = `
      <label class="check-box">
        <input type="checkbox" name="separateBeds${roomCounter}" value="1">
        ${t('reservation.formLabel.separateBeds')}
      </label>
    `;
  } else {
    separateBedsContainer.innerHTML = '';
  }

  if (newSelect.value !== "1" && newSelect.value !== "2" && newSelect.value !== "3") {
    guestCountContainer.innerHTML = `
      <label class="form-item">
        ${t('reservation.formLabel.guestCount')}
        <input type="number" min="1" max="4" name="guestCount${roomCounter}" inputmode="numeric" required />
      </label>
    `;
  } else {
    guestCountContainer.innerHTML = '';
  }
};

/**
 * Handles the deletion of a room from the reservation form.
 * @param {HTMLElement} roomRow - The container element for the rooms.
 * @param {HTMLElement} newRoomContent - The room content element to be removed.
 */
export const handleDeleteRoom = (roomRow: HTMLElement, newRoomContent: HTMLElement) => {
  roomRow.removeChild(newRoomContent);
};