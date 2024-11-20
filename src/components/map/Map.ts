import { Loader } from "@googlemaps/js-api-loader";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

const initMap = (): void => {
  const lang = getLangFromUrl(new URL(window.location.href));
  const t = useTranslations(lang);
  const mapElement = document.getElementById("map") as HTMLDivElement;
  
  let center = { lat: 49.229709, lng: 16.54870 };
  let zoom = 11;

  const setCenterAndZoom = () => {
    let center;
    let zoom;
    switch (true) {
      case window.innerWidth <= 1024:
        center = { lat: 49.60918, lng: 16.66541 };
        zoom = 10;
        break;
      case window.innerWidth <= 1366:
        center = { lat: 49.20818, lng: 16.46286 };
        zoom = 11;
        break;
      case window.innerWidth <= 1920:
        center = { lat: 49.20818, lng: 16.35286 };
        zoom = 11;
        break;
      default:
        center = { lat: 49.229709, lng: 16.54870 };
        zoom = 12;
        break;
    }
    map.setCenter(center);
    map.setZoom(zoom);
  };

  const map = new google.maps.Map(mapElement, {
    mapId: '1fe75d9e7f76ee36',
    center: center, // Initial center
    zoom: zoom, 
    disableDefaultUI: true,
    gestureHandling: "cooperative",
  });

  // Set initial center and zoom level
  setCenterAndZoom();

  // Adjust center and zoom level on window resize
  window.addEventListener('resize', setCenterAndZoom);

  const markersData = [
    {
      position: { lat: 49.17764, lng: 16.69207 },
      title: `${t('contact.map.window.elendris')}`,
      pic: "/images/map/elendris.avif",
      desc: "Útulné ubytování v rodinné atmosféře",
      icon: "/images/map/marker.svg",
    },
    {
      position: { lat: 49.1816, lng: 16.668712 },
      title: `${t('contact.map.window.bruno')}`,
      pic: "/images/map/bruno.avif",
      link: "https://www.brunofamilypark.cz/",
      icon: "/images/map/interest.svg",
    },
    {
      position: { lat: 49.15901, lng: 16.86439 },
      title: `${t('contact.map.window.golf')}`,
      pic: "/images/map/austerlitz.avif",
      link: "https://www.agrt.cz/",
      icon: "/images/map/interest.svg",
    },
    {
      position: { lat: 49.194828, lng: 16.60857 },
      title: `${t('contact.map.window.historicalCenter')}`,
      pic: "/images/map/brno.avif",
      link: "https://www.gotobrno.cz/",
      icon: "/images/map/interest.svg",
    },
    {
      position: { lat: 49.30782, lng: 16.69971 },
      title: `${t('contact.map.window.moravianKarst')}`,
      pic: "/images/map/moravskykras.avif",
      link: "https://www.moravskykras.net/",
      icon: "/images/map/interest.svg",
    },
  ];

  const infoWindow = new google.maps.InfoWindow();

  // Function to close infoWindow
  const closeInfoWindow = () => {
    infoWindow.close();
  };

  // Iterate over the markersData array to create markers and info windows
  markersData.forEach((data) => {
    const markerElement = document.createElement('img');
    markerElement.src = data.icon;
    markerElement.alt = data.title;
    markerElement.title = data.title;
    markerElement.style.width = '32px';
    markerElement.style.height = '32px';
  
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: data.position,
      map: map,
      title: data.title,
      content: markerElement,
    });
  
    marker.addListener("click", () => {
      infoWindow.setContent(`
        <div class="map__window">
          <img src="${data.pic}" alt="${data.title}" title="${data.title}" width="260px" height="120px" loading="lazy" />
          <div>
            <strong>${data.title}</strong>
            ${data.desc ? `<span>${data.desc}</span>` : ""}
            ${data.link 
              ? `<a href="${data.link}" class="link" target="_blank">
                  ${t('contact.map.window.moreInfo')}
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" class="icon">
                    <g id="icomoon-ignore">
                    </g>
                    <path d="M503.543 275.965c5.372-5.143 8.457-12.343 8.457-19.886s-3.085-14.629-8.457-19.886l-201.143-192c-10.971-10.514-28.343-10.057-38.743 0.914s-10.056 28.343 0.914 38.743l151.542 144.799h-388.686c-15.2 0-27.428 12.229-27.428 27.429s12.229 27.428 27.428 27.428h388.686l-151.658 144.685c-10.971 10.514-11.314 27.772-0.914 38.745 10.4 10.969 27.772 11.31 38.743 0.913l201.142-192.001 0.115 0.114z"></path>
                  </svg>
                </a>` 
              : ""}
          </div>
        </div>
      `);
      infoWindow.open(map, marker);
    });
  });

  window.addEventListener("click", (event) => {
    if (!mapElement.contains(event.target as Node)) {
      closeInfoWindow();
    }
  });
};

window.initMap = initMap;

export function loadGoogleMapsAPI() {
  const loader = new Loader({
    apiKey: "AIzaSyCxLnuRF4MRFg7MErCYXcdroyHYeLYUUfo", // Replace with your actual API key
    version: "weekly",
    libraries: ["places", "marker"], // Add additional libraries if needed
  });

  loader
    .load()
    .then(() => {
      // API loaded successfully, now you can initialize your map
      window.initMap();
    })
    .catch((error) => {
      console.error("Error loading Google Maps API:", error);
    });
}