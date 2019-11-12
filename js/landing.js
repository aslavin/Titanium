function initialize() {
    document.getElementById("recSportsVideo").play();
}

function playVideoAgain() {
    document.getElementById("recSportsVideo").currentTime = 0;
    document.getElementById("recSportsVideo").play();
}
