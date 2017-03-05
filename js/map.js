//Key Coordinates
var CAMPUS = {lat: 33.7756, lng: -84.3963};

// Dictionary of markers. eventually use info from DB.
var markers = {FERST_AND_SIXTH:{lat: 33.777289,lng: -84.402403},
               CRC_CROSSWALK:{lat: 33.775430,lng: -84.402557}};

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
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
  for (var marker in markers) { //cant do a for-each in chrome
    drawMarkers(map,marker);
  }
}

function drawMarkers(google_map, location) {
  var marker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    position: markers[location],
    map: google_map,
    title: location
  });
  google.maps.event.addListener(marker, 'click', function(){
   getDataFromDB(location);
  });
}