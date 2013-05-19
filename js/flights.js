require(
    [
        "libs/text!../templates/flights/flights.html",
        "libs/text!../templates/flights/flights_data.html",
        "libs/utils",
        "libs/carousel",
        // "libs/calendar/calendar",
        // "libs/calendar/calendar-es",
        // "libs/calendar/calendar-setup",
        // "libs/hci",
        "libs/hciapi",
        "libs/domReady"
    ],

    function(flights_html, flights_data_html) {

        Utils.init();
        Utils.make_html(flights_html);

	    var api = new HCI();
	    api.misc.getLanguages({
            success: function(result) {
                $("#uuid").text(result.meta.uuid);
                $("#time").text(result.meta.time);

                for (var i = 0; i < result.languages.length; i++) {
                    var li = $("<li>" + result.languages[i].name + " (" + result.languages[i].languageId + ")" + "</li>");
                    $("ul").append(li);
                }
            }
        });
	}
);

