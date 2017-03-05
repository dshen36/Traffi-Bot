// Combination of factors to determine the overall health of the robot.
function calculateHealthStatus(batteryLevel) {
	if (batteryLevel > 30) {
		return "Healthy";
	}
	return "Unhealthy";
}