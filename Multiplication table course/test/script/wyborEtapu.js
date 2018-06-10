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
				step = "etap1stylRealistyczny";
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
				step = "etap1stylRealistyczny";
				input1.addClass("incorrect disabled");
				input2.addClass("incorrect disabled");
				$('#finishButton').removeClass('is-hidden');
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
				input1.addClass("correct disabled");
				input2.addClass("correct disabled");
				$('#step3').removeClass('is-hidden');
				$("html, body").animate({ scrollTop: $(document).height() }, 1000);
			}
			else {
				step = 'etap2stylRealistyczny';
				input1.addClass("incorrect disabled");
				input2.addClass("incorrect disabled");
				$('#finishButton').removeClass('is-hidden');
			}
		}
    });
	$('#step2input2').keyup(function(){
		if ($('#step2input2').val()) {
			var input1 = $('#step2input1');
			var input2 = $(this);
			
			var firstNumber = input1.val();
			var secondNumber = input2.val();
			
			if (firstNumber==2 && secondNumber==3) {
				input1.addClass("correct disabled");
				input2.addClass("correct disabled");
				$('#step3').removeClass('is-hidden');
			}
			else {
				step = 'etap2stylRealistyczny';
				input1.addClass("incorrect disabled");
				input2.addClass("incorrect disabled");
				$('#finishButton').removeClass('is-hidden');
			}
		}
    });

	
	
	
	
	
	
	$('#step3input01').keyup(function(){
		
		var resultInput = $(this);
		var result = resultInput.val();
		var firstNumber = 5;
		var secondNumber = 0;
		var idNumber = '02';
		var listEntry = '<li><div class="operation"><div class="frame">'+firstNumber+'</div><div class="math-symbol">*</div><div class="frame">'+secondNumber+'</div><div class="math-symbol">=</div><input id="step3input'+idNumber+'"></div></li>'
		
		
		console.log('hello result is '+result);	
		if (result==0) {
			resultInput.addClass("correct disabled");
			$("#multiplicationTable").append(listEntry);
		}
		else {
			step = 'etap3stylRealistyczny';
			resultInput.addClass("incorrect disabled");
			resultInput.addClass("incorrect disabled");
			$('#finishButton').removeClass('is-hidden');
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
		console.log('nasz keyword: '+step);
		
		var objectivesCount = doGetValue("cmi.objectives._count");
		var keywordOfWrong = step;
		var recommendationRule = "KEYWORD_EQUAL_TO";
		for (var i=0; i < objectivesCount; i++) {
			var idObjective = doGetValue("cmi.objectives." + i + ".id");
			if (idObjective == "its.run") {
				
				console.log('Jestem w its run! Pierwszy objectives');
				console.log(doGetValue("cmi.objectives." + i + ".description"));
				
				var ta1 = "\"SearchConditions=(\"general/keyword=" + keywordOfWrong + "\")\"";
				var ta2 = "\"RecommendationRule="+ recommendationRule +"\"";
				var trigger_actions = ta1 + ";" + ta2;
				doSetValue("cmi.objectives." + i + ".description", trigger_actions);
				doCommit();
				console.log('Jestem w its run! 2 objectives');
				console.log(doGetValue("cmi.objectives." + i + ".description"));
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