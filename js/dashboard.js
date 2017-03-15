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

var defaultText = 'Edit Robot Name';

function doneInput(i) {
    var input = $(i.target),
        label = input && input.prev();

    label.text(input.val() === '' ? defaultText : input.val());

    input.hide();
    label.show();
}

$('.clickedit').hide()
	.focusout(doneInput)
	.keyup(function (i) {
	    if ((i.which && i.which == 13) || (i.keyCode && i.keyCode == 13)) {
	        doneInput(i);
	        return false;
	    } else {
	        return true;
	    }
	})
	.prev().click(function () {
    $(this).hide();
    $(this).next().show().focus();
});