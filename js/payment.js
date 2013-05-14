require(
    [
        "libs/text!../templates/payment/payment.html",
        "libs/utils",
        "libs/carousel",
        "libs/domReady"
    ],

    function(payment_html) {

        Utils.init();
        Utils.make_non_menu_html(payment_html);
    }
);

