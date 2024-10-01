import { Loader } from "@googlemaps/js-api-loader";

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

const initMap = (): void => {
  const mapElement = document.getElementById("map") as HTMLDivElement;

  const center = { lat: 49.19055, lng: 16.50246 };

  const map = new google.maps.Map(mapElement, {
    center: center,
    zoom: 12,
    disableDefaultUI: true,
    gestureHandling: "cooperative",
  });
  
  const markersData = [
    {
      position: { lat: 49.17764, lng: 16.69207 },
      title: "Elendris",
      pic: "https://elendris.cz/img/gril.webp",
      icon: "./images/map/marker.svg",
    },
    {
      position: { lat: 49.1816, lng: 16.668712 },
      title: "BRuNO family park",
      pic: "https://elendris.cz/img/bruno.webp",
      link: "https://www.brunofamilypark.cz/",
      icon: "./images/map/star.svg",
    },
    {
      position: { lat: 49.15901, lng: 16.86439 },
      title: "Mistrovské golfové hřiště Austerlitz",
      pic: "https://elendris.cz/img/austerlitz.webp",
      link: "https://www.agrt.cz/",
      icon: "./images/map/star.svg",
    },
    {
      position: { lat: 49.194828, lng: 16.60857 },
      title: "Historickém centrum města Brna",
      pic: "https://elendris.cz/img/brno.webp",
      link: "https://www.gotobrno.cz/",
      icon: "./images/map/star.svg",
    },
    {
      position: { lat: 49.30782, lng: 16.69971 },
      title: "Krásy Moravského krasu",
      pic: "https://elendris.cz/img/moravskykras.webp",
      link: "https://www.moravskykras.net/",
      icon: "./images/map/star.svg",
    },
  ];

  const infoWindow = new google.maps.InfoWindow();

  // Function to close infoWindow
  const closeInfoWindow = () => {
    infoWindow.close();
  };

  // Iterate over the markersData array to create markers and info windows
  markersData.forEach((data) => {
    const marker = new google.maps.Marker({
      position: data.position,
      map: map,
      title: data.title,
      icon: data.icon,
    });

    marker.addListener("click", () => {
      infoWindow.setContent(`
        <div>
          <h3>${data.title}</h3>
          <img src="${data.pic}" alt="${data.title}" style="width:100px;height:auto;">
          ${data.link && `<a href="${data.link}" target="_blank">More info</a>`}
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
    apiKey: "AIzaSyDL2nvxZgXk8NXOQmhizNX4HgrH5WbJnYk",
    version: "weekly",
    libraries: ["places"], // Add additional libraries if needed
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


