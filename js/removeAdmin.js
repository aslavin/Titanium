function removeAdmin(){
    var userId = window.localStorage.getItem("user_id");

    if(userId == null){
        console.error("no userId specified");
    }

    var xhr = new XMLHttpRequest();
    var url = 'http://project01.cse.nd.edu:51069/users/' + userId;
    xhr.open('GET', url, false);
    xhr.onload = function(e){
        if (xhr.readyState != 4){
            console.error(xhr.statusText);
        }
        var r = JSON.parse(xhr.response);
        if(r.is_admin != "1"){
            document.getElementById('admin_nav').remove();
        }
    }
    xhr.send();
}
