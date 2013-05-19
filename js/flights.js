require(["libs/text!../templates/flights/flights.html",
        "libs/text!../templates/flights/flights_data.html",
        "libs/utils",
        "libs/carousel",
        // "libs/calendar/calendar",
        // "libs/calendar/calendar-es",
        // "libs/calendar/calendar-setup",
        // "libs/hci",
        "libs/domReady"],

        function(flights_html, flights_data_html) {

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
		"infants" : "0",
		"sort_key" : $.trim($("#selectionOrder :selected").val().match(".* ")[0]),
		"sort_order" : $.trim($("#selectionOrder :selected").val().match(" .*")[0])
	};
	var callback = {
		success : function(result) {
			for (var i = 0; i < result.flights.length; i++) {
				if (result.flights[i].hasOwnProperty('inboundRoutes')) {
					$('.inbound form').append(flights_data_tmp({
						"departureCity" : result.flights[i].inboundRoutes[0].segments[0].departure.cityName,
						"arrivalCity" : result.flights[i].inboundRoutes[0].segments[0].arrival.cityName,
						"departureTime" : result.flights[i].inboundRoutes[0].segments[0].departure.date.substring(11),
						"arrivalTime" : result.flights[i].inboundRoutes[0].segments[0].arrival.date.substring(11),
						"flightClass" : result.flights[i].inboundRoutes[0].segments[0].cabinType,
						"flightStopovers" : result.flights[i].inboundRoutes[0].segments[0].stopovers.length,
						"flightDuration" : result.flights[i].inboundRoutes[0].segments[0].duration
					}));
				} else if (result.flights[i].hasOwnProperty('outboundRoutes')) {
					$('.outbound form').append(flights_data_tmp({
						"departureCity" : result.flights[i].outboundRoutes[0].segments[0].departure.cityName,
						"arrivalCity" : result.flights[i].outboundRoutes[0].segments[0].arrival.cityName,
						"departureTime" : result.flights[i].outboundRoutes[0].segments[0].departure.date.substring(11),
						"arrivalTime" : result.flights[i].outboundRoutes[0].segments[0].arrival.date.substring(11),
						"flightClass" : result.flights[i].outboundRoutes[0].segments[0].cabinType,
						"flightStopovers" : result.flights[i].outboundRoutes[0].segments[0].stopovers.length,
						"flightDuration" : result.flights[i].outboundRoutes[0].segments[0].duration
					}));
				}
			};
		}
	};

	$("#selectionOrder").change(function() {
		param = {
			"from" : "EZE",
			"to" : "MIA",
			"dep_date" : "2013-08-19",
			"ret_date" : "2013-09-01",
			"adults" : "1",
			"children" : "0",
			"infants" : "0",
			"sort_key" : $.trim($("#selectionOrder :selected").val().match(".* ")[0]),
			"sort_order" : $.trim($("#selectionOrder :selected").val().match(" .*")[0])};
		$(".flight").remove();
		$(".flight").remove();
		api.booking.getRoundTripFlights(callback, param);
	});
	api.booking.getRoundTripFlights(callback, param);
});

