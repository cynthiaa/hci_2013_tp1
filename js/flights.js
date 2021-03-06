var cabin_names = {
	"ECONOMY" : "Turista",
	"BUSINESS" : "Ejecutiva",
	"FIRST_CLASS" : "Primera Clase"
};

require(["libs/text!../templates/flights/flights.html", "libs/text!../templates/flights/flights_data.html", "libs/text!../templates/img.html", "libs/text!../templates/sideValidation.html", "libs/utils", "libs/carousel", "libs/domReady"], function(flights_html, flights_data_html, img_html, side_validation_html) {

	Utils.init();
	Utils.make_html(flights_html, side_validation_html);

	$("#contact_link").click(function() {
		document.location.href = Utils.getUrl("contact.html", Utils.setAttrs());
	});

	$("#about_link").click(function() {
		document.location.href = Utils.getUrl("about.html", Utils.setAttrs());
	});

	$("#home_link").click(function() {
		document.location.href = Utils.getUrl("index.html", Utils.setAttrs());
	});

	$("#advanced_options").click(function() {
		document.location.href = Utils.getUrl("advanced_options.html", Utils.setAttrs());
	});

	var api = new API();
	var flights_data_tmp = Handlebars.compile(flights_data_html);
	var tmp_img = Handlebars.compile(img_html);
	var oneWay = false;

	var param = $.url().param();
	param.sort_key = $.trim($("#selectionOrder :selected").val().match(".* ")[0]);
	param.sort_order = $.trim($("#selectionOrder :selected").val().match(" .*")[0]);

	completeSideBar();
	$("#continue").hide();

	// Si es sólo ida
	generateLayoutOneWay();

	var inpagenum = 0;
	var outpagenum = 0;
	var inTotal = 0;
	var outTotal = 0;
	var inSelected = 0;
	var outSelected = 0;
	var flights;
	var missingFlights = false;

	var paginate = function(arr, pagesize, type) {
		var aux = new Array;
		for (var i = 0; i * pagesize < arr.length; i++)
			aux.push(arr.slice(i * pagesize, (i + 1) * pagesize));

		if ( type = "inbound")
			paramsFlightInbound = arr[0];
		else
			paramsFlightOutbound = arr[0];

		return aux;
	}
	var loadPagesArrays = function(flightsArray) {
		var inbound = new Array;
		var outbound = new Array;
		var aux;

		if (flightsArray !== undefined)
			for (var i = 0; i < flightsArray.length; i++) {
				if (flightsArray[i].hasOwnProperty('inboundRoutes')) {
					aux = inbound.push(flightsArray[i].inboundRoutes[0].segments[0]);
					inbound[aux - 1].pricing = flightsArray[i].price;
				} else {
					aux = outbound.push(flightsArray[i].outboundRoutes[0].segments[0]);
					outbound[aux - 1].pricing = flightsArray[i].price;
				}
			}

		if (!oneWay) {
			if (inbound[0] !== undefined) {
				inbound = paginate(inbound, 5, "inbound");
				$(".inbound .empty-flights").remove();
			} else {
				missingFlights = true;
				$(".inbound").prepend("<div class='empty-flights'> <span> Su busqueda obtuvo 0 vuelos de vuelta, lo sentimos mucho. </span> </div>");
			}

		}

		if (outbound[0] !== undefined) {
			outbound = paginate(outbound, 5, "outbound");
			$(".outbound .empty-flights").remove();
		} else {
			missingFlights = true;
			$(".outbound").prepend("<div class='empty-flights'> <span> Su busqueda obtuvo 0 vuelos de ida, lo sentimos mucho. </span> </div>");
		}

		var flights = {
			"inbound" : inbound,
			"outbound" : outbound
		}

		return flights;
	}
	var airlineToAirlineLink = function(airline) {
		return Handlebars.compile("{{Link 'img/airlines/" + airline + ".png'}}");
	}
	var showFlights = function(form, page, type) {
		if (page !== undefined) {
			for (var i = 0; i < page.length; i++) {

				var airlineLink = airlineToAirlineLink(page[i].airlineId);
				$(form).append(flights_data_tmp({
					"departureCity" : page[i].departure.cityName,
					"arrivalCity" : page[i].arrival.cityName,
					"departureTime" : convertDate(page[i].departure.date),
					"arrivalTime" : convertDate(page[i].arrival.date),
					"departureAirport" : (page[i].departure.airportDescription).split(",")[0],
					"arrivalAirport" : (page[i].arrival.airportDescription).split(",")[0],
					"flightClass" : convertCabinType(page[i].cabinType),
					"flightStopovers" : page[i].stopovers.length,
					"flightDuration" : page[i].duration + " horas",
					"flightTotal" : page[i].pricing.total.total,
					"buttonValue" : createUrl(page[i], type)
				}));

				form.find(".airline-image").eq(i).append(tmp_img({
					"img_src" : airlineLink
				}));
			}
		};
	}
	var convertDate = function(stringDate) {

		var finalDate;

		var dateRegex = /^(\d{4})\-(\d{1,2})\-(\d{1,2})\ (\d{1,2})\:(\d{1,2})\:(\d{1,2})$/;
		var dateRegexResult = stringDate.match(dateRegex);

		return dateRegexResult[3] + "/" + dateRegexResult[2] + "/" + dateRegexResult[1] + " - " + dateRegexResult[4] + ":" + dateRegexResult[5];
	}
	var convertCabinType = function(cabin) {

		return cabin_names[cabin];
	}
	var clearAll = function() {
		inpagenum = 0;
		outpagenum = 0;
		if (!oneWay)
			$(".inbound form").remove();
		$(".outbound form").remove();
		return {
			"inbound" : inbound,
			"outbound" : outbound
		};
	}
	var refreshPageFooting = function() {
		if (!oneWay)
			$(".inbound-pages span").text("/" + flights.inbound.length);
		$(".outbound-pages span").text("/" + flights.outbound.length);
	}
	var refreshSelected = function() {
		$(".inbound .flight-radio input").each(function(i) {
			if ($(this).is(":checked"))
				inSelected = i;
		});
		$(".outbound .flight-radio input").each(function(i) {
			if ($(this).is(":checked"))
				outSelected = i;
		});
	};

	var refreshTotals = function() {

		var inData = flights.inbound[inpagenum];
		if (inData != undefined)
			inData = inData[inSelected];
		var outData = flights.outbound[outpagenum];
		if (outData != undefined)
			outData = outData[outSelected];

		var inAdulFare = 0;
		var inChilFare = 0;
		var inInfFare = 0;
		var inTaxation = 0;
		var outAdulFare = 0;
		var outChilFare = 0;
		var outInfFare = 0;
		var outTaxation = 0;
		var strChil = "";
		var strInf = "";

		inTotal = (!oneWay) ? inData.pricing.total.total : 0;
		outTotal = outData.pricing.total.total;

		if (inData !== undefined) {
			inAdulFare = inData.pricing.adults.baseFare;
			if (param.children != 0)
				inChilFare = inData.pricing.children.baseFare;
			if (param.infants != 0)
				inInfFare = inData.pricing.infants.baseFare;
			inTaxation = Number((inData.pricing.total.charges + inData.pricing.total.taxes).toFixed(2));
		}

		if (outData !== undefined) {
			outAdulFare = outData.pricing.adults.baseFare;
			if (param.children != 0)
				outChilFare = outData.pricing.children.baseFare;
			if (param.infants != 0)
				outInfFare = outData.pricing.infants.baseFare;
			outTaxation = Number((outData.pricing.total.charges + outData.pricing.total.taxes).toFixed(2));
		}

		if ((inChilFare + outChilFare) != 0)
			strChil = ("U$S " + Number((inChilFare + outChilFare).toFixed(2)) + "(c/ men.), ");
		if ((inInfFare + outInfFare) != 0)
			strInf = ("U$S " + Number((inInfFare + outInfFare).toFixed(2)) + " (c/ inf.), ");

		var str = " [" + ("U$S " + Number((inAdulFare+outAdulFare).toFixed(2)) + " (c/ adul.), ") + strChil + strInf + ("U$S " + Number((inTaxation+outTaxation).toFixed(2)) + " (c/ imp.)") + "]";
		$(".summary div").text(("Total: U$S " + Number((inTotal + outTotal).toFixed(2))) + str);
	}
	var clearFlights = function() {
		if (!oneWay)
			$(".inbound form div").remove();
		$(".outbound form div").remove();
	}
	var refreshPage = function() {
		clearFlights();
		if (!oneWay && flights.inbound[inpagenum] !== undefined) {
			showFlights($(".inbound form"), flights.inbound[inpagenum], "inbound");
			$(".inbound .flight-radio input").first().prop('checked', 'checked');
			$(".inbound-pages .page-number").val(inpagenum + 1);
		}
		if (flights.outbound[outpagenum] !== undefined) {
			showFlights($(".outbound form"), flights.outbound[outpagenum], "outbound");
			$(".outbound .flight-radio input").first().prop('checked', 'checked');
			$(".outbound-pages .page-number").val(outpagenum + 1);
		}
		refreshSelected();
		refreshTotals();
	}
	var clearPageNums = function() {
		inpagenum = 0;
		outpagenum = 0;
	}
	var callback = {
		success : function(result) {
			$(".flight-wrapper form img").remove();
			flights = loadPagesArrays(result.flights);
			clearPageNums();
			refreshPageFooting();
			refreshPage();
			if ((flights.inbound[0] == undefined && !oneWay) || flights.outbound[0] == undefined)
				$("#continue").hide();
			else
				$("#continue").show();
		}
		//   	<-- Falta la funcion de error aca -->
	}

	var getFlights = function() {
		clearFlights();
		$(".flight-wrapper form").append(tmp_img({
			"img_src" : "img/loading.gif"
		}));
		if (!oneWay)
			api.booking.getRoundTripFlights(callback, param);
		else
			api.booking.getOneWayFlights(callback, param);
	}

	$("#selectionOrder").change(function() {
		param.sort_key = $.trim($("#selectionOrder :selected").val().match(".* ")[0]);
		param.sort_order = $.trim($("#selectionOrder :selected").val().match(" .*")[0]);
		if (!missingFlights)
			getFlights();
	});

	$("div").click(function() {
		if (!missingFlights)
			refreshTotals();
		refreshSelected();
	});

	$(".inbound-prev").click(function() {
		if (inpagenum > 0) {
			inpagenum--;
			refreshPage();
		}

	});

	$(".outbound-prev").click(function() {
		if (outpagenum > 0) {
			outpagenum--;
			refreshPage();
		}
	});

	$(".inbound-next").click(function() {
		if (inpagenum < flights.inbound.length - 1) {
			inpagenum++;
			refreshPage();
		}
	});

	$(".outbound-next").click(function() {
		if (outpagenum < flights.outbound.length - 1) {
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

	function generateLayoutOneWay() {

		if (param.ret_date == "null") {
			oneWay = true;
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

		$("#from").val(param.from_name);
		$("#to").val(param.to_name);
		$("#depart_input").val(param.dep_date_input);
		$("#return_input").val(param.ret_date_input);
		$("#select_adults").val(param.adults);
		$("#select_children").val(param.children);
		$("#select_infants").val(param.infants);
	}


	$("#continue").click(function() {

		if (oneWay)
			document.location.href = $(".outbound .flight-radio input:checked").val();
		else
			document.location.href = concatUrls($(".inbound .flight-radio input:checked").val(), $(".outbound .flight-radio input:checked").val());
	});

	function concatUrls(url1, url2) {

		url2 = url2.split("?");

		return url1 + "&" + url2[1];

	}

	function createUrl(data, type) {

		return getUrl(data, (type == "inbound" ? "ret" : ""));
	}

	function getUrl(data, string) {

		var attrs = new Array();
		var aux;

		attrs[string + "departureCity"] = data.departure.cityName;
		attrs[string + "arrivalCity"] = data.arrival.cityName;
		attrs[string + "departureAirport"] = (data.departure.airportDescription).split(",")[0];
		attrs[string + "arrivalAirport"] = (data.arrival.airportDescription).split(",")[0];
		attrs[string + "departureTime"] = convertDate(data.departure.date);
		attrs[string + "arrivalTime"] = convertDate(data.arrival.date);
		attrs[string + "flightClass"] = convertCabinType(data.cabinType);
		attrs[string + "flightStopovers"] = data.stopovers.length;
		attrs[string + "flightDuration"] = data.duration + " horas";
		attrs[string + "flightTotal"] = data.pricing.total.total;
		attrs[string + "adultsFare"] = data.pricing.adults.baseFare;
		if ( aux = data.pricing.children)
			attrs[string + "childrenFare"] = aux.baseFare;
		if ( aux = data.pricing.infants)
			attrs[string + "infantsFare"] = aux.baseFare;
		attrs[string + "taxation"] = Number((data.pricing.total.charges + data.pricing.total.taxes).toFixed(2));
		attrs[string + "flightId"] = data.flightId;

		return Utils.getUrl("passengers.html", (string == "ret" ? attrs : Utils.jsonConcat(attrs, param)));
	}

});

