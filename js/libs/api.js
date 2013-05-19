function API() {
}

API.prototype = (function() {

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
        /* Misc methods */
        misc: {

            getLanguages: function(callbacks) {

                call("Misc.groovy", "GetLanguages", {}, callbacks);
            },

            getCurrencies: function(callbacks, params) {
                call("Misc.groovy", "GetCurrencies", params, callbacks);
            },

            getCurrencyById: function(callbacks, params) {
                call("Misc.groovy", "GetCurrencyById", params, callbacks);
            },

            getCurrenciesRatio: function(callbacks, params) {
                call("Misc.groovy", "GetCurrenciesRatio", params, callbacks);
            },

            getAirlines: function(callbacks, params) {
                call("Misc.groovy", "GetAirlines", params, callbacks);
            },

            getAirlineById: function(callbacks, params) {
                call("Misc.groovy", "GetAirlineById", params, callbacks);
            },

            getAirlinesByName: function(callbacks) {
                call("Misc.groovy", "GetAirlineByName", {}, callbacks);
            }
        },

        /* Geo methods */
        geo: {

            getCountries: function(callbacks, params) {
                call("Geo.groovy", "GetCountries", params, callbacks);
            },

            getCountryById: function(callbacks, params) {
                call("Geo.groovy", "GetCountryById", params, callbacks);
            },

            getCities: function(callbacks, params) {
                call("Geo.groovy", "GetCities", params, callbacks);
            },

            getCityById: function(callbacks, params) {
                call("Geo.groovy", "GetCityById", params, callbacks);
            },

            getCitiesByName: function(callbacks) {
                call("Geo.groovy", "GetCitiesByName", {}, callbacks);
            },

            getCitiesByPosition: function(callbacks, params) {
                call("Geo.groovy", "GetCitiesByPosition", params, callbacks);
            },

            getAirports: function(callbacks, params) {
                call("Geo.groovy", "GetAirports", params, callbacks);
            },

            getAirportById: function(callbacks, params) {
                call("Geo.groovy", "GetAirportById", params, callbacks);
            },

            getAirportByName: function(callbacks) {
                call("Geo.groovy", "GetAirportByName", {}, callbacks);
            },

            getAirportByPosition: function(callbacks, params) {
                call("Geo.groovy", "GetAirportByPosition", params, callbacks);
            },

            getCitiesAndAirportsByName: function(callbacks) {
                call("Geo.groovy", "GetCitiesAndAirportsByName", {}, callbacks);
            }
        },

        /* Booking methods */
        booking: {

            getOneWayFlights: function(callbacks, params) {
                call("Booking.groovy", "GetOneWayFlights", params, callbacks);
            },

            getRoundTripFlights: function(callbacks, params) {
                call("Booking.groovy", "GetRoundTripFlights", params, callbacks);
            },

            getFlightsDeals: function(callbacks, params) {
                call("Booking.groovy", "GetFlightsDeals", params, callbacks);
            },

            // TODO
            bookFlight: function(callbacks) {
                call("Booking.groovy", "BookFlight", {}, callbacks);
            },

            validateCreditCard: function(callbacks) {
                call("Booking.groovy", "ValidateCreditCard", {}, callbacks);
            },

            getInstallments: function(callbacks, params) {
                call("Booking.groovy", "GetInstallments", params, callbacks);
            }
        },

        /* Review methods */
        review: {

            getAirlineReviews: function(callbacks, params) {
                call("Review.groovy", "GetOneWayFlights", params, callbacks);
            },

            // TODO
            reviewAirline: function(callbacks) {
                call("Review.groovy", "ReviewAirline", {}, callbacks);
            }
        },

        /* Status methods */
        getFlightStatus: {

            getOneWayFlights: function(callbacks, params) {
                call("Status.groovy", "GetFlightStatus", params, callbacks);
            }
        }

    }
})();
