console.log("ESTOY EN EL VALIDADOR!");
var passengerRules = [];
var MAX_PASSENGERS = 7;
var validator = new FormValidator('passenger-form', createPassengerRules(passengerRules), function(errors, e) {
	console.log("ESTOY EN LA FUNCION!");
	var SELECTOR_ERRORS = $('.passenger-error');
	if (errors.length > 0) {
		console.log("IF!");
		SELECTOR_ERRORS.empty();

		for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
			SELECTOR_ERRORS.append(errors[i].message + '<br />');
		}
		SELECTOR_ERRORS.fadeIn(200);
	} else {
		console.log("ELSE!");
		Utils.stopEvent(e);
		document.location.href = Utils.getUrl("payment.html", Utils.jsonConcat(param, makeJson()));
	}
});

var createPassengerRules = new function(passengerRules) {
	console.log("CREATE PASSENGER RULES!");
	for (var i = 0; i < MAX_PASSENGERS; i++) {
	  passengerRules[i] = {
		name : 'name' + i,
		display : 'Nombre',
		rules : 'required|alpha'
		}
	};
	
	for (var i = 0; i < MAX_PASSENGERS; i++) {
	  passengerRules[MAX_PASSENGERS + i] = {
		name : 'lastname' + i,
		display : 'Apellido',
		rules : 'required|alpha'
		}
	};
	
	for (var i = 0; i < MAX_PASSENGERS; i++) {
	  passengerRules[MAX_PASSENGERS*2 + i] = {
		name : 'birth' + i,
		display : 'Fecha de nacimiento',
		rules : 'required|alpha'
		}
	};
	
	for (var i = 0; i < MAX_PASSENGERS; i++) {
	  passengerRules[MAX_PASSENGERSS*3 + i] = {
		name : 'gender' + i,
		display : 'Sexo',
		rules : 'required|alpha'
		}
	};
	return passengerRules;
}


