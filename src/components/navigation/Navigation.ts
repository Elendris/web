export const initNavigation = () => {
  const nav = document.querySelector("nav");
  const menu = document.querySelector(".menu");
  const menuBtn = document.getElementById("menuBtn");
  const tabletResolution = 768;

  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px",
    threshold: 0.01,
  };

  let timeoutId: number | undefined;

  const handleIntersection: IntersectionObserverCallback = (entries) => {
    if (timeoutId !== undefined) {
      window.cancelAnimationFrame(timeoutId);
    }
    timeoutId = window.requestAnimationFrame(() => {
      entries.forEach((entry) => {
        if (window.innerWidth >= tabletResolution) {
          const isSticky = menu?.getAttribute("data-sticky") === "true";
          if (!entry.isIntersecting && !isSticky) {
            menu?.setAttribute("data-sticky", "true");
          } else if (entry.isIntersecting && isSticky) {
            menu?.setAttribute("data-sticky", "false");
          }
        }
      });
    });
  };

  const observer = new IntersectionObserver(handleIntersection, options);

  if (nav) observer.observe(nav);

  const handleMenuToggle = () => {
    const isOpen = menu?.getAttribute("data-open") === "true";
    menu?.setAttribute("data-open", isOpen ? "false" : "true");
    menuBtn?.setAttribute("data-open", isOpen ? "false" : "true");
  };

  if (menuBtn) {
    menuBtn.addEventListener("click", handleMenuToggle);
  }

  const menuLinks = document.querySelectorAll(".menu > li > a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu?.setAttribute("data-open", "false");
      menuBtn?.setAttribute("data-open", "false");
    });
  });
};