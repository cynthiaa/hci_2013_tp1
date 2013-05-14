require(
    [
        "libs/text!../templates/passengers/passengers.html",
        "libs/text!../templates/passengers/passenger_data.html",
        "libs/text!../templates/select.html",
        "libs/text!../templates/select.html",
        "libs/utils",
        "libs/carousel",
        "libs/domReady"
    ],

    function(passengers_html, passenger_data_html, select_html) {

        Utils.init();
        Utils.make_non_menu_html(passengers_html);

        var passenger_data_tmp = Handlebars.compile(passenger_data_html);

        /* Para cada pasajero */

        $('#pass-ctn').append(passenger_data_tmp({"title": "Adultos"}));
        $('#pass-ctn').append(passenger_data_tmp({"title": "Menores"}));
        $('#pass-ctn').append(passenger_data_tmp({"title": "Infantes"}));

        var select_tmp = Handlebars.compile(select_html);

        current_year = new Date().getFullYear();

        for (var i = 1; i <= 31; i++) {
            $("#select_birth_day").append(select_tmp({"value": i, "name": i}));
        }

       for (var i = 1; i <= 12; i++) {
            $("#select_birth_month").append(select_tmp({"value": i, "name": i}));
        }

        for (var i = 1900; i <= current_year; i++) {
            $("#select_birth_year").append(select_tmp({"value": i, "name": i}));
        }

    }
);

