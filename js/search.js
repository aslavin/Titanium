var currentButton = 0;

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
}

var currentButtons = ["Leagues","Teams","Players"]
var searchResults = []; // things will be added with the form [LINK, NAME, TYPE]
var searchResultComponents = ['<div class="searchResult"><a class="userLink" href="',
'">',
'</a></div>'];

var searchResultComponents = [
'<div class="col-md-4 col-6 sportsImageContainer"><img class="sportsImage" src="data/',
'.jpg"><a href="',
'"><div class="sportsImageTextContainer"><p class="sportsImageText">',
'</p></div></a></div>'
] 


function loadData() { 
    var leagueData = [];
    var xhr = new XMLHttpRequest();
    var url = 'http://127.0.0.1:51069/leagues/';
    xhr.open('GET', url, false);
    xhr.onload = function(e) { 
        if (xhr.readyState != 4){
            console.error(xhr.statusText);
        }
        var response = JSON.parse(xhr.response);
        console.log(response);
        var htmlString;
        for (var i = 0; i < response.length; i++) { 
            htmlString = searchResultComponents[0] + response[i]["sport"] + searchResultComponents[1] +
            "#" + searchResultComponents[2] + response[i]["level"].split(" ").join("<br>") + "<br>" + 
            response[i]["sport"] + searchResultComponents[3];
            document.getElementById("sportsImageCollection").insertAdjacentHTML("beforeend",htmlString)
        } 
    }
    xhr.send();
}



function search() {
    searchResults = []; // clear search results
    var searchInput = document.getElementById("searchBox").value;
    switch (currentButton) { 
        case 0:
            // search leagues
            var xhr = new XMLHttpRequest();
            var url = 'http://127.0.0.1:51069/search/leagues/';
            xhr.open('POST', url, false);
            xhr.onload = function(e) {
                if (xhr.readyState != 4){
                    console.error(xhr.statusText);
                }
                var response = JSON.parse(xhr.response);
                for (var i = 0; i < response.length; i++) {
                    searchResults.push(["", response[i][0] + " " + response[i][1], "League"]);
                }
                displayResults();
            }
            xhr.send(JSON.stringify({"query": searchInput}));
            break;
        case 1:
            // search teams
            var xhr = new XMLHttpRequest();
            var url = 'http://127.0.0.1:51069/search/teams/';
            xhr.open('POST', url, false);
            xhr.onload = function(e) {
                if (xhr.readyState != 4){
                    console.error(xhr.statusText);
                }
                var response = JSON.parse(xhr.response);
                console.log(response);
                for (var i = 0; i < response.length; i++) {
                    searchResults.push(["", response[i][0], "Team"]);
                }
                displayResults();
            }
            xhr.send(JSON.stringify({"query": searchInput}));
            break;
        case 2: 
            // search players
            var xhr = new XMLHttpRequest();
            var url = 'http://127.0.0.1:51069/search/users/';
            xhr.open('POST', url, false);
            xhr.onload = function(e) {
                if (xhr.readyState != 4){
                    console.error(xhr.statusText);
                }
                var response = JSON.parse(xhr.response);
                for (var i = 0; i < response.length; i++) {
                    searchResults.push(["", response[i][4] + " " + response[i][5] + " (" + response[i][1] + ")", "Player"]);
                }
                displayResults();
            }
            xhr.send(JSON.stringify({"query": searchInput}));
            break;
    }
}

function displayResults() {
    document.getElementById("nResults").innerHTML = searchResults.length;
    document.getElementById("searchScope").innerHTML = currentButtons[currentButton];
    document.getElementById("originalSearch").innerHTML = document.getElementById("searchBox").value;
    document.getElementById("resultsBox").style.display = "block";

    document.getElementById("searchResults").innerHTML = "";
    for (var i = 0; i < searchResults.length; i++) {
        htmlString = searchResultComponents[0] + searchResults[i][0] + searchResultComponents[1] + searchResults[i][1] + searchResultComponents[2];
        document.getElementById("searchResults").insertAdjacentHTML("beforeend", htmlString);
    }

}
