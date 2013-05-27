var validator = new FormValidator('payment-form', [{
	name : 'card_num',
	display : 'numero de tarjeta',
	rules : 'required|max_legth(16)|numeric'
}, {
	name : 'exp-date',
	display : 'fecha de vencimiento',
	rules : 'required|max_length(10)'
}, {
	name : 'security_code',
	display : 'codigo de seguridad',
	rules : 'required|max_length(3)|numeric'
}, {
	name : 'name',
	display : 'nombre',
	rules : 'required|alpha'
}, {
	name : 'lastname',
	display : 'apellido',
	rules : 'required|alpha'
}, {
	name : 'dni',
	rules : 'required|numeric|max_length(8)'
}, {
	name : 'email',
	rules : 'required|valid_email'
}], function(errors, e) {
	var SELECTOR_ERRORS = $('.payment-error');
	SELECTOR_ERRORS.empty();

	if (errors.length > 0) {
		for (var i = 0; i < errors.length; i++)
			SELECTOR_ERRORS.append(errors[i].message + '<br />');

		SELECTOR_ERRORS.fadeIn(200);
	} else {
		var param = $.url().param();
		Utils.stopEvent(e);
		api.booking.bookFlight2(function(data) {
		}, param);
		document.location.href = Utils.getUrl("confirmation.html", param);
	}
}); 