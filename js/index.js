require(
    [
        "libs/text!../templates/index/index.html",
        "libs/utils",
        "libs/carousel",
        // "libs/calendar/calendar",
        // "libs/calendar/calendar-es",
        // "libs/calendar/calendar-setup",
        "libs/domReady"
    ],

    function(index_html) {

        Utils.init();
        Utils.make_html(index_html);

        $("#home_link").addClass("selected");

        // Init the carousel

        DP.inicio();

        var api = new API();
        var countries = new Array();

        api.geo.getCountries({

            success: function(result) {

            for (var i = 0; i < result.countries.length; i++) {

                countries[i] = result.countries[i].name + " (" + result.countries[i].countryId + ")";
            }
        }});

        $("#from").autocomplete({
            source: countries
        });

        $("#to").autocomplete({
            source: countries
        });
    }
);

