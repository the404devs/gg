var loadHoursFromJSON = function() {
    $.getJSON("./js/hours.json", function(jsonData) {

        var years = Object.keys(jsonData).sort();
        for (let y = 0; y < years.length; y++) {
            $("#main").append($("<div>").addClass("blob").attr("id", years[y]).append($("<h3>").html(years[y])))
            var months = Object.keys(jsonData[years[y]]).sort();
            for (let m = 0; m < months.length; m++) {
                $("#" + years[y]).append($("<div>").addClass("blob").attr("id", years[y] + "-" + months[m]).append($("<h3>").html(monthNames[parseInt(months[m])] + " " + years[y])));
                var days = Object.keys(jsonData[years[y]][months[m]]).sort();
                for (let d = 0; d < days.length; d++) {
                    var date = new Date(years[y] + "-" + months[m] + "-" + days[d]);
                    $("#" + years[y] + "-" + months[m]).append(
                        $("<div>").addClass("blob").append(
                            $("<h3>").html(years[y] + "-" + months[m] + "-" + days[d] + " (" + weekdays[date.getDay()] + ")")
                        ).append(
                            $("<h6>").html("G&G: " + jsonData[years[y]][months[m]][days[d]]["gg"] + " hours")
                        ).attr("id", years[y] + "-" + months[m] + "-" + days[d])
                    );
                }
            }
        }
    });
}





var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.responseText);
        } else {
            callback(status, xhr.responseText);
        }
    };
    xhr.send();
};

var weekdays = {
    "0": "Monday",
    "1": "Tuesday",
    "2": "Wednesday",
    "3": "Thursday",
    "4": "Friday",
    "5": "Saturday",
    "6": "Sunday"
}

var monthNames = {
    "1": "January",
    "2": "February",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
    "10": "October",
    "11": "November",
    "12": "December"
}

loadHoursFromJSON();