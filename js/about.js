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

        var select_tmp = Handlebars.compile(select_html);

        for (var i = 1; i <= 12; i++) {
            $("#select_expiration_month").append(select_tmp({"value": i, "name": i}));
        }
    }
);

