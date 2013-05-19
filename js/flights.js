require(
    [
        "libs/text!../templates/flights/flights.html",
        "libs/text!../templates/flights/flights_data.html",
        "libs/utils",
        "libs/carousel",
        // "libs/calendar/calendar",
        // "libs/calendar/calendar-es",
        // "libs/calendar/calendar-setup",
        "libs/api",
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

    // Ejemplos de uso de la API
    // Esto está sólo para probar la API, borrar TODO

        var api = new API();

        api.misc.getLanguages({

            success: function(result) {
                $("#uuid").text(result.meta.uuid);
                $("#time").text(result.meta.time);

                for (var i = 0; i < result.languages.length; i++) {

                    var li = $("<li>" + result.languages[i].name + " (" +
                        result.languages[i].languageId + ")" + "</li>");
                    $("ul").append(li);
                }
            }
        });

        var params = {"page": "1"};

        api.misc.getCurrencies({

            success: function(result) {

                for (var i = 0; i < result.currencies.length; i++) {

                    var li = $("<li>" + result.currencies[i].description + " (" +
                        result.currencies[i].currencyId + ")" + "</li>");
                    $("ul").append(li);
                }
            }
        }, params);

	}
);

