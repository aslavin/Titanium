/* the following array is assumed to be in RANK order */

var poolData = [["","Boolin Boys","3","0"],["","Papal Rage","2","1"],["","Broom Roasted","1","2"],["","Stix Or It Didn't Happen","0","3"],["","Another Team", "0", "4"]]; // indexed by LINK - TEAM - TEAM WINS - TEAM LOSSES

function loadData() { 

    document.getElementById("teamsRegistered").innerHTML = poolData.length;
    
    if (poolData.length == 0) { 
        document.getElementById("noTeamsInPool").style.display = "block";
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

        var teamsRegistered = document.getElementById("teamsRegistered").innerHTML;
        var teamCapacity = document.getElementById("teamCapacity").innerHTML;

        if (teamCapacity == teamsRegistered) document.getElementById("noSpaceInPoolAlert").style.display = "block";
        else  document.getElementById("poolSignUp").style.display = "block";     
    }

    var ch = document.getElementById("landingFooterUser").clientHeight;
    var ih = window.innerHeight;
    var sh = document.getElementById("mainContent").scrollHeight;
    if (ih - ch - sh > 0) document.getElementById("landingFooterUser").style.marginTop = (ih - ch - sh) + "px";

}
