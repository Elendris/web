import { createNewRoomContent, handleRoomSelectChange, handleDeleteRoom } from './Reservation.helpers';

export const initReservation = () => {
  const reservationDialog = document.querySelector(".reservation") as HTMLDialogElement;
  const closeButton = document.getElementById("reservationClose");
  const submitButton = document.getElementById("submitBtn") as HTMLButtonElement;
  let roomCounter = 0;

  const updateSubmitButtonState = () => {
    if (submitButton) {
      submitButton.disabled = roomCounter === 0;
    }
  };

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      reservationDialog.close();
    });
  }

  const reservationButtons = document.querySelectorAll("button[data-reservation]");
  reservationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      reservationDialog.showModal();
    });
  });

  const addRoomButton = document.getElementById("addRoom");

  if (addRoomButton) {
    addRoomButton.addEventListener("click", function () {
      const roomRow = document.getElementById("roomsList");
      if (roomRow) {
        roomCounter++;
        const newRoomContent = createNewRoomContent(roomCounter);
        roomRow.appendChild(newRoomContent);

        const newSelect = newRoomContent.querySelector("select");
        const guestCountContainer = newRoomContent.querySelector(`#guestCountContainer${roomCounter}`) as HTMLElement;
        const separateBedsContainer = newRoomContent.querySelector(`#separateBedsContainer${roomCounter}`) as HTMLElement;

        if (newSelect && guestCountContainer && separateBedsContainer) {
          newSelect.addEventListener("change", () => handleRoomSelectChange(newSelect, guestCountContainer, separateBedsContainer, roomCounter));
          newSelect.focus();
        }

        const deleteButton = newRoomContent.querySelector(".deleteRoom");
        if (deleteButton) {
          deleteButton.addEventListener("click", () => {
            handleDeleteRoom(roomRow, newRoomContent);
            roomCounter--;
            updateSubmitButtonState();
          });
        }

        updateSubmitButtonState();
      }
    });
  }

  updateSubmitButtonState();
};