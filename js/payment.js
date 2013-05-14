require(
    [
        "libs/text!../templates/payment/payment.html",
        "libs/text!../templates/select.html",
        "libs/utils",
        "libs/carousel",
        "libs/domReady"
    ],

    function(payment_html, select_html) {

        Utils.init();
        Utils.make_non_menu_html(payment_html);

        var select_tmp = Handlebars.compile(select_html);

        for (var i = 1; i <= 12; i++) {
            $("#select_expiration_month").append(select_tmp({"value": i, "name": i}));
        }

        for (var i = 2013; i <= 2023; i++) {
            $("#select_expiration_year").append(select_tmp({"value": i, "name": i}));
        }
    }
);

