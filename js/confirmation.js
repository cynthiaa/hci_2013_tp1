require(
    [
        "libs/text!../templates/confirmation/confirmation.html",
        "libs/utils",
        "libs/jquery.maskedinput",
        "libs/domReady"
    ],

    function(confirmation_html) {

        Utils.init();
        Utils.make_non_menu_html(confirmation_html);
		
    }
);