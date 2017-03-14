// Key Coordinates
// var CAMPUS = {lat: 33.7756, lng: -84.3963};
var CAMPUS = {lat: 33.774976 , lng: -84.396387};
var defaultZoom = 16;
var gMap;
var apiKey = 'AIzaSyCDOqVS7BV2Pz4FLhJKhwzOY8qOb-I2gpQ';

// Markers for installation of new robot;
var newRobotMarker;
var newRobotBoundaryMarkerA;
var newRobotBoundaryMarkerB;

// PolyLines used to draw paths
var drawingManager;
var placeIdArray = [];
var polylines = [];
var snappedCoordinates = [];

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
  var recenterButton = new RecenterButton(recenterDiv, gMap);
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

function addMarker(coordinates) {
  // If a marker was already created, redirect user's attention to the existing marker
  if (newRobotMarker) {
    newRobotMarker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        newRobotMarker.setAnimation(null)
    }, 1500);
  } else {
    // Create a new marker at the center of campus, and allow user to drag.
    newRobotMarker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: coordinates,
      map: gMap,
      draggable: true,
      title: "Drag me to your desired spot!"
    });
    google.maps.event.addListener(newRobotMarker, 'dragend',function(){ 
      gMap.setZoom(17);
      gMap.panTo(newRobotMarker.getPosition());
      injectMarkerCoordinates('#coordinates-field',newRobotMarker.getPosition());
    })
    injectMarkerCoordinates('#coordinates-field',newRobotMarker.getPosition());
  }
}

$('#add-robot-marker').on('click', function() {
    addMarker(CAMPUS);
    gMap.panTo(CAMPUS);
})

function injectMarkerCoordinates(text_div, coordinates) {
  $(text_div).val(coordinates);
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

function clearLinesButtonMaker(button_div, map) {
  // Set the CSS for the border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.margin = '10px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to erase lines';
  button_div.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '13px';
  controlText.style.lineHeight = '32px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Erase Lines';
  controlUI.appendChild(controlText);

  // Reset Map Events
  controlUI.addEventListener('click', function(ev) {
    for (var i = 0; i < polylines.length; ++i) {
      polylines[i].setMap(null);
    }
    polylines = [];
    ev.preventDefault();
    injectMarkerCoordinates('#boundary-point-A','');
    injectMarkerCoordinates('#boundary-point-B','');
    return false;
  });
}

function estimateTraffic(pointA, pointB) {
  var service = new google.maps.DistanceMatrixService();

  service.getDistanceMatrix({
    origins: [pointA,pointB], //,pointB
    destinations: [pointA,pointB], //,pointA
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL,
    avoidHighways: false,
    avoidTolls: false,
    drivingOptions: {
      departureTime: new Date(Date.now()),
      trafficModel: 'bestguess'
    }
  }, callback);
}

function callback(response, status) {
  if (status != google.maps.DistanceMatrixStatus.OK) {
    vehicular_traffic_card.innerText = "Error!";
  } else {
    var origin = response.originAddresses[0];
    var destination = response.destinationAddresses[0];
    if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
      vehicular_traffic_card.innerText = "No routes found!";
    } else {
      console.log(response);
      var rows = response.rows;

      var max_duration_diff = Number.MIN_SAFE_INTEGER;
      var max_duration = 0;
      var max_duration_in_traffic = 0;

      for (var row in rows) {
        for (var element in response.rows[row].elements) {
          var duration = response.rows[row].elements[element].duration;
          var duration_in_traffic = response.rows[row].elements[element].duration_in_traffic;
          if (row != element && (duration_in_traffic.value - duration.value) > max_duration_diff) {
             max_duration_diff = duration_in_traffic.value - duration.value;
             max_duration = duration;
             max_duration_in_traffic = duration_in_traffic;
          }
        }
      }
      vehicular_traffic_card.innerText =  max_duration_in_traffic.value + "s (Expected " + max_duration.value + " s)";
    }
  }
}

function packCoordinates(latitude,longitude) {
  var coordinates = {};
  coordinates.lat = latitude;
  coordinates.lng = longitude;
  return coordinates;
}

$('#add-robot-boundaries').on('click', function() {
  initDrawingControl();
})


function initDrawingControl() {
  if(!drawingManager) {
    drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYLINE,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYLINE
        ]
      },
      polylineOptions: {
        strokeColor: '#696969',
        strokeWeight: 2
      }
    });
    drawingManager.setMap(gMap);

    // calculates road when drawing is complete
    drawingManager.addListener('polylinecomplete', function(poly) {
      var path = poly.getPath();
      polylines.push(poly);
      placeIdArray = [];
      runSnapToRoad(path);
    });

    var clearLinesDiv = document.createElement('div');
    var clearLinesButton = new clearLinesButtonMaker(clearLinesDiv, gMap);
    clearLinesDiv.index = 10;
    gMap.controls[google.maps.ControlPosition.TOP_CENTER].push(clearLinesDiv);
  }
}

// Snap a user-created polyline to roads and draw the snapped path
// Credit: Google Maps API
function runSnapToRoad(path) {
  var pathValues = [];
  for (var i = 0; i < path.getLength(); i++) {
    pathValues.push(path.getAt(i).toUrlValue());
  }

  $.get('https://roads.googleapis.com/v1/snapToRoads', {
    interpolate: true,
    key: apiKey,
    path: pathValues.join('|')
  }, function(data) {
    processSnapToRoadResponse(data);
    drawSnappedPolyline();
    injectPathEndpointsCoordinates();
  });
}

// Store snapped polyline returned by the snap-to-road service.
// Credit: Google Maps API
function processSnapToRoadResponse(data) {
  snappedCoordinates = [];
  placeIdArray = [];
  for (var i = 0; i < data.snappedPoints.length; i++) {
    var latlng = new google.maps.LatLng(
        data.snappedPoints[i].location.latitude,
        data.snappedPoints[i].location.longitude);
    snappedCoordinates.push(latlng);
    placeIdArray.push(data.snappedPoints[i].placeId);
  }
}

// Draws the snapped polyline (after processing snap-to-road response).
// Credit: Google Maps API
function drawSnappedPolyline() {
  var snappedPolyline = new google.maps.Polyline({
    path: snappedCoordinates,
    strokeColor: '#1077a4',
    strokeWeight: 5
  });

  snappedPolyline.setMap(gMap);
  polylines.push(snappedPolyline);
}

function injectPathEndpointsCoordinates() {
  coordinatesA = '(' + snappedCoordinates[0].lat() + ', ' + snappedCoordinates[0].lng() + ')';
  coordinatesB = '(' + snappedCoordinates[snappedCoordinates.length-1].lat() +
                 ', ' + snappedCoordinates[snappedCoordinates.length-1].lng() + ')';

  injectMarkerCoordinates('#boundary-point-A',coordinatesA);
  injectMarkerCoordinates('#boundary-point-B',coordinatesB);

  // console.log(snappedCoordinates[snappedCoordinates.length-1]);
  //injectMarkerCoordinates
}
