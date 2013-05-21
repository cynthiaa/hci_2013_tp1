// Cantidad de imágenes en el carousel y en destacados
var max = 5;

require(
    [
        "libs/text!../templates/index/index.html",
        "libs/text!../templates/index/li.html",
        "libs/text!../templates/img.html",
        "libs/text!../templates/index/info_deal.html",
        "libs/text!../templates/index/featured_item.html",
        "libs/text!../templates/index/info_featured.html",
        "libs/utils",
        "libs/carousel",
        "libs/jquery.maskedinput",
        "libs/jquery.shuffle",
        // "libs/calendar/calendar",
        // "libs/calendar/calendar-es",
        // "libs/calendar/calendar-setup",
        "libs/domReady"
    ],

    function(index_html, li_html, img_html, info_deal_html, featured_item_html, info_featured_html) {

        Utils.init();
        Utils.make_html(index_html);

        $("#home_link").addClass("selected");

        // Create the carousel-frame

        var li_tmp = Handlebars.compile(li_html);
        var info_deal_tmp = Handlebars.compile(info_deal_html);
        var img_tmp = Handlebars.compile(img_html);
        var featured_item_tmp = Handlebars.compile(featured_item_html);
        var info_featured_tmp = Handlebars.compile(info_featured_html);

        for (var i = 0; i < max ; i++) {

            var li = li_tmp({'id': 'li-' + i});
            $('#carousel-frame').append(li);

            var featured_item = featured_item_tmp({'id': 'feat-' + i});
            $('#featured-flights').append(featured_item);
        }

        var api = new API();

        var deals = new Array();

        api.booking.getFlightDeals({

            success: function(result) {

                for (var i = 0; i < result.deals.length; i++) {

                    deals[i] = new Array();

                    deals[i][0] = result.deals[i].cityId;
                    deals[i][1] = result.deals[i].cityName;
                    deals[i][2] = result.deals[i].price;
                }

                deals = $.shuffle(deals);

                // Carousel images

                for (var i = 0; i < max; i++) {

                    var link = '{{Link "img/featured/' + deals[i][0] + '.jpg"}}';
                    var img_src = Handlebars.compile(link);
                    var img = img_tmp({'img_src': img_src});

                    var city = deals[i][1].split(",")[0];
                    var percentage = Math.floor(Math.random() * 5 + 1) * 5;
                    var cards = ["Visa", "Diners", "Master Card", "American Express"];
                    var card = cards[Math.floor(Math.random() * 3 + 1)];
                    var deal = percentage + "% de descuento a " + city +
                            " abonando con " + card;

                    $('#li-' + i).append(img);
                    $('#li-' + i + ' div').append(info_deal_tmp({"title": deals[i][1], "deal": deal}));
                }

                // Featured items

                for (var i = max; i < 2 * max; i++) {

                    var link = '{{Link "img/featured/' + deals[i][0] + '.jpg"}}';
                    var img_src = Handlebars.compile(link);
                    var img = img_tmp({'img_src': img_src});

                    var city = deals[i][1].split(",")[0];
                    var price = "Desde U$S " + Math.ceil(deals[i][2]);

                    $('#feat-' + (i - max)).append(img);
                    $('#feat-' + (i - max) + ' div').append(info_featured_tmp({"city": city, "price": price}));
                }
            }
        }, {"from": "BUE"});

        // Máscara para fechas

        jQuery(function($) {
            $("#depart_input").mask("99/99/9999");
        });

        jQuery(function($) {
            $("#return_input").mask("99/99/9999");
        });

        // Init the calendars

        Calendar.setup({inputField: "depart_input", ifFormat: "%d/%m/%Y", button: "depart-calendar"});
       	Calendar.setup({inputField: "return_input", ifFormat: "%d/%m/%Y", button: "return-calendar"});

        // Init the carousel

        DP.inicio();


        var citiesAndAirports = new Array(2);
        var airports = new Array();
        var airportsId = new Array();

        citiesAndAirports[0] = new Array();
        citiesAndAirports[1] = new Array();

        api.geo.getCities({

            success: function(result) {

            for (var i = 0; i < result.cities.length; i++) {

                citiesAndAirports[0][i] = result.cities[i].name;
                citiesAndAirports[1][i] = result.cities[i].cityId;
            }

            api.geo.getAirports({

                success: function(result) {

                    var citiesLength = citiesAndAirports[0].length;

                    for (var i = 0; i < result.airports.length; i++) {

                        citiesAndAirports[0][i + citiesLength] = result.airports[i].description;
                        citiesAndAirports[1][i + citiesLength] = result.airports[i].airportId;
                }
            }});

        }});

        console.log(Utils.convertDate("12/08/1991"));

        $("#from").autocomplete({
            source: citiesAndAirports[0],
            // minLength: "3"
        });

        $("#to").autocomplete({
            source: citiesAndAirports[0],
            // minLength: "3"
        });

        // Cuando se clickee el button de id search

        $("#search").click(function(){
            var attrs = new Array();

             // Por cada atributo que le quiera pasar
            // attrs["attr_name"] = "attr_value";

            attrs["from"] = citiesAndAirports[1][citiesAndAirports[0].indexOf($("#from").val())];
            attrs["to"] = citiesAndAirports[1][citiesAndAirports[0].indexOf($("#to").val())];
            attrs["dep_date"] = Utils.convertDate($("#depart_input").val());
            attrs["ret_date"] = Utils.convertDate($("#return_input").val());
            attrs["adults"] = $("#select_adults").val();
            attrs["children"] = $("#select_children").val();
            attrs["infants"] = $("#select_infants").val();


            console.log(attrs);
            // $.when((api.geo.getAirportsByName(callback1, param))).done(document.location.href = Utils.getUrl("flights.html", attrs));
            document.location.href = Utils.getUrl("flights.html", attrs);
        });

    }
);

