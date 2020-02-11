/* TODO: connect to backend and store result in variable teamGameData. */
var teamGameData = [["10/23","","Stix Or It Didn't Happen","15","10"],["10/30","","Another Team","9","20"],["11/7","","A Third Team","10","10"],["11/14","","A Fourth Team","-1","-1"]]; // formatted by DATE - OPP TEAM LINK - OPP TEAM - YOUR TEAM SCORE - OPP TEAM SCORE. IF GAME HAS NOT YET OCCURRED, MAKE SURE YOUR TEAM SCORE and OPP TEAM SCORE fields are negative! 

var gameComponents = ['<div class="card ',
'"><div class="card-body"><div class="row"><div class="col-3 col-md-2">',
'</div><div class="col-6 col-md-8"><a href="',
'" class="userLink">',
'</a></div><div class="col-3 col-md-2"><strong><span class="gameOutcome">',
'</span></strong> <span class="myPoints">',
'</span> - <span class="oppPoints">',
'</span></div></div></div></div>',
'</span></strong></div></div></div></div>'];


var rosterComponents = ['<tr><th scope="row" class="align-middle"><i class="fa ',
'"></i></th><td class="align-middle"><a class="userLink" href="',
'">',
'</a></td><td class="align-middle">',
'</td></tr>']

var rosterData = [[true,"","Tommy","Clare","tclare@nd.edu", "M"],[false,"","Patrick","Fischer","pfische@nd.edu","M"],[false,"","Sebastian","Miner","sminer@nd.edu","M"],[false,"","Andy","Slavin","aslavin@nd.edu","F"]]; // formatted by FNAME - LNAME - USER LINK - USER EMAIL - GENDER

var noPlayersOnRosterDiv = '<div class="noNotificationsDiv"></div>';

function loadData() { 
	console.log("here");
  
    /* TODO: here is where you connect to the backend and modify teamGameData EXACTLY as the format above suggests */
    
    /* ALSO TODO right here: connect to backend andinput a few side statistics (# wins, # losses, poolRank, teamsInPool) with data from db. 
    This is done with the following: 
    document.getElementById("nWins").innerHTML = ...; // a string
    document.getElementById("nLosses").innerHTML = ...; // a string
    document.getElementById("nTies").innerHTML = ...; // a string
    document.getElementById("poolRank").innerHTML = ...; // a string
    document.getElementById("teamsInPool").innerHTML = ...; // a string
    */

    var urlParams = new URLSearchParams(window.location.search);
    var teamId = urlParams.get("teamId");

    if (teamId == null){
        console.error("No pool specified");
    }

    var schedule_data = [];

    var wins = 0;
    var losses = 0;
    var ties = 0;
    var new_roster_data = [];
    var xhr = new XMLHttpRequest();
    var url = 'http://127.0.0.1:51069/teams/' + teamId;
    xhr.open('GET', url, false);
    xhr.onload = function(e){
        if(xhr.readyState != 4){
            console.error(xhr.statusText);
        }
        response = JSON.parse(xhr.response);
        document.getElementById("teamName").innerHTML = response.name;
        var users = response.users;
        users.forEach(function(item){
            var xhr_user = new XMLHttpRequest();
            var url_user = 'http://127.0.0.1:51069/users/'+item;
            xhr_user.open('GET', url_user, false);
            xhr_user.onload = function(e){
                if(xhr_user.readyState != 4){
                    console.error(xhr_user.statusText);
                }
                user_resp = JSON.parse(xhr_user.response);
                var user_holder = ['False', '', user_resp.first_name, user_resp.last_name, user_resp.email, user_resp.gender];
                new_roster_data.push(user_holder);
            }
            xhr_user.send();
        });

        var xhr_team = new XMLHttpRequest();
        var url_team = 'http://127.0.0.1:51069/pools/'+response.pool_id;
        xhr_team.open('GET', url_team, false);
        xhr_team.onload = function(e){
            if(xhr_team.ready_state != 4){
                console.error(xhr.statusText);
            }
            var teams_resp = JSON.parse(xhr_team.response);
            var teams = teams_resp.teams;
            console.log(teams);
            var teams_good = teams.filter(function(value, index, arr){
                return value != teamId;
            });
            console.log(teams_good);
            const shuffled = teams_good.sort(() => Math.random() - 0.5);
            console.log(shuffled);
            var max = 4;
            if (shuffled.length < max){
                max = shuffled.length;
            }
            var new_list = [];
            for (var x = 0; x < max; x++){
                new_list.push(shuffled.pop());
            }
            console.log(new_list);
            var order = 8;
            new_list.forEach(function(item){
                var temp = [];
                var xhr_iteam = new XMLHttpRequest();
                var url_iteam = 'http://127.0.0.1:51069/teams/' + item;
                xhr_iteam.open('GET', url_iteam, false);
                xhr_iteam.onload = function(e){
                    if(xhr_iteam.readyState != 4){
                        console.error(xhr_iteam.statusText);
                    }
                    var score1 = Math.floor((Math.random()*12)+1);
                    var score2 = Math.floor((Math.random()*12)+1);
                    if (order >= 11){
                        score1 = -1;
                        score2 = -1;
                    }
                    if(score1 > score2){
                        wins++;
                    }
                    if(score1 < score2){
                        losses++;
                    }
                    if(score1 == score2 && score1 != -1){
                        ties++;
                    }
                    iteam_resp = JSON.parse(xhr_iteam.response);
                    temp = [(order).toString() + "/" + Math.floor((Math.random()*30)+1).toString(), "", iteam_resp.name, score1, score2];
                    schedule_data.push(temp);
                    console.log(temp);
                    order++;
                }
                xhr_iteam.send();
            });

        }
        xhr_team.send();
    }
    xhr.send();

    document.getElementById("nWins").innerHTML = wins;
    document.getElementById("nLosses").innerHTML = losses;
    document.getElementById("nTies").innerHTML = ties;


    console.log(schedule_data);
    teamGameData = schedule_data;

    /* DONE: calculate other statistics */
    var nWins = parseInt(document.getElementById("nWins").innerHTML);
    var nLosses = parseInt(document.getElementById("nLosses").innerHTML);
    var scoreDifferential = 0;
    document.getElementById("winPercentage").innerHTML = (nWins + nLosses > 0) ? Math.round((nWins / (nWins + nLosses)) * 1000) / 10 + "%" : "TBD";

    /* DONE: grab data from teamGameData and load it into the page */
    var gameCards = document.getElementById("gameCards");
    var innerHTMLString;
    var win = false, loss = false, tie = false;
    for (var i = 0; i < teamGameData.length; i++) {

        win = (parseInt(teamGameData[i][3]) > parseInt(teamGameData[i][4]));
        loss = (parseInt(teamGameData[i][3]) < parseInt(teamGameData[i][4]));
        tie = (parseInt(teamGameData[i][3]) == parseInt(teamGameData[i][4]) && (parseInt(teamGameData[i][3]) >= 0));

        innerHTMLString = gameComponents[0];
        if (win) innerHTMLString += "outcomeWin"; 
        else if (loss) innerHTMLString += "outcomeLoss";
        else innerHTMLString += "outcomeTBDOrTie";
        innerHTMLString += gameComponents[1] + teamGameData[i][0] + gameComponents[2] + teamGameData[i][1] + gameComponents[3] + teamGameData[i][2] + gameComponents[4];
        if (win) { innerHTMLString += "W"; nWins++; } 
        else if (loss) innerHTMLString += "L";
        else if (tie) innerHTMLString += "T";

        if (win || loss || tie) {
            innerHTMLString += gameComponents[5] + teamGameData[i][3] + gameComponents[6] + teamGameData[i][4] + gameComponents[7]; 
            scoreDifferential += teamGameData[i][3] - teamGameData[i][4];
        }else innerHTMLString += "TBD" + gameComponents[7];
        
        gameCards.innerHTML += innerHTMLString;
    }     

    /* DONE: compute score differential and display it*/
    document.getElementById("scoreDifferential").innerHTML = (scoreDifferential >= 0) ? "+" + scoreDifferential : scoreDifferential;

   
    /* DONE: grab data from rosterData and load it into the page */ 
    rosterData = new_roster_data;
    innerHTMLString = "<tbody>";
    for (var j = 0; j < rosterData.length; j++) { 
        innerHTMLString += rosterComponents[0] + ((rosterData[j][0]) ? "fa-star" : "fa-user-o") + rosterComponents[1] + rosterData[j][1] + rosterComponents[2] + rosterData[j][2] + " " + rosterData[j][3] + " (" + rosterData[j][4] + ")" + rosterComponents[3] + rosterData[j][5];
    }
    innerHTMLString += "</tbody>";
    document.getElementById("teamRosterTable").innerHTML = innerHTMLString;

    /* DONE: compute footer margin */
    computeFooterMargin();

	/* DONE: LOAD FOOTER */
	console.log("here");
	var loggedInAs = document.getElementById('loggedInAs');
	loggedInAs.innerHTML = "Logged In As:<br>" + window.localStorage.getItem("email");
}
