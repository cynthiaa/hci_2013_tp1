var cabin_names = {
    "ECONOMY": "Turista",
    "BUSINESS": "Ejecutiva",
    "FIRST_CLASS": "Primera Clase"
};

var oneWay = false;

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

    completeSideBar();

    // Si es sólo ida
    generateLayoutOneWay();

    var inpagenum= 0;
    var outpagenum= 0;
	var inTotal= 0;
	var outTotal= 0;
    var flights;

    var paginate = function(arr, pagesize) {
    	var aux = new Array;

    	for (var i = 0; (i*pagesize) < arr.length; i++) {
    		aux.push(arr.slice(i*pagesize, (i + 1)*pagesize));
        }

 		return aux;
    }

    var loadPagesArrays = function(flightsArray) {
		var inbound= new Array;
		var outbound= new Array;
		var aux;

		for (var i = 0; i < flightsArray.length; i++) {

			if (flightsArray[i].hasOwnProperty('inboundRoutes') || oneWay) {

			    aux = inbound.push(flightsArray[i].inboundRoutes[0].segments[0]);
				inbound[aux-1].pricing = flightsArray[i].price;
			} else {

				aux = outbound.push(flightsArray[i].outboundRoutes[0].segments[0]);
				outbound[aux-1].pricing = flightsArray[i].price;
	        }
		}

		if (!oneWay) {

		    inbound = paginate(inbound, 5);
        }

		outbound = paginate(outbound, 5);

	    return flights = {"inbound": inbound, "outbound": outbound }
    }

	var airlineToAirlineLink = function(airline) {

	    return Handlebars.compile("{{Link 'img/airlines/" + airline + ".png'}}");
	}

    var showFlights = function(form, page) {

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

	var clearAll = function() {

        inpagenum = 0;
		outpagenum = 0;

		if (!oneWay)
			$(".inbound form").remove();

		$(".outbound form").remove();

		return {"inbound": inbound, "outbound": outbound};
	}

	var refreshPageFooting= function() {

        if(!oneWay) {

            $(".inbound-pages span").text("/" + flights.inbound.length);
        }

		$(".outbound-pages span").text("/" + flights.outbound.length);
	}

	var refreshTotals= function() {

		inTotal = $(".inbound .flight-radio input[checked='checked']").data-total.val();
		outTotal = $(".outbound .flight-radio input[checked='checked']").data-total.val();
		$(".navigation-bar span").text("Total: U$S" + (inTotal + outTotal));
	}

	var clearFlights = function() {

        if (!oneWay) {

			$(".inbound form div").remove();
        }

		$(".outbound form div").remove();
	}

	var refreshPage= function() {
		clearFlights();

		if(!oneWay) {

		    showFlights($(".inbound form"), flights.inbound[inpagenum]);
			$(".inbound .flight-radio input").first().prop('checked', 'checked');
			$(".inbound-pages .page-number").val(inpagenum + 1);
		}

		showFlights($(".outbound form"), flights.outbound[outpagenum]);
		$(".outbound .flight-radio input").first().prop('checked', 'checked');
		$(".outbound-pages .page-number").val(outpagenum + 1);
		refreshTotals();
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

	var getFlights = function() {

        if(!oneWay) {

    	    api.booking.getRoundTripFlights(callback, param);
        }

    	api.booking.getOneWayFlights(callback, param);
   }

	$("#selectionOrder").change(function() {

		param.sort_key = $.trim($("#selectionOrder :selected").val().match(".* ")[0]);
		param.sort_order = $.trim($("#selectionOrder :selected").val().match(" .*")[0]);
		getFlights();
	});

	$(".inbound .flight-radio input").change(refreshTotals());

	$(".inbound .flight-radio input").change(function() {
		outTotal = this.data-total.val();
		$(".navigation-bar span").val( "Total: U$S" + (inTotal + outTotal));
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

	getFlights();

    $("#continue").click(function(){

        document.location.href = Utils.getUrl("passengers.html", setAttrs());
    });


    function setAttrs() {

        return param;
    }

    function generateLayoutOneWay() {

        if (param.ret_date == "null") {
			oneWay= true;
            $(".inbound").hide();
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

        // console.log(param);
        $("#from").val(param.from_name);
        $("#to").val(param.to_name);
        $("#depart_input").val(param.dep_date_input);
        $("#return_input").val(param.ret_date_input);
        $("#select_adults").val(param.adults);
        $("#select_children").val(param.children);
        $("#select_infants").val(param.infants);
    }
});

