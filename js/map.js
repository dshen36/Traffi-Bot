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

function drawMarkers(google_map, location, coordinates, battery_level) {
  // Custom pin depending on color of battery level
  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + calculatePinColor(battery_level),
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34));

  var marker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    position: coordinates,
    map: google_map,
    icon: pinImage,
    title: location
  });

  google.maps.event.addListener(marker, 'click', function(){
   getDataFromDB(location);
  });
}