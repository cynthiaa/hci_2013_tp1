require(
    [
        "libs/text!../templates/flights/flights.html",
        "libs/text!../templates/flights/flights_data.html",
        "libs/utils",
        "libs/carousel",
        // "libs/calendar/calendar",
        // "libs/calendar/calendar-es",
        // "libs/calendar/calendar-setup",
        "libs/hci.api",
        "libs/domReady"
    ],

    function(flights_html, flights_data_html) {

        Utils.init();
        Utils.make_html(flights_html);
        
        var param = {"from": "EZE", "to": "MIA", "dep_date": "2013-08-19", "ret_date": "2013-09-1", "adults": "1", "children": "0", "infants": "0"}
        var callback = {"success": 
        
	        function(data){
	        	for (var i = 0; i <= data.flights.length; i++) {
	        		var flight_data_tmp = Handlebars.compile(flight_data_html);
	        		$('#caca').append(data.toString());
					// $('#flights').append(flights_data_tmp({"departureCity" :}));
			}},
		"error": function(data){}}
		console.log(HCI.prototype);
        var url = HCI.prototype.call("Misc.groovy", "GetRoundTripFlights", param, callback);
		
	}
);

