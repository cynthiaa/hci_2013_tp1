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

        var cities = new Array();
        var airports = new Array();
        var airportsId = new Array();

        api.geo.getCities({

            success: function(result) {

            for (var i = 0; i < result.cities.length; i++) {

                cities[i] = result.cities[i].name;
                // + " (" + result.airports[i].countryId + ")";
            }
        }});

        api.geo.getAirports({

            success: function(result) {

                for (var i = 0; i < result.airports.length; i++) {

                airports[i] = result.airports[i].description;
                airportsId[i] = result.airports[i].airportId;
                // + " (" + result.airports[i].countryId + ")";
            }
        }});

        $("#from").autocomplete({
            source: airports
        });

        $("#to").autocomplete({
            source: airports
        });

        // Cuando se clickee el button de id search

        $("#search").click(function(){
            var attrs = new Array();

             // Por cada atributo que le quiera pasar
            // attrs["attr_name"] = "attr_value";

            attrs["from"] = airportsId[airports.indexOf($("#from").val())];
            attrs["to"] = airportsId[airports.indexOf($("#to").val())];
            attrs["dep_date"] = Utils.convertDate($("#depart_input").val());
            attrs["ret_date"] = Utils.convertDate($("#return_input").val());
            attrs["adults"] = $("#select_adults").val();
            attrs["children"] = $("#select_children").val();
            attrs["infants"] = $("#select_infants").val();

            document.location.href = Utils.getUrl("flights.html", attrs);
        });

    }
);

