"use strict";

$(document).ready( function() {
		
	var step='etap2stylRealistyczny';
		
		
			
	$("#finishButton").click(function(){
		console.log('finish');
		getScoByKeyword()
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
			
});

$(window).on("unload", function(e) {
    doTerminate();
});

