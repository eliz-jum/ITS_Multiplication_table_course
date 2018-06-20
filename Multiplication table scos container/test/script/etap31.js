"use strict";

$(document).ready( function() {
		
	var step;
	var taskPart = 1;
	var task2Part = 1;
	var goBack = 0;
	var objective = getObjectiveStatus('step3part1');
	
	function getObjectiveStatus(objective) {
		doInitialize();
		var objectivesCount = doGetValue("cmi.objectives._count");
		for (var i = 0; i < objectivesCount; i++) {
			var idObjective = doGetValue("cmi.objectives." + i + ".id");
			var status = "cmi.objectives." + i + ".success_status";
			if (idObjective == objective) {
				return doGetValue(status);
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
		
		$('#zad2input1').keyup(function(){
			var input = $(this);
			var number = input.val();
			if ( number==7 ) {
				input.removeClass("incorrect");
				input.addClass("correct disabled");
				$('#errorMessage1').addClass('is-hidden');
				$('#zad2part2').removeClass('is-hidden');
				$("html, body").animate({ scrollTop: $(document).height() }, "slow");
			}
			else {
				input.addClass("incorrect");
				$('#errorMessage1').removeClass('is-hidden');
			}
		});
		
		$('#zad2input2').keyup(function(){
			var input = $(this);
			var number = input.val();
			if ( number==3 ) {
				input.removeClass("incorrect");
				input.addClass("correct disabled");
				$('#errorMessage2').addClass('is-hidden');
				$('#zad2part3').removeClass('is-hidden');
				$("html, body").animate({ scrollTop: $(document).height() }, "slow");
			}
			else {
				input.addClass("incorrect");
				$('#errorMessage2').removeClass('is-hidden');
			}
		});	
		
		$('#zad2input3').keyup(function(){
			var input = $(this);
			var number = input.val();
			if ( number==9 ) {
				input.removeClass("incorrect");
				input.addClass("correct disabled");
				$('#errorMessage3').addClass('is-hidden');
				$('#zad2part4').removeClass('is-hidden');
				$("html, body").animate({ scrollTop: $(document).height() }, "slow");
			}
			else {
				input.addClass("incorrect");
				$('#errorMessage3').removeClass('is-hidden');
			}
		});	
		
		$('#zad2input4').keyup(function(){
			var input = $(this);
			var number = input.val();
			if ( number==5 ) {
				input.removeClass("incorrect");
				input.addClass("correct disabled");
				$('#errorMessage4').addClass('is-hidden');
				$('#congratMessage4').removeClass('is-hidden');
				$('#zad3').removeClass('is-hidden');
				$("html, body").animate({ scrollTop: $(document).height() }, "slow");
			}
			else {
				input.addClass("incorrect");
				$('#errorMessage4').removeClass('is-hidden');
			}
		});	
		
		$('#zad3input1').keyup(function(){
			var input = $(this);
			var number = input.val();
			if ( number.toString()=='0') {
				step = 'etap32';
				setObjectiveStatus('step3part2',1); //trzba ustawic status na passed, bo byc moze tam byl, zrobilo sie failed, tylko wrocil do wczesniejszych
				input.addClass("correct disabled");
				$('#congratMessage5').removeClass('is-hidden');
			}
			else {
				//step = 'etap30';
				console.log('jestem w cofaniu sie');
				goBack = 1;
				setObjectiveStatus('step3part0', 1);
				console.log('etap 3 0: '+getObjectiveStatus('step3part0'));
				input.addClass("incorrect disabled");
				$('#errorMessage5').removeClass('is-hidden'); //wiadomosc musisz cofnac sie do 0
			}
			$("#finishButton").removeClass('is-hidden');
			$("html, body").animate({ scrollTop: $(document).height() }, "slow");
		});
		
		
		$("#finishButton").click(function(){
			$(this).addClass('disabled');
			//jesli sie cofa do jednego z poprzednich sco, to nie ma co go zaciagac po keywordzie, bo ono juz tam jest
			if (!goBack) {
				getScoByKeyword()
			}
			$('#finishMessage').removeClass('is-hidden');
			$('#activeBody').addClass('is-hidden');
			setObjectiveStatus('step3part1', 0);
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
				
				
		function setObjectiveStatus (objectiveName, statusPassed) {
			var objectivesCount = doGetValue("cmi.objectives._count");
			for (var i = 0; i < objectivesCount; i++) {
				var idObjective = doGetValue("cmi.objectives." + i + ".id");
				var status = "cmi.objectives." + i + ".success_status";
				var scoreRaw = "cmi.objectives." + i + ".score.raw";
				var scoreScaled = "cmi.objectives." + i + ".score.scaled";
				
				if (idObjective == objectiveName) {
					doSetValue(scoreRaw, 0);
					doSetValue(scoreScaled, 1);
					if (statusPassed) {
						doSetValue(status, CMI_OBJECTIVES_SUCCESS_STATUS_PASSED);
					}
					else{
						doSetValue(status, CMI_OBJECTIVES_SUCCESS_STATUS_FAILED);
					}
				}
			}
		}	
				
		
	}		
});


$(window).on("unload", function(e) {
    doTerminate();
});