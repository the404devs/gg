function loadHistFromJSON() {
    $.getJSON("./js/data/BrowserHistory.json", function(jsonData) {
        let ids = [];
        jsonData.History.forEach(entry => {
            if (!ids.includes(entry.client_id)) {
                ids.push(entry.client_id);
            }
            let source = "";
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
    }).then(() => { getDateFromURL() });
}

function convertedDate(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp / 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const day = days[a.getDay()];
    const hour = ('0' + a.getHours()).slice(-2);
    const min = ('0' + a.getMinutes()).slice(-2);
    const sec = ('0' + a.getSeconds()).slice(-2);
    const time = day + ', ' + date + ' ' + month + ' ' + year + ', ' + hour + ':' + min + ':' + sec;
    return time;
}

function dateTagGen(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp / 1000);
    const year = a.getFullYear();
    const month = ('0' + (a.getMonth() + 1)).slice(-2);
    const date = ('0' + a.getDate()).slice(-2);
    const tag = year + "-" + month + "-" + date;
    return tag;
}

loadHistFromJSON();