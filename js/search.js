var currentButton = 0;
var searchLinkType = "./league.html?leagueId=";
var currentButtons = ["Leagues","Teams","Players"]

function changeBtnGroupSearch(id) { 
    var searchButtons = document.getElementById("searchBtns").children;
    for (var i = 0; i < searchButtons.length; i++) {   
        if (searchButtons[i].id == id) { 
            currentButton = i;
            searchButtons[i].classList.remove("notificationUnpressed");
            searchButtons[i].classList.add("notificationPressed");
        } else { 
            searchButtons[i].classList.remove("notificationPressed");
            searchButtons[i].classList.add("notificationUnpressed");    
        } 
    }
    document.getElementById("searchBox").value = "";
    document.getElementById("searchBox").placeholder = "Search For " + document.getElementById(id).innerHTML;
    document.getElementById("sportsImageCollection").innerHTML = "";

    switch (currentButton) { 
        case 0:
            searchLinkType = "./league.html?leagueId=";
            loadLeagues();
            break;
        case 1:
            searchLinkType = "./team.html?teamId=";
            loadTeams();
            break;
        case 2:
            searchLinkType = "./user.html?userId=";
            loadUsers();
            break;
    }
}

var searchResultComponents = [
'<div class="col-md-4 col-6 sportsImageContainer" id="sportsImageContainer',
'"><img class="sportsImage" src="',
'.jpg"><a href="',
'"><div class="sportsImageTextContainer"><p class="sportsImageText">',
'</p></div></a></div>'
] 


var currentSearchResults; 


function loadLeagues() { 
    var xhr = new XMLHttpRequest();
    var url = 'http://127.0.0.1:51069/leagues/';
    xhr.open('GET', url, false);
    xhr.onload = function(e) { 
        if (xhr.readyState != 4){
            console.error(xhr.statusText);
        }
        var response = JSON.parse(xhr.response);
        console.log(response);
        currentSearchResults = response;
        var htmlString;
        for (var i = 0; i < response.length; i++) { 
            htmlString = searchResultComponents[0] + response[i]["league_id"] +searchResultComponents[1] + "./data/" + response[i]["sport"] + searchResultComponents[2] + searchLinkType + response[i]["league_id"] + searchResultComponents[3] + response[i]["level"].split(" ").join("<br>") + "<br>" + response[i]["sport"] + searchResultComponents[4];
            document.getElementById("sportsImageCollection").insertAdjacentHTML("beforeend",htmlString)
        } 
    }
    xhr.send();
}


function loadUsers() {
    var xhr = new XMLHttpRequest();
    var url = 'http://127.0.0.1:51069/users/';
    xhr.open('GET', url, false);
    xhr.onload = function(e) { 
        if (xhr.readyState != 4){
            console.error(xhr.statusText);
        }
        var response = JSON.parse(xhr.response);
        console.log(response);
        currentSearchResults = response;
        var htmlString;
        var profilePictureURL;
        for (var i = 0; i < response.length; i++) {
            profilePictureURL = response[i]["profilePicExists"] ? "file:///Users/tommyclare/Documents/Class/SoftwareEngineering/Titanium/data/userPictures/" + response[i]["user_id"] : "./data/blankProfilePic";
            htmlString = searchResultComponents[0] + response[i]["user_id"] + searchResultComponents[1] + profilePictureURL + searchResultComponents[2] + searchLinkType + response[i]["user_id"] + searchResultComponents[3] + response[i]["first_name"] + "<br>" + response[i]["last_name"]  + searchResultComponents[4];
            document.getElementById("sportsImageCollection").insertAdjacentHTML("beforeend",htmlString)
        } 
    }
    xhr.send();
}

function loadTeams() {
    var xhr = new XMLHttpRequest();
    var url = 'http://127.0.0.1:51069/teams/';
    xhr.open('GET', url, false);
    xhr.onload = function(e) { 
        if (xhr.readyState != 4){
            console.error(xhr.statusText);
        }
        var response = JSON.parse(xhr.response);
        console.log(response);
        currentSearchResults = response;
        var htmlString;
        for (var i = 0; i < response.length; i++) { 
            htmlString = searchResultComponents[0] + response[i]["team_id"] + searchResultComponents[1] + "./data/" + response[i]["sport"] + searchResultComponents[2] + searchLinkType + response[i]["team_id"] + searchResultComponents[3] + response[i]["team_name"] + "<br>(" + response[i]["wins"] +" - " + response[i]["losses"] + " - " + response[i]["ties"] + ")" + searchResultComponents[4];
            document.getElementById("sportsImageCollection").insertAdjacentHTML("beforeend",htmlString)
        } 
    }
    xhr.send();
}


function narrowSearch(searchValue) {
    switch (currentButton) { 
        case 0:
            for (var i = 0; i < currentSearchResults.length; i++) { 
                if (!narrowSearchHelper(currentSearchResults[i], searchValue)) document.getElementById("sportsImageContainer" + currentSearchResults[i]["league_id"]).style.display = "none";
                else document.getElementById("sportsImageContainer" + currentSearchResults[i]["league_id"]).style.display = "flex";
            }
            break;
        case 1:
            for (var i = 0; i < currentSearchResults.length; i++) { 
                if (!narrowSearchHelper(currentSearchResults[i], searchValue)) document.getElementById("sportsImageContainer" + currentSearchResults[i]["team_id"]).style.display = "none";
                else document.getElementById("sportsImageContainer" + currentSearchResults[i]["team_id"]).style.display = "flex";
            }
            break;
        case 2:
            for (var i = 0; i < currentSearchResults.length; i++) { 
                if (!narrowSearchHelper(currentSearchResults[i], searchValue)) document.getElementById("sportsImageContainer" + currentSearchResults[i]["user_id"]).style.display = "none";
                else document.getElementById("sportsImageContainer" + currentSearchResults[i]["user_id"]).style.display = "flex";
            }
            break;
        
    }   
}
/* new approach: split search query, make it uppercase. Make sure every value in that split matches one of the elements in the league response */
function narrowSearchHelper(someEntitySet, searchValue) { 
    var uppercaseSearch = searchValue.toUpperCase();
    var splitUppercaseSearch = uppercaseSearch.split(/ +/); // split on multiple spaces    
    var uppercaseWordsToMatch = determineWordsToMatch(someEntitySet)
    for (var i = 0; i < splitUppercaseSearch.length; i++) { 
        var match = false;
        for (var j = 0; j < uppercaseWordsToMatch.length; j++) { 
            if (uppercaseWordsToMatch[j].startsWith(splitUppercaseSearch[i])) { 
                match = true;
                break;
            }
        }
        if (!match) return false;
    }
    return true;
}

function determineWordsToMatch(someEntitySet) {
    switch (currentButton) { 
        case 0: // league
            return [someEntitySet["sport"].toUpperCase(), someEntitySet["level"].split(/ +/)[0].toUpperCase(), someEntitySet["level"].split(/ +/)[1].toUpperCase()];  
        case 1: // team 
            return someEntitySet["team_name"].toUpperCase().split(/ +/).concat(someEntitySet["sport"].toUpperCase());
        case 2: // player
            return [someEntitySet["first_name"].toUpperCase(), someEntitySet["last_name"].toUpperCase()];
        default:
            console.error("search type not recognized");
            break;
    }
}

function narrowTeam(someTeam, searchValue) { 
        
}

function narrowPlayer(somePlayer, searchValue) { 
    
}
