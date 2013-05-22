require(
    [
        "libs/text!../templates/payment/payment.html",
        "libs/text!../templates/select.html",
        "libs/utils",
        "libs/jquery.maskedinput",
        "libs/domReady"
    ],

    function(payment_html, select_html) {

        Utils.init();
        Utils.make_non_menu_html(payment_html);

        var api = new API();

        jQuery(function($) {
            $("#exp-date").mask("99/9999");
        });

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

