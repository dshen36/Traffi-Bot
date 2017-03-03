function initMap() {
  var location = {lat: 33.7756, lng: -84.3963};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: location,
    scrollwheel: false,
    draggable: false,
    panControl: true,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    overviewMapControl: true,
    rotateControl: true
  });
  drawMarkers(map,location);
}

function drawMarkers(google_map, location) {
  var marker = new google.maps.Marker({
    position: location,
    map: google_map
  });
}