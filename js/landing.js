function initialize() {
    document.getElementById("recSportsVideo").play();
}

function playVideoAgain() {
    document.getElementById("recSportsVideo").currentTime = 0;
    document.getElementById("recSportsVideo").play();
}

function populateModal(loginText, isAdmin) { 
    
    clearAllAlerts();

    var modalAction = document.getElementsByClassName("modalAction");
    for (var i = 0; i < modalAction.length; i++) { 
        modalAction[i].innerHTML = loginText;
    }
    if (isAdmin) document.getElementById("adminCheckbox").checked = true;
    else document.getElementById("adminCheckbox").checked = false;

    var formClasses = document.getElementsByClassName("form-control");
    for (var j = 0; j < formClasses.length; j++) { 
        formClasses[j].value = "";
    } 
}

/* The following function activates only a single alert after login.
Here are the options for the single STRING parameter:

CREATE:

"invalidEmailFormat" -- handled by frontend already -- email does not contain @ followed by .
"emailAlreadyExists" -- TODO #1 implementation -- email does not exist in database yet
"weakPassword" -- handled by frontend already -- password is less than 8 chars, or does not containletters, or does not contain numbers
"successfulCreation" -- TODO #2 implementation -- email did not exist in database before, and does now 

LOGIN: 
"invalidEmail" -- TODO #3 implementation -- email does not exist in selected database (student or admin)
"invalidPassword" -- TODO #4 implementation -- email does exist in db, but invalid password pw

Scroll down to see where to implement these.    
    
*/

function activateSingleAlert(alertId) {
    var alerts = document.getElementsByClassName("alert");
    var alertToDelete = 0;
    for (var i = 0; i < alerts.length; i++) {
        console.log(alerts[i].id, alertId);
        if (alerts[i].id == alertId) {
            alerts[i].style.display = "block";
            alertToDelete = i;
        }
        else alerts[i].style.display = "none";
    }
}

function clearAllAlerts() {
    var alerts = document.getElementsByClassName("alert");
    for (var i = 0; i < alerts.length; i++) { 
        alerts[i].style.display = "none";
    }
}

function loginOrAccountCreate(isAdmin) {
    if (document.getElementById("createOrLoginBtn").innerHTML == "Log In") loginValidation(isAdmin);
    else accountCreateValidation(isAdmin);
}

/* in the functions below, isAdmin is boolean + can be used to figure out how to filter users db 
(either for normal users or those w admin status) */
function accountCreateValidation(isAdmin) { 
    
    clearAllAlerts();

    var email = document.getElementById("userEmail").value;
    var atIndex = email.indexOf("@");
    var dotIndex = email.indexOf(".");

    var password = document.getElementById("userPassword").value;
    var hasLetters = false;
    var hasNumbers = false;

    for (var i = 0; i < password.length; i++) { 
        var c = password.charCodeAt(i);
        if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) hasLetters = true;
        else if (c >= 48 && c <= 57) hasNumbers = true;
    } 


    /* db queries, etc. could go here. */
    

    if (atIndex < 0 || dotIndex < 0 || dotIndex - atIndex <= 1) activateSingleAlert("invalidEmailFormat");
    else if (ineffectivePassword(password, hasLetters, hasNumbers)) activateSingleAlert("weakPassword");

    /* TODO: CONNECT TO BACKEND HERE */

    /* TODO #1: throw "emailAlreadyExists" alert if email already exists in db. activateSingleAlert("emailAlreadyExists") */
    /* TODO #2: throw "successfulCreation" alert if email did not exist in db. Follow same pattern*/
}

function ineffectivePassword(password, hasLetters, hasNumbers) { 
    return (password.length < 8 || !hasLetters || !hasNumbers);
}

function loginValidation(isAdmin)  {

    clearAllAlerts();
    var email = document.getElementById("userEmail").value;
    var password = document.getElementById("userPassword").value;

    /* TODO: connect to backend here */

    /* TODO #3: throw "invalidEmail" alert if email does not exist in db */
    /* TODO #4  throw "invalidPassword" alert if email exists in db but password is incorrect.*/

}
