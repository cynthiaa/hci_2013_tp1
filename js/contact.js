require(
    [
        "libs/text!../templates/contact/contact.html",
        "libs/text!../templates/contact/contactValidation.html",
        "libs/utils",
        "libs/carousel",
        // "libs/calendar/calendar",
        // "libs/calendar/calendar-es",
        // "libs/calendar/calendar-setup",
        "libs/domReady"
    ],

    function(contact_html, contact_validation_html) {

        Utils.init();
        Utils.make_html(contact_html, contact_validation_html);

        $("#contact_link").addClass("selected");
    }
);

