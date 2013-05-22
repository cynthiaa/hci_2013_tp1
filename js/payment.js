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

        var api = new API();

        // Cuando se clickee el button de id next, se debe validar la tarjeta

        $("#next").click(function(){

            var param = {
                "number": $('#card-num').val(),
                "exp_date": Utils.convertExpirationDate($('#select_expiration_month').val(), $('#select_expiration_year').val()),
                "sec_code": $('#security-code').val()
            };

            var callback = {
                success: function(result) {

                    window.alert("Los datos de la tarjeta son " + (result.valid == true ? "" : "in") + "correctos");
                }
            }

            console.log(param);
            api.booking.validateCreditCard(callback, param);

            // document.location.href = Utils.getUrl("flights.html", setAttrs());
        });

    }
);

