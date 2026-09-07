// Mapa real (OpenStreetMap vía Leaflet) con las ubicaciones de las tiendas HuertoHogar.
// No requiere API Key. Las coordenadas son las de la plaza/centro de cada ciudad.

document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.getElementById("mapa-real");
  if (!contenedor || typeof L === "undefined") return;

  const tiendas = [
    { nombre: "Valparaíso",   lat: -33.0472, lng: -71.6127 },
    { nombre: "Viña del Mar", lat: -33.0153, lng: -71.5500 },
    { nombre: "Santiago",     lat: -33.4489, lng: -70.6693 },
    { nombre: "Concepción",   lat: -36.8201, lng: -73.0444 },
    { nombre: "Nacimiento",   lat: -37.5022, lng: -72.6772 },
    { nombre: "Villarrica",   lat: -39.2827, lng: -72.2263 },
    { nombre: "Puerto Montt", lat: -41.4693, lng: -72.9424 },
  ];

  // Centro aproximado de Chile continental, con zoom que muestra todas las tiendas.
  const mapa = L.map("mapa-real", {
    scrollWheelZoom: false,
  }).setView([-36.5, -71.8], 4.6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> colaboradores',
    maxZoom: 18,
  }).addTo(mapa);

  const iconoTienda = L.divIcon({
    className: "pin-tienda-leaflet",
    html: '<span class="pin-punto-leaflet"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  const grupo = L.featureGroup();

  tiendas.forEach(function (tienda) {
    const urlGoogleMaps =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(tienda.nombre + ", Chile");

    const marcador = L.marker([tienda.lat, tienda.lng], { icon: iconoTienda }).bindPopup(
      '<strong>Tienda HuertoHogar</strong><br>' +
        tienda.nombre +
        '<br><a href="' +
        urlGoogleMaps +
        '" target="_blank" rel="noopener">Ver en Google Maps</a>'
    );

    marcador.addTo(mapa);
    grupo.addLayer(marcador);
  });

  // Ajusta el zoom/centro automáticamente para que se vean las 7 tiendas.
  mapa.fitBounds(grupo.getBounds().pad(0.15));

  // Permitir hacer zoom con la rueda solo cuando el usuario interactúa con el mapa,
  // para no "atrapar" el scroll de la página al pasar el mouse por encima.
  contenedor.addEventListener("mouseenter", function () {
    mapa.scrollWheelZoom.enable();
  });
  contenedor.addEventListener("mouseleave", function () {
    mapa.scrollWheelZoom.disable();
  });
});
