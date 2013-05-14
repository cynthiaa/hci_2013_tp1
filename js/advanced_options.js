require(
    [
        "libs/text!../templates/advanced_options/advanced_options.html",
        "libs/text!../templates/select.html",
        "libs/utils",
        "libs/carousel",
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
    }
);

