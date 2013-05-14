require(
    [
        "libs/text!../templates/advanced_options/advanced_options.html",
        "libs/utils",
        "libs/carousel",
        "libs/domReady"
    ],

    function(advanced_options_html) {

        Utils.init();
        Utils.make_html(advanced_options_html);
    }
);

