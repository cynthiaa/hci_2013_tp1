var validator = new FormValidator('payment-form', [{
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
		var errorString = '';
		for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
			errorString += errors[i].message + '<br />';
			console.log(errors[i].message);
		}
	} else {
		Utils.stopEvent(e);
		window.location.href = Utils.getUrl("confirmation.html", Utils.setAttrs());
	}
});