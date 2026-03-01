(function () {
  'use strict';

  const form = document.getElementById('reservationForm');
  const reservationDialog = document.getElementById('reservationDialog');
  const successDialog = document.getElementById('successDialog');

  if (!form) return;

  // Set minimum dates to today
  const today = new Date().toISOString().split('T')[0];
  const arrivalInput = document.getElementById('arrival');
  const departureInput = document.getElementById('departure');
  if (arrivalInput) arrivalInput.min = today;
  if (departureInput) departureInput.min = today;

  // Ensure departure >= arrival
  if (arrivalInput && departureInput) {
    arrivalInput.addEventListener('change', function () {
      if (departureInput.value && departureInput.value < arrivalInput.value) {
        departureInput.value = arrivalInput.value;
      }
      departureInput.min = arrivalInput.value || today;
    });
  }

  // Close reservation dialog
  const closeButtons = reservationDialog
    ? reservationDialog.querySelectorAll('.dialog__close, [data-close-dialog]')
    : [];
  closeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (reservationDialog) reservationDialog.close();
    });
  });

  // Form submission
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Honeypot check
    const honeypot = document.getElementById('reservation-website');
    if (honeypot && honeypot.value) {
      // Bot detected — silently succeed
      if (reservationDialog) reservationDialog.close();
      if (successDialog) {
        successDialog.showModal();
        const firstBtn = successDialog.querySelector('button');
        if (firstBtn) firstBtn.focus();
      }
      return;
    }

    // Basic validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '...';
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        form.reset();
        if (reservationDialog) reservationDialog.close();
        if (successDialog) {
          successDialog.showModal();
          const firstBtn = successDialog.querySelector('button');
          if (firstBtn) firstBtn.focus();
        }
      } else {
        alert('Odeslání selhalo. Zkuste to prosím znovu nebo kontaktujte info@elendris.cz');
      }
    } catch (err) {
      alert('Chyba při odesílání. Zkuste to prosím znovu nebo kontaktujte info@elendris.cz');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        // Restore original button text based on lang
        const lang = document.documentElement.lang;
        submitBtn.textContent = lang === 'en' ? 'Send reservation' : 'Odeslat rezervaci';
      }
    }
  });

  // Success dialog close
  if (successDialog) {
    successDialog.querySelectorAll('.dialog__close, [data-close-dialog]').forEach(function (btn) {
      btn.addEventListener('click', function () { successDialog.close(); });
    });
    successDialog.addEventListener('click', function (e) {
      if (e.target === successDialog) successDialog.close();
    });
  }
})();
