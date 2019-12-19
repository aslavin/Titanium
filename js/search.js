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
    document.getElementById("searchBox").placeholder = "Search For " + document.getElementById(id).innerHTML;
}

var currentButtons = ["Anything","Leagues","Teams","Players"]
var searchResults = [["","Broom Roasted", "Team"],["", "Broomball Co-Rec", "League"]]; /* formatted by LINK, TEAM, TYPE */
var searchResultComponents = ['<div class="searchResult"><a class="userLink" href="',
'">',
'</a></div>'];

function search() { 
    var searchInput = document.getElementById("searchBox").value;
    /* TODO: search the appropriate database(s) using the fields Results list */
    switch (currentButton) { 
        case 0:
            // search users, leagues, teams (all)
            break;
        case 1:
            // search leagues
            break;
        case 2:
            // search teams
            break;
        case 3: 
            // search players
            break;
    }
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
