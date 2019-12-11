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
