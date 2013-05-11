function init() {

    $("body").append("<div id='temp_div'></div>");
    $("#temp_div").load("/layout.html", function() {

        if ($("body[data-sidebar='false']").length) {

            $("#body").empty();
            $("body > *").filter(":not(#temp_div)").appendTo("#body");

        } else {

            $("body > *").filter(":not(#temp_div)").appendTo("#main");
        }

        $("#temp_div > *").appendTo("body");
        $("#temp_div").remove();
    });
}

$(document).ready(init);

