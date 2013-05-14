require(
    [
        "libs/text!../templates/index/index.html",
        "libs/utils",
        "libs/carousel",
        "libs/domReady"
    ],

    function(index_html) {

        Utils.init();
        Utils.make_html(index_html);

        // Init the carousel

        DP.inicio();
    }
);
