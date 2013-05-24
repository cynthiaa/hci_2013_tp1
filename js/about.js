require(
    [
        "libs/text!../templates/about/about.html",
        "libs/text!../templates/sideValidation.html",
        "libs/utils",
        "libs/carousel",
        // "libs/calendar/calendar",
        // "libs/calendar/calendar-es",
        // "libs/calendar/calendar-setup",
        "libs/domReady"
 ],

    function(about_html, side_validation_html) {

        Utils.init();
        Utils.make_html(about_html, side_validation_html);

        $("#about_link").addClass("selected");
    }
);

