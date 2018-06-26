"use strict";

$(document).ready( function() {
		
	var step;
	var taskPartCounter = 1;
	var goBack = 0;
	var objective = getObjectiveStatus('step3part9');
	
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
			taskPartCounter++;
			var taskId = '#zad1part'+taskPartCounter;
			if (taskPartCounter<11) { //11
				$(taskId).removeClass('is-hidden');
			}
			else {
				$('#zad2').removeClass('is-hidden');
				$('#nextButton').addClass('is-hidden');
			}
			$("html, body").animate({ scrollTop: $(document).height() }, "slow");
		});
		
		
		$('.zad2input').keyup(function(){
			var input = $(this);
			var number = input.val();
			var firstNumber = input.siblings().eq(0).html();
			var secondNumber = input.siblings().eq(2).html();
			var result = firstNumber * secondNumber;
			
			if (result.toString().length==2) {
				if (number.toString().length==2) {
					if ( number.toString()==result.toString() ) {
						input.removeClass("incorrect");
						input.addClass("correct disabled");
						$('#errorMessage1').addClass('is-hidden');
						if (input.attr('id')!=='zad2lastInput'){
							input.parent().parent().next().removeClass('is-hidden');
						}
						else{
							$('#congratMessage1').removeClass('is-hidden');
							$('#zad3').removeClass('is-hidden');
						}
						$("html, body").animate({ scrollTop: $(document).height() }, "slow");
					}
					else {
						input.addClass("incorrect");
						$('#errorMessage1').removeClass('is-hidden');
					}
				}
			}
			else{
				if ( number.toString()==result.toString() ) {
					input.removeClass("incorrect");
					input.addClass("correct disabled");
					$('#errorMessage1').addClass('is-hidden');
					if (input.attr('id')!=='zad2lastInput'){
						input.parent().parent().next().removeClass('is-hidden');
					}
					else{
						$('#congratMessage1').removeClass('is-hidden');
						$('#zad3').removeClass('is-hidden');
					}
					$("html, body").animate({ scrollTop: $(document).height() }, "slow");
				}
				else {
					input.addClass("incorrect");
					$('#errorMessage1').removeClass('is-hidden');
				}
			}
		});
		
		
		$('.zad3input').keyup(function(){
			var input = $(this);
			var number = input.val();
			var firstNumber = input.siblings().eq(0).html();
			var secondNumber = input.siblings().eq(2).html();
			var result = firstNumber * secondNumber;
			
			if (result.toString().length==2) {
				if (number.toString().length==2) {
					if ( number.toString()==result.toString() ) {
						input.addClass("correct disabled");
						if (input.attr('id')!=='zad3lastInput'){ //dopoki to nie jest ostatni przyklad
							input.parent().parent().next().removeClass('is-hidden'); //pokaz nastepny przyklad
						}
						else{
							input.addClass("correct disabled");
							$('#congratMessage2').removeClass('is-hidden');
							//step = 'etap310';
							step = 'etap3ostatni';
							setObjectiveStatus('step3part10',1);
							$("#finishButton").removeClass('is-hidden');
						}
						$("html, body").animate({ scrollTop: $(document).height() }, "slow");
					}
					else {//zla odpowiedz
						input.addClass("incorrect disabled");
						goBack = 1;
						var operationNumber = input.parent().parent().attr('id');
						var goBackNumber = Math.ceil(operationNumber/2)-1;
						$('#goBackNumber').html(goBackNumber);
						$('#errorMessage2').removeClass('is-hidden'); //wiadomosc musisz cofnac sie do goBackNumber
						var nextObjective = 'step3part'+goBackNumber;
						console.log('cofanie sie do objectivesa: '+nextObjective);
						setObjectiveStatus(nextObjective, 1);//tam gdzie idzie trzeba ustawic na passed
						$("#finishButton").removeClass('is-hidden');
					}
				}
			}
			else{
				if ( number.toString()==result.toString() ) {
					input.addClass("correct disabled");
					if (input.attr('id')!=='zad3lastInput'){ //dopoki to nie jest ostatni przyklad
						input.parent().parent().next().removeClass('is-hidden'); //pokaz nastepny przyklad
					}
					else{
						input.addClass("correct disabled");
						$('#congratMessage2').removeClass('is-hidden');
						//step = 'etap310';
						step = 'etap3ostatni';
						//setObjectiveStatus('step3part10',1);
						setObjectiveStatus('step3part10',1);
						$("#finishButton").removeClass('is-hidden');
					}
					$("html, body").animate({ scrollTop: $(document).height() }, "slow");
				}
				else {//zla odpowiedz
					input.addClass("incorrect disabled");
					goBack = 1;
					var operationNumber = input.parent().parent().attr('id');
					var goBackNumber = Math.ceil(operationNumber/2)-1;
					$('#goBackNumber').html(goBackNumber);
					$('#errorMessage2').removeClass('is-hidden'); //wiadomosc musisz cofnac sie do goBackNumber
					var nextObjective = 'step3part'+goBackNumber;
					
					console.log()
					
					console.log('cofanie sie do objectivesa: '+nextObjective);
					setObjectiveStatus(nextObjective, 1);//tam gdzie idzie trzeba ustawic na passed
					$("#finishButton").removeClass('is-hidden');
				}
			}
		});
	
		
		
		
		
		$("#finishButton").click(function(){
			$(this).addClass('disabled');
			//jesli sie cofa do jednego z poprzednich sco, to nie ma co go zaciagac po keywordzie, bo ono juz tam jest
			if (!goBack) {
				getScoByKeyword()
			}
			$('#finishMessage').removeClass('is-hidden');
			$('#activeBody').addClass('is-hidden');
			setObjectiveStatus('step3part9', 0);
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