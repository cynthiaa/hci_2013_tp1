var validator = new FormValidator('payment-form', [{
	name : 'card_num',
	display : 'numero de tarjeta',
	rules : 'required|max_legth(16)|numeric|callback_is_valid_card'
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
	var param = $.url().param();
	var SELECTOR_ERRORS = $('.payment-error');
	SELECTOR_ERRORS.empty();
	var passengersArrayGenerator = function() {
		var arr= new Array();
		var aux;
		for(var i=0; i<param.adults ;i++) {
			aux= {
				"firstName" : $(param).attr("name-" + i),
				"lastName" : $(param).attr("surname-" + i),
				"birthdate" : $(param).attr("name-" + i),
				"idType" : 1,
				"idNumber" : $(".form-component-left input")[1].val()
			}
			arr.push(aux);
		}
		for(i=0; i<param.children ;i++) {
			aux= {
				"firstName" : $(param).attr("name-" + (i + param.adults)),
				"lastName" : $(param).attr("surname-" + (i + param.adults)),
				"birthdate" : $(param).attr("name-" + (i + param.adults)),
				"idType" : 1,
				"idNumber" : $(".form-component-left input")[1].val()
			}
			arr.push(aux);
		}
		for(i=0; i<param.infants ;i++) {
			aux= {
				"firstName" : $(param).attr("name-" + (i + param.children + param.adults)),
				"lastName" : $(param).attr("surname-" + (i + param.children + param.adults)),
				"birthdate" : $(param).attr("name-" + (i + param.children + param.adults)),
				"idType" : 1,
				"idNumber" : $(".form-component-left input")[1].val()	
			}
			arr.push(aux);
		}
	}

	if (errors.length > 0) {
		for (var i = 0; i < errors.length; i++)
			SELECTOR_ERRORS.append(errors[i].message + '<br />');

		SELECTOR_ERRORS.fadeIn(200);
	} else {
		Utils.stopEvent(e);
		var json = {
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
		}
		console.log(json);
		api.booking.bookFlight2( function(data) {
			document.location.href = Utils.getUrl("confirmation.html", Utils.jsonConcat(param, makeJson()));
		}, json);
	}
});

validator.registerCallback("is_valid_card", function(value) {
	var api = new API();
	var callback = {
		success : function(result) {
			console.log(result);
			return result.valid;
		}
	}
	var params = {
		number : $("#card-num").val(),
		exp_date : $("#exp-date").val(),
		sec_code : $("#security-code").val()
	};
	var ans = api.booking.validateCreditCard(callback, params);

}).setMessage('is_valid_card', "El numero de tarjeta de crédito es inválido");

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