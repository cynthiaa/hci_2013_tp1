require(["libs/text!../templates/flights/flights.html", "libs/text!../templates/flights/flights_data.html", "libs/utils", "libs/carousel",
// "libs/calendar/calendar",
// "libs/calendar/calendar-es",
// "libs/calendar/calendar-setup",
// "libs/hci",
"libs/api", "libs/domReady"], function(flights_html, flights_data_html) {

	Utils.init();
	Utils.make_html(flights_html);

	var api = new API();
	var flights_data_tmp = Handlebars.compile(flights_data_html);
	var param = {
		"from" : "EZE",
		"to" : "MIA",
		"dep_date" : "2013-08-19",
		"ret_date" : "2013-09-01",
		"adults" : "1",
		"children" : "0",
		"infants" : "0"
	};
	api.booking.getRoundTripFlights({

		success : function(result) {
			console.log(result);
			for (var i = 0; i < result.flights.length; i++) {
				console.log(i);
				if (result.flights[i].hasOwnProperty('inboundRoutes')) {
					console.log("*1");
					$('#flight-container').append(flights_data_tmp({
						"inboundDepartureCity" : result.flights[i].inboundRoutes[0].segments[0].departure.cityName,
						"inboundArrivalCity" : result.flights[i].inboundRoutes[0].segments[0].arrival.cityName,
						"inboundDepartureTime" : result.flights[i].inboundRoutes[0].segments[0].departure.date.substring(11),
						"inboundArrivalTime" : result.flights[i].inboundRoutes[0].segments[0].arrival.date.substring(11),
						"inboundFlightClass" : result.flights[i].inboundRoutes[0].segments[0].cabinType,
						"inboundFlightStopovers" : result.flights[i].inboundRoutes[0].segments[0].stopovers.length,
						"inboundFlightDuration" : result.flights[i].inboundRoutes[0].segments[0].duration}));
				} else if (result.flights[i].hasOwnProperty('outboundRoutes')) {
					console.log("*2");
					$('#flight-container').append(flights_data_tmp({
						"outboundDepartureCity" : result.flights[i].outboundRoutes[0].segments[0].departure.cityName,
						"outboundArrivalCity" : result.flights[i].outboundRoutes[0].segments[0].arrival.cityName,
						"outboundDepartureTime" : result.flights[i].outboundRoutes[0].segments[0].departure.date.substring(11),
						"outboundArrivalTime" : result.flights[i].outboundRoutes[0].segments[0].arrival.date.substring(11),
						"outboundFlightClass" : result.flights[i].outboundRoutes[0].segments[0].cabinType,
						"outboundFlightStopovers" : result.flights[i].outboundRoutes[0].segments[0].stopovers.length,
						"outboundFlightDuration" : result.flights[i].outboundRoutes[0].segments[0].duration}));
				}
			};
			// console.log(result);
			// $("#uuid").text(result.meta.uuid);
			// $("#time").text(result.meta.time);

			// for (var i = 0; i < result.languages.length; i++) {
			//
			// var li = $("<li>" + result.flights[i].name + " (" +
			// result.flights[i].languageId + ")" + "</li>");
			// $("ul").append(li);
			// }
		}
	}, param);

	var params = {
		"page" : "3"
	};

	// api.misc.getCurrencies({
	//
	// success: function(result) {
	// $("#uuid").text(result.meta.uuid);
	// $("#time").text(result.meta.time);
	// console.log(result);
	// for (var i = 0; i < result.currencies.length; i++) {
	//
	// var li = $("<li>" + result.currencies[i].description + " (" +
	// result.currencies[i].currencyId + ")" + "</li>");
	// $("ul").append(li);
	// }
	// }
	// }, params);

});

