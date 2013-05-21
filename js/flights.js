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

//        var param = $.url().param();
//        console.log(param);
		var sortkey= $.trim($("#selectionOrder :selected").val().match(".* ")[0]);
		var sortorder= $.trim($("#selectionOrder :selected").val().match(" .*")[0]);
		var param = {
			"from" : "EZE",
			"to" : "MIA",
			"dep_date" : "2013-08-19",
			"ret_date" : "2013-09-01",
			"adults" : "1",
			"children" : "0",
			"infants" : "0",
			"sort_key": sortkey,
			"sort_order": sortorder
		}
        
        var inpagenum= 0;
        var outpagenum= 0;
        var flights;
        
        var paginate= function(arr, pagesize) {
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
			switch(airline) {
				case "AR":
					return Handlebars.compile("{{Link 'img/aerolineasArgentinas.png'}}");
				case "LA":
					return Handlebars.compile("{{Link 'img/lan.png'}}");
				case "8R":
					return Handlebars.compile("{{Link 'img/sol.png'}}");
				case "JJ":
					return Handlebars.compile("{{Link 'img/tamAirlines.png'}}");
				case "BA":
					return Handlebars.compile("{{Link 'img/britishAirways.png'}}");
				case "AF":
					return Handlebars.compile("{{Link 'img/airFrance.png'}}");
				case "AZ":
					return Handlebars.compile("{{Link 'img/alitalia.png'}}");
				case "AA":
					return Handlebars.compile("{{Link 'img/americanAirlines.png'}}");
				case "IB":
					return Handlebars.compile("{{Link 'img/iberia.png'}}");
				case "AM":
					return Handlebars.compile("{{Link 'img/aeroMexico.png'}}");
				case "TA":
					return Handlebars.compile("{{Link 'img/taca.png'}}");
				case "CM":
					return Handlebars.compile("{{Link 'img/copaAirlines.png'}}");
				case "AV":
					return Handlebars.compile("{{Link 'img/avianca.png'}}");
			}
		}
        
        var showFlights= function(form, page) {
        	
        	for(var i=0; i<page.length ;i++) {
        		var airlineLink= airlineToAirlineLink(page[i].airlineId)
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
			inpagenum= 0;
			outpagenum= 0;
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
		$(".inbound form").remove();
		$(".outbound form").remove();
		api.booking.getRoundTripFlights(callback, param);
		showFlights($(".inbound form"), flights.inbound[0]);
		showFlights($(".outbound form"), flights.outbound[0]);
	});

    api.booking.getRoundTripFlights(callback, param);
});



