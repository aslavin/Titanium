// TODO: fetch league data (i.e., pools) and store it in variable leagueData in the format as follows: 
// POOL LINK - POOL DAY - POOL TIME - POOL # TEAM SPOTS AVAILABLE - POOL TEAM CAPACITY. 
// Example is below
var leagueData = []
var leagueMetadata = [];
//var leagueData = [["","Sun","7:00p", "1","5"],["","Sun","8:00p", "3","5"],["","Mon","7:00p", "0","5"],["","Tues","8:00p", "0","5"],["","Wed","2:30p", "0","5"]];

var leagueLeagueComponents = ['<div class="col-6 col-md-4 col-lg-3 leaguePoolCol"><a class="imageLink" href="',
    '"><div class="leaguePool">',
    '<span class="leagueDescription">',
    '</span><span class="leagueDescription">',
    '</span></div></a></div>'
];

function loadData() {
	
	// DONE: GET QUERY VARIABLE
	var urlParams = new URLSearchParams(window.location.search);

    var leagueId = urlParams.get("leagueId");

    if (leagueId == null){
        console.error("No league specified");
    }
	
   /* DONE: CONNECT TO BACKEND, GET LEAGUE DATA (INCLUDING DATA FOR POOLS IN LEAGUE) */
	var xhr = new XMLHttpRequest();
	var url = 'http://127.0.0.1:51069/leagues/' + leagueId;
	xhr.open('GET', url, true);

	xhr.onload = function(e) {

		if (xhr.readyState != 4) { // failed
			console.error(xhr.statusText);
		}
        response = JSON.parse(xhr.response);
        console.log(response);
        leagueMetadata = {"leagueId": response["leagueId"], "leagueName": response["level"] + " " + response["sport"], "leagueLocation": response["location"]};
		for (pool of response['pools']) {
            availableSpots = response['max_teams_in_pool'] - pool['num_teams'].length;
            leagueData.push(["./pool.html?poolId="+pool["pool_id"], pool["day"], pool["time"], availableSpots.toString(), response['max_teams_in_pool']]);
        }
        
        loadPage();
		
	}

	xhr.send();
}

function loadPage() {

    /* DONE: SET LEAGUE TITLE */

    document.getElementById("leagueName").innerHTML = leagueMetadata["leagueName"];
    document.getElementById("gameLocation").innerHTML = leagueMetadata["leagueLocation"];


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

    computeFooterMargin();
 
}
