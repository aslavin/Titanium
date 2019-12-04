// TODO: fetch pool data from database and store it in var called poolData with this format: TEAM LINK - TEAM NAME - TEAM WINS - TEAM LOSSES. 
// NOTE that it is assumed that the array poolData has been sorted in RANK ORDER.
// Example is here:
var poolData = [["","Andy's Army","4","0"],["","Broom Roasted","3","1"],["","Stix Or It Didn't Happen","2","2"],["","Another Team 1","1","3"]]; 
function loadData() { 

    /* EXECUTE TODO items here; connect to backend, manipulate poolData variable as above.
        
    ALSO TODO:  set innerHTML of #poolCapacity, set innerHTML of #playoffEligible */

    document.getElementById("teamsRegistered").innerHTML = poolData.length;  

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

    var ch = document.getElementById("landingFooterUser").clientHeight;
    var ih = window.innerHeight;
    var sh = document.getElementById("mainContent").scrollHeight;
    if (ih - ch - sh > 0) document.getElementById("landingFooterUser").style.marginTop = (ih - ch - sh) + "px";

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
    var finalTeamMembers = document.getElementsByClassName("teamMemberText"); 

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

            /*
            - TODO: user (derived from email) is already on the team -- use activateSingleAlert("teamMemberAlreadyExists") and set #teamMemberAlreadyExists to finalTeamMembers[i].value. Then RETURN! See the code below.

            activateSingleAlert("teamMemberAlreadyExists");
            document.getElementById("teamMemberAlreadyExistsText").innerHTML = finalTeamMembers[i].value;
            return;
            */
    }

    createTeamAndSendInvitations();
}


function createTeamAndSendInvitations() {

    /* After error checking all team members above, we can now create a new team, and send invitations to
    // all the users that were invited.

    /* TODO: create a new team */

    var finalTeamMembers = document.getElementsByClassName("teamMemberText");
    for (var i = 0; i < finalTeamMembers.length; i++) {
        /* TODO: add each user (email found with finalTeamMembers[i].value) to the team you just made. */
    }
}
