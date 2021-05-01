var loadHistFromJSON = function() {
    $.getJSON("./js/BrowserHistory.json", function(jsonData) {
        // console.log(data)
        // var jsonData = JSON.parse(data);
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
        $("#loading-box").hide();
    });
    const urlParams = new URLSearchParams(window.location.search);
    const requestedDate = urlParams.get('d');
    console.log(requestedDate);
    scrollToElem(requestedDate);
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

loadHistFromJSON();