/* TODO: gather player notification data and store it in playerNotifications as below. */
/* TODO: gather pending notification data and store it in pendingNotifications as below. */
/* TODO: gather captain notification data and store it in captainNotifications as below. *//

// EXAMPLES for how to store (FOLLOW EXACTLY):

var playerNotifications = [["","Brian Hall", "","Newfs", "", "Indoor Volleyball - CoRec"],["","Rosie Crisman", "", "Blue Bar", "","Bookstore Basketball - CoRec"],["","Will Huffman","", "Boolin Boys", "", "Springtime Curling - Intramural"]]; // indexed by CAPTAIN LINK - CAPTAIN  - TEAM LINK - TEAM  - LEAGUE LINK - LEAGUE
var pendingNotifications = [["","Andy Slavin", "", "Jump Rope Nation"]]; // indexed by CAPTAIN LINK - CAPTAIN - TEAM LINK - TEAM
var captainNotifications = [["","Noah Davis", "", "Andy's Army"]]; // indexed by PLAYER LINK - PLAYER - YOUR TEAM LINK - YOUR TEAM
 

var gameNotifications = [["10/23", "","Broomball Co-Rec", "","Broom Roasted", "3","1", "10:30pm", "10:30pm", "", "Broom Roasted", "3", "1", "","Stix Or It Didn't Happen", "2", "2", "Compton Family Ice Arena"]];
// indexed by DATE - LEAGUE LINK - LEAGUE - TEAM 1 LINK - TEAM 1 - TEAM 1 WINS - TEAM 1 LOSSES - TIME - TIME - TEAM 1 LINK - TEAM 1 - TEAM 1 WINS - TEAM 1 LOSSES - TEAM 2 LINK - TEAM 2 WINS - TEAM 2 LOSSES - LOCATION


/* DONE: MAKE HTML COMPONENTS for everythiNG */

var playerMessageComponents = ['<div class="notificationMessage" id="playerNotificationMessage',
'"><div class="row"><div class="col-lg-10 col-md-9 col-sm-8 col-6"><div class="notificationTextDiv"><span class="notificationText"><a class="userLink" href="',
'">',
'</a> invited you to join <a class="userLink" href="',
'">',
'</a> in <a class="userLink" href="',
'">',
'</a>!</span></div></div><div class="col-lg-2 col-md-3 col-sm-4 col-6"><div class="buttonFlexbox"><button class="notificationResponse btn btn-info" id="playerAcceptInvitation', 
'" onclick="playerAcceptInvitation(this.id)">ACCEPT</button><div class="d-block d-sm-none"><br></div><button class="notificationResponse btn btn-danger" id="playerDenyInvitation','" onclick="playerDenyInvitation(this.id)">DENY</button></div></div></div></div>'];

var pendingMessageComponents = ['<div class="notificationMessage" id="pendingNotificationMessage',
    '"><div class="row"><div class="col-lg-11 col-md-10 col-9"><div class="notificationTextDiv"><span class="notificationText">Waiting for captain (<a class="userLink" href="',
    '">',
    '</a>) to approve your request to join <a href="',
    '" class="userLink">',
    '</a>!</span></div></div><div class="col-lg-1 col-md-2 col-3"><div class="buttonFlexbox"><button id="dismissPendingBtn',
    '" class="notificationResponse btn btn-warning" onclick="dismissPendingInvitation(this.id)">DISMISS</button></div></div></div></div>'];

var captainMessageComponents = ['<div class="notificationMessage" id="captainNotificationMessage',
'"><div class="row"><div class="col-lg-9 col-md-8 col-7"><div class="notificationTextDiv"><span class="notificationText"><a href="',
'" class="userLink">',
'</a> has requested to join your team <a href="',
'" class="userLink">',
'</a>!</span></div></div><div class="col-lg-3 col-md-4 col-5"><div class="buttonFlexbox"><button class="notificationResponse btn btn-info" id="captainAcceptBtn',
'" onclick="captainAcceptInvitation(this.id)">ACCEPT</button><button class="notificationResponse btn btn-danger" id="captainDenyBtn',
'" onclick="captainDenyInvitation(this.id)">DENY</button></div></div></div></div>'];

var gameComponents = ['<div class="card"><div class="card-header" id="heading',
'"><div class="row"><div class="col-sm-2 col-3"><div class="gameDiv"><div class="gameDateText">',
'</div></div></div><div class="col-sm-8 col-6"><div class="gameDiv"><div class="gameLeagueText"><a class="userLink" href="',
'">',
'</a></div></div></div><div class="col-sm-2 col-3"><div class="gameDiv"><div class="gameExpandText"><button onclick="changeExpandIcon(this.id)" id="gameExpandBtn',
'" class="btn btn-link expand gameExpandBtn" type="button" data-toggle="collapse" data-target="#collapse',
'" aria-expanded="true" aria-controls="collapse',
'"><i class="fa fa-caret-down"></i></button></div></div></div></div></div><div id="collapse',
'" class="collapse" aria-labelledby="heading',
'" data-parent="#gameAccordion"><div class="card-body"><div class="row"><div class="col-md-5 col-12"><div class="leftGameBody"><div class="leftGameBodyLarge d-none d-lg-block"><div class="myTeamName"><a class="userLink" href="',
'">',
' (<span class="myTeamWins">',
'</span> - <span class="myTeamLosses">',
'</span>)</a></div><div class="gameTime">',
'</div></div><div class="leftGameBodySmall d-block d-lg-none"><div class="gameTime">',
'</div><div class="myTeamName"><a class="userLink" href="',
'">',
' (<span class="myTeamWins">',
'</span> - <span class="myTeamLosses">',
'</span>)</a></div></div></div></div><div class="col-md-2 col-12"><div class="centerGameBody"><span class="versus">VS.</span></div></div><div class="col-md-5 col-12"><div class="rightGameBody"><div class="oppTeamName"><a class="userLink" href="',
'">',
'(<span class="oppTeamWins">',
'</span> - <span class="oppTeamLosses">',
'</span>)</a></div><div class="gameLocation">',
'</div></div></div></div></div></div></div>'
]


var playerNoNotification = '<div class="noNotificationsMessage">No player notifications! If you get invited to or request to join a team, your status will appear here.</div>';
var pendingNoNotification = '<div class="noNotificationsMessage">No pending notifications! Information about teams you\'ve requested to join will appear here.</div>';
var captainNoNotification = '<div class="noNotificationsMessage">No captain notifications! If you are the captain of any team(s), requests to join your team(s), as well as the status of any prior invitations you\'ve sent out will appear here.</div';
var gameNoNotification = '<div class="noNotificationsMessage">No upcoming games! To request membership of a new team, search for it by name with the \'Search\' feature above.</div></div>';

function loadData() { 


    /* EXECUTE TODO items here. Connect to backend, manipulate playerNotifications, pendingNotifications, captainNotifications, gameNotifications
    variables as described above, EXACTLY. */


    var playersNotificationMessages = document.getElementById("playersNotificationMessages");
    var pendingNotificationMessages = document.getElementById("pendingNotificationMessages");
    var captainNotificationMessages = document.getElementById("captainNotificationMessages");
    var games = document.getElementById("gameAccordion");

    /* DONE: LOAD PLAYER NOTIFICATION DATA */

    document.getElementById("nPlayerNotifications").innerHTML = playerNotifications.length ? playerNotifications.length : "";
    if (playerNotifications.length == 0) playersNotificationMessages.innerHTML = playerNoNotification;
    for (var i = 0; i < playerNotifications.length; i++) { 
        playersNotificationMessages.innerHTML += playerMessageComponents[0] + i + playerMessageComponents[1] + playerNotifications[i][0] + playerMessageComponents[2]  + playerNotifications[i][1] + playerMessageComponents[3] + playerNotifications[i][2] + playerMessageComponents[4] + playerNotifications[i][3] + playerMessageComponents[5] + playerNotifications[i][4] + playerMessageComponents[6] + playerNotifications[i][5]+ playerMessageComponents[7] + i + playerMessageComponents[8] + i + playerMessageComponents[9];
    }


    /* DONE: LOAD PENDING NOTIFICATION DATA */

    document.getElementById("nPendingNotifications").innerHTML = pendingNotifications.length ? pendingNotifications.length : "";
    if (pendingNotifications.length == 0) pendingNotificationMessages.innerHTML = pendingNoNotification;
    for (var j = 0; j < pendingNotifications.length; j++) { 
        pendingNotificationMessages.innerHTML += pendingMessageComponents[0] + j + pendingMessageComponents[1] + pendingNotifications[j][0] + pendingMessageComponents[2]  + pendingNotifications[j][1] + pendingMessageComponents[3] + pendingNotifications[j][2] + pendingMessageComponents[4] + pendingNotifications[j][3] + pendingMessageComponents[5] + j + pendingMessageComponents[6];
    }


    /* DONE: LOAD CAPTAIN NOTIFICATION DATA */
    document.getElementById("nCaptainNotifications").innerHTML = captainNotifications.length ? captainNotifications.length : "";
    if (captainNotifications.length == 0) captainNotificationMessages.innerHTML = captainNoNotification;
    for (var k = 0; k < captainNotifications.length; k++) { 
        captainNotificationMessages.innerHTML += captainMessageComponents[0] + k + captainMessageComponents[1] + captainNotifications[k][0] + captainMessageComponents[2] + captainNotifications[k][1] + captainMessageComponents[3] + captainNotifications[k][2] + captainMessageComponents[4] + captainNotifications[k][3] + captainMessageComponents[5] + k + captainMessageComponents[6] + k + captainMessageComponents[7];
    }



    /* DONE: LOAD GAME DATA */
    if (gameNotifications.length == 0) games.innerHTML = gameNoNotification;
    for (var l = 0; l < gameNotifications.length; l++) { 
        games.innerHTML += gameComponents[0] + l + gameComponents[1] + gameNotifications[l][0] + gameComponents[2] + gameNotifications[l][1] + gameComponents[3] + gameNotifications[l][2] + gameComponents[4] + l + gameComponents[5] + l + gameComponents[6] + l + gameComponents[7] + l + gameComponents[8] + l + gameComponents[9] + gameNotifications[l][3] +   gameComponents[10] + gameNotifications[l][4] + gameComponents[11] + gameNotifications[l][5] + gameComponents[12] + gameNotifications[l][6] + gameComponents[13] + gameNotifications[l][7] + gameComponents[14] + gameNotifications[l][8] + gameComponents[15] + gameNotifications[l][9] + gameComponents[16] + gameNotifications[l][10] + gameComponents[17] + gameNotifications[l][11] +  gameComponents[18] + gameNotifications[l][12] + gameComponents[19] + gameNotifications[l][13] + gameComponents[20] + gameNotifications[l][14] + gameComponents[21] + gameNotifications[l][15] + gameComponents[22] + gameNotifications[l][16] + gameComponents[23] + gameNotifications[l][17] + gameComponents[24];
    }


}

function changeExpandIcon(id) { 

    var currActiveElement = document.getElementsByClassName("gameExpandBtn");

    for (var i = 0; i < currActiveElement.length; i++) {
        if (currActiveElement[i].id == id && currActiveElement[i].children[0].classList.contains("fa-caret-down")) { 
            changeElementClass(currActiveElement[i].children[0], "fa-caret-down", "fa-caret-up");
        } else { 
            changeElementClass(currActiveElement[i].children[0], "fa-caret-up","fa-caret-down");
        }  
    } 
}

function changeElementClass(element, from, to) { 
    element.classList.remove(from);
    element.classList.add(to);
}


function changeBtnGroup(id) { 
    var notificationButtons = document.getElementById("notificationBtns").children;
    for (var i = 0; i < notificationButtons.length; i++) {  
        if (notificationButtons[i].id == id) { 
            notificationButtons[i].classList.remove("notificationUnpressed");
            notificationButtons[i].classList.add("notificationPressed");
        } else { 
             notificationButtons[i].classList.remove("notificationPressed");
            notificationButtons[i].classList.add("notificationUnpressed");           
        }
    }

    var notificationMessages = document.getElementsByClassName("notificationMessages");
    for (var j = 0; j < notificationMessages.length; j++) {
        notificationMessages[j].style.display = "none"; 
    }

    var buttonSubstr = id.substring(0, 7);
    document.getElementById(buttonSubstr + "NotificationMessages").style.display = "block";
}


/* MOSTLY DONE: HELPER FUNCTIONS FOR ACCEPTING, DENYING, DISMISSING NOTIFICATIONS */

function playerAcceptInvitation(id) { 
    var playerNotifications = document.getElementById("nPlayerNotifications");
    playerNotifications.innerHTML -= 1;
    if (playerNotifications.innerHTML <= 0) { 
        playerNotifications.style.display = "none";
        document.getElementById("playersNotificationMessages").innerHTML = playerNoNotification;

    }

    /* TODO: connect to backend to add current user to team. Hold off on this for a little while. */

    else document.getElementById(id).parentElement.parentElement.parentElement.parentElement.style.display = "none"; 
}


function playerDenyInvitation(id) {

   
    var playerNotifications = document.getElementById("nPlayerNotifications");
    playerNotifications.innerHTML -= 1;
    if (playerNotifications.innerHTML <= 0) { 
        playerNotifications.style.display = "none";
        document.getElementById("playersNotificationMessages").innerHTML = playerNoNotification;
    } else document.getElementById(id).parentElement.parentElement.parentElement.parentElement.style.display = "none"; 

}

function captainAcceptInvitation(id) {
    var captainNotifications = document.getElementById("nCaptainNotifications"); 
    captainNotifications.innerHTML -= 1;
    if (captainNotifications.innerHTML <= 0) { 
        captainNotifications.style.display = "none";
        document.getElementById("captainNotificationMessages").innerHTML = captainNoNotification;
    
    /* TODO: connect to backend to add the requested player to the captain's team. Hold off on this for a little while. */ 

    } else document.getElementById(id).parentElement.parentElement.parentElement.parentElement.style.display = "none";
}

function captainDenyInvitation(id) {
    var captainNotifications = document.getElementById("nCaptainNotifications");
    captainNotifications.innerHTML -= 1;
    if (captainNotifications.innerHTML <= 0) {
        captainNotifications.style.display = "none";
        document.getElementById("captainNotificationMessages").innerHTML = captainNoNotification;
    } else document.getElementById(id).parentElement.parentElement.parentElement.parentElement.style.display = "none";
}

function dismissPendingInvitation(id) { 

    var pendingNotifications = document.getElementById("nPendingNotifications");
    pendingNotifications.innerHTML -= 1;
    if (pendingNotifications.innerHTML <= 0) { 
        document.getElementById("pendingNotificationMessages").innerHTML = pendingNoNotification;
        pendingNotifications.style.display = "none";
    } else document.getElementById(id).parentElement.parentElement.parentElement.parentElement.style.display = "none"; 
}

