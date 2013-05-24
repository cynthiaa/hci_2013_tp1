var validator = new FormValidator('contact-form', [{
	name: 'subject',
	display: 'asunto',
	rules: ''
	}, {
	name: 'email',
	rules: 'valid_email|required'
	}, {
	name: 'body',
	display:'mensaje',
	rules: ''
	}], function(errors, event) {
	if (errors.length > 0) {
		var errorString = '';
		for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
			errorString += errors[i].message + '<br />';
			console.log(errors[i].message);
		}
	}
});
