var config = {
    apiKey: "AIzaSyBubL-kdF-06j1Ap3gfNewSy92xUHpQgkI",
    authDomain: "traffi-bot.firebaseapp.com",
    databaseURL: "https://traffi-bot.firebaseio.com",
    storageBucket: "traffi-bot.appspot.com",
    messagingSenderId: "1076814412978"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// Reference to specifically the robots
var robotRefDB = database.ref().child('robots');
var trafficBoundaryRefDB = database.ref().child('traffic_boundaries');

// Initiates General Statistics
robotRefDB.on('value', function(snapshot) {
    document.getElementById('count').innerText = Object.keys(snapshot.val()).length;
})

// Retrieving all robots
function getAllMarkers(map) {
    robotRefDB.on('value', function(snapshot) {
        var robots = snapshot.val();
        Object.keys(robots).forEach(function(location) {
            var coordinates = packCoordinates(robots[location]['latitude'],robots[location]['longitude']);
            var battery_percentage = robots[location]['battery_level'];
            drawMarkers(map,location,coordinates,battery_percentage);
        })
    })
}

// IDs of text to change
var location_card = document.getElementById('location');
var health_status_card = document.getElementById('health-status');
var battery_level_card = document.getElementById('battery-level');  //normally would just poll robot for battery level
var vehicular_traffic_card = document.getElementById('vehicular-traffic');
var pedestrian_traffic_card = document.getElementById('pedestrian-traffic');
var traffic_pattern_card = document.getElementById('traffic-pattern');

//synchronizing object changes in real time. via on method
// dbRefObject.on('value', snap => console.log(snap.val()));
//on points at the location of the inputted parameter
//pulls down information on every change referring to the inputted parameter
    //snap parameter = data snapshot. an entire tuple of values so only need .val()

function getDataFromDB(location) {
    var robotRefObject = robotRefDB.child(location);
    robotRefObject.on('value', function(snapshot) {
        location_card.innerText = snapshot.val().location;
        battery_level_card.innerText = snapshot.val().battery_level + "%";
        health_status_card.innerText = calculateHealthStatus(snapshot.val().battery_level);
    });

    var trafficBoundaries = trafficBoundaryRefDB.child(location);
    trafficBoundaries.on('value', function(snapshot) {
        var p1 = packCoordinates(snapshot.val()['point1']['latitude'],snapshot.val()['point1']['longitude']);
        var p2 = packCoordinates(snapshot.val()['point2']['latitude'],snapshot.val()['point2']['longitude']);
        estimateTraffic(p1,p2);
    });
}

function writeRobotData(name, location, latitude, longitude) {
    database.ref('robots/' + name).set({
        location: location,
        latitude: latitude,
        longitude: longitude,
        battery_level: Math.floor(Math.random()*100 +1)
    });
}
