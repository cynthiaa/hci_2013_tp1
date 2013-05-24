var validator = new FormValidator('passenger-form', [{
	name : 'name',
	display : 'nombre',
	rules : 'required|alpha'
}, {
	name : 'lastname',
	display : 'apellido',
	rules : 'required|alpha'
}, {
	name : 'birth',
	display : 'fecha de nacimiento',
	rules : 'required'
}, {
	name : 'gender',
	display : 'sexo',
	rules : 'required'
}], function(errors, e) {
	console.log("CACONA");
	var SELECTOR_ERRORS = $('.passenger-error');
	if (errors.length > 0) {
		SELECTOR_ERRORS.empty();

		for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
			SELECTOR_ERRORS.append(errors[i].message + '<br />');
		}
		SELECTOR_ERRORS.fadeIn(200);
	} else {

		Utils.stopEvent(e);
		document.location.href = Utils.getUrl("payment.html", Utils.jsonConcat(param, makeJson()));
	}
});

