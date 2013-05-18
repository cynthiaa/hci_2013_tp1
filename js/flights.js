require(
    [
        "libs/text!../templates/flights/flights.html",
        "libs/utils",
        "libs/carousel",
        // "libs/calendar/calendar",
        // "libs/calendar/calendar-es",
        // "libs/calendar/calendar-setup",
        "libs/domReady"
    ],

    function(flights_html) {

        Utils.init();
        Utils.make_html(flights_html);
    }
);

