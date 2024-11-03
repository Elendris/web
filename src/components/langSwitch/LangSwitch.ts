/**
 * Initializes the language switch functionality.
 * Sets up event listeners for toggling the language switch popover and closing it when clicking outside.
 */
export const initLangSwitch = () => {
  const langSwitchBtn = document.querySelector('.lang-switch__btn');
  const langSwitchPopover = document.querySelector('.lang-switch__popover');

  if (langSwitchBtn && langSwitchPopover) {
    langSwitchBtn.addEventListener('click', () => {
      const isOpen = langSwitchPopover.getAttribute('data-open') === 'true';
      langSwitchPopover.setAttribute('data-open', (!isOpen).toString());
    });

    document.addEventListener('click', (event) => {
      if (!langSwitchBtn.contains(event.target as Node) && !langSwitchPopover.contains(event.target as Node)) {
        langSwitchPopover.setAttribute('data-open', 'false');
      }
    });
  }
};