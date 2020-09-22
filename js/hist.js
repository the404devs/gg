var loadHistFromJSON = function() {
    var request = new XMLHttpRequest();
    request.open("GET", "./js/BrowserHistory.json", false);
    request.overrideMimeType("application/json");
    request.send(null);
    var jsonData = JSON.parse(request.responseText);
    // console.log(jsonData);
    // console.log(jsonData.History[0]);

    var ids = [];

    jsonData.History.forEach(entry => {
        if (!ids.includes(entry.client_id)) {
            ids.push(entry.client_id);
        }
        var source = "";
        if (entry.client_id == "GOsaQkbKv2pHIBa4tKCfHA==") {
            source = "Phone";
        } else if (entry.client_id == "WU91epkrKwLcHbD0DQGQnw==") {
            source = "Home PC"
        } else {
            source = "Unknown"
        }
        $("#main").append(
            $("<div>").addClass("blob").append(
                $("<h3>").html(entry.title)
            ).append(
                $("<h5>").html(convertedDate(entry.time_usec))
            ).append(
                $("<h5>").html("Accessed from: <b>" + source + "</b>")
            ).append(
                $("<a>").attr("href", entry.url).html(entry.url)
            ).attr("id", dateTagGen(entry.time_usec))
        );
    });
}

var convertedDate = function(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp / 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var day = days[a.getDay()];
    var hour = ('0' + a.getHours()).slice(-2);
    var min = ('0' + a.getMinutes()).slice(-2);
    var sec = ('0' + a.getSeconds()).slice(-2);
    var time = day + ', ' + date + ' ' + month + ' ' + year + ', ' + hour + ':' + min + ':' + sec;
    return time;
}

var dateTagGen = function(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp / 1000);
    var year = a.getFullYear();
    var month = ('0' + (a.getMonth() + 1)).slice(-2);
    var date = ('0' + a.getDate()).slice(-2);
    var tag = year + "-" + month + "-" + date;
    return tag;
}

var scrollToElem = function(id) {
    console.log(id);
    var elem = document.getElementById(id);
    if (elem == null) {
        $("#errmsg").css("opacity", "1");
        setTimeout(() => { $("#errmsg").css("opacity", "0"); }, 2000);
        return;
    }
    var offset = elem.offsetTop - 0;
    window.scrollTo({
        top: offset,
        behavior: "smooth"
    });
}



loadHistFromJSON();