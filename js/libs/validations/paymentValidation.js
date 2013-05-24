var validator = new formvalidator('payment-form', [{
    name: 'card_num',
    display: 'numero de tarjeta',    
    rules: 'required|max_legth(16)|numeric'
}, {
    name: 'exp-date',
    display: 'fecha de vencimiento'
    rules: 'required|max_length(10)'
}, {
    name: 'security_code',
    display: 'codigo de seguridad',
    rules: 'required|max_length(3)|numeric'
}, {
    name: 'name',
    display: 'nombre',
    rules: 'required|alpha'
}, {
    name: 'lastname',
    display: 'apellido',
    rules: 'required|alpha'
}, {
    name: 'dni',
    rules: 'required|numeric|max_length(8)'
}, {
    name: 'email',
    rules: 'required|valid_email'
}], function(errors, event) {
	if (errors.length > 0) {
		var selector_errors = $('.payment-error');
		for (var i = 0, errorlength = errors.length; i < errorlength; i++) {
			selector_errors.append(errors[i].message + '<br />');
		}
		selector_errors.fadein(200);
	} else {
		utils.stopevent(e);
		/*
		var param = {
                "number": $('#card-num').val(),
                "exp_date": utils.convertexpirationdate($('#select_expiration_month').val(), $('#select_expiration_year').val()),
                "sec_code": $('#security-code').val()
		};

		var callback = {
			success: function(result) {
				window.alert("los datos de la tarjeta son " + (result.valid == true ? "" : "in") + "correctos");
			}
		}

		console.log(param);
		api.booking.validatecreditcard(callback, param);
           */ 
		window.location.href = utils.geturl("confirmation.html", utils.setattrs());
	}
});