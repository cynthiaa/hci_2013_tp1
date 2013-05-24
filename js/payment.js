require(
    [
        "libs/text!../templates/payment/payment.html",
        "libs/text!../templates/select.html",
        "libs/text!../templates/payment/paymentValidation.html",
        "libs/text!../templates/payment/payment_summary_flights.html",
        "libs/text!../templates/payment/payment_title.html",
        "libs/text!../templates/payment/payment_data_passenger.html",
        "libs/utils",
        "libs/jquery.maskedinput",
        "libs/domReady"
    ],

    function(payment_html, select_html, payment_validation_html, payment_summary_flights_html, payment_title_html, payment_data_passenger_html) {

        Utils.init();
        Utils.make_non_menu_html(payment_html, payment_validation_html);

        var param = $.url().param();
        var api = new API();
        var payment_summary_flights_tmp = Handlebars.compile(payment_summary_flights_html);
        var payment_title_tmp = Handlebars.compile(payment_title_html);
        var payment_data_passenger_tmp = Handlebars.compile(payment_data_passenger_html);

        jQuery(function($) {
            $("#exp-date").mask("99/9999");
        });

            console.log(param);
            /* Passengers */

            var n_adults = Number(param["adults"]);
            var n_children = Number(param["children"]);
            var n_infants = Number(param["infants"]);

            addPassengers(n_adults, n_children, n_infants);

            current_year = new Date().getFullYear();

            Utils.dateMask("input.birth");

            $("#back").click(function(){

                document.location.href = Utils.getUrl("flights.html", param);
            });

            showData("Ida");

            if (param.ret_date != "null") {

                showData("Vuelta");
            }

            function showData(type) {

                var prefix = (type == "Vuelta") ? "ret" : "";

                $("#summary").append(payment_summary_flights_tmp({

                    "type": type,
                    "title": type,
                    "departureCity": param[prefix + "departureCity"],
                    "arrivalCity": param[prefix + "arrivalCity"],
                    "departureTime": param[prefix + "departureTime"],
                    "arrivalTime": param[prefix + "arrivalTime"],
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

                for (var i = 0, count = 0; count < n && i < n_total; i++) {

                    if (param["type-" + i] == type) {

                        console.log(type);
                        console.log(i);
                        var attrs = {

                            'name': param["name-" + i],
                            'lastname': param["surname-" + i],
                            'gender': (param["gender-" + i] == "male" ? "Masculino" : "Femenino"),
                            'birth': param["birth-" + i]
                        };

                        console.log(attrs);
                       if (count++ == 0) {

                            ($('#pass-ctn').append(payment_title_tmp({"title": title}))).append(payment_data_passenger_tmp(attrs));
                        } else {

                            ($('#pass-ctn').append(payment_data_passenger_tmp(attrs)));
                        }
                    }
                }
            }
    }
);

