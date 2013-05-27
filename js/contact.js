require(["libs/text!../templates/contact/contact.html", "libs/text!../templates/contact/contactValidation.html", "libs/utils", "libs/carousel",
// "libs/calendar/calendar",
// "libs/calendar/calendar-es",
// "libs/calendar/calendar-setup",
"libs/domReady"], function(contact_html, contact_validation_html) {

	Utils.init();
	Utils.make_html(contact_html, contact_validation_html);
	
	var param = $.url().param();
	
	completeSideBar();

	$("#contact_link").addClass("selected");

	$("#about_link").click(function() {
		document.location.href = Utils.getUrl("about.html", Utils.setAttrs());
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
		var dateString = param.ret_date_input;
		if (param.ret_date_input != "99/99/9999") {
			$("#return_input").val(param.ret_date_input);
		};
		$("#select_adults").val(param.adults);
		$("#select_children").val(param.children);
		$("#select_infants").val(param.infants);
	}
});

