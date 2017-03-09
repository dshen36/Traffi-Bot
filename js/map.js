//Key Coordinates
// var CAMPUS = {lat: 33.7756, lng: -84.3963};
var CAMPUS = {lat: 33.774976 , lng: -84.396387};
var defaultZoom = 16;
var gMap;

function initMap() {
  gMap = new google.maps.Map(document.getElementById('map'), {
    zoom: defaultZoom,
    center: CAMPUS,
    scrollwheel: false,
    draggable: true,
    panControl: true,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    overviewMapControl: true,
    rotateControl: true
  });

  // Adding traffic data to the map
  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(gMap);

  // Recenter Button Logic
  var recenterDiv = document.createElement('div');
  var recenterButton = new RecenterButton(recenterDiv, map);
  recenterDiv.index = 10;
  gMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(recenterDiv);

  // Appending all of the markers to 
  getAllMarkers(gMap);
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

function RecenterButton(button_div, map) {
  // Set the CSS for the border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.margin = '10px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  button_div.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '13px';
  controlText.style.lineHeight = '32px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Center Map';
  controlUI.appendChild(controlText);

  // Reset Map Events
  controlUI.addEventListener('click', function() {
    gMap.panTo(CAMPUS);
  })
}