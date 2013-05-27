function isBetweenThirtyOneDays(date) { {
		var day = date.substr(0, 1);
		if (day > 31 || day < 1) {
			return false;
		} else {
			console.log("ENTRE A ESTE IF1");
			while (true);
			return true;
		}
	}
}

function isBetweenThirtyDays(date) { {
		var day = date.substr(0, 1);
		if (day > 30 || day < 1) {
			return false;
		} else {
			console.log("ENTRE A ESTE IF2");
			while (true);
			return true;
		}
	}
}

var validator = new FormValidator('side-form', [{
	name : 'from',
	display : 'origen',
	rules : 'required'
}, {
	name : 'to',
	display : 'destino',
	rules : 'required'
}, {
	name : 'depart',
	display : 'partida',
	rules : 'required|callback_check_date_range'
}, {
	name : 'return',
	display : 'regreso',
	rules : 'required'
}], function(errors, e) {

	var SELECTOR_ERRORS = $('.error');
	SELECTOR_ERRORS.empty();

	if (errors.length > 0) {
		for (var i = 0; i < errors.length; i++)
			$(".error").append(errors[i].message + '<br />');

		SELECTOR_ERRORS.fadeIn(200);
	} else {
		Utils.stopEvent(e);
		window.location.href = Utils.getUrl("flights.html", Utils.setAttrs());
	}
	errors = new Array();
});

// validator.registerCallback("check_date_range", function(value) {
	// var finalDate;
	// var dateRegex = /^(\d{4})\-(\d{1,2})\-(\d{1,2})\ (\d{1,2})\:(\d{1,2})\:(\d{1,2})$/;
	// var dateRegexResult = value.match(dateRegex);
	// var date = dateRegexResult[3] + "/" + dateRegexResult[2] + "/" + dateRegexResult[1] + " - " + dateRegexResult[4] + ":" + dateRegexResult[5];
// 	
	// var day = date.substr(0, 1);
	// if ( day = "02") {
		// var isLeap = new Date(date.substr(5, 9), 1, 29).getMonth() == 1;
		// if (isLeap) {
			// if (day < 1 || day > 28) {
				// return false;
			// }
			// return true;
		// } else {
			// console.log("NO ES BISIESTO!!!");
			// if (day < 1 || day > 29) {
				// return false;
			// } else {
				// return true;
			// }
		// }
	// } else if (( day = "01") || ( day = "03") || ( day = "05") || ( day = "07") || ( day = "08") || ( day = "10") || ( day = "12")) {
		// return isBetweenThirtyOneDays(value);
	// } else {
		// return isBetweenThirtyDays(value);
	// }
// }).setMessage('check_date_range', "El rango de la fecha no es válido");
