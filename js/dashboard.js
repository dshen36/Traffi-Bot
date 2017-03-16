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

// Logic used to edit text divs that look normal
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




// Unique ID coutner add-on
var alert_counter = 0;

// general method to create alerts
bootstrap_alert = function () {}
bootstrap_alert.warning = function (message, alert, timeout) {
	var alert_id = "floating_alert_" + alert_counter++;
    $('<div id=' + alert_id + ' class="alert alert-' + alert + ' alert-dismissable fade in"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' + message + '</div>').appendTo('#content');

    // closes the alert automatically after a timeout
    setTimeout(function () {
        $("#" + alert_id).alert('close');
    }, timeout);
}

// Alert for marker add on
$(document).ready(function () {
    $('#add-robot-marker').click(function () {
    	bootstrap_alert.warning('Please move the red marker to the desired traffic point of interest!', 'info', 4000);
    })
});

// Alert for traffic boundaries for traffic intersection
$(document).ready(function () {
    $('#add-robot-boundaries').click(function () {
    	bootstrap_alert.warning('Draw a small path through the previously marked point. \
    		This will serve as the boundaries of this intersection. Click on the map <strong> near the road </strong>\
    		and draw throught the intersection. Double click to stop drawing', 'info', 5000);
    })
});