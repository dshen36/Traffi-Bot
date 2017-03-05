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
var dbRefObject = database.ref().child('robots');

// IDs of text to change
var location_card = document.getElementById('location');
var battery_level_card = document.getElementById('battery-level');  //normally would just poll robot for battery level
var traffic_pattern_card = document.getElementById('traffic-pattern');


// var dbRefObject = database.ref().child('CRC_CROSSWALK');
//remember: firebase inserts nodes into the database in a tree-like structure via key:value pairs, not like SQL DB
//ref function gets you to the root of the database
	//child, appends a child node to the previously captured node (in this case, root), and appends a new node to it
	//creates a child key (key:value node) of the inputed parameter. in this case location card.

//synchronizing object changes in real time. via on method
// dbRefObject.on('value', snap => console.log(snap.val()));
//on points at the location of the inputted parameter
//pulls down information on every change referring to the inputted parameter
	//snap parameter = data snapshot. an entire tuple of values so only need .val()

function getDataFromDB(location) {
	var robotRefObject = dbRefObject.child(location);
	robotRefObject.on('value', function(snapshot) {
		location_card.innerText = snapshot.val().location;
		battery_level_card.innerText = snapshot.val().battery_level;
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