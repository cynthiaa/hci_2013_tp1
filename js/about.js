require(["libs/text!../templates/about/about.html", "libs/text!../templates/sideValidation.html", "libs/utils", "libs/carousel",
// "libs/calendar/calendar",
// "libs/calendar/calendar-es",
// "libs/calendar/calendar-setup",
"libs/domReady"], function(about_html, side_validation_html) {

	Utils.init();
	Utils.make_html(about_html, side_validation_html);

	var param = $.url().param();

	completeSideBar();

	$("#about_link").addClass("selected");

	$("#contact_link").click(function() {
		document.location.href = Utils.getUrl("contact.html", Utils.setAttrs());
	});

	$("#home_link").click(function() {
		document.location.href = Utils.getUrl("index.html", Utils.setAttrs());
	});
	
	$("#advanced_options").click(function() {
		document.location.href = Utils.getUrl("advanced_options.html", Utils.setAttrs());
	});

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

