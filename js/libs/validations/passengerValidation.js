var validator = new FormValidator('passenger-form', [{
	name : 'name1',
	display : 'nombre',
	rules : 'required|alpha'
}, {
	name : 'name2',
	display : 'nombre',
	rules : 'required|alpha'
}, {
	name : 'name3',
	display : 'nombre',
	rules : 'required|alpha'
}, {
	name : 'name4',
	display : 'nombre',
	rules : 'required|alpha'
}, {
	name : 'name5',
	display : 'nombre',
	rules : 'required|alpha'
}, {
	name : 'name6',
	display : 'nombre',
	rules : 'required|alpha'
}, {
	name : 'name7',
	display : 'nombre',
	rules : 'required|alpha'
}, {
	name : 'lastname1',
	display : 'apellido',
	rules : 'required|alpha'
}, {
	name : 'lastname2',
	display : 'apellido',
	rules : 'required|alpha'
}, {
	name : 'lastname3',
	display : 'apellido',
	rules : 'required|alpha'
}, {
	name : 'lastname4',
	display : 'apellido',
	rules : 'required|alpha'
}, {
	name : 'lastname5',
	display : 'apellido',
	rules : 'required|alpha'
}, {
	name : 'lastname6',
	display : 'apellido',
	rules : 'required|alpha'
}, {
	name : 'lastname7',
	display : 'apellido',
	rules : 'required|alpha'
}, {
	name : 'birth1',
	display : 'fecha de nacimiento',
	rules : 'required'
}, {
	name : 'birth2',
	display : 'fecha de nacimiento',
	rules : 'required'
}, {
	name : 'birth3',
	display : 'fecha de nacimiento',
	rules : 'required'
}, {
	name : 'birth4',
	display : 'fecha de nacimiento',
	rules : 'required'
}, {
	name : 'birth5',
	display : 'fecha de nacimiento',
	rules : 'required'
}, {
	name : 'birth6',
	display : 'fecha de nacimiento',
	rules : 'required'
}, {
	name : 'birth7',
	display : 'fecha de nacimiento',
	rules : 'required'
}, {
	name : 'gender1',
	display : 'sexo',
	rules : 'required'
}, {
	name : 'gender2',
	display : 'sexo',
	rules : 'required'
}, {
	name : 'gender3',
	display : 'sexo',
	rules : 'required'
}, {
	name : 'gender4',
	display : 'sexo',
	rules : 'required'
}, {
	name : 'gender5',
	display : 'sexo',
	rules : 'required'
}, {
	name : 'gender6',
	display : 'sexo',
	rules : 'required'
}, {
	name : 'gender7',
	display : 'sexo',
	rules : 'required'
}], function(errors, e) {
	var SELECTOR_ERRORS = $('.passenger-error');
	if (errors.length > 0) {
		SELECTOR_ERRORS.empty();

		for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
			SELECTOR_ERRORS.append(errors[i].message + '<br />');
		}
		SELECTOR_ERRORS.fadeIn(200);
	} else {

		Utils.stopEvent(e);
		document.location.href = Utils.getUrl("payment.html", Utils.jsonConcat(param, makeJson()));
	}
});

