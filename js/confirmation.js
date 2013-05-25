require(["libs/text!../templates/confirmation/confirmation.html", "libs/text!../templates/passengers/passenger_summary.html", "libs/text!../templates/payment/payment_summary.html", "libs/utils", "libs/jquery.maskedinput", "libs/domReady"], function(confirmation_html, passenger_summary_html, payment_summary_html) {

	Utils.init();
	Utils.make_non_menu_html(confirmation_html);

	var param = $.url().param();

	var passenger_summary_tmp = Handlebars.compile(passenger_summary_html);
	var paymeny_summary_tmp = Handlebars.compile(paymeny_summary_html);
	var n_adults = Number(param["adults"]);
	var n_children = Number(param["children"]);
	var n_infants = Number(param["infants"]);

	addPassengers("Adultos", n_adults);
	addPassengers("Menores", n_children);
	addPassengers("Infantes", n_infants);

	$(".summary").append(payment_summary_tmp({
		"type" : "flightTitle",
		"title" : "Resumen",
		"departureCity" : param[prefix + "departureCity"],
		"arrivalCity" : param[prefix + "arrivalCity"],
		"departureTime" : param[prefix + "departureTime"],
		"arrivalTime" : param[prefix + "arrivalTime"],
		"flightClass" : param[prefix + "flightClass"],
		"flightStopovers" : param[prefix + "flightStopovers"],
		"flightDuration" : param[prefix + "flightDuration"],
		"flightTotal" : param[prefix + "flightTotal"],
	}));
	$(".summary").append(passenger_summary_tmp({}));

	function addPassengers(title, n) {

		if (n == 0)
			return;
		($('#pass-ctn').append(passenger_title_tmp({
				"title" : title
			})));

		while (n) {($('.summary').append(passenger_data_tmp({
					"name" : "name" + n,
					"lastname" : "lastname" + n,
					"birth" : "birth" + n,
					"gender" : "gender" + n
				})));
			n--;
		}
	}

});

