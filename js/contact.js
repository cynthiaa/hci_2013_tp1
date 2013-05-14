require(
    [
        "libs/text!../templates/contact/contact.html",
        "libs/utils",
        "libs/carousel",
        "libs/domReady"
    ],

    function(contact_html) {

        Utils.init();
        Utils.make_html(contact_html);

        $("#contact_link").addClass("selected");
    }
);

