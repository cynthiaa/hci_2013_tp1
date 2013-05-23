var cabin_names = {
    "ECONOMY": "Turista",
    "BUSINESS": "Ejecutiva",
    "FIRST_CLASS": "Primera Clase"
};

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

    // Vuelve a rellenar la sidebar
    completeSideBar();

    // Si es sólo ida
    generateLayoutOneWay();

    var inpagenumx = 0;
    var outpagenum = 0;
    var flights;

    var paginate = function(arr, pagesize) {
    	var aux = new Array;

    	for (var i = 0; (i*pagesize) < arr.length; i++) {
    		aux.push(arr.slice(i*pagesize, (i + 1)*pagesize));
        }

 		return aux;
    }

    var loadPagesArrays = function(flightsArray) {
		var inbound = new Array;
		var outbound = new Array;
		var aux;

		for(var i = 0; i < flightsArray.length; i++) {

			if(flightsArray[i].hasOwnProperty('inboundRoutes')) {
				aux = inbound.push(flightsArray[i].inboundRoutes[0].segments[0]);
				inbound[aux-1].pricing = flightsArray[i].price;
			}
			else {
				aux = outbound.push(flightsArray[i].outboundRoutes[0].segments[0]);
				outbound[aux-1].pricing = flightsArray[i].price;
			}
		}

		inbound = paginate(inbound, 2);
		outbound = paginate(outbound, 2);

	    var flights = {"inbound": inbound, "outbound": outbound};

	    return flights;
    }

	var airlineToAirlineLink = function(airline) {

	    return Handlebars.compile("{{Link 'img/airlines/" + airline + ".png'}}");
	}

    var showFlights= function(form, page) {

        for(var i = 0; i < page.length ; i++) {

    	    var airlineLink= airlineToAirlineLink(page[i].airlineId);

            $(form).append(flights_data_tmp({
				"departureCity": page[i].departure.cityName,
				"arrivalCity": page[i].arrival.cityName,
				"departureTime": convertDateToTime(page[i].departure.date),
				"arrivalTime": convertDateToTime(page[i].arrival.date),
				"flightClass": convertCabinType(page[i].cabinType),
				"flightStopovers": page[i].stopovers.length,
				"flightDuration": page[i].duration + " horas",
				"flightTotal": "U$S " + page[i].pricing.total.total
			}));
			form.find(".airline-image").eq(i).append(tmp_img({"img_src" : airlineLink}));
		}
	}

    var convertCabinType = function(cabinType) {

        return cabin_names[cabinType];
    }

    var convertDateToTime = function(date) {

        return date.substring(11,16) + " hs";
    }

	var clearAll = function() {
		inpagenum = 0;
		outpagenum = 0;
		$(".inbound form").remove();
		$(".outbound form").remove();
		var flights= { "inbound": inbound, "outbound": outbound }
		return flights;
	}

	var refreshPageFooting= function() {
		$(".inbound-pages span").text("/" + flights.inbound.length);
		$(".outbound-pages span").text("/" + flights.outbound.length);
	}

	var clearFlights = function() {
		$(".inbound form div").remove();
		$(".outbound form div").remove();
	}

	var refreshPage= function() {
		clearFlights();
		showFlights($(".inbound form"), flights.inbound[inpagenum]);
		showFlights($(".outbound form"), flights.outbound[outpagenum]);
		$(".inbound .flight-radio input").first().prop('checked', 'checked');
    	$(".outbound .flight-radio input").first().prop('checked', 'checked');
	}

	var clearPageNums = function() {
		inpagenum = 0;
		outpagenum = 0;
	}

	var callback = {
		success: function(result) {
			flights = loadPagesArrays(result.flights);
			clearPageNums();
			refreshPageFooting();
			refreshPage();
			}
 //   	<-- Falta la funcion de error aca -->
	}

	$("#selectionOrder").change(function() {
		param.sort_key = $.trim($("#selectionOrder :selected").val().match(".* ")[0]);
		param.sort_order = $.trim($("#selectionOrder :selected").val().match(" .*")[0]);
		api.booking.getRoundTripFlights(callback, param);
	});

	$(".inbound-prev").click(function(){
		if (inpagenum > 0) {
			inpagenum--;
			refreshPage();
		}

	});

	$(".outbound-prev").click(function(){
		if (outpagenum > 0) {
			outpagenum--;
			refreshPage();
		}
	});

	$(".inbound-next").click(function(){
		if(inpagenum < flights.inbound.length-1) {
			inpagenum++;
			refreshPage();
		}
	});

	$(".outbound-next").click(function(){
		if(outpagenum < flights.outbound.length-1) {
			outpagenum++;
			refreshPage();
		}
	});

	$(".inPageBtn").click(function() {
		var desiredPage = $(".inbound-pages .page-number").val();
		if (desiredPage > 0 && desiredPage <= flights.inbound.length) {
			inpagenum = desiredPage - 1;
			refreshPage();
		}
	});

	$(".outPageBtn").click(function() {
		var desiredPage = $(".outbound-pages .page-number").val();
		if (desiredPage > 0 && desiredPage <= flights.outbound.length) {
			outpagenum = desiredPage - 1;
			refreshPage();
		}
	});

    api.booking.getRoundTripFlights(callback, param);

    function generateLayoutOneWay() {

        if (param.ret_date == "null") {

            $(".outbound").hide();
            $("#flight-header-ret").hide();
            $(".flight-wrapper").css("width", "100%");
            $(".flight-header").css("width", "100%");
            $("#pagination-bar-right").hide();
            $(".vdivider").hide();
            $(".pagination-bar").css("width", "100%");
            $(".pagination-bar").css("text-align", "center");

            javascript:toggleFlightMode('one_way')
        }
    }

    function completeSideBar() {

        console.log(param);
        $("#from").val(param.from_name);
        $("#to").val(param.to_name);
        $("#depart_input").val(param.dep_date_input);
        $("#return_input").val(param.ret_date_input);
        $("#select_adults").val(param.adults);
        $("#select_children").val(param.children);
        $("#select_infants").val(param.infants);
    }
});

