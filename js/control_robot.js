var connected = false;
var IP_address;
// var socket = new io.Socket();
var socket;

$(document).ready(function () {
	$('#connect-robot').click(function () {
		IP_Address = document.getElementById("IP-Address").value;
		// TODO: @STEVEN
		try {
			var socket = new WebSocket('wss://' + IP_Address + ':5000');
		} catch (exception) {
			alert(exception);
		}
		// socket = io('http://' + IP_Address + ':5000');
		connected = true;
	});

	socket.onopen = function() {
		alert('Socket has been opened');
	}

	$('#start-button').click(function () {
		Vehicle_Duration = document.getElementById("vehicle-duration").value;
		Pedestrian_Duration = document.getElementById("pedestrian-duration").value;
		// TODO: @STEVEN
		if (connected) {
			alert('V: ' + Vehicle_Duration + ', P: ' + Pedestrian_Duration);
		} else {
			alert('Not connected yet');
		}
	});

	$('#stop-button').click(function () {
		// TODO: @STEVEN
		if (connected) {
			alert('Stop');
		} else {
			alert('Not connected yet');
		}
	});
});



