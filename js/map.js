//Key Coordinates
var CAMPUS = {lat: 33.7756, lng: -84.3963};

function initMap() {
  var gMap = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: CAMPUS,
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
  getAllLocations(gMap);
}

function drawMarkers(google_map, location, coordinates) {
  var marker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    position: coordinates,
    map: google_map,
    title: location
  });
  google.maps.event.addListener(marker, 'click', function(){
   getDataFromDB(location);
  });
}