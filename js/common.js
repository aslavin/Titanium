var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function computeFooterMargin() { 
    var ch = document.getElementById("landingFooterUser").clientHeight;
    var ih = window.innerHeight;
    var sh = document.getElementById("mainContent").scrollHeight;
    if (ih - ch - sh > 0) document.getElementById("landingFooterUser").style.marginTop = (ih - ch - sh) + "px"; 
}

function confirmLogin() {
	if(!window.localStorage.getItem("user_id") || window.localStorage.getItem("user_id") == 'null' ){
		window.location.href = "./index.html#";
	} 
}


function readableTimeFromSQLDate(timeString) { // 2020-02-03 18:00:00 
    console.log(timeString);
    var timePortion = timeString.split(" ")[1];
    var militaryTime = timePortion.split(":")
    var militaryHours = militaryTime[0];
    var militaryMinutes = militaryTime[1];
    var readableHours = (militaryHours > 12) ? militaryHours - 12 : militaryHours;
    var amOrPm = (militaryHours > 11) ? "pm" : "am"; 
    return readableHours + ":" + militaryMinutes + amOrPm; 
}

function readableDateFromSQLDate(dateString) { // 2020-02-03 
    var dateList = dateString.split("-");
    var monthName = monthNames[dateList[1]-1];
    var monthDay = parseInt(dateList[2]);
    
    return monthName + " " + monthDay; 
}  


