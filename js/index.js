// Cantidad de imágenes en el carousel y en destacados
var max = 5;

require(["libs/text!../templates/index/index.html", "libs/text!../templates/index/li.html", "libs/text!../templates/img.html", "libs/text!../templates/index/info_deal.html", "libs/text!../templates/index/featured_item.html", "libs/text!../templates/index/info_featured.html", "libs/text!../templates/sideValidation.html", "libs/utils", "libs/carousel", "libs/jquery.shuffle", "libs/domReady"], function(index_html, li_html, img_html, info_deal_html, featured_item_html, info_featured_html, side_validation_html) {

	Utils.init();
	Utils.make_html(index_html, side_validation_html);

	var param = $.url().param();

	completeSideBar();

	$("#home_link").addClass("selected");

	$("#contact_link").click(function() {
		document.location.href = Utils.getUrl("contact.html", Utils.setAttrs());
	});

	$("#about_link").click(function() {
		document.location.href = Utils.getUrl("about.html", Utils.setAttrs());
	});
	
	$("#advanced_options").click(function() {
		document.location.href = Utils.getUrl("advanced_options.html", Utils.setAttrs());
	});

	var api = new API();
	var citiesAndAirports = new Array(2);
	var deals = new Array(max);

	// Create the carousel-frame and the featured-frame

	createCarouselAndFeatured();

	// Init the carousel

	DP.inicio();

	// // Cuando se clickee alguna imagen del carousel

	clickCarouselImage();

	// Cuando se clickee algún destacado

	clickFeaturedItem();

	// Cuando se clickee el button de id search

	function createCarouselAndFeatured() {

		var li_tmp = Handlebars.compile(li_html);
		var featured_item_tmp = Handlebars.compile(featured_item_html);

		for (var i = 0; i < max; i++) {

			var li = li_tmp({
				'id' : 'li-' + i
			});
			$('#carousel-frame').append(li);

			var featured_item = featured_item_tmp({
				'id' : 'feat-' + i
			});
			$('#featured-flights').append(featured_item);
		}

		setCarouselAndFeaturedImages();
	}

	function setCarouselAndFeaturedImages() {

		var info_deal_tmp = Handlebars.compile(info_deal_html);
		var info_featured_tmp = Handlebars.compile(info_featured_html);
		var img_tmp = Handlebars.compile(img_html);

		api.booking.getFlightDeals({

			success : function(result) {

				for (var i = 0; i < result.deals.length; i++) {

					deals[i] = new Array();

					deals[i][0] = result.deals[i].cityId;
					deals[i][1] = result.deals[i].cityName;
					deals[i][2] = result.deals[i].price;
				}

				deals = $.shuffle(deals);

				// Carousel images

				for (var i = 0; i < max; i++) {

					var link = '{{Link "img/featured/' + deals[i][0] + '.jpg"}}';
					var img_src = Handlebars.compile(link);
					var img = img_tmp({
						'img_src' : img_src
					});

					var city = deals[i][1].split(",")[0];
					var percentage = Math.floor(Math.random() * 5 + 1) * 5;
					var cards = ["Visa", "Diners", "Master Card", "American Express"];
					var card = cards[Math.floor(Math.random() * 3 + 1)];
					var deal = percentage + "% de descuento a " + city + " abonando con " + card;

					$('#li-' + i).append(img);
					$('#li-' + i + ' div').append(info_deal_tmp({
						"title" : deals[i][1],
						"deal" : deal
					}));
				}

				// Featured items

				for (var i = max; i < 2 * max; i++) {

					var link = '{{Link "img/featured/' + deals[i][0] + '.jpg"}}';
					var img_src = Handlebars.compile(link);
					var img = img_tmp({
						'img_src' : img_src
					});

					var city = deals[i][1].split(",")[0];
					var price = "Desde U$S " + Math.ceil(deals[i][2]);

					$('#feat-' + (i - max)).append(img);
					$('#feat-' + (i - max) + ' div').append(info_featured_tmp({
						"city" : city,
						"price" : price
					}));
				}
			}
		}, {
			"from" : "BUE"
		});
	}

	function setDealsAttrs(n, days, offset) {

		var attrs = new Array();
		var currentDate = new Date();
		currentDate.setDate(currentDate.getDate() + days);
		var date = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

		attrs["from"] = "BUE";
		attrs["from_name"] = "Buenos Aires, Ciudad de Buenos Aires";
		attrs["to"] = deals[n + offset][0];
		attrs["to_name"] = deals[n + offset][1];
		attrs["dep_date"] = date;
		attrs["dep_date_input"] = convertToDateInput(date);
		attrs["ret_date"] = "null";
		attrs["adults"] = 1;
		attrs["children"] = attrs["infants"] = 0;

		return attrs;
	}

	function convertToDateInput(stringDate) {

		var dateRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
		var dateRegexResult = stringDate.match(dateRegex);

		// return moment.utc(stringDate, "DD-MM-YYYY").format("YYYY-MM-DD");
		return dateRegexResult[3] + "/" + dateRegexResult[2] + "/" + dateRegexResult[1];
	}

	function clickFeaturedItem() {

		for (var i = 0; i < max; i++) {

			clickFeaturedImage(i);
		}
	}

	function clickFeaturedImage(i) {

		$("#feat-" + i).click(function() {

			document.location.href = Utils.getUrl("flights.html", setDealsAttrs(i, 2, max));
		});

	}

	function clickCarouselImage() {

		for (var i = 0; i < max; i++) {

			$("#li-" + i).click(function() {

				for (var j = 0; j < max; j++) {

					if ($("#li-" + j).hasClass("selected")) {

						document.location.href = Utils.getUrl("flights.html", setDealsAttrs(j, 2, 0));
					}
				}
			});
		}
	}

	function completeSideBar() {

		$("#from").val(param.from_name);
		$("#to").val(param.to_name);
		$("#depart_input").val(param.dep_date_input);
		var dateString = param.ret_date_input;
		if (param.ret_date_input != "99/99/9999") {
			$("#return_input").val(param.ret_date_input);
		};
		$("#select_adults").val(param.adults);
		$("#select_children").val(param.children);
		$("#select_infants").val(param.infants);
	}

});

