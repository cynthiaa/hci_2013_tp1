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

		if (errors.length > 0) {

		    var errorString = '';

			for (var i = 0, errorLength = errors.length; i < errorLength; i++) {

			    errorString += errors[i].message + '<br />';
				console.log(errors[i].message);
			}
		} else {

            Utils.stopEvent(e);
            window.location.href = Utils.getUrl("flights.html", Utils.setAttrs());
        }
	});
}
