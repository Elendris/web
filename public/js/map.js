(function () {
  'use strict';

  const MAP_CONTAINER = document.getElementById('map');
  if (!MAP_CONTAINER) return;

  const API_KEY = 'AIzaSyCxLnuRF4MRFg7MErCYXcdroyHYeLYUUfo';
  const MAP_ID = '1fe75d9e7f76ee36';

  const lang = document.documentElement.lang || 'cs';

  const LABELS = {
    cs: {
      elendris: 'Elendris – ubytování u kostela',
      bruno: 'BRuNO family park',
      golf: 'Golf v Slavkově u Brna',
      historicalCenter: 'Historické centrum Brna',
      moravianKarst: 'Krásy Moravského krasu',
      moreInfo: 'Více informací',
    },
    en: {
      elendris: 'Elendris – Guesthouse near the church',
      bruno: 'BRuNO family park',
      golf: 'Golf course in Austerlitz',
      historicalCenter: 'Historical center of Brno',
      moravianKarst: 'Beauty of the Moravian Karst',
      moreInfo: 'More information',
    },
  };

  const t = LABELS[lang] || LABELS.cs;

  const MARKERS = [
    {
      lat: 49.17764, lng: 16.69207,
      title: t.elendris,
      info: '<strong>' + t.elendris + '</strong><br>Krejčího 550/2, Brno 627 00',
      isPrimary: true,
    },
    {
      lat: 49.1711, lng: 16.6745,
      title: t.bruno,
      info: '<strong>' + t.bruno + '</strong><br><a href="https://www.brunofamilypark.cz" target="_blank" rel="noopener">' + t.moreInfo + '</a>',
    },
    {
      lat: 49.1547, lng: 16.8813,
      title: t.golf,
      info: '<strong>' + t.golf + '</strong><br><a href="https://www.gcausterlitz.cz" target="_blank" rel="noopener">' + t.moreInfo + '</a>',
    },
    {
      lat: 49.1952, lng: 16.6079,
      title: t.historicalCenter,
      info: '<strong>' + t.historicalCenter + '</strong>',
    },
    {
      lat: 49.3636, lng: 16.7184,
      title: t.moravianKarst,
      info: '<strong>' + t.moravianKarst + '</strong><br><a href="https://www.cavesbrno.cz" target="_blank" rel="noopener">' + t.moreInfo + '</a>',
    },
  ];

  let loaded = false;

  function loadMap() {
    if (loaded) return;
    loaded = true;

    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + API_KEY + '&callback=initElendrisMap&libraries=marker&v=weekly';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  window.initElendrisMap = function () {
    const isMobile = window.innerWidth < 768;

    const center = isMobile
      ? { lat: 49.17764, lng: 16.69207 }
      : { lat: 49.19, lng: 16.71 };

    const zoom = isMobile ? 12 : 11;

    const map = new google.maps.Map(MAP_CONTAINER, {
      center: center,
      zoom: zoom,
      mapId: MAP_ID,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    });

    const infoWindow = new google.maps.InfoWindow();

    MARKERS.forEach(function (m) {
      const pinEl = document.createElement('div');
      if (m.isPrimary) {
        pinEl.className = 'map-pin map-pin--primary';
        pinEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#df8681" d="M16 0C9.383 0 4 5.383 4 12c0 9 12 20 12 20s12-11 12-20C28 5.383 22.617 0 16 0zm0 16c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>';
      } else {
        pinEl.className = 'map-pin';
        pinEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="#555" d="M16 0C9.383 0 4 5.383 4 12c0 9 12 20 12 20s12-11 12-20C28 5.383 22.617 0 16 0zm0 16c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>';
      }

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: m.lat, lng: m.lng },
        map: map,
        title: m.title,
        content: pinEl,
      });

      marker.addListener('click', function () {
        infoWindow.setContent(m.info);
        infoWindow.open(map, marker);
      });
    });

    // Responsive center update
    window.addEventListener('resize', function () {
      const mobile = window.innerWidth < 768;
      map.setCenter(mobile ? { lat: 49.17764, lng: 16.69207 } : { lat: 49.19, lng: 16.71 });
      map.setZoom(mobile ? 12 : 11);
    });
  };

  // Lazy load with IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadMap();
          observer.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    observer.observe(MAP_CONTAINER);
  } else {
    // Fallback: load on scroll or after timeout
    let fallbackLoaded = false;
    function fallbackLoad() {
      if (!fallbackLoaded) {
        fallbackLoaded = true;
        loadMap();
        window.removeEventListener('scroll', fallbackLoad);
      }
    }
    window.addEventListener('scroll', fallbackLoad, { passive: true });
    setTimeout(fallbackLoad, 3000);
  }
})();
