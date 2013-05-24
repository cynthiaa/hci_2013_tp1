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

            /* Passengers */

            addPassengers("Adultos", Number(param["adults"]));
            addPassengers("Menores", Number(param["children"]));
            addPassengers("Infantes", Number(param["infants"]));

            current_year = new Date().getFullYear();

            Utils.dateMask("input.birth");

            $("#back").click(function(){

                document.location.href = Utils.getUrl("flights.html", param);
            });

            showData("Ida");

            function showData(type) {

                $("#summary").append(passenger_summary_tmp({

                    "type": type,
                    "departureCity": param["departureCity"],
                    "arrivalCity": param["arrivalCity"],
                    "departureTime": param["departureTime"],
                    "arrivalTime": param["arrivalTime"],
                    "flightClass": param["flightClass"],
                    "flightStopovers": param["flightStopovers"],
                    "flightDuration": param["flightDuration"],
                    "flightTotal": param["flightTotal"],
                }));

            }


            function addPassengers(title, n) {

                if (n == 0) return;

                ($('#pass-ctn').append(passenger_title_tmp({"title": title}))).append(passenger_data_tmp({}));

                while(--n) {

                    ($('#pass-ctn').append(passenger_data_tmp({})));
                }
            }
});

