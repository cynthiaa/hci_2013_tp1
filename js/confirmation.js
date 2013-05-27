require(
    [
        "libs/text!../templates/confirmation/confirmation.html",
        "libs/text!../templates/confirmation/confirmationValidation.html",
        "libs/text!../templates/passengers/passenger_summary.html",
        "libs/text!../templates/payment/payment_title.html",
        "libs/text!../templates/payment/payment_data_passenger.html",
        "libs/utils",
        "libs/jquery.maskedinput",
        "libs/domReady"
    ],

    function(confirmation_html, confirmation_validation_html, flight_data_summary_html, summary_passenger_title_html, summary_passenger_data_html) {

        Utils.init();
        Utils.make_non_menu_html(confirmation_html, confirmation_validation_html);
        
        var param = $.url().param();
		var flight_data_summary_html_tmp = Handlebars.compile(flight_data_summary_html);
		var summary_passenger_title_html_tmp = Handlebars.compile(summary_passenger_title_html);
		var summary_passenger_data_html_tmp = Handlebars.compile(summary_passenger_data_html);
		
		showData("Ida");
		if (param.ret_date != "null"){
			showData("Vuelta");
		}
		
		var n_adults = Number(param["adults"]);
		var n_children = Number(param["children"]);
		var n_infants = Number(param["infants"]);
		
		addPassengers(n_adults, n_children, n_infants);
		
		function showData(type) {
			var prefix = (type == "Vuelta") ? "ret" : "";
			$("#flight-summary").append(flight_data_summary_html_tmp({
				"type": type,
				"title": type,
				"departureCity": param[prefix + "departureCity"],
				"arrivalCity": param[prefix + "arrivalCity"],
				"departureTime": param[prefix + "departureTime"],
				"arrivalTime": param[prefix + "arrivalTime"],
				"departureAirport" : "caca", 
				"arrivalAirport" : "caca2",
				"flightClass": param[prefix + "flightClass"],
				"flightStopovers": param[prefix + "flightStopovers"],
				"flightDuration": param[prefix + "flightDuration"],
				"flightTotal": param[prefix + "flightTotal"],
			}));
		}
		
		function addPassengers(n_adults, n_children, n_infants) {
			var n_total = n_adults + n_children + n_infants;
			
			addPassengersByType(n_adults, n_total, "adults", "Adultos");
			addPassengersByType(n_children, n_total, "children", "Menores");
			addPassengersByType(n_infants, n_total, "infants", "Infantes");
		}
		
		function addPassengersByType(n, n_total, type, title) {
			
			for (var i=0, count=0; count<n && i<n_total ;i++)
				if (param["type-" + i] == type) {
					var attrs = {
						'name': param["name-" + i],
						'lastname': param["surname-" + i],
						'gender': (param["gender-" + i] == "male" ? "Masculino" : "Femenino"),
						'birth': param["birth-" + i]
					};
					
					if (count++ == 0)
						($('#passenger-summary').append(summary_passenger_title_html_tmp({"title": title}))).append(summary_passenger_data_html_tmp(attrs));
					else
						($('#passenger-summary').append(summary_passenger_data_html_tmp(attrs)));
				}
		}
    }
);

