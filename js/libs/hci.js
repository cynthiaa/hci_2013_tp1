var HCI;

define(
    [
        "libs/handlebars",
        "jquery",
        "libs/purl"
    ],

    function() {

        HCI = {

            'prototype': function() {

   var baseUrl = "http://eiffel.itba.edu.ar/hci/service2/";

   var resolveUrl = function(relativeUrl, method, params) {
      var url = baseUrl + relativeUrl + "?method=" + method;
      for (var property in params) {
         if (params.hasOwnProperty(property)) {
            url += "&" + property + "=" + encodeURIComponent(params[property]);
         }
      }
      return url;
   }

   var call = function(relativeUrl, method, params, callbacks) {
      $.ajax({
        url: resolveUrl(relativeUrl, method, params),
        dataType: "jsonp"
      }).done(function(data) {
       if (callbacks.success) {
         callbacks.success(data);
       }
      }).fail(function() {
       if (callbacks.error) {
         callbacks.error();
       }
      });
   };

   return {
       /* Misc methods. */
       misc: {
           getLanguages: function(callbacks) {
             call("Misc.groovy", "GetLanguages", {}, callbacks);
           },
           getCurrencies: function(params, callbacks) {
               call("Misc.groovy", "GetCurrencies", params, callbacks);
           }
       }
   }

            }

        }
    }
);
