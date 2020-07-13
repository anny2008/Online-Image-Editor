function getCurrentDateTime() {
    let currentTime = new Date();
    let formattedTime = '' + currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1) + '-' + currentTime.getDate()
        + ' ' + currentTime.getHours() + ':' + (currentTime.getMinutes() + 1) + ':' + currentTime.getSeconds();
    return formattedTime;
}

function sendEventLogin(eventLogin) {
    $.ajax({
        type: "POST",
        url: "./sendlog",
        data: "&event=UserLogin&user=" + eventLogin.user + "&action=" + eventLogin.action + "&time=" + eventLogin.time,
        dataType: "html",
        success: function (response) {
            console.log(response);
        },
        error: function (e) {
            console.log(e.message);
        }
    });
}


function sendEventOpenImage(eventLogin) {
    let userID = getUserID();
    if(!userID)
        return;
    $.ajax({
        type: "POST",
        url: "./sendlog",
        data: "&event=OpenImage&user=" + userID + "&source=" + eventLogin.source + "&width=" + eventLogin.width + "&height=" + eventLogin.height + "&time=" + eventLogin.time,
        dataType: "html",
        success: function (response) {
            console.log(response);
        },
        error: function (e) {
            console.log(e.message);
        }
    });
}