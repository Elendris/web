(function () {
  'use strict';

  // --- Room dialog open ---
  document.querySelectorAll('.card[data-room]').forEach(function (card) {
    card.addEventListener('click', function () {
      const roomId = card.getAttribute('data-room');
      const dialog = document.getElementById('dialog-' + roomId);
      if (dialog) {
        dialog.showModal();
        focusFirst(dialog);
      }
    });
  });

  // --- Dialog close buttons ---
  document.querySelectorAll('.dialog__close, .detail__close, [data-close-dialog]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const dialog = btn.closest('dialog');
      if (dialog) dialog.close();
    });
  });

  // Reservation buttons inside room dialogs: ensure expected data-room-id is present
  document.querySelectorAll('dialog[id^="dialog-"] [data-reservation]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const dialog = btn.closest('dialog');
      if (dialog) {
        const roomId = dialog.id.replace('dialog-', '');
        if (!btn.getAttribute('data-room-id')) {
          btn.setAttribute('data-room-id', roomId);
        }
      }
    });
  });

  // Close dialog on backdrop click
  document.querySelectorAll('dialog').forEach(function (dialog) {
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
  });

  // Close dialog on Escape (native behavior) — restore focus to trigger
  let lastFocused = null;
  document.querySelectorAll('.card[data-room]').forEach(function (card) {
    card.addEventListener('click', function () { lastFocused = card; });
  });
  document.querySelectorAll('dialog').forEach(function (dialog) {
    dialog.addEventListener('close', function () {
      if (lastFocused && document.contains(lastFocused)) {
        lastFocused.focus();
        lastFocused = null;
      }
    });
  });

  // --- Lightbox ---
  const lightbox = document.getElementById('lightboxDialog');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = lightbox && lightbox.querySelector('.lightbox__close');
  const lightboxPrev = lightbox && lightbox.querySelector('.lightbox__prev');
  const lightboxNext = lightbox && lightbox.querySelector('.lightbox__next');

  let lightboxImages = [];
  let lightboxIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function openLightbox(images, index) {
    lightboxImages = images;
    lightboxIndex = index;
    updateLightboxImg();
    lightbox.showModal();
    lightboxClose && lightboxClose.focus();
  }

  function updateLightboxImg() {
    if (!lightboxImg || !lightboxImages.length) return;
    const src = lightboxImages[lightboxIndex];
    lightboxImg.src = src;
    lightboxImg.alt = 'Foto ' + (lightboxIndex + 1) + ' z ' + lightboxImages.length;
    if (lightboxPrev) lightboxPrev.style.display = lightboxImages.length > 1 ? '' : 'none';
    if (lightboxNext) lightboxNext.style.display = lightboxImages.length > 1 ? '' : 'none';
  }

  document.querySelectorAll('.dialog__gallery-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const gallery = btn.closest('.dialog__gallery');
      if (!gallery) return;
      const items = Array.from(gallery.querySelectorAll('.dialog__gallery-item'));
      const images = items.map(function (b) { return b.getAttribute('data-lightbox-src'); });
      const index = items.indexOf(btn);
      openLightbox(images, index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', function () { lightbox.close(); });
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function () {
      lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      updateLightboxImg();
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', function () {
      lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
      updateLightboxImg();
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' && lightboxImages.length > 1) {
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        updateLightboxImg();
      }
      if (e.key === 'ArrowRight' && lightboxImages.length > 1) {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        updateLightboxImg();
      }
    });

    // Swipe gestures for touch devices
    lightbox.addEventListener('touchstart', function (e) {
      if (!e.changedTouches || !e.changedTouches.length) return;
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      if (!e.changedTouches || !e.changedTouches.length || lightboxImages.length < 2) return;
      touchEndX = e.changedTouches[0].screenX;
      const delta = touchStartX - touchEndX;
      if (Math.abs(delta) < 40) return;

      if (delta > 0) {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
      } else {
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      }
      updateLightboxImg();
    }, { passive: true });
  }

  // --- Focus helper ---
  function focusFirst(dialog) {
    const focusable = dialog.querySelector(
      'button:not([disabled]),input:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])'
    );
    if (focusable) focusable.focus();
  }

  // --- Check for ?reservated=true in URL (success redirect) ---
  if (window.location.search.includes('reservated=true')) {
    const successDialog = document.getElementById('successDialog');
    if (successDialog) {
      successDialog.showModal();
      focusFirst(successDialog);
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('reservated');
      history.replaceState(null, '', url.toString());
    }
  }
})();
