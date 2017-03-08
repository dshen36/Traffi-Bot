// Combination of factors to determine the overall health of the robot.
function calculateHealthStatus(batteryLevel) {
	if (batteryLevel > 20) {
		return "Healthy";
	}
	return "Unhealthy";
}

function calculatePinColor(batteryLevel) {
	if (batteryLevel >= 50) {
		return "239B56";
	} else if (batteryLevel >= 20) {
		return "F4D03F";
	} else {
		return "CB4335";
	}
}