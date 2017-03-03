
var CAMPUS = {lat: 33.7756, lng: -84.3963};

var FERST_AND_SIXTH = {lat: 33.777289,lng: -84.402403};
var CRC_CROSSWALK = {lat: 33.775430,lng: -84.402557};

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
  drawMarkers(map,CRC_CROSSWALK);
  drawMarkers(map,FERST_AND_SIXTH);
}

function drawMarkers(google_map, location) {
  var marker = new google.maps.Marker({
    position: location,
    map: google_map,
    title: 'Test_Robot'
  });
}