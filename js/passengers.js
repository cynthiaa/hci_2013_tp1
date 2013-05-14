require(
    [
        "libs/text!../templates/passengers/passengers.html",
        "libs/utils",
        "libs/carousel",
        "libs/domReady"
    ],

    function(passengers_html) {

        Utils.init();
        Utils.make_non_menu_html(passengers_html);
    }
);

