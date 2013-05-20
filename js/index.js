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

                countries[i] = result.countries[i].name;
                // + " (" + result.countries[i].countryId + ")";
            }
        }});

        $("#from").autocomplete({
            source: countries
        });

        $("#to").autocomplete({
            source: countries
        });

        // Cuando se clickee el button de id search

        $("#search").click(function(){
            var attrs = new Array();

             // Por cada atributo que le quiera pasar
            // attrs["attr_name"] = "attr_value";

            attrs["from"] = $("#from").val();
            attrs["to"] = $("#to").val();
            attrs["dep_date"] = $("#depart_input").val();
            attrs["ret_date"] = $("#return_input").val();
            attrs["adults"] = $("#select_adults").val();
            attrs["children"] = $("#select_children").val();
            attrs["infants"] = $("#select_infants").val();

            document.location.href = Utils.getUrl("flights.html", attrs);
        });

    }
);

