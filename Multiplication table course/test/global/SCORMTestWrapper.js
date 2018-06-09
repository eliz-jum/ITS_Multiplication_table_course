//garść "stałych"
var CHOICE_QUESTION_SEPARATOR = "[,]";
var FILL_IN_QUESTION_SEPARATOR = "[,]";
var SEQUENCING_QUESTION_SEPARATOR = "[,]";
var MATCHING_ANSWER_SEPARATOR = "[.]";
var MATCHING_QUESTION_SEPARATOR = "[,]";
var NUMERIC_QUESTION_SEPARATOR = "[:]";

//typy interakcji
var INTERACTION_TYPE_TRUE_FALSE = "true-false";
var INTERACTION_TYPE_SINGLE_CHOICE = "single-choice";
var INTERACTION_TYPE_SINGLE_CHOICE_DROP = "single-choice-drop";
var INTERACTION_TYPE_CHOICE = "choice";
var INTERACTION_TYPE_FILL_IN = "fill-in";
var INTERACTION_TYPE_LONG_FILL_IN = "long-fill-in";
var INTERACTION_TYPE_MATCHING = "matching";
var INTERACTION_TYPE_PERFORMANCE = "performance";
var INTERACTION_TYPE_SEQUENCING = "sequencing";
var INTERACTION_TYPE_LIKERT = "likert";
var INTERACTION_TYPE_NUMERIC = "numeric";
var INTERACTION_TYPE_OTHER = "other";

//podpowiedzi do różnych typów interakcji
var INTERACTION_TYPE_TRUE_FALSE_HINT = "Please select an answer";
var INTERACTION_TYPE_SINGLE_CHOICE_HINT = "Please select an answer";
var INTERACTION_TYPE_SINGLE_CHOICE_DROP_HINT = "Please select an answer";
var INTERACTION_TYPE_CHOICE_HINT = "Please select answers";
var INTERACTION_TYPE_FILL_IN_HINT = "Please enter the answer";
var INTERACTION_TYPE_LONG_FILL_IN_HINT = "Please enter the answer";
var INTERACTION_TYPE_MATCHING_LEFT_COMBO_HINT = "Please select an item from the dropdown list";
var INTERACTION_TYPE_MATCHING_RIGHT_COMBO_HINT = "Please select an item that matches the item selected in the left column";
var INTERACTION_TYPE_SEQUENCING_HINT = "Please enter a numeric value";
var INTERACTION_TYPE_NUMERIC_HINT = "Please enter a numeric value";

//napisy na przyciskach
var BUTTON_SEND_RESPONSES_TEXT = "Send";
var BUTTON_START_AGAIN_TEXT = "Start again";
//podpowiedzi do przycisków
var BUTTON_SEND_RESPONSES_HINT = "Click to send answers";
var BUTTON_START_AGAIN_HINT = "Click to start again";

var OBJECTIVES_DIVISOR = 100;

//typy SCO
//SCO z możliwością jednokrotnego zdawania
var SCO_TYPE_1 = 1;
//SCO z możliwością wielokrotnego zdawania
var SCO_TYPE_2 = 2;
//SCO ze wstrzymywaniem pokazywania wyników do momentu oceny przez nauczyciela
var SCO_TYPE_3 = 3;

var CMI_OBJECTIVES_SUCCESS_STATUS_PASSED = "passed";
var CMI_OBJECTIVES_SUCCESS_STATUS_FAILED = "failed";
var CMI_OBJECTIVES_SUCCESS_STATUS_UNKNOWN = "unknown";

//inne stałe
var CMI_COMPLETION_STATUS = "cmi.completion_status";
var CMI_COMPLETION_STATUS_COMPLETED = "completed";
var CMI_COMPLETION_STATUS_INCOMPLETE = "incomplete";
var CMI_MODE = "cmi.mode";
var CMI_MODE_REVIEW = "review";
var CMI_MODE_BROWSE = "browse";
var CMI_MODE_NORMAL = "normal";
var CMI_ENTRY_AB_INITIO = "ab-initio";
var CMI_SCORE_SCALED = "cmi.score.scaled";
var CMI_SCORE_RAW = "cmi.score.raw";
var CMI_SCORE_MIN = "cmi.score.min";
var CMI_SCORE_MAX = "cmi.score.max";
var CASE_MATTERS = "case_matters";
var ORDER_MATTERS = "order_matters";
var TRUE = "true";
var FALSE = "false";
var CORRECT = "correct";
var INCORRECT = "incorrect";
var CMI_EXIT = "cmi.exit";
var SUSPEND = "suspend";

var scoreMax = 0;
var scoTerminated = false;
var questionTypes = new Array();
var questionResults = new Array();
var numericQuestions = new Array();
var mapping = new Array();

/*******************************************************************************
**
** Rozszerzam obiekt string o metodę trim().
**
*******************************************************************************/
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');  
}

/*******************************************************************************
**
** Metoda używana do generowania identyfikatorów dla input'ów.
**
*******************************************************************************/
function getQuestionInputName(i) {
	return "pyt" + getNumberOfQuestion(i);
}

/*******************************************************************************
**
** Metoda pomocnicza - zwraca nr pytania poprzedzony cyfrą 0 gdy jest mniejszy 
** od 10.
**
*******************************************************************************/
function getNumberOfQuestion(i) {
	return i < 10 ? "0" + i : "" + i;
}

/*******************************************************************************
**
** Czyta odpowiedź studenta.
** 
** Parametry:
**  - questionType - typ interakcji (stała - jedna ze zbioru - 
** INTERACTION_TYPE_TRUE_FALSE, INTERACTION_TYPE_CHOICE, INTERACTION_TYPE_FILL_IN,
** INTERACTION_TYPE_LONG_FILL_IN, INTERACTION_TYPE_MATCHING, 
** INTERACTION_TYPE_PERFORMANCE, INTERACTION_TYPE_SEQUENCING,
** INTERACTION_TYPE_LIKERT, INTERACTION_TYPE_NUMERIC, INTERACTION_TYPE_OTHER),
**  - questionInputName - ,
**  - interactionNumber.
**
*******************************************************************************/
function readLearnerResponse(questionType, questionInputName, interactionNumber) {
	var learnerResponse = "";
	var inputs = document.getElementsByName(questionInputName);			

	switch (questionType) {
		case INTERACTION_TYPE_TRUE_FALSE:
			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].checked) {
					learnerResponse = inputs[i].value;
					break;
				}
			}
			break;
		case INTERACTION_TYPE_SINGLE_CHOICE:
			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].checked) {
					learnerResponse = inputs[i].value;
					break;
				}
			}
			break;
		case INTERACTION_TYPE_SINGLE_CHOICE_DROP:
			learnerResponse = inputs[0].value;
			break;
		case INTERACTION_TYPE_CHOICE:
			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].checked) {
					//learnerResponse += inputs[i].value + CHOICE_QUESTION_SEPARATOR;
					learnerResponse += inputs[i].value + CHOICE_QUESTION_SEPARATOR;
				}
			}
			
			if (learnerResponse.length > 2) {
				learnerResponse = learnerResponse.substring(0, learnerResponse.length - 3);
			}
			break;
		case INTERACTION_TYPE_FILL_IN:
		case INTERACTION_TYPE_LONG_FILL_IN:
			for (var i = 0; i < inputs.length; i++) {
				learnerResponse += inputs[i].value + FILL_IN_QUESTION_SEPARATOR;
			}
			
			if (learnerResponse.length > 2) {
				learnerResponse = learnerResponse.substring(0, learnerResponse.length - 3);
			}
			break;
		case INTERACTION_TYPE_LIKERT:
			break;
		case INTERACTION_TYPE_MATCHING:
			var length = inputs.length / 2;
			for (var i = 0; i < length; i++) {
				learnerResponse += mapping["" + interactionNumber][0][inputs[i * 2].selectedIndex] + MATCHING_ANSWER_SEPARATOR + mapping["" + interactionNumber][1][inputs[(i * 2) + 1].selectedIndex] + MATCHING_QUESTION_SEPARATOR;
			}
			
			if (learnerResponse.length > 2) {
				learnerResponse = learnerResponse.substring(0, learnerResponse.length - 3);
			}
			break;
		case INTERACTION_TYPE_PERFORMANCE:
			break;
		case INTERACTION_TYPE_SEQUENCING:
			for (i = 0; i < inputs.length; i++) {
				//learnerResponse += inputs[i].options[inputs[i].selectedIndex].value + SEQUENCING_QUESTION_SEPARATOR;
				learnerResponse += mapping["" + interactionNumber][inputs[i].selectedIndex][1] + SEQUENCING_QUESTION_SEPARATOR;
			}
			if (learnerResponse.length > 2) {
				learnerResponse = learnerResponse.substring(0, learnerResponse.length - 3);
			}
			break;
		case INTERACTION_TYPE_NUMERIC:
			for (i = 0; i < inputs.length; i++) {
				learnerResponse += inputs[i].value;
			}
			break;
		case INTERACTION_TYPE_OTHER:
			break;
		default:
			break;
	}
	
	return learnerResponse;
}

/*******************************************************************************
**
** Inicjalizacja SCO.
**
** Parametry:
**  - _scoreMin - minimalna liczba punktów do zdobycia (String),
**  - _scoreMax - maksymalna liczba punktów do zdobycia (String).
**
*******************************************************************************/
function initSCO(_scoreMin, _scoreMax) {
	doSetValue(CMI_EXIT, SUSPEND);
	doSetValue(CMI_SCORE_MIN, _scoreMin);
	doSetValue(CMI_SCORE_MAX, _scoreMax);
	doCommit();
	
	scoreMax = _scoreMax;
}

/*******************************************************************************
** Metoda zwraca true gdy typ interakcji jest jednym z podlegających mapowaniu.
**
** Parametry:
**  - interactionType - typ interakcji  (stała - jedna ze zbioru - 
** INTERACTION_TYPE_TRUE_FALSE, INTERACTION_TYPE_CHOICE, INTERACTION_TYPE_FILL_IN,
** INTERACTION_TYPE_LONG_FILL_IN, INTERACTION_TYPE_MATCHING, 
** INTERACTION_TYPE_PERFORMANCE, INTERACTION_TYPE_SEQUENCING,
** INTERACTION_TYPE_LIKERT, INTERACTION_TYPE_NUMERIC, INTERACTION_TYPE_OTHER).
**
*******************************************************************************/
function isCorrectInteractionTypeForMapping(interactionType) {
	return //interactionType == INTERACTION_TYPE_CHOICE || 
					//interactionType == INTERACTION_TYPE_MATCHING || 
					interactionType == INTERACTION_TYPE_SEQUENCING; // || 
					//interactionType == INTERACTION_TYPE_PERFORMANCE || 
					//interactionType == INTERACTION_TYPE_LIKERT;
}

/*******************************************************************************
**
** Inicjalizacja interakcji.
**
** Parametry:
**  - blockId - identyfikator div'a w sekcji body (String),
**  - questionNumber - kolejny nr pytania (zaczynając od 0) (Number),
**  - identifier - identyfikator (String),
**  - interactionType - typ interakcji (stała - jedna ze zbioru - INTERACTION_TYPE_TRUE_FALSE, INTERACTION_TYPE_CHOICE, INTERACTION_TYPE_FILL_IN, INTERACTION_TYPE_LONG_FILL_IN, INTERACTION_TYPE_MATCHING, INTERACTION_TYPE_PERFORMANCE, INTERACTION_TYPE_SEQUENCING, 
INTERACTION_TYPE_LIKERT, INTERACTION_TYPE_NUMERIC, INTERACTION_TYPE_OTHER),
**  - weighting - waga (String),
**  - correctResponsesPattern - wzorzec prawidłowych odpowiedzi (tablica obiektów String),
**  - description - treść pytania (String),
**  - answersContent - możliwe odpowiedzi (tablica obiektów String),
**  - objectives - tablica obiektów String (parameter opcjonalny).
**
*******************************************************************************/
function initInteraction(blockId, questionNumber, identifier, interactionType, weighting, correctResponsesPattern, description, answersContent, objectives) {
	var interactionCount = doGetValue("cmi.interactions._count");
	var learnerResponse = "";
	
	if (interactionCount <= questionNumber) {
		doSetValue("cmi.interactions." + questionNumber + ".id", identifier);
		doSetValue("cmi.interactions." + questionNumber + ".type", (interactionType == INTERACTION_TYPE_SINGLE_CHOICE || interactionType == INTERACTION_TYPE_SINGLE_CHOICE_DROP) ? INTERACTION_TYPE_CHOICE : interactionType );
		doSetValue("cmi.interactions." + questionNumber + ".timestamp", getTimestamp());
		doSetValue("cmi.interactions." + questionNumber + ".weighting", weighting);
		
		for (var i = 0; i < correctResponsesPattern.length; i++) {
			doSetValue("cmi.interactions." + questionNumber + ".correct_responses." + i + ".pattern", correctResponsesPattern[i]);
		}
		
		doSetValue("cmi.interactions." + questionNumber + ".description", description);
		
		if (objectives) {
			for (var i = 0; i < objectives.length; i++) {
				doSetValue("cmi.interactions." + questionNumber + ".objectives." + i + ".id", objectives[i]);
			}
		}
		
		doCommit();
	} else {
		learnerResponse = doGetValue("cmi.interactions." + questionNumber + ".learner_response");
	}

	if (isCorrectInteractionTypeForMapping(interactionType)) {
		if (interactionType == INTERACTION_TYPE_MATCHING) {
			var temp = new Array(2);
			var temp1 = new Array(answersContent.length / 2);
			var temp2 = new Array(answersContent.length / 2);
			for (var i = 0; i < answersContent.length / 2; i++) {
				temp1[i] = answersContent[i*2][1];
				temp2[i] = answersContent[i*2 + 1][1];
			}
			temp[0] = temp1;
			temp[1] = temp2;
			
			mapping["" + questionNumber] = temp;
		} else {
			mapping["" + questionNumber] = answersContent;
		}
	}

	questionTypes[questionNumber] = interactionType;
	questionResults[questionNumber] = 0;
	
	printInteraction(blockId, questionNumber, interactionType, description, answersContent,  correctResponsesPattern, learnerResponse);
}

/*******************************************************************************
**
** Inicjalizacja objectives'ów pochodzących ze SCO.
** 
** Parametry:
**  - objectives - tablica obiektów String.
**
*******************************************************************************/
function initObjectivesFromSCO(objectives) {
	var objectivesCount = doGetValue("cmi.objectives._count");
	objectivesCount--;
	if (objectives) {
		for (var i = 0; i < objectives.length; i++) {
			var canWriteObjective = true;
			for (var j = 0; j <= objectivesCount; j++) {
				var id = doGetValue("cmi.objectives." + j + ".id");
				if (id == objectives[i]) {
					canWriteObjective = false;
					break;
				}
			}
			
			if (canWriteObjective) {
				objectivesCount++;
				doSetValue("cmi.objectives." + objectivesCount + ".id", objectives[i]);
			}
		}
	}
	
	doCommit();
}

/*******************************************************************************
**
** Wypisuje interakcję w postaci HTML.
** 
** Parametry:
**  - blockId - identyfikator div'a w sekcji body (String),
**  - questionNumber - kolejny nr interakcji (zaczynając od 0) (Number),
**  - interactionType - typ interakcji (stała - jedna ze zbioru - INTERACTION_TYPE_TRUE_FALSE, INTERACTION_TYPE_CHOICE, INTERACTION_TYPE_FILL_IN, INTERACTION_TYPE_LONG_FILL_IN, INTERACTION_TYPE_MATCHING, INTERACTION_TYPE_PERFORMANCE, INTERACTION_TYPE_SEQUENCING, 
INTERACTION_TYPE_LIKERT, INTERACTION_TYPE_NUMERIC, INTERACTION_TYPE_OTHER),
**  - description - treść pytania (String),
**  - answersContent - możliwe odpowiedzi (tablica obiektów String),
**  - correctResponsesPattern - wzorzec prawidłowych odpowiedzi (tablica obiektów String),
**  - learnerResponse - odpowiedź studenta (String).
**
*******************************************************************************/
function printInteraction(blockId, questionNumber, interactionType, description, answersContent, correctResponsesPattern, learnerResponse) {
	var result = "";
	var cmiCompletionStatus = doGetValue(CMI_COMPLETION_STATUS);

	var questionInputName = getQuestionInputName(questionNumber);
	
	switch (interactionType) {
		case INTERACTION_TYPE_TRUE_FALSE:
			result = "<div class=\"pytanie\">" + description + "</div>";
			result += "<div class=\"odpowiedz\">";
			result += "<input type=\"radio\" id=\"" +  questionInputName + "_01\" name=\"" + questionInputName + "\" value=\"true\" title=\"" + INTERACTION_TYPE_TRUE_FALSE_HINT + "\" " + (learnerResponse == TRUE ? "checked=\"checked\"": "") + "/><label for=\"" + questionInputName + "_01\" title=\"" + INTERACTION_TYPE_TRUE_FALSE_HINT + "\">";
			result += answersContent[0];
			result += "</label><br />";
			result += "<input type=\"radio\" id=\"" +  questionInputName + "_02\" name=\"" + questionInputName + "\" value=\"false\" title=\"" + INTERACTION_TYPE_TRUE_FALSE_HINT + "\" " + (learnerResponse == FALSE ? "checked=\"checked\"": "") + "\"/><label for=\"" + questionInputName + "_02\" title=\"" + INTERACTION_TYPE_TRUE_FALSE_HINT + "\">";
			result += answersContent[1];
			result += "</div>";
			break;
		case INTERACTION_TYPE_SINGLE_CHOICE_DROP:
			result = "<div class=\"pytanie\">" + description + "</div>";
			result += "<div class=\"odpowiedz\">";
			var numberOfAnswer = getNumberOfQuestion(i);
			result += "<select id=\"" +  questionInputName + "\" name=\"" + questionInputName + "\" title=\"" + INTERACTION_TYPE_SINGLE_CHOICE_DROP_HINT + "\">";
			for (var i = 0; i < answersContent.length; i++) {
				if (learnerResponse == answersContent[i][1]) {
					result += "checked=\"checked\"";
					result += "<option value=\""+answersContent[i][1]+"\" selected=\"selected\">"+answersContent[i][0]+"</option>";
				} else {
					result += "<option value=\""+answersContent[i][1]+"\">"+answersContent[i][0]+"</option>";
				}
			}
			result += "</select>";
			result += "</div>";
			break;
		case INTERACTION_TYPE_SINGLE_CHOICE:
			result = "<div class=\"pytanie\">" + description + "</div>";
			result += "<div class=\"odpowiedz\">";
			for (var i = 0; i < answersContent.length; i++) {
				var numberOfAnswer = getNumberOfQuestion(i);
				result += "<input type=\"radio\" id=\"" +  questionInputName + "_" + numberOfAnswer + "\" name=\"" + questionInputName + "\" value=\"" + answersContent[i][1] + "\" title=\"" + INTERACTION_TYPE_SINGLE_CHOICE_HINT + "\" ";
				if (learnerResponse == answersContent[i][1]) {
					result += "checked=\"checked\"";
				}
				result += "/><label for=\"" + questionInputName + "_" + numberOfAnswer + "\" title=\"" + INTERACTION_TYPE_SINGLE_CHOICE_HINT + "\">";
				result += answersContent[i][0];
				result += "</label><br />";
			}
			result += "</div>";
			break;
		case INTERACTION_TYPE_CHOICE:
			result = "<div class=\"pytanie\">" + description + "</div>";
			result += "<div class=\"odpowiedz\">";
			var learnerResponsesArray = learnerResponse.split(CHOICE_QUESTION_SEPARATOR);
			for (var i = 0; i < answersContent.length; i++) {
				var numberOfAnswer = getNumberOfQuestion(i);
				result += "<input type=\"checkbox\" id=\"" +  questionInputName + "_" + numberOfAnswer + "\" name=\"" + questionInputName + "\" value=\"" + answersContent[i][1] + "\" title=\"" + INTERACTION_TYPE_CHOICE_HINT + "\" ";
				for (var j = 0; j < learnerResponsesArray.length; j++) {
					if (learnerResponsesArray[j] == answersContent[i][1]) {
						result += "checked=\"checked\"";
					}
				}
				result += "/><label for=\"" + questionInputName + "_" + numberOfAnswer + "\" title=\"" + INTERACTION_TYPE_CHOICE_HINT + "\">";
				result += answersContent[i][0];
				result += "</label><br />";
			}
			result += "</div>";
			break;
		case INTERACTION_TYPE_FILL_IN:
			result = "<div class=\"pytanie\">" + description + "</div>";
			result += "<div class=\"odpowiedz\">";
			var learnerResponsesArray = learnerResponse.split(FILL_IN_QUESTION_SEPARATOR);
			for (var i = 0; i < answersContent.length; i++) {
				var numberOfAnswer = getNumberOfQuestion(i);
result += answersContent[i] + "<input type=\"text\" id=\"" +  questionInputName + "_" + numberOfAnswer + "\" name=\"" + questionInputName + "\" title=\"" + INTERACTION_TYPE_FILL_IN_HINT + "\" size=\"10\" maxlength=\"10\"";
				result += " class=\"fill_in\" ";
				result += " value=\"";
				if (i < learnerResponsesArray.length) {
					result += learnerResponsesArray[i];
				}
				result += "\"" + "/><br /><br />";
			}
			result += "</div>";
			break;
		case INTERACTION_TYPE_LONG_FILL_IN:
			result = "<div class=\"pytanie\">" + description + "</div>";
			result += "<div class=\"odpowiedz\">";
			var learnerResponsesArray = learnerResponse.split(FILL_IN_QUESTION_SEPARATOR);
			for (var i = 0; i < answersContent.length; i++) {
				var numberOfAnswer = getNumberOfQuestion(i);
				result += answersContent[i] + "<textarea id=\"" +  questionInputName + "_" + numberOfAnswer + "\" name=\"" + questionInputName + "\" title=\"" + INTERACTION_TYPE_LONG_FILL_IN_HINT + "\" ";
				result += " class=\"long_fill_in\" ";
				result += ">";
				if (i < learnerResponsesArray.length) {
					result += learnerResponsesArray[i];
				}
				result += "</textarea><br /><br />";
			}
			result += "</div>";
			break;
		case INTERACTION_TYPE_LIKERT:
			break;
		case INTERACTION_TYPE_MATCHING:
			result = "<div class=\"pytanie\">" + description + "</div>";
			result += "<div class=\"odpowiedz\">";
			var learnerResponsesArray = learnerResponse.split(MATCHING_QUESTION_SEPARATOR);
			var aaa = correctResponsesPattern[0].split(MATCHING_QUESTION_SEPARATOR);
			for (var i = 0; i < answersContent.length / 2; i++) {
				var currentResp = null;
				if (i < learnerResponsesArray.length) {
					currentResp = learnerResponsesArray[i].split(MATCHING_ANSWER_SEPARATOR);
				}
				var numberOfAnswer = getNumberOfQuestion(i);
				result += "<select name=\"" + questionInputName + "\" class=\"matching_left\" id=\"" +  questionInputName + "_" + numberOfAnswer + "\" title=\"" + INTERACTION_TYPE_MATCHING_LEFT_COMBO_HINT + "\">";
//					result += "<option value=\"\"></option>";
				for (var j = 0; j < answersContent.length / 2; j++) {
					result += "<option value=\""+ answersContent[j*2][0] + "\" ";
					if (currentResp && currentResp[0] == answersContent[j*2][1]) {
						result += "selected=\"selected\"";
					}
					result += ">" + answersContent[j*2][0] + "</option>";
				}
				result += "</select>&rarr;";
				result += "<select name=\"" + questionInputName + "\" class=\"matching_right\" id=\"" +  questionInputName + "_" + numberOfAnswer + "_\" title=\"" + INTERACTION_TYPE_MATCHING_RIGHT_COMBO_HINT + "\">";
//					result += "<option value=\"\"></option>";
				for (var j = 0; j < answersContent.length / 2; j++) {
					result += "<option value=\""+ answersContent[j*2 + 1][0] + "\" ";
					if (currentResp && currentResp[1] == answersContent[j*2 + 1][1]) {
						result += "selected=\"selected\"";
					}
					result += ">" + answersContent[j*2 + 1][0] + "</option>";
				}
				result += "</select><br />";
			}
			result += "</div>";
			break;
		case INTERACTION_TYPE_PERFORMANCE:
			break;
		case INTERACTION_TYPE_SEQUENCING:
			result = "<div class=\"pytanie\">" + description + "</div>";
			result += "<div class=\"odpowiedz\">";
			var learnerResponsesArray = learnerResponse.split(SEQUENCING_QUESTION_SEPARATOR);
			for (var i = 0; i < answersContent.length; i++) {
				var numberOfAnswer = getNumberOfQuestion(i);
				result += "<select name=\"" + questionInputName + "\" id=\"" +  questionInputName + "_" + numberOfAnswer + "\" title=\"" + INTERACTION_TYPE_SEQUENCING_HINT + "\">";
//					result += "<option value=\"\"></option>";
				for (var j = 0; j < answersContent.length; j++) {
					result += "<option value=\""+ answersContent[j] + "\" ";
					if (i < learnerResponsesArray.length && learnerResponsesArray[i] == answersContent[j][1]) {
						result += "selected=\"selected\" ";
					}
					result += ">" + answersContent[j][0];
					result += "</option>";
				}
				result += "</select><br />";
			}
			result += "</div>";
			break;
		case INTERACTION_TYPE_NUMERIC:
			result = "<div class=\"pytanie\">" + description + "</div>";
			result += "<div class=\"odpowiedz\">";
			var learnerResponsesArray = learnerResponse.split(FILL_IN_QUESTION_SEPARATOR);
			for (var i = 0; i < answersContent.length; i++) {
				var numberOfAnswer = getNumberOfQuestion(i);
				result += answersContent[i] + "<input type=\"text\" id=\"" +  questionInputName + "_" + numberOfAnswer + "\" name=\"" + questionInputName + "\" onchange=\"checkNumber('" + questionInputName + "_" + numberOfAnswer + "')\" size=\"10\" maxlength=\"10\" title=\"" + INTERACTION_TYPE_NUMERIC_HINT + "\"";
				result += " class=\"numeric\" ";
				result += "value=\"";
				if (i < learnerResponsesArray.length) {
					result += learnerResponsesArray[i];
				}
				result += "\"" + "/>";
			}
			result += "</div>";
			
			numericQuestions.push(questionInputName + "_" + numberOfAnswer);
			break;
		case INTERACTION_TYPE_OTHER:
			break;
		default:
			break;
	}
	
	document.getElementById(blockId).innerHTML = result;
}

/*******************************************************************************
**
** Zapisuje wynik.
** 
** Parametry:
**  - interactionNumber - numer interakcji (Number).
**
*******************************************************************************/
function saveResult(interactionNumber) {
	var result = 0;

	var learnerResponse = readLearnerResponse(questionTypes[interactionNumber], getQuestionInputName(interactionNumber), interactionNumber);
	if (learnerResponse && learnerResponse.trim() != "") {
		var result = checkLearnerResponse(interactionNumber, learnerResponse);
		
		var param = "cmi.interactions." + interactionNumber;
		var weighting = Number(doGetValue("cmi.interactions." + interactionNumber + ".weighting"));
		if (!isNaN(weighting)) {
			result = result * weighting;
		}
		doSetValue(param + ".learner_response", learnerResponse);

		if (result > 0) {
			doSetValue(param + ".result", CORRECT);
		} else {
			doSetValue(param + ".result", INCORRECT);
		}
		
		var timestampMilis = convertTimestampToDate(doGetValue("cmi.interactions." + interactionNumber + ".timestamp")).getTime();
		var nowMilis = new Date().getTime();
		var difference = nowMilis - timestampMilis;
		
		var latency = getLatency(difference);
		doSetValue(param + ".latency", latency);
		doCommit();
		
		questionResults[interactionNumber] = result;
	}
}

/*******************************************************************************
**
** Sprawdza czy odpowiedź studenta jest poprawna.
** 
** Parametry:
**  - interactionNumber - nr interakcji (Number),
**  - learnerResponse - odpowiedź studenta.
**
*******************************************************************************/
function checkLearnerResponse(interactionNumber, learnerResponse) {
	var result = 0;
	
	switch (questionTypes[interactionNumber]) {
		case INTERACTION_TYPE_TRUE_FALSE:
		case INTERACTION_TYPE_SINGLE_CHOICE:
		case INTERACTION_TYPE_SINGLE_CHOICE_DROP:
		case INTERACTION_TYPE_CHOICE:
		case INTERACTION_TYPE_MATCHING:
		case INTERACTION_TYPE_SEQUENCING:
			var correctResponsesCount = doGetValue("cmi.interactions." + interactionNumber + ".correct_responses._count");
			for (var i = 0; i < correctResponsesCount; i++) {
				var correctAnswer = doGetValue("cmi.interactions." + interactionNumber + ".correct_responses." + i + ".pattern");
				if (learnerResponse == correctAnswer) {
					result = 1;
				}
			}
			break;
		case INTERACTION_TYPE_FILL_IN:
		case INTERACTION_TYPE_LONG_FILL_IN:
			result = 0;
			var correctAnswer = doGetValue("cmi.interactions." + interactionNumber + ".correct_responses.0.pattern");
			var caseMatters, orderMatters;
			if (correctAnswer.indexOf("}") > -1) {
				var parameters = correctAnswer.substring(0, correctAnswer.lastIndexOf("}")).split("}");
				correctAnswer = correctAnswer.substring(correctAnswer.lastIndexOf("}") + 1);
				for (var i = 0; i< parameters.length; i++) {
					parameters[i] = parameters[i].replace(/{/, "").replace(/}/, "").split("=");
					if (parameters[i][0] == CASE_MATTERS) {
						caseMatters = parameters[i][1];
					} else if (parameters[i][0] == ORDER_MATTERS) {
						orderMatters = parameters[i][1];
					}
				}
			}
			
			var correctAnswersArray = correctAnswer.split(FILL_IN_QUESTION_SEPARATOR);
			var learnerResponsesArray = learnerResponse.split(FILL_IN_QUESTION_SEPARATOR);
			if (checkCaseMatters(caseMatters, correctAnswersArray, learnerResponsesArray) && checkOrderMatters(orderMatters, correctAnswersArray, learnerResponsesArray)) {
				result = 1;
			} else {
				result = 0;
			}
			break;
		case INTERACTION_TYPE_LIKERT:
			break;
		case INTERACTION_TYPE_PERFORMANCE:
			break;
		case INTERACTION_TYPE_NUMERIC:
			var correctAnswer = doGetValue("cmi.interactions." + interactionNumber + ".correct_responses.0.pattern").split(NUMERIC_QUESTION_SEPARATOR);
			var response = Number(learnerResponse);
			if (!isNaN(response)) {
				if (correctAnswer[0] == "") {
					correctAnswer[0] = "a";
				}
				if (correctAnswer[1] == "") {
					correctAnswer[1] = "a";
				}
				var start = Number(correctAnswer[0]);
				var end = Number(correctAnswer[1]);
				if (!isNaN(start)) {
					if (start <= response) {
						result = 1;
					} else {
						result = 0;
					}
					if (!isNaN(end)) {
						if (response <= end) {
							result &= 1;
						} else {
							result &= 0;
						}
					}
				} else {
					if (!isNaN(end)) {
						if (response <= end) {
							result = 1;
						} else {
							result = 0;
						}
					} else {
						result = 1;
					}
				}
			} else {
				result = 0;
			}
			break;
		case INTERACTION_TYPE_OTHER:
			break;					
		default:
			break;
	}
	
	return result;
}

/*******************************************************************************
**
** Zwraca timestamp.
**
*******************************************************************************/
function getTimestamp() {
	var dateSeparator = "-";
	var hourSeparator = ":";
	var result = "";
	
	var data = new Date();
	result = data.getFullYear() + dateSeparator;
	
	var month = data.getMonth() + 1;
	if (month < 10) month = "0" + month;
	result += month + dateSeparator;
	
	var day = data.getDate();
	if (day < 10) day = "0" + day;
	result += day + "T";
	
	var hour = data.getHours();
	if (hour < 10) hour = "0" + hour;
	result += hour + hourSeparator;
	
	var minutes = data.getMinutes();
	if (minutes < 10) minutes = "0" + minutes;
	result += minutes + hourSeparator;
	
	var seconds = data.getSeconds();
	if (seconds < 10) seconds = "0" + seconds;
	result += seconds;
	
	return result;
}

/*******************************************************************************
**
** Konwertuje timestamp na obiekt Date.
** 
** Parametry:
**  - timestamp - znacznik czasu (String).
**
*******************************************************************************/
function convertTimestampToDate(timestamp) {
	var dateSeparator = "-";
	var hourSeparator = ":";
	
	var result = new Date();
	var tab = timestamp.split("T");
	var dateTab = tab[0].split(dateSeparator);
	result.setFullYear(dateTab[0], dateTab[1] - 1, dateTab[2]);
	
	var hourTab = tab[1].split(hourSeparator);
	result.setHours(hourTab[0], hourTab[1], hourTab[2]);
	
	return result;
}

/*******************************************************************************
**
** Wywołuje metodę doTerminate() z APIWrapper'a jeśli zmienna scoTerminated == false.
**
*******************************************************************************/
function terminate() {
	if (!scoTerminated) {
		doTerminate();
	}
}

/*******************************************************************************
**
** Wyłącza inputy w SCO.
** 
** Parametry:
**  - testType - typ SCO, stała (SCO_TYPE_1, SCO_TYPE_2, SCO_TYPE_3).
**
*******************************************************************************/
function disableInputs(testType) {
	var cmiCompletionStatus = doGetValue(CMI_COMPLETION_STATUS);
	var cmiMode = doGetValue(CMI_MODE);

	switch (testType) {
		case SCO_TYPE_1:
			disable(cmiCompletionStatus == CMI_COMPLETION_STATUS_COMPLETED || cmiMode == CMI_MODE_REVIEW);
			break;
		case SCO_TYPE_2:
			disable(cmiCompletionStatus == CMI_COMPLETION_STATUS_COMPLETED || cmiMode == CMI_MODE_REVIEW);
			break;
		case SCO_TYPE_3:
			disable(cmiCompletionStatus == CMI_COMPLETION_STATUS_COMPLETED || cmiMode == CMI_MODE_REVIEW);
			break;
	}
}

/*******************************************************************************
**
** Wyłącza inputy.
** 
** Parametry:
**  - condition - warunek logiczny.
**
*******************************************************************************/
function disable(condition) {
	if (condition) {
		for (var j = 0; j <= questionTypes.length; j++) {
			var inputs = document.getElementsByName(getQuestionInputName(j));
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].disabled = true;
			}
		}
	}
}

/*******************************************************************************
**
** Wypisuje komunikat w zależności od typu SCO.
** 
** Parametry:
**  - messageId - id div'a do którego ma być wypisany komunikat,
**  - testType - typ SCO, stała (SCO_TYPE_1, SCO_TYPE_2, SCO_TYPE_3).
** 
*******************************************************************************/
function printMessage(messageId, testType) {
	var cmiCompletionStatus = doGetValue(CMI_COMPLETION_STATUS);
	var cmiMode = doGetValue(CMI_MODE);
	var result = "";
	
	switch (testType) {
		case SCO_TYPE_1:
			if (cmiCompletionStatus != CMI_COMPLETION_STATUS_COMPLETED) {
				result = "<p><strong>Uwaga!</strong></p>";
				result += "<p>Ten test można zdawać <strong>tylko raz</strong>.</p>";
				result += "<p>Po naciśnięciu przycisku „<span class=\"correctAnswer\">" + BUTTON_SEND_RESPONSES_TEXT + "</span>” ponowne rozwiązanie testu i wysłanie odpowiedzi nie będzie możliwe.</p>"
			} else {
				result = "<p><strong>Uwaga!</strong></p>";
				result += "<p>Test został już wysłany. Nie można go zdawać po raz drugi.</p>";
				result += "<p><span class=\"correctAnswer\">Zielonym kolorem</span> zostały zaznaczone prawidłowe odpowiedzi.</p>";
			}			
			break;
		case SCO_TYPE_2:
			if (cmiCompletionStatus != CMI_COMPLETION_STATUS_COMPLETED) {
				result = "<p><strong>Uwaga!</strong></p>";
				result += "<p>Ten test można zdawać <strong>wielokrotnie</strong>.</p>";
				result += "<p>Po naciśnięciu przycisku „<span class=\"correctAnswer\">" + BUTTON_SEND_RESPONSES_TEXT + "</span>” ponowne rozwiązanie testu i wysłanie odpowiedzi będzie możliwe.</p>";
			} else {
				result = "<p><strong>Uwaga!</strong></p>";
				result += "<p>Ten test można zdawać <strong>wielokrotnie</strong>.</p>";
				result += "<p>Jesteś w trybie oglądania wyników testu. <span class=\"correctAnswer\">Zielonym kolorem</span> zostały zaznaczone prawidłowe odpowiedzi.</p>";
				result += "<p>Aby rozpocząć ponowne zdawanie testu należy nacisnąć przycisk „<span class=\"correctAnswer\">" + BUTTON_START_AGAIN_TEXT + "</span>”.</p>";
			}
			break;
		case SCO_TYPE_3:
			if (cmiCompletionStatus == CMI_COMPLETION_STATUS_COMPLETED) {
				result = "<p><strong>Note!</strong></p>";
				result += "<p>The survey has been completed.</p>";
			} else {
				result = "<p><strong>Note!</strong></p>";
				result += "<p>The questionnaire can be filled <strong>only once</strong>.</p>";
				result += "<p>After pressing the „<span class=\"correctAnswer\">" + BUTTON_SEND_RESPONSES_TEXT + "</span>” button again to complete the questionnaire will not be possible.</p>";
			}
			break;
	}
	
	document.getElementById(messageId).innerHTML = result;
}

/*******************************************************************************
**
** Wypisuje komunikat o ocenianiu testu przez nauczyciela.
** 
** Parametry:
**  - messageId - id div'a do którego ma być wypisany komunikat,
**  - testType - typ SCO, stała (SCO_TYPE_1, SCO_TYPE_2, SCO_TYPE_3).
**
*******************************************************************************/
function printCmiModeMessage(messageId, cmiMode) {
	if (cmiMode == CMI_MODE_BROWSE) {
		var result = "<p>Tutaj pojawią się pytania testowe.</p>"
		
		document.getElementById(messageId).innerHTML = result;
	}
}

/*******************************************************************************
**
** Zapisuje odpowiedź studenta.
** 
** Parametry:
**  - button - przycisk (obiekt),
**  - idSCO - id SCO z pliku imsmanifest.xml (String),
**  - completionStatus - wartość pola CMI_COMPLETION_STATUS (String).
**
*******************************************************************************/
function printButton(inputId, idSCO, completionStatus) {
	var cmiCompletionStatus = doGetValue(CMI_COMPLETION_STATUS);
	var cmiMode = doGetValue(CMI_MODE);

	if (cmiCompletionStatus != CMI_COMPLETION_STATUS_COMPLETED && cmiMode != CMI_MODE_REVIEW && cmiMode != CMI_MODE_BROWSE) {
		var result = "<input type=\"button\" class=\"button\" onclick=\"saveLearnerResponses(this, '" + idSCO + "'";
		if (completionStatus != null && completionStatus.trim() != "") {
			result += ", '" + CMI_COMPLETION_STATUS_COMPLETED + "'";
		}   
		result += ")\" value=\"" + BUTTON_SEND_RESPONSES_TEXT + "\" title=\"" + BUTTON_SEND_RESPONSES_HINT + "\" />";
		
		document.getElementById(inputId).innerHTML = result;
	}
}

/*******************************************************************************
**
** Wypisuje przycisk "Rozpocznij ponownie".
** 
** Parametry:
**  - inputId - id div'a gdzie ma być umieszczony przycisk (String),
**  - idSCO - id SCO z pliku imsmanifest.xml (String).
**
*******************************************************************************/
function printButtonStartAgain(inputId, idSCO) {
	var cmiCompletionStatus = doGetValue(CMI_COMPLETION_STATUS);

	if (cmiCompletionStatus == CMI_COMPLETION_STATUS_COMPLETED) {
		var result = "<input type=\"button\" class=\"button\" onclick=\"startAgain(this, '" + idSCO + "')\" value=\"" + BUTTON_START_AGAIN_TEXT + "\" title=\"" + BUTTON_START_AGAIN_HINT + "\" />";
		
		document.getElementById(inputId).innerHTML = result;
	}
}

/*******************************************************************************
**
** Wypisuje uzyskany wynik.
** 
** Parametry:
**  - resultId - id div'a do którego wypisywany jest wynik (String),
**  - testType - typ SCO, stała (SCO_TYPE_1, SCO_TYPE_2, SCO_TYPE_3).
**
*******************************************************************************/
function printResults(resultId, testType) {
	var cmiCompletionStatus = doGetValue(CMI_COMPLETION_STATUS);
	var cmiMode = doGetValue(CMI_MODE);
	var result = "";
	
	switch (testType) {
		case SCO_TYPE_1:
		case SCO_TYPE_2:
			if (cmiCompletionStatus == CMI_COMPLETION_STATUS_COMPLETED) {
				result = "<br /><br />Uzyskany wynik: <strong>" + doGetValue(CMI_SCORE_RAW) + "/" + doGetValue(CMI_SCORE_MAX) + "</strong><br />";
			}
			break;
		case SCO_TYPE_3:
			if (cmiCompletionStatus == CMI_COMPLETION_STATUS_COMPLETED && cmiMode == CMI_MODE_REVIEW) {
				result = "<br /><br />Uzyskany wynik: <strong>" + doGetValue(CMI_SCORE_RAW) + "/" + doGetValue(CMI_SCORE_MAX) + "</strong><br />";
			}
			break;
	}
		
	document.getElementById(resultId).innerHTML = result;
}

/*******************************************************************************
**
** Zapisuje odpowiedź studenta.
** 
** Parametry:
**  - button - przycisk (obiekt),
**  - idSCO - id SCO z pliku imsmanifest.xml (String),
**  - completionStatus - wartość pola CMI_COMPLETION_STATUS (String).
**
*******************************************************************************/
function saveLearnerResponses(button, idSCO, completionStatus) {
	console.log('saveLearnerResponses');
	if (!checkNumericQuestions()) {
		alert("Należy wpisać liczbę!");
		return;
	}
	
	button.className = 'button_disabled';
	button.disabled = true;
	
	console.log(questionResults);
	console.log(questionResults[0]);
	for (var i = 0; i < questionResults.length; i++) {
		saveResult(i);
	}
		
	var sum = 0;
	
	for(var i = 0; i < questionResults.length; i++) {
		sum += questionResults[i];
	}
	
	var scaled = 1;

	if (scoreMax != 0) {
		scaled = sum / scoreMax;
	}
	
	if (scaled > 1) {
		scaled = 1;
	}

	if (completionStatus) {
		doSetValue(CMI_COMPLETION_STATUS, completionStatus);
	}
	doSetValue(CMI_SCORE_SCALED, scaled.toString());
	doSetValue(CMI_SCORE_RAW, sum.toString());

	doCommit();
	
	if (window.setObjectivesStatusForSCO) {
		setObjectivesStatusForSCO();
		doCommit();
	}
	
	reloadSCO(idSCO);
	
	terminate();
	
	scoTerminated = true;
}

/*******************************************************************************
**
** Funkcja wywoływana na naciśnięcie przycisku "Rozpocznij ponownie".
** 
** Parametry:
**  - button - przycisk "Rozpocznij ponownie" (obiekt),
**  - idSCO - id SCO z pliku imsmanifest.xml (String).
**
*******************************************************************************/
function startAgain(button, idSCO) {
	button.className = 'button_disabled';
	button.disabled = true;
	
	doSetValue(CMI_COMPLETION_STATUS, CMI_COMPLETION_STATUS_INCOMPLETE);
	doSetValue(CMI_SCORE_SCALED, "0");
	doSetValue(CMI_SCORE_RAW, "0");

	if (window.subractScoreRaw) {
		subractScoreRaw();
	}

	doCommit();
	
	reloadSCO(idSCO);
	
	terminate();
	
	scoTerminated = true;	
}

/*******************************************************************************
**
** Programowe przeładowanie SCO.
** 
** Parametry:
**  - idSCO - id SCO z pliku imsmanifest.xml (String).
**
*******************************************************************************/
function reloadSCO(idSCO) {
	doSetValue('adl.nav.request', "{target=" + idSCO + "}choice");
}

/*******************************************************************************
**
** Sprawdza wielkość liter w odpowiedziach.
** 
** Parametry:
** - caseMatters - stała (TRUE, FALSE),
** - correctAnswersArray - prawidłowe odpowiedzi (tablica obiektów String),
** - learnerResponsesArray - odpowiedzi studenta (tablica obiektów String).
**
*******************************************************************************/
function checkCaseMatters(caseMatters, correctAnswersArray, learnerResponsesArray) {
	var result = true;

	if (caseMatters == TRUE) {
		for (var i = 0; i < correctAnswersArray.length; i++) {
			if (result) {
				var s = correctAnswersArray[i];
				var found = false;
				for (var j = 0; j < learnerResponsesArray.length; j++) {
					if (s == learnerResponsesArray[j]) {
						found = true;
					}
				}
				result = result && found;
			}
		}
	} else {
		for (var i = 0; i < correctAnswersArray.length; i++) {
			if (result) {
				var s = correctAnswersArray[i].toUpperCase();
				var found = false;
				for (var j = 0; j < learnerResponsesArray.length; j++) {
					if (s == learnerResponsesArray[j].toUpperCase()) {
						found = true;
					}
				}
				result = result && found;
			}
		}
	}

	return result;
}

/*******************************************************************************
**
** Sprawdza kolejność odpowiedzi.
** 
** Parametry:
** - orderMatters - stała (TRUE, FALSE),
** - correctAnswersArray - prawidłowe odpowiedzi (tablica obiektów String),
** - learnerResponsesArray - odpowiedzi studenta (tablica obiektów String).
**
*******************************************************************************/
function checkOrderMatters(orderMatters, correctAnswersArray, learnerResponsesArray) {
	var result = true;

	if (orderMatters == TRUE) {
		for (var i = 0; i < correctAnswersArray.length; i++) {
			if (result) {
				var s = correctAnswersArray[i].toUpperCase();
				var found = false;
				for (var j = 0; j < learnerResponsesArray.length; j++) {
					if (s == learnerResponsesArray[j].toUpperCase() && i == j) {
						found = true;
					}
				}
				result = result && found;
			}
		}
	} else {
		for (var i = 0; i < correctAnswersArray.length; i++) {
			if (result) {
				var s = correctAnswersArray[i].toUpperCase();
				for (var j = 0; j < learnerResponsesArray.length; j++) {
					if (s == learnerResponsesArray[j].toUpperCase()) {
						found = true;
					}
				}
				result = result && found;
			}
		}
	}

	return result;
}

/*******************************************************************************
**
** Przekształca podany czas (w ms) na typ latency.
** 
** Parametry:
**  - time - czas w ms (long).
**
*******************************************************************************/
function getLatency(time) {
	var years = 0;
	var months = 0;
	var days = 0;
	var hours = 0;
	var minutes = 0;
	var seconds = 0;
	var miliSeconds = 0;

	var YEAR = 31119000000;
	var MONTH = 2592000000;
	var DAY = 86400000;
	var HOUR = 3600000;
	var MINUTE = 60000;
	var SECOND = 1000;
	
	if (time >= YEAR) {
		years = Math.floor(time / YEAR);
		time -= years *  YEAR;
	}
	
	if (time >= MONTH) {
		months = Math.floor(time / MONTH);
		time -= months * MONTH;
	}
	
	if (time >= DAY){
		days = Math.floor(time / DAY);
		time -= days * DAY;
	}
	
	hours = Math.floor(time / HOUR);
	time -= hours * HOUR;
	
	minutes = Math.floor(time / MINUTE);
	time -= minutes * MINUTE;
	
	seconds = Math.floor(time / SECOND);
	time -= seconds * SECOND;
	
	miliSeconds = time;
	
	var result = "P";
	if (years == 0 && months == 0 && days == 0 && hours == 0 && minutes == 0 && seconds == 0 && miliSeconds == 0) {
		return "PT0S";
	}
	
	if (years != 0 || months != 0 || days != 0) {
		if (years != 0)
			result += years + "Y";
		
		if (months != 0)
			result += months + "M";
		
		if (days != 0)
			result += days + "D";
	}
	
	if (hours != 0 || minutes != 0 || seconds != 0 || mseconds != 0) {
		result += "T";
		
		if (hours != 0)
			result += hours + "H";
		
		if (minutes != 0)
			result += minutes + "M";
		
		if (seconds != 0 || miliSeconds != 0) {
			if (miliSeconds != 0) {
				var miliSec = "" + miliSeconds;
				if (miliSec.length > 2) {
					miliSec = miliSec.substring(0, 2);
				}
				result += seconds + "." + miliSec + "S";
			}	else {
				result += seconds + "S";
			}
		}
	}
	
	return result;
}

/*******************************************************************************
**
** Sprawdza czy wpisana wartość jest liczbą.
** 
** Parametry:
**  - questionInputName - .
**
*******************************************************************************/
function checkNumber(questionInputName) {
	var value = document.getElementById(questionInputName).value;
	if (isNaN(Number(value))) {
		alert("Należy wpisać liczbę!");
		document.getElementById(questionInputName).focus();
	}
}

/*******************************************************************************
** 
** Sprawdza czy w pytaniach typu NUMERIC są wpisane tylko liczby.
**
*******************************************************************************/
function checkNumericQuestions() {
	var result = true;
	
	for (i = 0; i < numericQuestions.length; i++) {
		var value = document.getElementById(numericQuestions[i]).value;
		
		if (isNaN(Number(value)) || "" == value.trim()) {
			result = false;
			break;
		}
	}
	
	return result;
}

/*******************************************************************************
**
** Wypisuje objectives'y wraz z punktacją.
** 
** Parametry:
**  - messageId - id div'a do którego należy wypisać objectives'y (String).
**
*******************************************************************************/
function printObjectives(messageId) {
	var objectivesCount = doGetValue("cmi.objectives._count");
	var result = "<strong>Objectives</strong><br />";
	result += "<div style=\"margin-left: 1em;\">";
	
	var tmp = new Array();
	for (var i = 0; i < objectivesCount; i++) {
		var idSCO = doGetValue("cmi.objectives." + i + ".id");
		tmp.push(idSCO + " - " + doGetValue("cmi.objectives." + i + ".success_status") + " (" + Number(doGetValue("cmi.objectives." + i + ".score.raw"))/OBJECTIVES_DIVISOR + ") <br />");
	}
	
	tmp.sort();
	
	for (var i = 0; i < tmp.length; i++) {
		result += tmp[i];
	}
	
	result += "</div>"
	
	document.getElementById(messageId).innerHTML = result;
}

/*******************************************************************************
**
** Uaktualnia liczbę zdobytych punktów dla zadanego objectives'a w zależności od 
** statusu.
** 
** Parametry:
**  - name - nazwa pola (cmi.objectives.n.score.raw, String),
**  - status - stała (CMI_OBJECTIVES_SUCCESS_STATUS_PASSED, 
**    CMI_OBJECTIVES_SUCCESS_STATUS_FAILED).
**
*******************************************************************************/
function updateObjectivesScoreRaw(name, status) {
	var scoreRaw = Number(doGetValue(name));
	
	if (status == CMI_OBJECTIVES_SUCCESS_STATUS_PASSED) {
		scoreRaw += 1;
	} else if (status == CMI_OBJECTIVES_SUCCESS_STATUS_FAILED) {
		if (scoreRaw > 0)
			scoreRaw -= 1;
	}
	
	doSetValue(name, scoreRaw.toString());
}

/*******************************************************************************
**
** Funkcja wywoływana na naciśnięcie przycisku "Rozpocznij ponownie". Kasuje 
** punkty zdobyte za rozwiązanie interakcji z objectives.
** 
** Parametry:
**  - name - nazwa pola (cmi.objectives.n.score.raw, String),
**  - status - stała (CMI_OBJECTIVES_SUCCESS_STATUS_PASSED, 
**    CMI_OBJECTIVES_SUCCESS_STATUS_FAILED).
**
*******************************************************************************/
function subtractObjectivesScoreRaw(name, status) {
	var scoreRaw = Number(doGetValue(name));

	if (status == CMI_OBJECTIVES_SUCCESS_STATUS_PASSED) {
		if (scoreRaw > 0)
			scoreRaw -= 1;
	} else if (status == CMI_OBJECTIVES_SUCCESS_STATUS_FAILED) {
		if (scoreRaw > 0)
			scoreRaw += 1;
	}

	doSetValue(name, scoreRaw.toString());
}

/*******************************************************************************
** Metoda zwraca true gdy typ interakcji jest jednym z podlegających mapowaniu.
**
** Parametry:
**  - interactionType - typ interakcji  (stała - jedna ze zbioru - 
** INTERACTION_TYPE_TRUE_FALSE, INTERACTION_TYPE_CHOICE, INTERACTION_TYPE_FILL_IN,
** INTERACTION_TYPE_LONG_FILL_IN, INTERACTION_TYPE_MATCHING, 
** INTERACTION_TYPE_PERFORMANCE, INTERACTION_TYPE_SEQUENCING,
** INTERACTION_TYPE_LIKERT, INTERACTION_TYPE_NUMERIC, INTERACTION_TYPE_OTHER).
**
*******************************************************************************/
function isCorrectInteractionTypeForMapping(interactionType) {
	return //interactionType == INTERACTION_TYPE_CHOICE || 
					interactionType == INTERACTION_TYPE_MATCHING || 
					interactionType == INTERACTION_TYPE_SEQUENCING; // || 
					//interactionType == INTERACTION_TYPE_PERFORMANCE || 
					//interactionType == INTERACTION_TYPE_LIKERT;
}

