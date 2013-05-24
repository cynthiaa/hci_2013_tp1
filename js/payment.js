require(
    [
        "libs/text!../templates/payment/payment.html",
        "libs/text!../templates/select.html",
        "libs/text!../templates/payment/paymentValidation.html",
        "libs/text!../templates/payment/payment_summary_flights.html",
        "libs/utils",
        "libs/jquery.maskedinput",
        "libs/domReady"
    ],

    function(payment_html, select_html, payment_validation_html, payment_summary_flights_html) {

        Utils.init();
        Utils.make_non_menu_html(payment_html, payment_validation_html);

        var api = new API();
        var payment_summary_flights_tmp = Handlebars.compile(payment_summary_flights_html);

        jQuery(function($) {
            $("#exp-date").mask("99/9999");
        });

        // Cuando se clickee el button de id next, se debe validar la tarjeta

        $("#next").click(function(){

            var param = {
                "number": $('#card-num').val(),
                "exp_date": Utils.convertExpirationDate($('#select_expiration_month').val(), $('#select_expiration_year').val()),
                "sec_code": $('#security-code').val()
            };

            var callback = {
                success: function(result) {

                    window.alert("Los datos de la tarjeta son " + (result.valid == true ? "" : "in") + "correctos");
                }
            }

            console.log(param);
            api.booking.validateCreditCard(callback, param);

            // document.location.href = Utils.getUrl("flights.html", setAttrs());
        });
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
console.log("hola");
            }


            function addPassengers(title, n) {

                if (n == 0) return;

                // ($('#pass-ctn').append(passenger_title_tmp({"title": title}))).append(passenger_data_tmp({}));

                while(--n) {

                    ($('#pass-ctn').append(passenger_data_tmp({})));
                }
            }

    }
);

