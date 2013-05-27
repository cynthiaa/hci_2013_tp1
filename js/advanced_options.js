require(["libs/text!../templates/advanced_options/advanced_options.html", "libs/text!../templates/select.html", "libs/text!../templates/advanced_options/advancedOptionsValidation.html", "libs/utils", "libs/carousel", "libs/domReady"], function(advanced_options_html, select_html, advanced_options_validation_html) {

	Utils.init();
	Utils.make_html(advanced_options_html, advanced_options_validation_html);

	var param = $.url().param();

	completeSideBar();

	$("#advanced_options").addClass("selected");
	$("#search").hide();

	$("#contact_link").click(function() {
		document.location.href = Utils.getUrl("contact.html", Utils.setAttrs());
	});

	$("#about_link").click(function() {
		document.location.href = Utils.getUrl("about.html", Utils.setAttrs());
	});

	$("#home_link").click(function() {
		document.location.href = Utils.getUrl("index.html", Utils.setAttrs());
	});

	var select_tmp = Handlebars.compile(select_html);

	for (var i = 0; i < 24; i++) {

		$("#select_departure_time").append(select_tmp({
			"value" : i,
			"name" : i + ":00"
		}));
		$("#select_return_time").append(select_tmp({
			"value" : i,
			"name" : i + ":00"
		}));
	}

	for (var i = 1; i <= 8; i++) {

		$("#select_stopovers").append(select_tmp({
			"value" : i,
			"name" : i + " escala" + (i > 1 ? "s" : "")
		}));
	}

	var api = new API();

	var airlines = new Array();
	airlines[0] = new Array();
	airlines[1] = new Array();

	var callbacks = {

		success : function(result) {

			for (var i = 0; i < result.airlines.length; i++) {

				airlines[0][i] = result.airlines[i].name;
				airlines[1][i] = result.airlines[i].airlineId;
			}
		}
	};

	api.misc.getAirlines(callbacks);

	$("#airline").autocomplete({
		source : airlines[0]
	});

	// Currencies
	//
	// callbacks = {

	//     success: function(result) {

	//     for (var i = 0; i < result.currencies.length; i++) {

	//         var name = result.currencies[i].description;

	//         name = (name == "Pesos - Argentina") ? "Pesos" : name;

	//         $("#currency").append(select_tmp({"value": name, "name": name}));
	//     }
	// }
	// };

	// var param = {"sort_key": "id", "sort_order": "asc"};

	// api.misc.getCurrencies(callbacks, param);

	// $("#search_adv_opt").click(function() {
// 
		// // var citiesAndAirports = Utils.getCitiesAndAirports();
		// var attrs = new Array();
// 
		// attrs["airline_id"] = airlines[1][airlines[0].indexOf($("#airline").val())];
// 
		// checkAndSetPrice("min_price", attrs);
		// checkAndSetPrice("max_price", attrs);
// 
		// checkAndSetValue("stopovers", "select_stopovers", attrs);
		// checkAndSetValue("cabin_type", "class", attrs);
// 
		// setTimes("dep_time", "select_departure_time", attrs);
// 
		// if ($("#return").is(":visible")) {
			// setTimes("ret_time", "select_return_time", attrs);
		// }
// 
		// // console.log(attrs)
		// document.location.href = Utils.getUrl("flights.html", Utils.setAdvAttrs(attrs));
	// });

	function checkAndSetPrice(attrs_name, attrs) {

		if (($("#" + attrs_name).val()) != "") {

			attrs[attrs_name] = $("#" + attrs_name).val();
		}
	}

	function checkAndSetValue(attrs_name, id, attrs) {

		if (checkValue(id)) {

			attrs[attrs_name] = $("#" + id).val();
		}
	}

	function checkValue(id) {

		return ($("#" + id).val() != "no-preference");
	}

	function setTimes(attrs_name, id, attrs) {

		if (checkValue(id)) {

			attrs["min_" + attrs_name] = addHours(id, -1);
			attrs["max_" + attrs_name] = addHours(id, 1);
		}
	}

	function addHours(id, offset) {

		var currentTime = $("#" + id).val();
		var newTime = Number(currentTime) + offset;

		return ((newTime < 0 || newTime > 24) ? currentTime : newTime) + ":00";

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

});

