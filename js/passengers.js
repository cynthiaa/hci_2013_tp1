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

            if (param.ret_date != "null") {

                showData("Vuelta");
            }

            $("#continue").click(function(){

                var json = makeJson();

                console.log(concat(param, json));
                // document.location.href = Utils.getUrl(concat(param, json));
            });

            function showData(type) {

                var prefix = (type == "Vuelta") ? "ret" : "";

                $("#summary").append(passenger_summary_tmp({
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

            function addPassengers(title, n) {

                if (n == 0) return;

                ($('#pass-ctn').append(passenger_title_tmp({"title": title}))).append(passenger_data_tmp({}));

                while(--n) {

                    ($('#pass-ctn').append(passenger_data_tmp({})));
                }
            }
	        function constructFrom(index, str, json) {
	            for(var i=index; i< (index + Number(param[str])) ;i++) {
					$(json).prop("name-" + i , $(".name").eq(i).val());
					$(json).prop("surname-" + i , $(".surname").eq(i).val());
					$(json).prop("birth-" + i , $(".birth").eq(i).val());
					$(json).prop("gender-" + i , $(".gender option:checked").eq(i).val());
					$(json).prop("type-" + i , str);
				}
				return i;
			}

            function makeJson () {
            	var json= new Object();
            	constructFrom(constructFrom(constructFrom(0, "adults", json), "children", json), "infants", json);
            	return json;
            }

});

