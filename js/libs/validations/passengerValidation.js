var validate = new function() {
	var validator = new FormValidator('passenger-form', [{
		name: 'name',
		display: 'nombre',
		rules: 'required|alpha'
		}, {
		name: 'lastname',
		display: 'apellido',
		rules: 'required|alpha'
		}, {
		name: 'birth',
		display:'fecha de nacimiento',
		rules: 'required'
		},{
		name: 'gender',
		display: 'sexo',
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
            window.location.href = Utils.getUrl("payment.html", Utils.setAttrs());
        }
	});
}