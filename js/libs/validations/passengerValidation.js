var param = $.url().param();
var validator = new FormValidator('passenger-form', createPassengerRules(), function(errors, e) {
	var SELECTOR_ERRORS = $('.passenger-error');
	if (errors.length > 0) {
		SELECTOR_ERRORS.empty();
		for (var i = 0, errorLength = errors.length; i < errorLength; i++)
			SELECTOR_ERRORS.append(errors[i].message + '<br />');

		SELECTOR_ERRORS.fadeIn(200);
	} else {
		SELECTOR_ERRORS.empty();
		Utils.stopEvent(e);
		document.location.href = Utils.getUrl("payment.html", Utils.jsonConcat(param, makeJson()));
	}
});

function createPassengerRules() {
	var MAX_PASSENGERS = 7;
	var passengerRules = [];

	for (var i = 0; i < MAX_PASSENGERS; i++) {
		passengerRules[i] = {
			name : 'name' + i,
			display : 'Nombre',
			rules : 'required|alpha'
		}
		passengerRules[MAX_PASSENGERS + i] = {
			name : 'lastname' + i,
			display : 'Apellido',
			rules : 'required|alpha'
		}
		passengerRules[MAX_PASSENGERS * 2 + i] = {
			name : 'birth' + i,
			display : 'Fecha de nacimiento',
			rules : 'required'
		}
		passengerRules[MAX_PASSENGERS * 3 + i] = {
			name : 'gender' + i,
			display : 'Sexo',
			rules : 'required|alpha'
		}
	};
	return passengerRules;
}

function constructFrom(index, str, json) {
	for (var i = index; i < (index + Number(param[str])); i++) {
		$(json).prop("name-" + i, $(".name").eq(i).val());
		$(json).prop("surname-" + i, $(".surname").eq(i).val());
		$(json).prop("birth-" + i, $(".birth").eq(i).val());
		$(json).prop("gender-" + i, $(".gender option:checked").eq(i).val());
		$(json).prop("type-" + i, str);
	}
	return i;
}

function makeJson() {
	var json = new Object();
	constructFrom(constructFrom(constructFrom(0, "adults", json), "children", json), "infants", json);
	return json;
}