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
	var passengersArrayGenerator = function() {
		
	}

	if (errors.length > 0) {
		for (var i = 0; i < errors.length; i++)
			SELECTOR_ERRORS.append(errors[i].message + '<br />');

		SELECTOR_ERRORS.fadeIn(200);
	} else {
		var param = $.url().param();
		Utils.stopEvent(e);
		api.booking.bookFlight2(function(data) {
			document.location.href = Utils.getUrl("confirmation.html", Utils.jsonConcat(param, makeJson()));
		}, {
			"flightId" : param.flightId,
			"passengers" : passengersArrayGenerator(), 
			"payment" : { 
				"creditCard" : {
					"number" : $("card-num").val(),
					"expiration" : $("exp-date").val(),
					"securityCode" : $("security-code").val(),
					"firstName" : $(".form-component-left input")[0].val(),
					"lastName" : $(".form-component-right input")[0].val()
				}				
			}, 
			"contact" : { 
				"email" : $(".form-component-right input")[1].val(),
				"phones" : ["555-5555"]
			}	
		});
	}
});

function makeJson() {
	var json = new Object();
	$(json).prop("card", $("input:checked").attr("id"));
	$(json).prop("cardnum", $("#card-num").val());
	$(json).prop("expdate", $("#exp-date").val());
	$(json).prop("securitycode", $("#security-code").val());
	$(json).prop("ownername", $("input[name='name']").val());
	$(json).prop("ownerlastname", $("input[name='lastname']").val());
	$(json).prop("ownerdni", $("input[name='dni']").val());
	$(json).prop("owneremail", $("input[name='email']").val());
	return json;
}