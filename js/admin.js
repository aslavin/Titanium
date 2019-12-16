function changeBtnGroup(id) {
    var adminButtons = document.getElementById("adminButtons").children;
    for (var i = 0; i < adminButtons.length; i++) {
        if (adminButtons[i].id == id) { 
            adminButtons[i].classList.remove("adminUnpressed");
            adminButtons[i].classList.add("adminPressed");
        } else { 
            adminButtons[i].classList.remove("adminPressed");
            adminButtons[i].classList.add("adminUnpressed");    
        }   
    }     

    var buttonSubstr = id.substring(3, id.length);
    document.getElementById("contentAddLeagueWrapper").style.display = "none";
    document.getElementById("contentInputScoreWrapper").style.display = "none";
    document.getElementById("content" + buttonSubstr + "Wrapper").style.display = "block";
}

var nPools = 1;

var newPoolComponents = ['<div class="col-md-6 d-none d-md-flex centerContent pool',
'" style="padding:0px"><div class="nonInputContent"><button type="button" onclick="removePoolTime(',
')" class="btn btn-danger removeTeamMember"><i class="fa fa-close"></i></button>Pool Time*</div></div><div class="col-12 d-flex d-md-none centerContent pool',
'"><div class="nonInputContent"><button type="button" onclick="removePoolTime(',
')" class="btn btn-danger removeTeamMember"><i class="fa fa-close"></i></button>Pool Time*</div></div><div class="col-md-2 col-4 centerContent pool',
'"><input type="text" class="form-control weekdayInput" placeholder="DDD"></div><div class="col-md-2 col-4 centerContent pool',
'"><input type="text" class="form-control hourInput" placeholder="HH"></div><div class="col-md-2 col-4 centerContent pool',
'"><div class="punctuationText">:</div><input type="text" class="form-control minuteInput" placeholder="MM"></div>']

function addNewPool() {

    var htmlString = newPoolComponents[0];
    for (var i = 1; i < newPoolComponents.length; i++) { 
        htmlString += nPools + newPoolComponents[i]; 
    }
    document.getElementById("contentAddLeague").insertAdjacentHTML('beforeend', htmlString);
    nPools++;

    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) { 
        inputs[i].addEventListener("keypress", function () { 
            this.classList.remove("invalidInput");
        });
    }
    
    calculateTotalTeams();
}

function removePoolTime(n) {
    var poolClassElements = document.getElementsByClassName("pool" + n); /* yikes and a half */
    console.log(poolClassElements);
    for (var i = poolClassElements.length - 1; i >= 0; i--) { 
        poolClassElements[i].remove();
    } 
    calculateTotalTeams();
}

function activateSingleAlert(alertId) {
    document.getElementById("createTeamModal").scrollTop = 0; // since we are displaying a warning, scroll to the top of the modal */ 
    var alerts = document.getElementsByClassName("alert");
    var alertToDelete = 0;
    for (var i = 0; i < alerts.length; i++) {
        if (alerts[i].id == alertId) {
            alerts[i].style.display = "block";
            alertToDelete = i;
        }   
        else alerts[i].style.display = "none";
    }   
}

function incrementTeams() { 
   var nTeams = document.getElementById("nTeams");
   if (isNaN(parseInt(nTeams.value))) nTeams.value = 0;
   nTeams.value = parseInt(nTeams.value) + 1;
   calculateTotalTeams();
}

function decrementTeams() { 
   var nTeams = document.getElementById("nTeams");
   if (isNaN(parseInt(nTeams.value))) nTeams.value = 1;
   if (nTeams.value > 0) nTeams.value = parseInt(nTeams.value) - 1; 
   calculateTotalTeams();
}

function calculateTotalTeams() { 
    var nTeamsEntered = parseInt(document.getElementById("nTeams").value);
    var nPoolsSoFar = document.getElementsByClassName("weekdayInput").length;
   
    var totalTeamsNums = document.getElementsByClassName("totalTeamsNum");
    for (var i = 0; i < totalTeamsNums.length; i++) { 
        if (isNaN(nTeamsEntered)) totalTeamsNums[i].innerHTML = "0"; 
        else totalTeamsNums[i].innerHTML = nPoolsSoFar * nTeamsEntered;
    } 
}

function highlightInvalidInput(i) { 
    months[i].classList.add("invalidInput");
    days[i].classList.add("invalidInput");
    years[i].classList.add("invalidInput");   
}


function highlightInvalidInputScore() { 
    document.getElementById("searchMonthInput").classList.add("invalidInput"); 
    document.getElementById("searchDayInput").classList.add("invalidInput");
    document.getElementById("searchYearInput").classList.add("invalidInput");
}

var months; 
var days;
var years;

function evaluateNewLeagueFormat() {
    window.scrollTo(0,0);
    document.getElementById("invalidLeagueDiv").style.display = "none"; // assume there were no errors ... for now ...
    document.getElementById("invalidScoreDiv").style.display = "none"; 
    document.getElementById("successfulLeagueCreationDiv").style.display = "none"; // also no success lol

    months = document.getElementsByClassName("monthInput");
    days = document.getElementsByClassName("dayInput");
    years = document.getElementsByClassName("yearInput");
    var weekdays = document.getElementsByClassName("weekdayInput");
    var hours = document.getElementsByClassName("hourInput");
    var minutes = document.getElementsByClassName("minuteInput");  

    var formFields = document.getElementsByClassName("form-control");
    for (var f = 0; f < formFields.length; f++) { 
        formFields[f].classList.remove("invalidInput");
    }

    var leagueNameInput = document.getElementById("leagueName");
    if (leagueNameInput.value.length == 0) {  
        leagueNameInput.classList.add("invalidInput"); 
    }

    var currentDate;
    for (var i = 0; i < months.length; i++) {  /* This iteration variable works for all of months,  */
        month = parseInt(months[i].value);
        day = parseInt(days[i].value);
        year = parseInt(years[i].value);
        if (isNaN(month) || isNaN(day) || isNaN(year)) highlightInvalidInput(i);
        else { 
           currentDate = new Date(year, month - 1, day); 
           if (currentDate.getDate() != day || currentDate.getMonth() + 1 != month || currentDate.getFullYear() != year) highlightInvalidInput(i);          
           if (i == 0) savedDate = currentDate;
           else if (currentDate.getTime() < savedDate.getTime()) {
               highlightInvalidInput(i);
               highlightInvalidInput(i-1);
           }
        }
    } 
    
    var nTeamsFinal = parseInt(document.getElementById("nTeams").value);
    console.log(nTeamsFinal);
    if (isNaN(nTeamsFinal) || nTeamsFinal < 0) document.getElementById("nTeams").classList.add("invalidInput");

    for (var j = 0; j < weekdays.length; j++) { 
        weekdays[j].value = weekdays[j].value.toUpperCase();
        weekday = weekdays[j].value;
        hour = parseInt(hours[j].value);
        minute = parseInt(minutes[j].value);
        if (weekdays[j].value != "MON" && weekdays[j].value != "TUE" && weekdays[j].value != "WED" && weekdays[j].value != "THU" && weekdays[j].value != "FRI" && weekdays[j].value != "SAT" && weekdays[j].value != "SUN") weekdays[j].classList.add("invalidInput");
        
        if (isNaN(hour) || hour < 1 || hour > 12 || isNaN(minute) || minute < 0 ||  minute > 59){ 
            hours[j].classList.add("invalidInput");  
            minutes[j].classList.add("invalidInput");
        }
    }

    var invalidInputs = document.getElementsByClassName("invalidInput");

    if (invalidInputs.length == 0) { /* NO ERRORS: proceed with league insertion to database */

        /* TODO: there are no errors creating a league, so create a new league with the 
            specified properties. Also create pools belonging to that league, with the 
            parameters specified. */
        document.getElementById("successfulLeagueCreationDiv").style.display = "block";
        setTimeout(function(){
            document.getElementById("successfulLeagueCreationDiv").style.display = "none"; 
        }, 2000);


        for (var k = 0; k < formFields.length; k++) { // RESET FORM FIELDS
            formFields[k].value = "";    
        }
        document.getElementById("nTeams").value = "0"; // SET NTEAMS CALCULATION TO 0
        for (var l = 0; l < 2; l++) { 
            document.getElementsByClassName("totalTeamsNum")[l].innerHTML = "0";
        }

           
    } else document.getElementById("invalidLeagueDiv").style.display = "block"; /* 1+ ERRORS: prompt user to fix mistakes */

}


function removeInvalidInput() { 
    this.classList.remove("invalidInput");
}

function adminLoad() { 
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) { 
        inputs[i].addEventListener("keypress", removeInvalidInput);
    }
    document.getElementById("nTeams").addEventListener("click",removeInvalidInput);
    computeFooterMargin();
}

var searchResults = [[0,0,"","Titanium Dragons","","Ultimate Frisbee",0,0,0,"7","00","Compton Family Ice Arena"],[0,0,"","Andy's Army","","Pat Fischer's Airpods",0,0,0,"10","00","Compton Family Ice Arena"]];

var scoreComponents = ['<div class="searchResult" id="searchResult',
'"><div id="invalidScore',
'" class="alert alert-danger invalidScore">Invalid score format. Please reenter.</div><div class="row"><div class="col-5 teamText"><a class="userLink" href="',
'">',
'</a></div><div class="col-5 offset-2 teamText"><a class="userLink" href="',
'">',
'</a></div><div class="col-3 offset-1 scoreText"><input id="searchResultFirstTeam',
'" "type="text" class="form-control searchResultScoreInput"></div><div class="col-4 col-sm-2 offset-sm-1 connectorText"><button class="btn btn-success  enterScoreButton" onclick="enterScore(',
')">ENTER</button></div><div class="col-3 offset-sm-1 scoreText"><input type="text" class="form-control searchResultScoreInput" id="searchResultSecondTeam',
'"></div><div class="col-5 detailsText"><span class="searchHour">',
'</span>:<span class="searchMinute">',
'</span>pm</div><div class="col-5 offset-2 detailsText">',
'</div></div></div></div>'];

function evaluateScoreInput() { 

    document.getElementById("invalidLeagueDiv").style.display = "none";
    document.getElementById("invalidScoreDiv").style.display = "none";
    var formFields = document.getElementsByClassName("form-control");
    for (var f = 0; f < formFields.length; f++) {
        formFields[f].classList.remove("invalidInput");
    }
    
    var leagueNameInput = document.getElementById("leagueNameScore");
    if (leagueNameInput.value.length == 0) {
        leagueNameInput.classList.add("invalidInput");
    }

        month = parseInt(document.getElementById("searchMonthInput").value);
        day = parseInt(document.getElementById("searchDayInput").value);
        year = parseInt(document.getElementById("searchYearInput").value);
        if (isNaN(month) || isNaN(day) || isNaN(year)) highlightInvalidInputScore();
        else {
           currentDate = new Date(year, month - 1, day);
           if (currentDate.getDate() != day || currentDate.getMonth() + 1 != month || currentDate.getFullYear() != year) highlightInvalidInputScore();
        }
    

    var invalidInputs = document.getElementsByClassName("invalidInput");

    if (invalidInputs.length == 0) { 

        /*  TODO: query the database with the parameters of the search. 
        If search results, populate the variable searchResults here*/

        if (searchResults.length == 0) {document.getElementById("searchResultsDiv").innerHTML = '<div class="noNotificationsMessage">No results matched your search! Make sure you entered the league name correctly.</div>'; }
        else {
            document.getElementById("searchResultsDiv").innerHTML = "";
            for (var a = 0; a < searchResults.length; a++) {
                console.log(a);
                var htmlString = "";
                for (var i = 0; i < searchResults[a].length; i++) {
                    htmlString += scoreComponents[i]; 
                    if (searchResults[a][i] === 0) htmlString += a+1;
                    else htmlString += searchResults[a][i];
                }
                document.getElementById("searchResultsDiv").insertAdjacentHTML("beforeEnd", htmlString);
            }

            var searchResultInputs = document.getElementsByClassName("searchResultScoreInput");
            for (var j = 0; j < searchResultInputs.length; j++) { 
                searchResultInputs[j].addEventListener("keyup",removeInvalidInput);
            }
        }
        document.getElementById("scoreSearchResults").style.display = "block";
    } else { 
        document.getElementById("invalidScoreDiv").style.display = "block";
        document.getElementById("scoreSearchResults").style.display = "none";  
    }

}

function enterScore(i) {

    var team1Element = document.getElementById("searchResultFirstTeam" + i);
    team1Element.classList.remove("invalidInput");
    var team2Element = document.getElementById("searchResultSecondTeam" + i);
    team2Element.classList.remove("invalidInput");
    var team1Score = parseInt(team1Element.value);
    var team2Score = parseInt(team2Element.value);
    if (isNaN(team1Score) || team1Score < 0) document.getElementById("searchResultFirstTeam" + i).classList.add("invalidInput");
    if (isNaN(team2Score) || team2Score < 0) document.getElementById("searchResultSecondTeam" + i).classList.add("invalidInput");
    if (team1Element.classList.contains("invalidInput") || team2Element.classList.contains("invalidInput")) {
        document.getElementById("invalidScore" + i).style.display = "block";
        document.getElementById("invalidScore" + i).style.padding = "10px"; 
    }
    else  {
        /* TODO: add the game score to the database */
        document.getElementById("searchResult" + i).remove();
        if(document.getElementById("searchResultsDiv").children.length == 0) document.getElementById("scoreSearchResults").style.display = "none";
    }   
}


function clearSearchResults () {
    document.getElementById("invalidScoreDiv").style.display = "none";
    
    var formFields = document.getElementsByClassName("form-control");
    for (var f = 0; f < formFields.length; f++) {
        formFields[f].classList.remove("invalidInput");
    }
    document.getElementById("scoreSearchResults").style.display = "none"; 
    document.getElementById("searchMonthInput").value = "";
    document.getElementById("searchDayInput").value = "";
    document.getElementById("searchYearInput").value = "";
    document.getElementById("leagueNameScore").value = "";
}
