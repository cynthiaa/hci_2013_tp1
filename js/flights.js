require(
    [
        "libs/text!../templates/flights/flights.html",
        "libs/utils",
        "libs/carousel",
        "libs/domReady"
    ],

    function(flights_html) {

        Utils.init();
        Utils.make_html(flights_html);
    }
);

