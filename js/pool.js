// TODO: fetch pool data from database and store it in var called poolData with this format: TEAM LINK - TEAM NAME - TEAM WINS - TEAM LOSSES. 
// NOTE that it is assumed that the array poolData has been sorted in RANK ORDER.
// Example is here:
//var poolData = {'league_name': CoRec Broomball'teams':[["","Andy's Army","4","0"],["","Broom Roasted","3","1"],["","Stix Or It Didn't Happen","2","2"],["","Another Team 1","1","3"]]};

var leagueAndPoolInfo = {'leagueLevel': 'CoRec Intramural', 'leagueSport': 'Broomball', 'leagueLocation': 'Compton Family Ice Arena', 'poolDay': 'Wednesday', 'poolTime': '6:00pm'} 


function loadData() {
    /* EXECUTE TODO items here; connect to backend, manipulate poolData variable as above.
        
    ALSO TODO:  set innerHTML of #poolCapacity, set innerHTML of #playoffEligible */

    var poolData = [];

    var urlParams = new URLSearchParams(window.location.search);

    var poolId = urlParams.get("poolId");

    if (poolId == null){
        console.error("No pool specified");
    }

    var xhr = new XMLHttpRequest();
    var url = 'http://127.0.0.1:51069/pools/' + poolId;
    xhr.open('GET', url, false);
    xhr.onload = function(e){
        if(xhr.readyState != 4){
            console.error(xhr.statusText);
        }
        response = JSON.parse(xhr.response);
        console.log(response);
        var teams = response.teams;
        teams.forEach(function(item){
            var xhr_team = new XMLHttpRequest();
            var url_team = 'http://127.0.0.1:51069/teams/' + item;
            xhr_team.open('GET', url_team, false);
            xhr_team.onload = function(e){
                if(xhr_team.readyState != 4){
                    console.error(xhr_team.statusText);
                }
                team_resp = JSON.parse(xhr_team.response);
                var team_info = ["", team_resp.name, team_resp.wins, team_resp.losses];
                poolData.push(team_info);
            };
            
            xhr_team.send();
        });
    }
    xhr.send();

    document.getElementById("teamsRegistered").innerHTML = poolData.length;

    /* DONE: FILL OUT LEAGUE AND POOL METADATA */

    document.getElementById("leagueName").innerHTML = leagueAndPoolInfo["leagueLevel"] + " " + leagueAndPoolInfo["leagueSport"];
    document.getElementById("gameLocation").innerHTML = leagueAndPoolInfo["leagueLocation"];
    document.getElementById("poolTime").innerHTML = leagueAndPoolInfo["poolTime"];
    document.getElementById("poolDay").innerHTML = leagueAndPoolInfo["poolDay"];

    /* DONE: FILL OUT THE TABLE OF POOL DATA */

    if (poolData.length == 0) { 
        document.getElementById("noTeamsInPool").style.display = "block";
        document.getElementById("actualPoolTable").style.display = "none";
        document.getElementById("poolSignUp").style.display = "block";
    } else { 
        var poolTable = document.getElementById("actualPoolTable");  
        for (var i = 0; i < poolData.length; i++) {
            var row = poolTable.insertRow(i+1);
            var rank = row.insertCell(0);
            var team = row.insertCell(1);
            var record = row.insertCell(2);
            rank.innerHTML = (i+1);
            team.innerHTML = '<a href="' + poolData[i][0] + '" class="tableUserLink">' + poolData[i][1] + '</a>';
            record.innerHTML = '<span id="nWins' + (i+1) + '">' + poolData[i][2] + '</span> - <span id="nLosses' + (i+1) + '">' + poolData[i][3] + '</span></td></tr>';
        }

        /* DONE: DETERMINE WHETHER A USER SHOULD BE ABLE TO REGISTER A NEW TEAM */
        
        var teamsRegistered = document.getElementById("teamsRegistered").innerHTML;
        var teamCapacity = document.getElementById("poolCapacity").innerHTML;

        if (teamCapacity == teamsRegistered) document.getElementById("noSpaceInPoolAlert").style.display = "block";
        else  document.getElementById("poolSignUp").style.display = "block";     
    }

    /* DONE: COMPUTE FOOTER POSITION */
    computeFooterMargin();

	/* DONE: LOAD FOOTER */
	var loggedInAs = document.getElementById('loggedInAs');
	loggedInAs.innerHTML = "Logged In As:<br>" + window.localStorage.getItem("email");

}

function clearAllAlerts() {
    var alerts = document.getElementsByClassName("alert");
    for (var i = 0; i < alerts.length; i++) { 
        alerts[i].style.display = "none";
    }   
}

/* DONE: FUNCTIONS CONCERNING THE MODAL */


var nMembers = 0;
var nMembersToCheck = 0;

function readyModal() { 
    clearAllAlerts();
    nMembers = 0;
    document.getElementById("usersToInvite").innerHTML = "";
    document.getElementById("teamName").value = "";
}

function removeTeamMember(n) { 
    document.getElementById("teamMemberWrapper" + n).remove(); /* yikes and a half */ 
    nMembersToCheck--;
}

function addTeamMemberField()  {
    nMembers++; nMembersToCheck++;
    document.getElementById("usersToInvite").insertAdjacentHTML("beforeend", '<div class="teamMemberWrapper" id="teamMemberWrapper' + nMembers + '"><label for="teamMember' + nMembers + '">New Member <button type="button" class="btn btn-danger removeTeamMember" onclick="removeTeamMember(' + nMembers + ')"><i class="fa fa-close"></i>REMOVE</button></label><input type="text" class="form-control teamMemberText" placeholder="Email" id="teamMember' + nMembers + '"></div>');
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


// Check each user invited, one by one, to see if they are suitable for invitation to the team.
function processTeam() { 

    clearAllAlerts();
    var finalTeamName = document.getElementById("teamName").value;
    if (finalTeamName.length == 0) { 
        activateSingleAlert("absentTeamName");
        return;
    }  
    /* TODO: check if the same team name already exists in the league. If so, call activateSingleAlert("teamNameAlreadyExists") and RETURN!*/

    var urlParams = new URLSearchParams(window.location.search);

    var poolId = urlParams.get("poolId");

    if (poolId == null){
        console.error("No pool specified");
        return;
    }

    var league_id;
    var teams;
    var xhr = new XMLHttpRequest();
    var url = 'http://127.0.0.1:51069/pools/' + poolId;
    xhr.open('GET', url, false);
    xhr.onload = function(e){
        if (xhr.readyState != 4){
            console.error(xhr.statusText);
        }
        var response = JSON.parse(xhr.response);
        console.log(response);
        league_id = response.league_id;
        teams = getTeams(league_id);
    }
    xhr.send();

    console.log(teams);
    if (teams.includes(finalTeamName)){
        console.log('team name already exitst');
        activateSingleAlert("teamNameAlreadyExists");
        return;
    }
    else{
        console.log("team name is unique");
    }


    var finalTeamMembers = document.getElementsByClassName("teamMemberText"); 


    var leagueUsers = [];
    var xhr = new XMLHttpRequest();
    var url = 'http://127.0.0.1:51069/leagues/' + league_id + '/users';
    xhr.open('GET', url, false);
    xhr.onload = function(e){
        if (xhr.readyState != 4){
            console.error(xhr.statusText);
        }
        var response = JSON.parse(xhr.response);
        leagueUsers = response.users;
    }
    xhr.send();

    var user_ids = [];
    
    // Loop through every team member entered: 
    for (var i = 0; i < finalTeamMembers.length; i++) {            
            /* - DONE: raise an alert if any email field is blank */
            if (finalTeamMembers[i].value.length == 0) { 
                activateSingleAlert("blankUserEmail");
                return;
            } 
           
            /*
            - TODO: user email does not exist in the users db -- use activateSingleAlert("invalidTeamMemberEmail"), and set #invalidTeamMemberEmailText to finalTeamMembers[i].value. Then RETURN! See code below
            

            activateSingleAlert("invalidTeamMemberEmail");
            document.getElementById("invalidTeamMemberEmailText").innerHTML = finalTeamMembers[i].value;
            return;*/
            var xhr = new XMLHttpRequest();
            var url = 'http://127.0.0.1:51069/users/email/' + finalTeamMembers[i].value;
            var user;
            xhr.open('GET', url, false);
            xhr.onload = function(e) {
                if (xhr.readyState != 4){
                    console.error(xhr.statusText);
                }
                var response = JSON.parse(xhr.response);
                user = response;
                /*
                var count = Object.keys(response).length;
                if (count == 0){
                    activateSingleAlert("invalidTeamMemberEmail");
                    document.getElementById("invalidTeamMemberEmailText").innerHTML = finalTeamMembers[i].value;
                    return;
                }
                user_ids.push(user.user_id);
                */
            }
            xhr.send();
            
            var count = Object.keys(user).length;
            if (count == 0){
                activateSingleAlert("invalidTeamMemberEmail");
                document.getElementById("invalidTeamMemberEmailText").innerHTML = finalTeamMembers[i].value;
                return;
            }


            /*
            - TODO: user (derived from email) is already on a team in the league -- use activateSingleAlert("teamMemberAlreadyExists") and set #teamMemberAlreadyExists to finalTeamMembers[i].value. Then RETURN! See the code below.

            activateSingleAlert("teamMemberAlreadyExists");
            document.getElementById("teamMemberAlreadyExistsText").innerHTML = finalTeamMembers[i].value;
            return;
            */
            console.log(user_ids);
            console.log(user.user_id);
            console.log(leagueUsers);
            if(typeof leagueUsers != 'undefined' && leagueUsers.includes(user.user_id)){
                console.log("team member already exists");
                activateSingleAlert("teamMemberAlreadyExists");
                document.getElementById("teamMemberAlreadyExistsText").innerHTML = finalTeamMembers[i].value;
                return;
            }

            if(user_ids.includes(user.user_id)){
                activateSingleAlert("duplicate user entered for team");
                return;
            }

            user_ids.push(user.user_id);
    }

    createTeamAndSendInvitations(poolId, finalTeamName, league_id, user_ids);
}

function getTeams(league_id){
    var xhr = new XMLHttpRequest();
    var url = 'http://127.0.0.1:51069/leagues/'+league_id+'/teams';
    var teamList = [];
    xhr.open('GET', url, false);
    xhr.onload = function(e) {
        if(xhr.readyState != 4){
            console.error(xhr.statusText);
        }
        var response = JSON.parse(xhr.response);
        console.log(response);
        response.forEach(function(item){
            teamList.push(item.name);
        });
    }
    xhr.send();
    return teamList;
}


function createTeamAndSendInvitations(poolId, finalTeamName, league_id, user_ids) {

    /* After error checking all team members above, we can now create a new team, and send invitations to
    // all the users that were invited.

    /* TODO: create a new team */
    var data = {};
    data.name = finalTeamName;
    data.pool_id = poolId;
    data.league_id = league_id;
    data.wins = 0;
    data.losses = 0;
    data.ties = 0;
    
    var xhr = new XMLHttpRequest();
    var url = 'http://127.0.0.1:51069/teams/';
    var json = JSON.stringify(data);
    var team_id;
    xhr.open('POST', url, false);
    xhr.onload = function(e) {
        var team = JSON.parse(xhr.response);
        if(xhr.readyState != 4){
            console.error(xhr.statusText);
        }
        else if(team['result'] == 'success'){
            activateSingleAlert("successfulCreation");
        }
        else{
            console.error(team);
            return;
        }
        team_id = team.team_id;
    }
    xhr.send(json);

    var finalTeamMembers = document.getElementsByClassName("teamMemberText");
    user_ids.forEach(function(item) {
        /* TODO: add each user (email found with finalTeamMembers[i].value) to the team you just made. */
        var xhr = new XMLHttpRequest();
        var url = 'http://127.0.0.1:51069/users/'+item+'/team/'+team_id;
        xhr.open('POST', url, false);
        var response;
        xhr.onload = function(e) {
            if (xhr.readyState != 4){
                console.error(xhr.statusText);
            }
            response = JSON.parse(xhr.response);
        }
        xhr.send();
        if(response['result'] != 'success'){
            activateSingleAlert("Failed to add a user to team");
        }
    });
    console.log("made team. Not sure if alert will work");
    activateSingleAlert("Successfully Created Team");
}
