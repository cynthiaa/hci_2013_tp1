var cabin_names = {
    "ECONOMY": "Turista",
    "BUSINESS": "Ejecutiva",
    "FIRST_CLASS": "Primera Clase"
};

require(
	["libs/text!../templates/flights/flights.html",
	"libs/text!../templates/flights/flights_data.html",
    "libs/text!../templates/img.html",
    "libs/text!../templates/sideValidation.html",
    "libs/utils",
    "libs/carousel",
    "libs/domReady"],

    function(flights_html, flights_data_html, img_html, side_validation_html) {

	Utils.init();
    Utils.make_html(flights_html, side_validation_html);

	var api = new API();
	var flights_data_tmp = Handlebars.compile(flights_data_html);
	var tmp_img = Handlebars.compile(img_html);
	var oneWay = false;

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
    var missingFlights= false;

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

		if(flightsArray !== undefined)
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

		if(!oneWay) {
			if(inbound[0] !== undefined)
				inbound= paginate(inbound, 5);
			else {
				missingFlights= true;
				$(".inbound form").append("<span> Su busqueda obtuvo 0 vuelos de vuelta, lo sentimos mucho. </span>");
			}

		}
		if(outbound[0] !== undefined)
			outbound= paginate(outbound, 5);
		else {
			missingFlights= true;
			$(".outbound form").append("<span> Su busqueda obtuvo 0 vuelos de ida, lo sentimos mucho. </span>");
		}


	    var flights= { "inbound": inbound, "outbound": outbound }
	    return flights;
    }

	var airlineToAirlineLink = function(airline) { return Handlebars.compile("{{Link 'img/airlines/" + airline + ".png'}}"); }

    var showFlights= function(form, page) {

        for(var i=0; i<page.length ; i++) {

    	    var airlineLink= airlineToAirlineLink(page[i].airlineId);

			var selectionValue= $.param(page[i]);
            $(form).append(flights_data_tmp({
				"departureCity": page[i].departure.cityName,
				"arrivalCity": page[i].arrival.cityName,
				"departureTime": convertDate(page[i].departure.date),
				"arrivalTime": convertDate(page[i].arrival.date),
				"flightClass": convertCabinType(page[i].cabinType),
				"flightStopovers": page[i].stopovers.length,
				"flightDuration": page[i].duration + " horas",
				"flightTotal": page[i].pricing.total.total
			}));
			form.find(".airline-image").eq(i).append(tmp_img({"img_src" : airlineLink}));
		}
	}

    var convertDate = function(stringDate) {

        var finalDate;
        var dateRegex = /^(\d{4})\-(\d{1,2})\-(\d{1,2})\ (\d{1,2})\:(\d{1,2})\:(\d{1,2})$/;
        var dateRegexResult = stringDate.match(dateRegex);

        return dateRegexResult[3] + "/" + dateRegexResult[2] + "/" + dateRegexResult[1]
           + " - " + dateRegexResult[4] + ":" + dateRegexResult[5];
    }

    var convertCabinType = function(cabin) {

        return cabin_names[cabin];
    }

	var clearAll = function() {
		inpagenum = 0;
		outpagenum = 0;
		if(!oneWay)
			$(".inbound form").remove();
		$(".outbound form").remove();
		return { "inbound": inbound, "outbound": outbound };
	}

	var refreshPageFooting= function() {
		if(!oneWay)
			$(".inbound-pages span").text("/" + flights.inbound.length);
		$(".outbound-pages span").text("/" + flights.outbound.length);
	}

	var refreshTotals= function() {
		if(!oneWay)
			inTotal= parseFloat($(".inbound .flight-radio input:checked").attr("data-total"));
		outTotal= parseFloat($(".outbound .flight-radio input:checked").attr("data-total"));
		$(".summary div").text(("Total: U$S " + (inTotal + outTotal)).substring(0,19));
	}

	var clearFlights = function() {
		if(!oneWay)
			$(".inbound form div").remove();
		$(".outbound form div").remove();
	}

	var refreshPage= function() {
		clearFlights();
		if(!oneWay) {
			showFlights($(".inbound form"), flights.inbound[inpagenum]);
			$(".inbound .flight-radio input").first().prop('checked', 'checked');
			$(".inbound-pages .page-number").val(inpagenum +1);
		}
		showFlights($(".outbound form"), flights.outbound[outpagenum]);
		$(".outbound .flight-radio input").first().prop('checked', 'checked');
		$(".outbound-pages .page-number").val(outpagenum +1);
		refreshTotals();
	}

	var clearPageNums = function() {
		inpagenum= 0;
		outpagenum= 0;
	}

	var callback = {
		success: function(result) {
			$(".flight-wrapper form img").remove();
			flights = loadPagesArrays(result.flights);
			clearPageNums();
			refreshPageFooting();
			refreshPage();
			}
 //   	<-- Falta la funcion de error aca -->
	}

	var getFlights = function() {
		clearFlights();
		$(".flight-wrapper form").append(tmp_img({"img_src" : "img/loading.gif"}));
		if(!oneWay)
    		api.booking.getRoundTripFlights(callback, param);
    	else
    		api.booking.getOneWayFlights(callback, param);
   }

	$("#selectionOrder").change(function() {
		param.sort_key = $.trim($("#selectionOrder :selected").val().match(".* ")[0]);
		param.sort_order = $.trim($("#selectionOrder :selected").val().match(" .*")[0]);
		if(!missingFlights)
			getFlights();
	});

	$("div").click(function() {
		if(!missingFlights)
			refreshTotals();
	});

	$(".inbound-prev").click(function(){
		if(inpagenum>0) {
			inpagenum--;
			refreshPage();
		}

	});

	$(".outbound-prev").click(function(){
		if(outpagenum>0) {
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
		var desiredPage= $(".inbound-pages .page-number").val();
		if(desiredPage>0 && desiredPage<=flights.inbound.length) {
			inpagenum= desiredPage -1;
			refreshPage();
		}
	});

	$(".outPageBtn").click(function() {
		var desiredPage= $(".outbound-pages .page-number").val();
		if(desiredPage>0 && desiredPage<=flights.outbound.length) {
			outpagenum= desiredPage -1;
			refreshPage();
		}
	});

	getFlights();

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

        console.log(param);
        $("#from").val(param.from_name);
        $("#to").val(param.to_name);
        $("#depart_input").val(param.dep_date_input);
        $("#return_input").val(param.ret_date_input);
        $("#select_adults").val(param.adults);
        $("#select_children").val(param.children);
        $("#select_infants").val(param.infants);
    }


    $("#continue").click(function(){

        document.location.href = Utils.getUrl("passengers.html", setAttrs());
    });

    function setAttrs() {

        return param;
    }
});

