$(document).ready(function () {
	$('#connect-robot').click(function () {
		IP_Address = document.getElementById("IP-Address").value;
		// TODO: @STEVEN
		alert("Hello");

	})

	$('#start-button').click(function () {
		Vehicle_Duration = document.getElementById("vehicle-duration").value;
		Pedestrian_Duration = document.getElementById("pedestrian-duration").value;
		// TODO: @STEVEN
		alert('V: ' + Vehicle_Duration + ', P: ' + Pedestrian_Duration);

	})

	$('#stop-button').click(function () {
		// TODO: @STEVEN
		alert('Stop');
		
	})
});



