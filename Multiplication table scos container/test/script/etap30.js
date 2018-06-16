"use strict";

$(document).ready( function() {
		
	var step;
	var taskPart = 1;
	var task2Part = 1;
	
		
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
	
	$("#nextButton").click(function(){
		taskPart++;
		var taskId = '#zad1part'+taskPart;
		if (taskPart<6) {
			$(taskId).removeClass('is-hidden');
		}
		else {
			$('#zad2').removeClass('is-hidden');
			$('#nextButton').addClass('is-hidden');
		}
		$("html, body").animate({ scrollTop: $(document).height() }, "slow");
	});
	
	$('.zad2-input').keyup(function(){
		var input = $(this);
		var errorMessage = input.parent().next();
		var nextTaskPart = input.parent().parent().next();
		var number = input.val();
		if ( number==0 ) {
			task2Part++;
			if (task2Part<5) {
				input.removeClass("incorrect");
				input.addClass("correct disabled");
				errorMessage.addClass('is-hidden');
				nextTaskPart.removeClass('is-hidden');
			}
			else {
				step = 'etap31';
				$('#congratMessage4').removeClass('is-hidden');
				$("#finishButton").removeClass('is-hidden');
			}
			
			
			$("html, body").animate({ scrollTop: $(document).height() }, "slow");
		}
		else {
			input.addClass("incorrect");
			errorMessage.removeClass('is-hidden');
		}
    });
	
	
	




	
	$("#finishButton").click(function(){
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