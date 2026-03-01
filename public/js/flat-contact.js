(function () {
  'use strict';

  const flatContactDialog = document.getElementById('flatContactDialog');
  const flatContactForm = document.getElementById('flatContactForm');

  if (!flatContactDialog || !flatContactForm) return;

  // Open dialog on [data-flat-contact-open] click
  document.querySelectorAll('[data-flat-contact-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      flatContactDialog.showModal();
      const first = flatContactDialog.querySelector('input,textarea,button');
      if (first) first.focus();
    });
  });

  // Close dialog buttons
  flatContactDialog.querySelectorAll('.dialog__close, .flat-dialog-close, [data-close-dialog]').forEach(function (btn) {
    btn.addEventListener('click', function () { flatContactDialog.close(); });
  });

  flatContactDialog.addEventListener('click', function (e) {
    if (e.target === flatContactDialog) flatContactDialog.close();
  });

  // Form submission
  flatContactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Honeypot check
    const honeypot = document.getElementById('flat-contact-website');
    if (honeypot && honeypot.value) {
      flatContactDialog.close();
      showFlatSuccess();
      return;
    }

    if (!flatContactForm.checkValidity()) {
      flatContactForm.reportValidity();
      return;
    }

    const submitBtn = flatContactForm.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '...';
    }

    const formData = new FormData(flatContactForm);

    try {
      const response = await fetch(flatContactForm.action, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        flatContactForm.reset();
        flatContactDialog.close();
        showFlatSuccess();
      } else {
        alert('Odeslání selhalo. Kontaktujte prosím info@elendris.cz');
      }
    } catch (err) {
      alert('Chyba při odesílání. Kontaktujte prosím info@elendris.cz');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Odeslat';
      }
    }
  });

  function showFlatSuccess() {
    const successDialog = document.getElementById('flatSuccessDialog');
    if (successDialog) {
      successDialog.showModal();
      const btn = successDialog.querySelector('button');
      if (btn) btn.focus();
    }
  }

  // Success dialog close
  const flatSuccessDialog = document.getElementById('flatSuccessDialog');
  if (flatSuccessDialog) {
    flatSuccessDialog.querySelectorAll('.dialog__close, .flat-dialog-close, [data-close-dialog]').forEach(function (btn) {
      btn.addEventListener('click', function () { flatSuccessDialog.close(); });
    });
    flatSuccessDialog.addEventListener('click', function (e) {
      if (e.target === flatSuccessDialog) flatSuccessDialog.close();
    });
  }
})();
