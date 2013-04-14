function init() {

    $("body").append("<div id='1234'></div>");
    $("#1234").load("/html/layout.html", function() {

        $("body > *").filter(":not(#1234)").appendTo("#main");
        $("#1234 > *").appendTo("body");
        $("#1234").remove();
    });
}

$(document).ready(init);

