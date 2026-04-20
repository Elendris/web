(function () {
  'use strict';

  const flatContactDialog = document.getElementById('flatContactDialog');
  const flatContactForm = document.getElementById('flatContactForm');
  let statusLiveRegion;

  if (!flatContactDialog || !flatContactForm) return;

  statusLiveRegion = ensureStatusLiveRegion();

  // Open dialog on [data-flat-contact-open] or [data-flat-contact] click
  document.querySelectorAll('[data-flat-contact-open], [data-flat-contact]').forEach(function (btn) {
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

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (flatContactDialog.open) flatContactDialog.close();
      const flatSuccessDialog = document.getElementById('flatSuccessDialog');
      if (flatSuccessDialog && flatSuccessDialog.open) flatSuccessDialog.close();
    }
  });

  // Form submission
  flatContactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Honeypot check
    const honeypot = document.getElementById('flat-contact-website');
    if (honeypot && honeypot.value) {
      flatContactDialog.close();
      showStatus('Zpráva byla odeslána.', 'success');
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
        showStatus('Děkujeme, vaše zpráva byla úspěšně odeslána.', 'success');
        showFlatSuccess();
      } else {
        showStatus('Omlouváme se, při odesílání došlo k chybě. Kontaktujte prosím info@elendris.cz.', 'error');
      }
    } catch (err) {
      showStatus('Chyba při odesílání. Kontaktujte prosím info@elendris.cz.', 'error');
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

  function ensureStatusLiveRegion() {
    let region = document.getElementById('flatContactStatus');
    if (region) return region;

    region = document.createElement('div');
    region.id = 'flatContactStatus';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.style.marginTop = '1rem';
    region.style.fontWeight = '600';
    region.style.display = 'none';
    flatContactForm.appendChild(region);
    return region;
  }

  function showStatus(message, type) {
    if (!statusLiveRegion) return;
    statusLiveRegion.textContent = message;
    statusLiveRegion.style.display = 'block';
    statusLiveRegion.style.color = type === 'error' ? '#b91c1c' : '#166534';
  }
})();
