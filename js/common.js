function computeFooterMargin() { 
    var ch = document.getElementById("landingFooterUser").clientHeight;
    var ih = window.innerHeight;
    var sh = document.getElementById("mainContent").scrollHeight;
    if (ih - ch - sh > 0) document.getElementById("landingFooterUser").style.marginTop = (ih - ch - sh) + "px"; 
}

<<<<<<< HEAD
function confirmLogin() {
	if(!window.localStorage.getItem("user_id") || window.localStorage.getItem("user_id") == 'null' ){
		window.location.href = "http://project01.cse.nd.edu/tommy/Titanium/index.html#";
	} 
}
=======

>>>>>>> 7cfaa5b52bdec4bc525ab4077d7f5c6b6f340ace
