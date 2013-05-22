require(["libs/text!../templates/flights/flights.html",
        "libs/text!../templates/flights/flights_data.html",
         "libs/text!../templates/img.html",
        "libs/utils",
        "libs/carousel",
        "libs/domReady"],

        function(flights_html, flights_data_html, img_html) {

		Utils.init();
        Utils.make_html(flights_html);

    	var api = new API();
    	var flights_data_tmp = Handlebars.compile(flights_data_html);
    	var tmp_img = Handlebars.compile(img_html);

        var param = $.url().param();
		param.sort_key= $.trim($("#selectionOrder :selected").val().match(".* ")[0]);
		param.sort_order= $.trim($("#selectionOrder :selected").val().match(" .*")[0]);
        console.log(param);

        var inpagenum= 0;
        var outpagenum= 0;
        var flights;

        var paginate = function(arr, pagesize) {
        	var aux= new Array;
        	for(var i=0; (i*pagesize)<arr.length ;i++)
        		aux.push(arr.slice(i*pagesize, (i+1)*pagesize));
     		return aux;
        }

        var loadPagesArrays = function(flightsArray) {
        	var inbound= new Array;
        	var outbound= new Array;
        	var aux;

        	for(var i=0; i<flightsArray.length ; i++) {
        		if(flightsArray[i].hasOwnProperty('inboundRoutes')) {
        			aux= inbound.push(flightsArray[i].inboundRoutes[0].segments[0]);
        			inbound[aux-1].pricing= flightsArray[i].price;
        		}
        		else {
        			aux= outbound.push(flightsArray[i].outboundRoutes[0].segments[0]);
        			outbound[aux-1].pricing= flightsArray[i].price;
        		}
        	}

        	inbound= paginate(inbound, 10);
        	outbound= paginate(outbound, 10);

        	var flights= { "inbound": inbound, "outbound": outbound }
        	return flights;
        }

        var airlineToAirlineLink = function(airline) {

			return Handlebars.compile("{{Link 'img/airlines/" + airline + ".png'}}");

		}

        var showFlights= function(form, page) {

        	for(var i = 0; i < page.length ; i++) {
        		var airlineLink= airlineToAirlineLink(page[i].airlineId);
        		$(".airline-image").append(tmp_img({"img_src" : airlineLink}));
				$(form).append(flights_data_tmp({
					"departureCity": page[i].departure.cityName,
					"arrivalCity": page[i].arrival.cityName,
					"departureTime": page[i].departure.date.substring(11),
					"arrivalTime": page[i].arrival.date.substring(11),
					"flightClass": page[i].cabinType,
					"flightStopovers": page[i].stopovers.length,
					"flightDuration": page[i].duration,
					"flightTotal": page[i].pricing.total.total
				}));
			}
		}

		var clearAll = function() {
			inpagenum = 0;
			outpagenum = 0;
			$(".inbound form").remove();
			$(".outbound form").remove();
		}

    	var callback = {
    		success: function(result) {
    			flights = loadPagesArrays(result.flights);
    			showFlights($(".inbound form"), flights.inbound[0]);
				showFlights($(".outbound form"), flights.outbound[0]);
			}
 //   		<-- Falta la funcion de error aca -->
    	}


	$("#selectionOrder").change(function() {
		param.sort_key = $.trim($("#selectionOrder :selected").val().match(".* ")[0]);
		param.sort_order = $.trim($("#selectionOrder :selected").val().match(" .*")[0]);
		$(".inbound form div").remove();
		$(".outbound form div").remove();
		api.booking.getRoundTripFlights(callback, param);
	});

    api.booking.getRoundTripFlights(callback, param);
});


