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
    console.log(buttonSubstr);
    document.getElementById("contentAddLeagueWrapper").style.display = "none";
    document.getElementById("contentInputScoreWrapper").style.display = "none";
    document.getElementById("content" + buttonSubstr + "Wrapper").style.display = "block";
}

var nPools = 1;

var newPoolComponents = ['<div class="col-md-6 d-none d-md-block centerContent pool',
'" style="padding:0px"><div class="nonInputContent">Pool Time</div></div><div class="col-12 d-block d-md-none centerContent pool',
'"><div class="nonInputContent">Pool</div></div><div class="col-md-2 col-4 centerContent pool',
'"><input type="text" class="form-control" id="" placeholder="HH"></div><div class="col-md-2 col-4 centerContent pool',
'"><input type="text" class="form-control" id="" placeholder="MM"></div><div class="col-md-2 col-4 centerContent pool',
'"><input type="text" class="form-control" id="" placeholder="AM/PM"></div>']

function addNewPool() {
    nPools++;
    var htmlString = newPoolComponents[0];
    for (var i = 1; i < newPoolComponents.length; i++) { 
        htmlString += i + newPoolComponents[i]; 
    }
    document.getElementById("contentAddLeague").innerHTML += htmlString;
}

function submitLeague() {

	// get all data from page
	leagueName = document.getElementById("leagueName").value;
	startDateMonth = document.getElementById("startDateMonth").value;
	startDateDay = document.getElementById("startDateDay").value;
	startDateYear = document.getElementById("startDateYear").value;
	endDateMonth = document.getElementById("endDateMonth").value;
	endDateDay = document.getElementById("endDateDay").value;
	endDateYear = document.getElementById("endDateYear").value;

	/* TODO: grab all the pools, no matter how many there are */
	poolTimeHour = document.getElementById("poolTimeMinute").value;
	poolTimeMinute = document.getElementById("poolTimeMinute").value;
	poolTimeAMPM = document.getElementById("poolTimeAMPM").value;

	// create start and end date strings
	startDate = startDateYear + '-' + startDateMonth + '-' + startDateDay + ' 00:00:00';
	endDate = endDateYear + '-' + endDateMonth + '-' + endDateDay + ' 00:00:00';

	// send POST request to server
	var xhr = new XMLHttpRequest();
	var url = 'http://project01.cse.nd.edu:51069/leagues/';
	xhr.open('POST', url, true);

	xhr.onload = function(e) {

		if (xhr.readyState != 4) { // failed
			console.error(xhr.statusText);
		}
		
		response = JSON.parse(xhr.response);

	}

	xhr.send(JSON.stringify({"leagueName": leagueName, "startDate": startDate, "endDate": endDate}));


}

function computeLogin() {

	/* DONE: LOAD FOOTER */
	var loggedInAs = document.getElementById('loggedInAs');
	loggedInAs.innerHTML = "Logged In As:<br>" + window.localStorage.getItem("email");

}

function confirmAdmin() {
	/* DONE: REDIRECT TO INDEX IF USER ISN'T AN ADMIN */
	if (window.localStorage.getItem("is_admin") != 1) {
		window.location.href = "http://project01.cse.nd.edu/tommy/Titanium/index.html#";
	}
}
