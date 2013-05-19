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

        var flights_data_tmp = Handlebars.compile(flights_data_html);

        /* Para cada pasajero, completar con la info correcta */

        $('#flight-container').append(flights_data_tmp({"departureCity": "City1",
             "arrivalCity": "City2", "departureTime": "Time1", "arrivalTime": "Time2",
             "flightClass": "Class", "flightScales": "Scales", "flightDuration": "Duration",
             "returningDepartureTime": "Time3", "returningArrivalTime": "Time4",
             "detailAdults": "Price1", "detailMinors": "Price2", "detailInfants": "Price3",
             "detailTaxes": "Taxes", "detailTotal": "Total"}));

	}
);

