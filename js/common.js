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
