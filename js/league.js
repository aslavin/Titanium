var leagueData = [["","Sun","7:00p"],["","Sun","8:00p"],["","Mon","7:00p"],["","Tues","8:00p"],["","Wed","2:30p"]];

var leagueLeagueComponents = ['<div class="col-6 col-md-4 col-lg-3 leaguePoolCol"><a class="imageLink" href="',
    '"><div class="leaguePool"><span class="leagueDescription">',
    '</span><span class="leagueDescription">',
    '</span></div></a></div>'
];

function loadData() { 
    for (var i = 0; i < leagueData.length; i++) { 
        document.getElementById("leaguePools").innerHTML += leagueLeagueComponents[0] + leagueData[i][0] + leagueLeagueComponents[1] + leagueData[i][1] + leagueLeagueComponents[2] + leagueData[i][2] + leagueLeagueComponents[3];
    }

    var nPoolsAvailable = document.getElementById("poolsAvailable").innerHTML;
    if (nPoolsAvailable == 0) document.getElementById("noMoreSpaceAlert").style.display = "block";
   
    var ch = document.getElementById("landingFooterUser").clientHeight;
    var ih = window.innerHeight;
    var sh = document.getElementById("mainContent").scrollHeight;
    if (ih - ch - sh > 0) {
        document.getElementById("landingFooterUser").style.marginTop = (ih - ch - sh) + "px"; 
        console.log(document.getElementById("landingFooterUser").style.marginTop);
    } 

}
