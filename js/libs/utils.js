var Utils;
var citiesAndAirports;

define(
    [
        "libs/text!../../templates/header.html",
        "libs/text!../../templates/layout.html",
        "libs/text!../../templates/layout_only_top.html",
        "libs/text!../../templates/select.html",
        "libs/moment",
        "libs/i18n",
        "libs/handlebars",
        "jquery",
        "libs/purl",
        "libs/api",
        "libs/jquery.maskedinput",
        "libs/ui/jquery-ui"
    ],
    function(header_html, layout_html, layout_only_top_html, select_html, moment) {

        // moment.utc("20-09-1991", "DD-MM-YYYY").format("YYYY-MM-DD");

        Utils = {

            '_isEmpty': function(obj) {

                for (var i in obj) {

                    if (i && i.length) {

                        return false;
                    }
                }

                return true;
            },

            '_urlAddParam': function(url, key, value) {

                if (Utils._isEmpty($.url(url).param())) {

                    if (!url || url.slice(-1) != "?") url += "?";

                } else {

                    if (url.slice(-1) != "&") url += "&";
                }

                return url + key + "=" + value;
            },

            'getUrl': function(url, attrs, lang) {

                // TODO: Descomentar esta línea para usar links relativos al root

                //url = $.url().attr('directory') + url;

                if (lang || typeof lang == 'undefined') {

                    url = Utils._urlAddParam(url, 'lang', I18n.getLanguage());
                }

                for (var prop in attrs) {

                    if (prop && prop.length) {

                        url = Utils._urlAddParam(url, prop, attrs[prop]);
                    }
                }

                return url;
            },

            'make_html': function(template, validation) {

                // Make HTML from templates

                var main_tmp = Handlebars.compile(template);
                var layout_tmp = Handlebars.compile(layout_html);
                var header_tmp = Handlebars.compile(header_html);
				var validation_tmp = Handlebars.compile(validation);
                $("body").append(layout_tmp({header: header_tmp(), main_body: main_tmp()}));

                var select_tmp = Handlebars.compile(select_html);

                for (var i = 0; i < 8; i++) {
                    $('#select_children').append(select_tmp({'value': i, 'name': i}));
                    $('#select_infants').append(select_tmp({'value': i, 'name': i}));
                }

                for (var i = 1; i < 8; i++) {
                    $('#select_adults').append(select_tmp({'value': i, 'name': i}));
                }

                // Date mask

                Utils.dateMask("#depart_input");
                Utils.dateMask("#return_input");

                // Init the calendars

                Utils.initCalendar("depart_input", "depart-calendar");
                Utils.initCalendar("return_input", "return-calendar");

                // Generate Cities and Airports

                Utils.generateCitiesAndAirports();

                // Generate autocomplete

                Utils.generateAutocomplete();

                $("body").append(validation_tmp);
           },

            'make_non_menu_html': function(template, validation) {

                // Make HTML from templates

                var main_tmp = Handlebars.compile(template);
                var layout_tmp = Handlebars.compile(layout_only_top_html);
                var header_tmp = Handlebars.compile(header_html);
				var validation_tmp = Handlebars.compile(validation);

                $("body").append(layout_tmp({header: header_tmp(), main_body: main_tmp()}));
				// $("body").append(validation_tmp);

            },

            'init': function() {

                I18n.init();

                Handlebars.registerHelper('Link', function(url) {

                    return Utils.getUrl(url);
                });
            },

            'convertExpirationDate': function(month, year) {

                return month + year.substring(2);
            },

            'dateMask': function(input) {

                jQuery(function($) {
                    $(input).mask("99/99/9999");
                });
            },

            'initCalendar': function(input, button) {

            Calendar.setup({"inputField": input, "ifFormat": "%d/%m/%Y", "button": button});
            },

            'generateAutocomplete': function() {

                Utils.autocomplete("#from", citiesAndAirports);
                Utils.autocomplete("#to", citiesAndAirports);

            },

            'generateCitiesAndAirports': function() {

                var api = new API();

                citiesAndAirports = new Array();
                citiesAndAirports[0] = new Array();
                citiesAndAirports[1] = new Array();

                api.geo.getCities({

                    success: function(result) {

                    for (var i = 0; i < result.cities.length; i++) {

                        citiesAndAirports[0][i] = result.cities[i].name;
                        Utils.checkName(i);
                        citiesAndAirports[1][i] = result.cities[i].cityId;
                    }

                    api.geo.getAirports({

                        success: function(result) {

                            var citiesLength = citiesAndAirports[0].length;

                            for (var i = 0; i < result.airports.length; i++) {

                                citiesAndAirports[0][i + citiesLength] = result.airports[i].description;
                                Utils.checkName(i + citiesLength);
                                citiesAndAirports[1][i + citiesLength] = result.airports[i].airportId;
                        }
                    }});

                }});
            },

            'checkName': function(i) {

                citiesAndAirports[0][i] = citiesAndAirports[0][i].replace("R\uFFFD","Ri");
                citiesAndAirports[0][i] = citiesAndAirports[0][i].replace("\uFFFD","ñ");
                citiesAndAirports[0][i] = citiesAndAirports[0][i].replace("&#241;","ñ");
                citiesAndAirports[0][i] = citiesAndAirports[0][i].replace("�","ñ");
            },

            'autocomplete': function(id, citiesAndAirports) {

                $(id).autocomplete({
                    source: function(request, response) {

                        var results = $.ui.autocomplete.filter(citiesAndAirports[0], request.term);

                        response(results.slice(0, 10));
                    },

                    minLength: "3"
                });
            },

            'jsonConcat': function(json1, json2) {

                for (var key in json2) {

                    json1[key] = json2[key];
                }

                return json1;
            },

            'setAdvAttrs': function(advAttrs) {

                var output = {};

                output = Utils.jsonConcat(output, advAttrs);
                output = Utils.jsonConcat(output, Utils.setAttrs());

                return output;
            },

            'setAttrs': function() {

                var attrs = new Array();

                attrs["from"] = Utils.getId("#from", citiesAndAirports);
                attrs["from_name"] = $("#from").val();
                attrs["to"] = Utils.getId("#to", citiesAndAirports);
                attrs["to_name"] = $("#to").val();
                attrs["dep_date"] = Utils.convertDate($("#depart_input").val());
                attrs["dep_date_input"] = $("#depart_input").val();
                attrs["ret_date"] = $("#return_input").is(":visible") ? Utils.convertDate($("#return_input").val()) : "null";
                attrs["ret_date_input"] = $("#return_input").val();
                attrs["adults"] = $("#select_adults").val();
                attrs["children"] = $("#select_children").val();
                attrs["infants"] = $("#select_infants").val();

                return attrs;
            },

            'convertDate': function(stringDate) {

                var dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
                var dateRegexResult = stringDate.match(dateRegex);

                // return moment.utc(stringDate, "DD-MM-YYYY").format("YYYY-MM-DD");
                return dateRegexResult[3] + "-" + dateRegexResult[2] + "-" + dateRegexResult[1];
            },

            'getId': function(name, citiesAndAirports) {

                return citiesAndAirports[1][citiesAndAirports[0].indexOf($(name).val())];
            },

            'stopEvent': function(e) {

                if (!e)
                    if (window.event)
                        e = window.event;
                    else
                        return;
                if (e.cancelBubble != null)
                    e.cancelBubble = true;
                if (e.stopPropagation)
                    e.stopPropagation();
                if (e.preventDefault)
                    e.preventDefault();
                if (window.event)
                    e.returnValue = false;
                if (e.cancel != null)
                    e.cancel = true;
            }

        }
    }
);

