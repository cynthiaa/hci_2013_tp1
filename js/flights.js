require(["libs/text!../templates/flights/flights.html",
        "libs/text!../templates/flights/flights_data.html",
        "libs/utils",
        "libs/carousel",
        "libs/domReady"],

        function(flights_html, flights_data_html) {

		Utils.init();
        Utils.make_html(flights_html);

    	var api = new API();
    	var flights_data_tmp = Handlebars.compile(flights_data_html);

        var param = $.url().param();
        console.log(param);

    	var callback = {

		    success : function(result) {

                for (var i = 0; i < result.flights.length; i++) {

                    var flight = result.flights[i];
                    var route;
                    var segment;
                    var form;

                    if (flight.hasOwnProperty('inboundRoutes')) {

                        route = flight.inboundRoutes[0];
                        form = ".inbound form";

                    } else {

                        route = flight.outboundRoutes[0];
                        form = ".outbound form";
                    }

                    segment = route.segments[0];

                    $(form).append(flights_data_tmp({

                        "departureCity" : segment.departure.cityName,
                        "arrivalCity" : segment.arrival.cityName,
                        "departureTime" : segment.departure.date.substring(11),
                        "arrivalTime" : segment.arrival.date.substring(11),
                        "flightClass" : segment.cabinType,
                        "flightStopovers" : segment.stopovers.length,
                        "flightDuration" : segment.duration
                    }));
                }
           }
	};

	$("#selectionOrder").change(function() {
		param.sort_key = $.trim($("#selectionOrder :selected").val().match(".* ")[0]);
		param.sort_order = $.trim($("#selectionOrder :selected").val().match(" .*")[0]);
		$(".inbound form").remove();
		$(".outbound form").remove();
		api.booking.getRoundTripFlights(callback, param);
	});

    api.booking.getRoundTripFlights(callback, param);

});

