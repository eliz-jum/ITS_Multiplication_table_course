"use strict";

$(document).ready( function() {
		
	var step;
	
	
		
	$('input').keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl/cmd+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: Ctrl/cmd+C
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: Ctrl/cmd+X
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
	
	$('#zad1input1').keyup(function(){
		var input = $(this);
		var number = input.val();
		console.log('wpisal '+number);
		
		if (number==8 ) {
			input.removeClass("incorrect");
			input.addClass("correct disabled");
			$('#congratMessage1').removeClass('is-hidden');
			$('#errorMessage1').addClass('is-hidden');
			$('#zad1part2').removeClass('is-hidden');
		}
		else {
			input.addClass("incorrect");
			$('#errorMessage1').removeClass('is-hidden');
		}
		
    });
	
			
});


$(window).on("unload", function(e) {
    doTerminate();
});