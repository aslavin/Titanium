/* TODO: connect to backend and store result in variable teamData["schedule"]. */
//var teamData = {'schedule': [["10/23","","Stix Or It Didn't Happen","15","10"],["10/30","","Another Team","9","20"],["11/7","","A Third Team","10","10"],["11/14","","A Fourth Team","-1","-1"]], 'roster': [[true,"","Tommy","Clare","tclare@nd.edu", "M"],[false,"","Patrick","Fischer","pfische@nd.edu","M"],[false,"","Sebastian","Miner","sminer@nd.edu","M"],[false,"","Andy","Slavin","aslavin@nd.edu","F"]]}; 
var teamData = {};
// ^^ indexed by schedule = 2D array of all games for this team's season,
//  GAME DATE - OPP NAME - YOUR SCORE - OPP SCORE
// ^^ and roster = a 2D array of attributes of all users on this team.
//  IS_CAPTAIN - USER LINK - FIRST NAME - LAST NAME - EMAIL - GENDER
var teamMetaData = {};
//var teamMetaData = {'teamName': 'Broom Roasted','poolTime': '10:30pm', 'poolLocation': 'Compton Family Ice Arena', 'teamWins': 2, 'teamLosses': 1, 'teamTies': 0, 'teamRankInPool': 3, 'teamsInPool': 5, 'malePlayers': 6, 'femalePlayers': 10}

// ^^ all attributes are self-explanatory. Metadata for a team.



var gameComponents = ['<div class="card ',
'"><div class="card-body"><div class="row gameText"><div class="col-3 col-md-2 verticallyCenteredFlexbox"><div class="nonTeamText">',
'</div></div><div class="col-6 col-md-8 verticallyCenteredFlexbox"><div><a href="',
'" class="userLink">',
'</a></div></div><div class="col-3 col-md-2 verticallyCenteredFlexbox"><strong><div class="nonTeamText"><span class="gameOutcome">',
'</span></strong> <span class="myPoints">',
'</span> - <span class="oppPoints">',
'</span></div></div></div></div>',
'</div></strong></div></div></div></div></div>'];


var rosterComponents = ['<tr><th scope="row" class="align-middle">',
'</th><td class="align-middle"><a class="userLink" href="',
'">',
'</a></td><td class="align-middle">',
'</td></tr>']

function loadData() { 
 
    var urlParams = new URLSearchParams(window.location.search);
    var teamId = urlParams.get("teamId");

    if (teamId == null){
        console.error("No pool specified");
    }

    /* TODO: here is where you connect to the backend and modify teamData["schedule"] EXACTLY as the format above suggests */
    var xhr = new XMLHttpRequest();
	var url = 'http://127.0.0.1:51069/teams/' + teamId;
	xhr.open('GET', url, true);

	xhr.onload = function(e) {

		if (xhr.readyState != 4) { // failed
			console.error(xhr.statusText);
		}
        response = JSON.parse(xhr.response);
        console.log(response);
        teamMetaData = {'teamName': response["teamName"],'poolTime': readableTimeFromSQLDate(response["poolTime"]), 'poolLocation': response["poolLocation"], 'teamWins': response["teamWins"], 'teamLosses': response["teamLosses"], 'teamTies': response["teamTies"], 'teamRankInPool': response["teamRankInPool"], 'teamsInPool': response["teamsInPool"], 'malePlayers': response["malePlayers"], 'femalePlayers': response["femalePlayers"]};
        console.log(teamMetaData);
        var schedule = [];
        var roster = [];
        for (var game of response["schedule"]) {
            schedule.push([readableDateFromSQLDate(game["date"]), "./team.html?teamId="+game["opponentId"], game["opponentName"], game["yourScore"], game["opponentScore"]]);
        }
        for (var player of response["roster"]) {
            roster.push([player["is_capt"], "", player["first_name"], player["last_name"], player["email"], player["gender"]]);
        }
        teamData = {"schedule": schedule, "roster": roster};
        
        loadPage();
		
	}

    xhr.send();
}
    
    /* ALSO TODO right here: connect to backend andinput a few side statistics (# wins, # losses, poolRank, teamsInPool) with data from db. 
    This is done with the following: 
    document.getElementById("nWins").innerHTML = ...; // a string
    document.getElementById("nLosses").innerHTML = ...; // a string
    document.getElementById("nTies").innerHTML = ...; // a string
    document.getElementById("poolRank").innerHTML = ...; // a string
    document.getElementById("teamsInPool").innerHTML = ...; // a string
    */

    /*

    var wins = 0;
    var losses = 0;
    var ties = 0;
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

    */
function loadPage() {
    var nWins = teamMetaData['teamWins'];
    var nLosses = teamMetaData['teamLosses'];
    var nTies = teamMetaData['teamTies'];

    document.getElementById("nWins").innerHTML = nWins;
    document.getElementById("nLosses").innerHTML = nLosses;
    document.getElementById("nTies").innerHTML = nTies;
    document.getElementById("teamName").innerHTML = teamMetaData["teamName"];
    document.getElementById("poolLocation").innerHTML = teamMetaData["poolLocation"];
    document.getElementById("poolRank").innerHTML = teamMetaData["teamRankInPool"];
    document.getElementById("teamsInPool").innerHTML = teamMetaData["teamsInPool"];
    document.getElementById("nMen").innerHTML = teamMetaData["malePlayers"];
    document.getElementById("nWomen").innerHTML = teamMetaData["femalePlayers"];

    /* DONE: calculate other statistics */
    var scoreDifferential = 0;
    document.getElementById("winPercentage").innerHTML = (nWins + nLosses > 0) ? Math.round((nWins / (nWins + nLosses)) * 1000) / 10 + "%" : "TBD";

    /* DONE: grab data from teamData["schedule"] and load it into the page */
    var gameCards = document.getElementById("gameCards");
    var innerHTMLString;
    var win = false, loss = false, tie = false;
    var teamSchedule = teamData["schedule"]
    for (var i = 0; i < teamData["schedule"].length; i++) {
        var gameData = teamSchedule[i]; 
        win = (parseInt(gameData[3]) > parseInt(gameData[4]));
        loss = (parseInt(gameData[3]) < parseInt(gameData[4]));
        tie = (parseInt(gameData[3]) == parseInt(gameData[4]) && (parseInt(gameData[3]) >= 0));

        innerHTMLString = gameComponents[0];
        if (win) innerHTMLString += "outcomeWin"; 
        else if (loss) innerHTMLString += "outcomeLoss";
        else if (tie) innerHTMLString += "outcomeTBDOrTie";
        else innerHTMLString += "outcomeTBDOrTie";
        innerHTMLString += gameComponents[1] + gameData[0] + gameComponents[2] + gameData[1] + gameComponents[3] + gameData[2] + gameComponents[4];
        if (win) { innerHTMLString += "Win<br>"; nWins++; } 
        else if (loss) innerHTMLString += "Loss<br>";
        else if (tie) innerHTMLString += "Tie<br>";

        if (win || loss || tie) {
            innerHTMLString += gameComponents[5] + gameData[3] + gameComponents[6] + gameData[4] + gameComponents[7]; 
            scoreDifferential += gameData[3] - gameData[4];
        } else innerHTMLString += "TBD" + gameComponents[7];
        
        gameCards.innerHTML += innerHTMLString;
    }     

    /* DONE: compute score differential and display it*/
    document.getElementById("scoreDifferential").innerHTML = (scoreDifferential >= 0) ? "+" + scoreDifferential : scoreDifferential;

   
    /* DONE: grab data from teamData["roster"] and load it into the page */ 
    innerHTMLString = "<tbody>";
    for (var j = 0; j < teamData["roster"].length; j++) { 
        innerHTMLString += rosterComponents[0] + ((teamData["roster"][j][0]) ? "<i class=\"fa fa-star\"></i>" : "") + rosterComponents[1] + teamData["roster"][j][1] + rosterComponents[2] + teamData["roster"][j][2] + " " + teamData["roster"][j][3] + " (" + teamData["roster"][j][4] + ")" + rosterComponents[3] + ((teamData["roster"][j][5] == "Male") ? "<i class=\"fa fa-male\"></i>" : "<i class=\"fa fa-female\"></i>") + rosterComponents[4];
    }
    innerHTMLString += "</tbody>";
    document.getElementById("teamRosterTable").innerHTML = innerHTMLString;

    /* DONE: compute footer margin */
    computeFooterMargin();

	var loggedInAs = document.getElementById('loggedInAs');
	loggedInAs.innerHTML = "Logged In As:<br>" + window.localStorage.getItem("email");
}
