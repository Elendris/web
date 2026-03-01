(function () {
  'use strict';

  const nav = document.querySelector('nav');
  const menu = document.getElementById('mainMenu');
  const menuBtn = document.getElementById('menuBtn');
  const langSwitchBtn = document.getElementById('langSwitchBtn');
  const langPopover = document.querySelector('.lang-switch__popover');
  const TABLET = 768;

  // --- Sticky nav via IntersectionObserver ---
  if (nav && menu) {
    let rafId;
    const observer = new IntersectionObserver(function (entries) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        entries.forEach(function (entry) {
          if (window.innerWidth >= TABLET) {
            const isSticky = menu.getAttribute('data-sticky') === 'true';
            if (!entry.isIntersecting && !isSticky) {
              menu.setAttribute('data-sticky', 'true');
            } else if (entry.isIntersecting && isSticky) {
              menu.setAttribute('data-sticky', 'false');
            }
          }
        });
      });
    }, { root: null, rootMargin: '0px', threshold: 0.01 });
    observer.observe(nav);
  }

  // --- Burger menu toggle ---
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      const isOpen = menu.getAttribute('data-open') === 'true';
      const next = isOpen ? 'false' : 'true';
      menu.setAttribute('data-open', next);
      menuBtn.setAttribute('data-open', next);
      menuBtn.setAttribute('aria-expanded', next);
    });
  }

  // Close menu on nav link click
  document.querySelectorAll('.menu > li > a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (menu) menu.setAttribute('data-open', 'false');
      if (menuBtn) {
        menuBtn.setAttribute('data-open', 'false');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!nav) return;
    if (!nav.contains(e.target)) {
      if (menu) menu.setAttribute('data-open', 'false');
      if (menuBtn) {
        menuBtn.setAttribute('data-open', 'false');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // --- Language switch popover ---
  if (langSwitchBtn && langPopover) {
    langSwitchBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = langPopover.getAttribute('data-open') === 'true';
      const next = isOpen ? 'false' : 'true';
      langPopover.setAttribute('data-open', next);
      langSwitchBtn.setAttribute('aria-expanded', next);
    });

    document.addEventListener('click', function (e) {
      if (!langSwitchBtn.closest('.lang-switch').contains(e.target)) {
        langPopover.setAttribute('data-open', 'false');
        langSwitchBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        langPopover.setAttribute('data-open', 'false');
        langSwitchBtn.setAttribute('aria-expanded', 'false');
        langSwitchBtn.focus();
      }
    });
  }

  // --- Header animation pictures ---
  const animPics = document.querySelectorAll('.anim__pic');
  if (animPics.length) {
    setTimeout(function () {
      animPics.forEach(function (pic) {
        pic.setAttribute('data-scroll-anim', 'true');
      });
    }, 2000);
  }

  // --- Open reservation dialog on [data-reservation] click ---
  const reservationDialog = document.getElementById('reservationDialog');
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-reservation]');
    if (!btn || !reservationDialog) return;
    const preselect = btn.getAttribute('data-preselect-room');
    if (preselect) {
      const roomSelect = document.getElementById('room');
      if (roomSelect) roomSelect.value = preselect;
    }
    reservationDialog.showModal();
    // Close any open room dialog first
    document.querySelectorAll('dialog[id^="dialog-"]').forEach(function (d) {
      if (d.open) d.close();
    });
    reservationDialog.showModal();
    trapFocus(reservationDialog);
  });

  // --- Focus trap helper ---
  function trapFocus(dialog) {
    const focusable = dialog.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    focusable[0].focus();
    dialog.addEventListener('keydown', function handler(e) {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }, { once: false });
  }
})();
