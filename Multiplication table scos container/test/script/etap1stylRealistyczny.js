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
		
		if ( number==8 ) {
			input.removeClass("incorrect");
			input.addClass("correct disabled");
			$('#congratMessage1').removeClass('is-hidden');
			$('#errorMessage1').addClass('is-hidden');
			$('#zad1part2').removeClass('is-hidden');
			$("html, body").animate({ scrollTop: $(document).height() }, "slow");
		}
		else {
			input.addClass("incorrect");
			$('#errorMessage1').removeClass('is-hidden');
		}
		
    });
	
	$('#zad1input2').keyup(function(){
		var input = $(this);
		var number = input.val();
		
		if ( number==4 ) {
			input.removeClass("incorrect");
			input.addClass("correct disabled");
			$('#congratMessage2').removeClass('is-hidden');
			$('#errorMessage2').addClass('is-hidden');
			$('#zad1part3').removeClass('is-hidden');
			$('#nextButtonDiv').removeClass('is-hidden');
			$("html, body").animate({ scrollTop: $(document).height() }, "slow");
		}
		else {
			input.addClass("incorrect");
			$('#errorMessage2').removeClass('is-hidden');
		}
		
    });	
	
	$("#nextButton").click(function(){
		$('#zad2').removeClass('is-hidden');
		$('#nextButton').addClass('disabled');
		$("html, body").animate({ scrollTop: $(document).height() }, "slow");
	});

	$('#zad2input1').keyup(function(){
		if ($('#zad2input2').val()) {
			var input1 = $(this);
			var input2 = $('#zad2input2');
			
			var firstNumber = input1.val();
			var secondNumber = input2.val();
			
			if ((firstNumber==3 && secondNumber==5) || (firstNumber==5 && secondNumber==3)) {
				step = 'etap2stylRealistyczny';
				input1.removeClass("incorrect");
				input2.removeClass("incorrect");
				input1.addClass("correct disabled");
				input2.addClass("correct disabled");
				$('#congratMessage3').removeClass('is-hidden');
				$('#errorMessage3').addClass('is-hidden');
				$('#finishButton').removeClass('is-hidden');
				$("html, body").animate({ scrollTop: $(document).height() }, "slow");
			}
			else {
				step = 'etap1stylIntegralny';
				input1.addClass("incorrect disabled");
				input2.addClass("incorrect disabled");
				$('#errorMessage3').removeClass('is-hidden');
				$('#finishButton').removeClass('is-hidden');
				$("html, body").animate({ scrollTop: $(document).height() }, "slow");
			}
		}
    });
	
	$('#zad2input2').keyup(function(){
		if ($('#zad2input1').val()) {
			var input1 = $('#zad2input1');
			var input2 = $(this);
			
			var firstNumber = input1.val();
			var secondNumber = input2.val();
			
			if ((firstNumber==3 && secondNumber==5) || (firstNumber==5 && secondNumber==3)) {
				step = 'etap2stylRealistyczny';
				input1.removeClass("incorrect");
				input2.removeClass("incorrect");
				input1.addClass("correct disabled");
				input2.addClass("correct disabled");
				$('#congratMessage3').removeClass('is-hidden');
				$('#errorMessage3').addClass('is-hidden');
				$('#finishButton').removeClass('is-hidden');
				$("html, body").animate({ scrollTop: $(document).height() }, "slow");
			}
			else {
				step = 'etap1stylIntegralny';
				input1.addClass("incorrect disabled");
				input2.addClass("incorrect disabled");
				$('#errorMessage3').removeClass('is-hidden');
				$('#finishButton').removeClass('is-hidden');
				$("html, body").animate({ scrollTop: $(document).height() }, "slow");
			}
		}
    });


	
	$("#finishButton").click(function(){
		console.log('finish');
		getScoByKeyword()
		$('#finishMessage').removeClass('is-hidden');
		$('#activeBody').addClass('is-hidden');
		//setObjectivesStatusForSCO();
	});
	
	
			
			
	function getScoByKeyword(){
		doInitialize();
		
		var objectivesCount = doGetValue("cmi.objectives._count");
		var keywordOfWrong = step;
		var recommendationRule = "KEYWORD_EQUAL_TO";
		for (var i=0; i < objectivesCount; i++) {
			var idObjective = doGetValue("cmi.objectives." + i + ".id");
			if (idObjective == "its.run") {
				var ta1 = "\"SearchConditions=(\"general/keyword=" + keywordOfWrong + "\")\"";
				var ta2 = "\"RecommendationRule="+ recommendationRule +"\"";
				var trigger_actions = ta1 + ";" + ta2;
				doSetValue("cmi.objectives." + i + ".description", trigger_actions);
				doCommit();
				break;
			}
		}
	}		
			
			
			
			
			
			
			
	function setObjectivesStatusForSCO() {
			var objectivesCount = doGetValue("cmi.objectives._count");
			for (var i = 0; i < objectivesCount; i++) {
				var idObjective = doGetValue("cmi.objectives." + i + ".id");
				var status = "cmi.objectives." + i + ".success_status";
				var scoreRaw = "cmi.objectives." + i + ".score.raw";
				var scoreScaled = "cmi.objectives." + i + ".score.scaled";
				
				
				if (idObjective == "learningStyle") {
					
					doSetValue(status, CMI_OBJECTIVES_SUCCESS_STATUS_PASSED);
					doSetValue(scoreRaw, 23);
					doSetValue(scoreScaled, 0.25);
					
					console.log('status passed '+ doGetValue(status));
					console.log('score raw 23 ' + doGetValue(scoreRaw));
					console.log('score scaled 23 ' + doGetValue(scoreScaled));
					
				}
			}
		}		
			
	
			
});


$(window).on("unload", function(e) {
    doTerminate();
});