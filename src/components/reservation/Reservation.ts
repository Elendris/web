import { createNewRoomContent, handleRoomSelectChange, handleDeleteRoom } from './Reservation.helpers';

/**
 * Initializes the reservation functionality.
 * Sets up event listeners for opening the reservation dialog, adding rooms to the reservation,
 * and handling form interactions.
 */
export const initReservation = () => {
  const reservationDialog = document.querySelector(".reservation") as HTMLDialogElement;
  const closeButton = document.getElementById("reservationClose") as HTMLButtonElement;
  const cancelButton = document.getElementById("cancelBtn") as HTMLButtonElement;
  const submitButton = document.getElementById("submitBtn") as HTMLButtonElement;
  let roomCounter = 0;
  let roomSelected = false;

  /**
   * Updates the state of the submit button based on the number of rooms added and selected.
   */
  const updateSubmitButtonState = () => {
    if (submitButton) {
      submitButton.disabled = !roomSelected;
    }
  };

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      reservationDialog.close();
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      reservationDialog.close();
    });
  }

  const reservationButtons = document.querySelectorAll("button[data-reservation]");
  reservationButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const roomId = (event.currentTarget as HTMLElement).getAttribute('data-room-id');
      reservationDialog.showModal();
      if (roomId) {
        addRoomToReservation(roomId);
      }
    });
  });

  const addRoomButton = document.getElementById("addRoom");

  if (addRoomButton) {
    addRoomButton.addEventListener("click", () => {
      addRoomToReservation();
    });
  }

  /**
   * Adds a room to the reservation form.
   * @param {string} [roomId] - The ID of the room to pre-select in the reservation form.
   */
  const addRoomToReservation = (roomId?: string) => {
    const roomRow = document.getElementById("roomsList");
    if (roomRow) {
      roomCounter++;
      const newRoomContent = createNewRoomContent(roomCounter);
      roomRow.appendChild(newRoomContent);

      const newSelect = newRoomContent.querySelector("select") as HTMLSelectElement;
      const guestCountContainer = newRoomContent.querySelector(`#guestCountContainer${roomCounter}`) as HTMLElement;
      const separateBedsContainer = newRoomContent.querySelector(`#separateBedsContainer${roomCounter}`) as HTMLElement;

      if (newSelect && guestCountContainer && separateBedsContainer) {
        if (roomId) {
          newSelect.value = roomId;
          handleRoomSelectChange(newSelect, guestCountContainer, separateBedsContainer, roomCounter);
          roomSelected = true;
          updateSubmitButtonState();
        }
        newSelect.addEventListener("change", () => {
          handleRoomSelectChange(newSelect, guestCountContainer, separateBedsContainer, roomCounter);
          roomSelected = newSelect.value !== "";
          updateSubmitButtonState();
        });
        newSelect.focus();
      }

      const deleteButton = newRoomContent.querySelector(".deleteRoom");
      if (deleteButton) {
        deleteButton.addEventListener("click", () => {
          handleDeleteRoom(roomRow, newRoomContent);
          roomCounter--;
          roomSelected = roomCounter > 0 && Array.from(roomRow.querySelectorAll("select")).some(select => select.value !== "");
          updateSubmitButtonState();
        });
      }

      updateSubmitButtonState();
    }
  };

  updateSubmitButtonState();
};