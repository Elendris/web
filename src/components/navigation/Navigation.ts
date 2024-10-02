export const initNavigation = () => {
  const nav = document.querySelector('nav'); 
  const menu = document.querySelector('.menu'); 

  const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.01
  };

  let timeoutId: number | undefined; 

  const callback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
      if (timeoutId !== undefined) {
          window.cancelAnimationFrame(timeoutId); 
      }
      timeoutId = window.requestAnimationFrame(() => {
          entries.forEach(entry => {
              const isSticky = menu?.getAttribute('data-sticky') === 'true';
              if (!entry.isIntersecting && !isSticky) {
                  menu?.setAttribute('data-sticky', 'true');
              } else if (entry.isIntersecting && isSticky) {
                  menu?.setAttribute('data-sticky', 'false');
              }
          });
      });
  };

  const observer = new IntersectionObserver(callback, options);

  if (nav) observer.observe(nav);
}