var validate = new function() {
	var validator = new FormValidator('side-form', [{
		name: 'from',
		display: 'origen',
		rules: 'required'
		}, {
		name: 'to',
		display: 'destino',
		rules: 'required'
		}, {
		name: 'depart',
		display:'partida',
		rules: 'required'
		},{
		name: 'return',
		display: 'regreso',
		rules: 'required'
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
}

