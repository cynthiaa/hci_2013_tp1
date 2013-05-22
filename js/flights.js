require(
	["libs/text!../templates/flights/flights.html",
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
    }
    
    var param = $.url().param();
	param.sort_key= $.trim($("#selectionOrder :selected").val().match(".* ")[0]);
	param.sort_order= $.trim($("#selectionOrder :selected").val().match(" .*")[0]);
     
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
	
		inbound= paginate(inbound, 2);
		outbound= paginate(outbound, 2);
	
	    var flights= { "inbound": inbound, "outbound": outbound }
	    return flights;
    }

	var airlineToAirlineLink = function(airline) { return Handlebars.compile("{{Link 'img/airlines/" + airline + ".png'}}"); }

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
		var flights= { "inbound": inbound, "outbound": outbound }
		return flights;
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
	
	var refreshPageFooting= function() {
		$(".inbound-pages span").text("/" + flights.inbound.length);
		$(".outbound-pages span").text("/" + flights.outbound.length);
	}

	var callback = { 
		success: function(result) { 
			flights = loadPagesArrays(result.flights);
			showFlights($(".inbound form"), flights.inbound[inpagenum]);
			showFlights($(".outbound form"), flights.outbound[outpagenum]);
			refreshPageFooting();
			}
 //   	<-- Falta la funcion de error aca -->
	}
	
	var clearAll = function() {
		inpagenum= 0;
		outpagenum= 0;
		$(".inbound form div").remove();
		$(".outbound form div").remove();
	}

	$("#selectionOrder").change(function() {
		param.sort_key = $.trim($("#selectionOrder :selected").val().match(".* ")[0]);
		param.sort_order = $.trim($("#selectionOrder :selected").val().match(" .*")[0]);
		clearAll();
		api.booking.getRoundTripFlights(callback, param);
	});

	$(".inbound-prev").click(function(){
		if(inpagenum>0) {
			inpagenum--;
			$(".inbound form div").remove();
			showFlights($(".inbound form"), flights.inbound[inpagenum]);
		}
		
	});
	
	$(".outbound-prev").click(function(){
		if(outpagenum>0) {
			outpagenum--;
			$(".outbound form div").remove();
			showFlights($(".outbound form"), flights.outbound[outpagenum]);
		}
	});
	
	$(".inbound-next").click(function(){
		if(inpagenum < flights.inbound.length-1) {
			inpagenum++;
			$(".inbound form div").remove();
			showFlights($(".inbound form"), flights.inbound[inpagenum]);
		}
	});
	
	$(".outbound-next").click(function(){
		if(outpagenum < flights.outbound.length-1) {
			outpagenum++;
			$(".outbound form div").remove();
			showFlights($(".outbound form"), flights.outbound[outpagenum]);
		}
	});
	
	$(".inPageBtn").click(function() {
		var desiredPage= $(".inbound-pages .page-number").val();
		if(desiredPage>0 && desiredPage<flights.inbound.length) {
			inpagenum= desiredPage -1;
			$(".inbound form div").remove();
			showFlights($(".inbound form"), flights.inbound[inpagenum]);
		}
	});
	
	$(".outPageBtn").click(function() {
		var desiredPage= $(".outbound-pages .page-number").val();
		if(desiredPage>0 && desiredPage<flights.outbound.length) {
			outpagenum= desiredPage -1;
			$(".outbound form div").remove();
			showFlights($(".outbound form"), flights.outbound[outpagenum]);
		}
	});
	
    api.booking.getRoundTripFlights(callback, param);
});




