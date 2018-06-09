"use strict";

$(document).ready( function() {
		
	function init() {			
		doInitialize();
		initSCO("0", "5");
		printMessage("message", SCO_TYPE_3);
		disableInputs(SCO_TYPE_3);
		printObjectives("objectives");
	}
		
	
	$("#myButton").click(function(){
		
		alert("hej");
	});	
	
			
});