var Utils;

define(
    [
        "libs/text!../../templates/layout.html",
        "libs/text!../../templates/layout_only_top.html",
        "libs/text!../../templates/select.html",
        "libs/i18n",
        "libs/handlebars",
        "jquery",
        "libs/purl"
    ],
    function(layout_html, non_menu_layout_html, select_html) {

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

                url = /* $.url().attr('directory') + */ url;

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

            'make_html': function(template) {

                // Make HTML from templates

                var main_tmp = Handlebars.compile(template);
                var layout_tmp = Handlebars.compile(layout_html);

                $("body").append(layout_tmp({main_body: main_tmp()}));

                var select_tmp = Handlebars.compile(select_html);

                for (var i = 0; i < 8; i++) {
                    $('#select_children').append(select_tmp({'value': i, 'name': i}));
                    $('#select_infants').append(select_tmp({'value': i, 'name': i}));
                }

                for (var i = 1; i < 8; i++) {
                    $('#select_adults').append(select_tmp({'value': i, 'name': i}));
                }
            },

            'make_non_menu_html': function(template) {

                // Make HTML from templates

                var main_tmp = Handlebars.compile(template);
                var layout_tmp = Handlebars.compile(non_menu_layout_html);

                $("body").append(layout_tmp({main_body: main_tmp()}));

            },

            'init': function() {

                I18n.init();

                Handlebars.registerHelper('Link', function(url) {

                    return Utils.getUrl(url);
                });
            }
        }
    }
);
