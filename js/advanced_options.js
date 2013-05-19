require(
    [
        "libs/text!../templates/advanced_options/advanced_options.html",
        "libs/text!../templates/select.html",
        "libs/utils",
        "libs/carousel",
        // "libs/calendar/calendar",
        // "libs/calendar/calendar-es",
        // "libs/calendar/calendar-setup",
        "libs/domReady"
    ],

    function(advanced_options_html, select_html) {

        Utils.init();
        Utils.make_html(advanced_options_html);

        var select_tmp = Handlebars.compile(select_html);

        for (var i = 0; i <= 24; i++) {

            $("#select_departure_time").append(select_tmp({"value": i, "name": i + ":00"}));
            $("#select_return_time").append(select_tmp({"value": i, "name": i + ":00"}));
        }

        for (var i = 1; i <= 8; i++) {

            $("#select_stopovers").append(select_tmp({"value": i, "name": "Hasta " + i + " escala" + (i > 1 ? "s" : "")}));
        }

        var api = new API();

        var airlines = new Array();

        var callbacks = {

            success: function(result) {

            for (var i = 0; i < result.airlines.length; i++) {

                airlines[i] = result.airlines[i].name + " (" + result.airlines[i].airlineId + ")";
            }
        }};

        api.misc.getAirlines(callbacks);

        $("#airline").autocomplete({
            source: airlines
        });

        callbacks = {

            success: function(result) {

            for (var i = 0; i < result.currencies.length; i++) {

                var name = result.currencies[i].description;

                name = (name == "Pesos - Argentina") ? "Pesos" : name;

                $("#currency").append(select_tmp({"value": name, "name": name}));
            }
        }
        };

        var param = {"sort_key": "id", "sort_order": "asc"};

        api.misc.getCurrencies(callbacks, param);

    }
);

