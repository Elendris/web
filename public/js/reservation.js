(function () {
  'use strict';

  const form = document.getElementById('reservationForm');
  const reservationDialog = document.getElementById('reservationDialog');
  const successDialog = document.getElementById('successDialog');
  const addRoomButton = document.getElementById('addRoom');
  const roomsList = document.getElementById('roomsList');
  const emptyMessage = document.getElementById('emptyMessage');
  const submitBtn = document.getElementById('submitBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const closeBtn = document.getElementById('reservationClose');

  if (!form || !reservationDialog) return;

  const lang = document.documentElement.lang === 'en' ? 'en' : 'cs';

  const i18n = {
    cs: {
      selectRoom: 'Vyberte pokoj',
      placeholder: 'Zvolte jednu z možností',
      room1: 'Jednolůžkový pokoj',
      room2: 'Dvoulůžkový pokoj',
      room3: 'Třílůžkový pokoj',
      room4: 'Rodinný pokoj',
      room5: 'Rodinný pokoj s kuchyňským koutem',
      room6: 'Pokoj s vanou',
      guestCount: 'Počet hostů',
      separateBeds: 'Oddělené postele',
      removeRoom: 'Odebrat pokoj',
      sending: 'Odesílám...',
      submitText: 'Rezervovat',
      errorMsg: 'Odeslání selhalo. Zkuste to prosím znovu nebo nás kontaktujte na info@elendris.cz'
    },
    en: {
      selectRoom: 'Select room',
      placeholder: 'Choose one of the options',
      room1: 'Single Room',
      room2: 'Double Room',
      room3: 'Triple Room',
      room4: 'Family Room',
      room5: 'Family Room with Kitchenette',
      room6: 'Room with Bathtub',
      guestCount: 'Guests count',
      separateBeds: 'Twin bed',
      removeRoom: 'Remove room',
      sending: 'Sending...',
      submitText: 'Reservation',
      errorMsg: 'Submission failed. Please try again or contact us at info@elendris.cz'
    }
  }[lang];

  let roomCounter = 0;

  function updateFormState() {
    const hasRooms = roomsList && roomsList.children.length > 0;
    const selects = roomsList ? Array.from(roomsList.querySelectorAll('select')) : [];
    const hasSelected = selects.length > 0 && selects.some(function (s) { return s.value !== ''; });

    if (emptyMessage) {
      emptyMessage.style.display = hasRooms ? 'none' : 'block';
    }
    if (submitBtn) {
      submitBtn.disabled = !hasSelected;
    }
  }

  function handleRoomSelectChange(select, guestCountContainer, separateBedsContainer, counter) {
    const val = select.value;

    if (val && val !== '1') {
      separateBedsContainer.innerHTML =
        '<label class="check-box">' +
        '<input type="checkbox" name="separateBeds' + counter + '" value="1"> ' +
        i18n.separateBeds +
        '</label>';
    } else {
      separateBedsContainer.innerHTML = '';
    }

    if (val && val !== '1' && val !== '2' && val !== '3') {
      guestCountContainer.innerHTML =
        '<label class="form-item">' +
        i18n.guestCount +
        ' <input type="number" min="1" max="4" name="guestCount' + counter + '" inputmode="numeric" required value="2">' +
        '</label>';
    } else {
      guestCountContainer.innerHTML = '';
    }

    updateFormState();
  }

  function addRoomToReservation(roomId) {
    if (!roomsList) return;
    roomCounter++;
    const currentCounter = roomCounter;

    const row = document.createElement('div');
    row.className = 'reservation__room';
    row.innerHTML =
      '<label class="form-item">' +
      i18n.selectRoom +
      ' <select name="rooms[]" required>' +
      '<option value="">-- ' + i18n.placeholder + ' --</option>' +
      '<option value="1">' + i18n.room1 + '</option>' +
      '<option value="2">' + i18n.room2 + '</option>' +
      '<option value="3">' + i18n.room3 + '</option>' +
      '<option value="4">' + i18n.room4 + '</option>' +
      '<option value="5">' + i18n.room5 + '</option>' +
      '<option value="6">' + i18n.room6 + '</option>' +
      '</select>' +
      '<svg class="icon icon-chevron-down"><use href="/images/icons.svg#icon-chevron-down"></use></svg>' +
      '</label>' +
      '<div id="guestCountContainer' + currentCounter + '"></div>' +
      '<button type="button" class="deleteRoom btn btn--delete" aria-label="' + i18n.removeRoom + '" title="' + i18n.removeRoom + '">' +
      '<svg class="icon icon-delete"><use href="/images/icons.svg#icon-close"></use></svg>' +
      '</button>' +
      '<div id="separateBedsContainer' + currentCounter + '"></div>' +
      '<hr>';

    roomsList.appendChild(row);

    const select = row.querySelector('select');
    const guestContainer = row.querySelector('#guestCountContainer' + currentCounter);
    const bedsContainer = row.querySelector('#separateBedsContainer' + currentCounter);
    const delBtn = row.querySelector('.deleteRoom');

    if (roomId && select) {
      select.value = roomId;
      handleRoomSelectChange(select, guestContainer, bedsContainer, currentCounter);
    }

    if (select) {
      select.addEventListener('change', function () {
        handleRoomSelectChange(select, guestContainer, bedsContainer, currentCounter);
      });
      select.focus();
    }

    if (delBtn) {
      delBtn.addEventListener('click', function () {
        row.remove();
        updateFormState();
      });
    }

    updateFormState();
  }

  // Export for external callers (e.g. rooms.js)
  window.addRoomToReservation = addRoomToReservation;

  if (addRoomButton) {
    addRoomButton.addEventListener('click', function () {
      addRoomToReservation();
    });
  }

  // Set min dates to today
  const today = new Date().toISOString().split('T')[0];
  const arrivalInput = document.getElementById('arrival');
  const departureInput = document.getElementById('departure');
  if (arrivalInput) arrivalInput.min = today;
  if (departureInput) departureInput.min = today;

  if (arrivalInput && departureInput) {
    arrivalInput.addEventListener('change', function () {
      if (departureInput.value && departureInput.value < arrivalInput.value) {
        departureInput.value = arrivalInput.value;
      }
      departureInput.min = arrivalInput.value || today;
    });
  }

  // Open reservation dialog from any [data-reservation] button
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-reservation]');
    if (!btn) return;

    // If inside another dialog, close it first
    const parentDialog = btn.closest('dialog');
    if (parentDialog && parentDialog !== reservationDialog) {
      parentDialog.close();
    }

    const roomId = btn.getAttribute('data-room-id') || btn.getAttribute('data-preselect-room');
    if (!reservationDialog.open) {
      reservationDialog.showModal();
    }

    if (roomId) {
      // If list is empty or doesn't have this room, add it
      if (roomsList && roomsList.children.length === 0) {
        addRoomToReservation(roomId);
      }
    } else if (roomsList && roomsList.children.length === 0) {
      addRoomToReservation();
    }
  });

  // Close reservation dialog
  [closeBtn, cancelBtn].forEach(function (btn) {
    if (btn) {
      btn.addEventListener('click', function () {
        reservationDialog.close();
      });
    }
  });

  // Close on backdrop
  reservationDialog.addEventListener('click', function (e) {
    if (e.target === reservationDialog) {
      reservationDialog.close();
    }
  });

  // Form submission
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Honeypot check
    const honeypot = document.getElementById('reservation-website');
    if (honeypot && honeypot.value) {
      const target = new URL(window.location.href);
      target.searchParams.set('reservated', 'true');
      window.location.href = target.toString();
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = i18n.sending;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const target = new URL(window.location.href);
        target.searchParams.set('reservated', 'true');
        window.location.href = target.toString();
      } else {
        alert(i18n.errorMsg);
      }
    } catch (err) {
      alert(i18n.errorMsg);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = i18n.submitText;
      }
    }
  });

  // Initial state update
  updateFormState();
})();
