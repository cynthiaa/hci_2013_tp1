require(
    [
        "libs/text!../templates/about/about.html",
        "libs/utils",
        "libs/carousel",
        "libs/domReady"
    ],

    function(about_html) {

        Utils.init();
        Utils.make_html(about_html);
    }
);

