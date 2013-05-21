require(
    [
        "libs/text!../templates/payment/payment.html",
        "libs/text!../templates/select.html",
        "libs/utils",
        "libs/domReady"
    ],

    function(payment_html, select_html) {

        Utils.init();
        Utils.make_non_menu_html(payment_html);

        var select_tmp = Handlebars.compile(select_html);

        current_year = new Date().getFullYear();

        for (var i = 1; i <= 12; i++) {
            $("#select_expiration_month").append(select_tmp({"value": i, "name": i}));
        }

        for (var i = current_year; i <= current_year + 10; i++) {
            $("#select_expiration_year").append(select_tmp({"value": i, "name": i}));
        }

        // Validación

        var params = {
            "number": $('#card-num'),
            "exp_date": Utils.convertExpirationDate($('#select_expiration_month'), $('#select_expiration_year')),
            "sec_code": $('#security-code')
        };
    }
);

