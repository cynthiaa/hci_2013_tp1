require([
        "libs/text!../templates/passengers/passengers.html",
        "libs/text!../templates/passengers/passenger_data.html",
        "libs/text!../templates/select.html",
        "libs/text!../templates/select.html",
        "libs/utils",
        "libs/jquery.validate",
        "libs/jquery.maskedinput",
        "libs/jquery.formvalidator.min",
        "libs/domReady"
        ],

        function(passengers_html, passenger_data_html, select_html) {

            Utils.init();
            Utils.make_non_menu_html(passengers_html);

            var passenger_data_tmp = Handlebars.compile(passenger_data_html);

            /* Para cada pasajero */

            $('#pass-ctn').append(passenger_data_tmp({
                "title" : "Adultos"
            }));
            $('#pass-ctn').append(passenger_data_tmp({
                "title" : "Menores"
            }));
            $('#pass-ctn').append(passenger_data_tmp({
                "title" : "Infantes"
            }));

            var select_tmp = Handlebars.compile(select_html);

            current_year = new Date().getFullYear();

            Utils.dateMask("input.birth");

            $("#continuar").click(function(){
                if(validator.valid())
                    console.log="jojoooojo";
            });
});

