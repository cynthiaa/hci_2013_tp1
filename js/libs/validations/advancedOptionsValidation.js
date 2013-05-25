var validator = new FormValidator('advancedForm', [{
	name : 'min-price',
	display : 'precio minimo',
	rules : 'numeric'
}, {
	name : 'max-price',
	display : 'precio maximo',
	rules : 'numeric'
}], function(errors, e) {
	if (errors.length > 0) {
		var SELECTOR_ERRORS = $('.error');
		SELECTOR_ERRORS.empty();
		console.log("ASDF");
		for (var i = 0, errorLength = errors.length; i < errorLength; i++) {

			$(".error").append(errors[i].message + '<br />');
		}
		SELECTOR_ERRORS.fadeIn(200);
	} else {
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
			rules : 'required'
		}], function(errors, e) {

			if (errors.length > 0) {
				var SELECTOR_ERRORS = $('.error');
				SELECTOR_ERRORS.empty();

				for (var i = 0, errorLength = errors.length; i < errorLength; i++) {

					$(".error").append(errors[i].message + '<br />');
				}
				SELECTOR_ERRORS.fadeIn(200);
			} else {
				Utils.stopEvent(e);
				window.location.href = Utils.getUrl("flights.html", Utils.setAttrs());
			}
		});
	}
	$(".side-form").submit();
});

