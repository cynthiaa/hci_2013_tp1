var I18n;

define(
    [
        "libs/text!../../i18n/en.json",
        "libs/text!../../i18n/es.json",
        "libs/handlebars",
        "jquery",
        "libs/purl"
    ],
    function(en_json, es_json) {

        I18n = {

            'en': JSON.parse(en_json),

            'es': JSON.parse(es_json),

            'getLanguage': function() {

                var def = 'es';

                var param = $.url().param('lang');

                return (param && I18n[param]) ? param : def;
            },

            'init': function() {

                Handlebars.registerHelper('I18n', function(str) {

                    var translation = I18n[ I18n.getLanguage() ][ str ];

                    return (str && translation) ? translation : str;
                });
            },
        };
    }
);

