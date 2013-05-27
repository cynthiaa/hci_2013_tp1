var types = {
	'adults' : 'Adultos',
	'children' : 'Menores',
	'infants' : 'Infantes'
};

require([
        "libs/text!../templates/passengers/passengers.html",
        "libs/text!../templates/passengers/passenger_data.html",
        "libs/text!../templates/passengers/passenger_summary.html",
        "libs/text!../templates/passengers/passenger_title.html",
        "libs/text!../templates/passengers/passengerValidation.html",
        "libs/utils",
        "libs/jquery.validate",
        "libs/jquery.maskedinput",
        "libs/jquery.formvalidator.min",
        "libs/domReady"
        ],

    function(passengers_html, passenger_data_html, passenger_summary_html, passenger_title_html, passenger_validation_html) {

	Utils.init();
	Utils.make_non_menu_html(passengers_html, passenger_validation_html);

	var passenger_data_tmp = Handlebars.compile(passenger_data_html);
	var passenger_summary_tmp = Handlebars.compile(passenger_summary_html);
	var passenger_title_tmp = Handlebars.compile(passenger_title_html);

	var api = new API();
	var param = $.url().param();
	var n_adults = Number(param["adults"]);
	var n_children = Number(param["children"]);
	var n_infants = Number(param["infants"]);

	if (param["gender-0"] == "female" || param["gender-0"] == "male")
		addDataPassengers(param, n_adults + n_children + n_infants);
	else {

		addPassengers("Adultos", n_adults);
		addPassengers("Menores", n_children);
		addPassengers("Infantes", n_infants);
	}
	Utils.dateMask("input.birth");

	$("#back").click(function() {
		var oldUrl = $(location).attr('href');
		var auxUrl = oldUrl.split("&from=");
		var newUrl = Utils.getUrl("flights.html", {}) + "&from=" + auxUrl[1];
		document.location.href = newUrl;
	});

	showData("Ida");

	if (param.ret_date != "null") {

		showData("Vuelta");
	}

	function showData(type) {

		var prefix = (type == "Vuelta") ? "ret" : "";

		$("#summary").append(passenger_summary_tmp({
			"type" : type,
			"title" : type,
			"departureCity" : param[prefix + "departureCity"],
			"arrivalCity" : param[prefix + "arrivalCity"],
			"departureTime" : param[prefix + "departureTime"],
			"arrivalTime" : param[prefix + "arrivalTime"],
			"departureAirport" : "caca", 
			"arrivalAirport" : "caca2",
			"flightClass" : param[prefix + "flightClass"],
			"flightStopovers" : param[prefix + "flightStopovers"],
			"flightDuration" : param[prefix + "flightDuration"],
			"flightTotal" : param[prefix + "flightTotal"],
		}));

	}

	function addDataPassengers(param, n) {

		var flags = {
			'adults' : false,
			'children' : false,
			'infants' : false
		};

		for (var i = 0; i < n; i++) {

			var type = param["type-" + i];

			if (!flags[type]) {

				$('#pass-ctn').append(passenger_title_tmp({
					"title" : types[type]
				}));
				flags[type] = true;
			}

			$('#pass-ctn').append(passenger_data_tmp({
				id : i
			}));

			$('#' + i + ' input.name').val(param["name-" + i]);
			$('#' + i + ' input.surname').val(param["surname-" + i]);
			$('#' + i + ' input.birth').val(param["birth-" + i]);
			$('#' + i + ' select.gender').val(param["gender-" + i]);
		}
	}

	function addPassengers(title, n) {
		if (n == 0)
			return;

		($('#pass-ctn').append(passenger_title_tmp({
				"title" : title
			})));

		while (n) {
			($('#pass-ctn').append(passenger_data_tmp({
					"name" : "name" + n,
					"lastname" : "lastname" + n,
					"birth" : "birth" + n,
					"gender" : "gender" + n
				})));
				n--;
		}
	}

	function constructFrom(index, str, json) {
		for (var i = index; i < (index + Number(param[str])); i++) {
			$(json).prop("name-" + i, $(".name").eq(i).val());
			$(json).prop("surname-" + i, $(".surname").eq(i).val());
			$(json).prop("birth-" + i, $(".birth").eq(i).val());
			$(json).prop("gender-" + i, $(".gender option:checked").eq(i).val());
			$(json).prop("type-" + i, str);
		}
		return i;
	}

	function makeJson() {
		var json = new Object();
		constructFrom(constructFrom(constructFrom(0, "adults", json), "children", json), "infants", json);
		return json;
	}

});

