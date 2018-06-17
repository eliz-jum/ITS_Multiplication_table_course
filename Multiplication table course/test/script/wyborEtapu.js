"use strict";

$(document).ready( function() {
		
	var step;
	var objective;
	
	getObjectives();
	
	function getObjectives() {
		doInitialize();
		var objectivesCount = doGetValue("cmi.objectives._count");
		console.log(objectivesCount.length);
		for (var i = 0; i < objectivesCount; i++) {
			console.log('jestem w bjectives count');
			var idObjective = doGetValue("cmi.objectives." + i + ".id");
			var status = "cmi.objectives." + i + ".success_status";
			if (idObjective == "stepChoosing") {
				console.log('status passed '+ doGetValue(status));
				objective = doGetValue(status);
			}
		}
	}
	
	if (objective=='failed') {
		$('#disabledMessage').removeClass('is-hidden');
		
	}
	else {
		$('#activeBody').removeClass('is-hidden');
		
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
		
		$('#step1input1').keyup(function(){
			if ($('#step1input2').val()) {
				var input1 = $(this);
				var input2 = $('#step1input2');
				
				var firstNumber = input1.val();
				var secondNumber = input2.val();
				
				if ((firstNumber==2 && secondNumber==5) || (firstNumber==5 && secondNumber==2)) {
					input1.addClass("correct disabled");
					input2.addClass("correct disabled");
					$('#step2').removeClass('is-hidden');
				}
				else {
					step = "etap1stylCzynnosciowy";
					input1.addClass("incorrect disabled");
					input2.addClass("incorrect disabled");
					$('#finishButton').removeClass('is-hidden');
				}
			}
		});
		
		$('#step1input2').keyup(function(){
			if ($('#step1input1').val()) {
				var input1 = $('#step1input1');
				var input2 = $(this);
				
				var firstNumber = input1.val();
				var secondNumber = input2.val();
				
				if ((firstNumber==2 && secondNumber==5) || (firstNumber==5 && secondNumber==2)) {
					input1.addClass("correct disabled");
					input2.addClass("correct disabled");
					$('#step2').removeClass('is-hidden');
				}
				else {
					step = "etap1stylCzynnosciowy";
					input1.addClass("incorrect disabled");
					input2.addClass("incorrect disabled");
					$('#finishButton').removeClass('is-hidden');
					$("html, body").animate({ scrollTop: $(document).height() }, "slow");
				}
			}
		});	
		

		$('#step2input1').keyup(function(){
			if ($('#step2input2').val()) {
				var input1 = $(this);
				var input2 = $('#step2input2');
				
				var firstNumber = input1.val();
				var secondNumber = input2.val();
				
				if (firstNumber==2 && secondNumber==3) {
					step = 'etap30';
					input1.addClass("correct disabled");
					input2.addClass("correct disabled");
					$('#finishButton').removeClass('is-hidden');
					$("html, body").animate({ scrollTop: $(document).height() }, "slow");
				}
				else {
					step = 'etap2stylCzynnosciowy';
					input1.addClass("incorrect disabled");
					input2.addClass("incorrect disabled");
					$('#finishButton').removeClass('is-hidden');
					$("html, body").animate({ scrollTop: $(document).height() }, "slow");
				}
			}
		});
		$('#step2input2').keyup(function(){
			if ($('#step2input1').val()) {
				var input1 = $('#step2input1');
				var input2 = $(this);
				
				var firstNumber = input1.val();
				var secondNumber = input2.val();
				
				if (firstNumber==2 && secondNumber==3) {
					step = 'etap30';
					input1.addClass("correct disabled");
					input2.addClass("correct disabled");
					$('#finishButton').removeClass('is-hidden');
					$("html, body").animate({ scrollTop: $(document).height() }, "slow");
				}
				else {
					step = 'etap2stylCzynnosciowy';
					input1.addClass("incorrect disabled");
					input2.addClass("incorrect disabled");
					$('#finishButton').removeClass('is-hidden');
					$("html, body").animate({ scrollTop: $(document).height() }, "slow");
				}
			}
		});

		
		$("#finishButton").click(function(){
			console.log('keyword   '+step);
			getScoByKeyword()
			$('#finishMessage').removeClass('is-hidden');
			$('#activeBody').addClass('is-hidden');
			setObjectivesStatusForSCO();
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
					console.log('Jestem w its run! 2 objectives');
					//console.log(doGetValue("cmi.objectives." + i + ".description"));
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
				
				
				if (idObjective == "stepChoosing") {
					
					//doSetValue(status, CMI_OBJECTIVES_SUCCESS_STATUS_PASSED);
					doSetValue(status, CMI_OBJECTIVES_SUCCESS_STATUS_FAILED);
					doSetValue(scoreRaw, 0);
					doSetValue(scoreScaled, 1);
					
					console.log('status passed '+ doGetValue(status));
					console.log('score raw 0 ' + doGetValue(scoreRaw));
					console.log('score scaled 1 ' + doGetValue(scoreScaled));
					
				}
			}
		}		
			
	}
			
});


$(window).on("unload", function(e) {
    doTerminate();
});