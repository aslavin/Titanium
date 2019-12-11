// TODO: fetch league data (i.e., pools) and store it in variable leagueData in the format as follows: 
// POOL LINK - POOL DAY - POOL TIME - POOL # TEAM SPOTS AVAILABLE - POOL TEAM CAPACITY. 
// Example is below
var leagueData = []
//var leagueData = [["","Sun","7:00p", "1","5"],["","Sun","8:00p", "3","5"],["","Mon","7:00p", "0","5"],["","Tues","8:00p", "0","5"],["","Wed","2:30p", "0","5"]];

var leagueLeagueComponents = ['<div class="col-6 col-md-4 col-lg-3 leaguePoolCol"><a class="imageLink" href="',
    '"><div class="leaguePool">',
    '<span class="leagueDescription">',
    '</span><span class="leagueDescription">',
    '</span></div></a></div>'
];

function loadData() {
	
	// TODO: GET SESSION VARIABLE RATHER THAN HARD CODING IN LEAGUE ID
	leagueId = 1;
	

   /* DONE: CONNECT TO BACKEND, GET LEAGUE DATA, SEND POOL DATA TO HANDLER BELOW */
	var xhr = new XMLHttpRequest();
	var url = 'http://project01.cse.nd.edu:51069/leagues/' + leagueId;
	xhr.open('GET', url, true);

	xhr.onload = function(e) {

		if (xhr.readyState != 4) { // failed
			console.error(xhr.statusText);
		}
		response = JSON.parse(xhr.response);

		for (poolId of response['pools']) {
			setPoolData(poolId, response['pools'].length);
		}
		
	}

	xhr.send();
}

/* DONE: SET POOL DATA FOR EACH POOL IN LEAGUEe */
function setPoolData(poolId, nPools) {
	
	var xhr = new XMLHttpRequest();
	var url = 'http://project01.cse.nd.edu:51069/pools/' + poolId;
	xhr.open('GET', url, true);

	xhr.onload = function(e) {

		if (xhr.readyState != 4) { // failed
			console.error(xhr.statusText);
		}
		response = JSON.parse(xhr.response);

		availableSpots = response['max_size'] - response['teams'].length;

		leagueData.push(["","Sun", "7:00p", availableSpots.toString(), response['max_size']]);
		
		// all pools have been loaded into leagueData, so load page
		if (leagueData.length == nPools) {
			loadPage();
		}

	}

	xhr.send();
}

function loadPage() {
   /* DONE: SET LEAGUE STATISTICS */
    
    document.getElementById("totalPools").innerHTML = leagueData.length;
    var nPoolsAvailable = 0;
    var nTeamsAvailable = 0;
    var nTeams = 0;

    for (var a = 0; a < leagueData.length; a++) {
        if (leagueData[a][3] > 0) {
            nTeamsAvailable += parseInt(leagueData[a][3]);
            nPoolsAvailable++;
        }
        nTeams += parseInt(leagueData[a][4]);
    }

    document.getElementById("poolsAvailable").innerHTML = nPoolsAvailable;
    document.getElementById("teamCapacity").innerHTML = nTeams;
    document.getElementById("teamsAvailable").innerHTML = nTeamsAvailable; 

    /* DONE: DISPLAY CONTENT RELEVANT TO POOL DATA */

    for (var i = 0; i < leagueData.length; i++) {
    
        var fullMessage = (leagueData[i][3] == 0) ? '<div class="leagueFullBanner">FULL</div>': '';

        document.getElementById("leaguePools").innerHTML += leagueLeagueComponents[0] + leagueData[i][0] + leagueLeagueComponents[1] + fullMessage + leagueLeagueComponents[2] + leagueData[i][1] + leagueLeagueComponents[3] + leagueData[i][2] + leagueLeagueComponents[4];
    }

    var nPoolsAvailable = document.getElementById("poolsAvailable").innerHTML;
    if (nPoolsAvailable == 0) document.getElementById("noMoreSpaceAlert").style.display = "block";
  
    /* DONE: COMPUTE FOOTER MARGIN */

    var ch = document.getElementById("landingFooterUser").clientHeight;
    var ih = window.innerHeight;
    var sh = document.getElementById("mainContent").scrollHeight;
    if (ih - ch - sh > 0) document.getElementById("landingFooterUser").style.marginTop = (ih - ch - sh) + "px"; 
}
