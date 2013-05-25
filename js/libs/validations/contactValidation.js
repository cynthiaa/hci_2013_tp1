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
		var SELECTOR_ERRORS = $('.contact-error');
        
	if (errors.length > 0) {
		SELECTOR_ERRORS.empty();
		for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
			SELECTOR_ERRORS.append(errors[i].message + '<br />');
		}
        SELECTOR_ERRORS.fadeIn(200);
	} 
});

