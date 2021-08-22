var loadHoursFromJSON = function() {
    var maxHours = 0;
    var maxHoursDate = "";
    var minHours = Infinity;
    var minHoursDate = "";

    $.getJSON("./js/hours.json", function(jsonData) {
        var years = Object.keys(jsonData).sort().reverse();
        $("#loading-box").hide();
        for (let y = 0; y < years.length; y++) {
            var months = Object.keys(jsonData[years[y]]).sort().reverse();
            for (let m = 0; m < months.length; m++) {
                $("#main").append(
                    $("<div>").addClass("blob month-view").append(
                        $("<h3>").html(monthNames[parseInt(months[m])] + " " + years[y]).css("font-size", "32px").attr("onclick", "showModal('#month-select')").css("cursor", "pointer")
                    ).append(
                        $("<div>").addClass("grid-container").attr("id", years[y] + "-" + months[m])
                    ).append(
                        $("<div>").addClass("prev button").attr("onclick", "switchView(1)").append(
                            $("<span>").text("❮")
                        )
                    ).append(
                        $("<div>").addClass("next button").attr("onclick", "switchView(-1)").append(
                            $("<span>").text("❯")
                        )
                    ).attr("id", years[y] + "-" + months[m] + "-blob")
                );

                $("#month-select-body").prepend($("<br>")).prepend($("<br>")).prepend(
                    $("<a>").html(monthNames[parseInt(months[m])] + " " + years[y]).addClass("link").attr("onclick", "showCalendar('" + years[y] + "-" + months[m] + "')")
                )

                var days = Object.keys(jsonData[years[y]][months[m]]).sort();
                var monthlyHourTotal = 0;

                $("#" + years[y] + "-" + months[m]).html(weekHTML);

                for (let d = 0; d < days.length; d++) {
                    var date = new Date(years[y] + "-" + months[m] + "-" + days[d]);
                    var totalHours = 0;

                    var index = date.getDay() + 2;
                    if (index > 7) { index = 1 }

                    $("#" + years[y] + "-" + months[m]).append(
                        $("<div>").addClass("grid-item").append(
                            $("<h3>").html(days[d])
                        ).attr("id", years[y] + "-" + months[m] + "-" + days[d]).css("grid-column-start", index + "")
                    );

                    if (jsonData[years[y]][months[m]][days[d]]["D"]) {
                        $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                            $("<h6>").html("Left: " + jsonData[years[y]][months[m]][days[d]]["D"]).css("font-weight", "bold")
                        );
                    }

                    if (jsonData[years[y]][months[m]][days[d]]["A"]) {
                        $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                            $("<h6>").html("Home: " + jsonData[years[y]][months[m]][days[d]]["A"]).css("font-weight", "bold")
                        );
                    }

                    if (jsonData[years[y]][months[m]][days[d]]["H"]) {
                        $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                            $("<h6>").html("Worked from home.").css("font-weight", "bold").css("color", "lime")
                        );
                    }

                    if (jsonData[years[y]][months[m]][days[d]]["gg"]) {
                        $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                            $("<h6>").html("G&G: " + jsonData[years[y]][months[m]][days[d]]["gg"] + " hours").css("font-weight", "normal")
                        );
                        totalHours += jsonData[years[y]][months[m]][days[d]]["gg"];
                    }

                    if (jsonData[years[y]][months[m]][days[d]]["bn"]) {
                        $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                            $("<h6>").html("Bruce: " + jsonData[years[y]][months[m]][days[d]]["bn"] + " hours").css("font-weight", "normal")
                        );
                        totalHours += jsonData[years[y]][months[m]][days[d]]["bn"];
                    }

                    if (jsonData[years[y]][months[m]][days[d]]["ag"]) {
                        $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                            $("<h6>").html("Alex: " + jsonData[years[y]][months[m]][days[d]]["ag"] + " hours").css("font-weight", "normal")
                        );
                        totalHours += jsonData[years[y]][months[m]][days[d]]["ag"];
                    }

                    var hourColour = "yellow";
                    if (totalHours == 0) {
                        hourColour = "red";
                    }
                    if (totalHours >= 8) {
                        hourColour = "orange";
                    }
                    $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                        $("<h6>").html("Total: " + totalHours + " hours").css("font-weight", "bold").css("color", hourColour)
                    );

                    if (jsonData[years[y]][months[m]][days[d]]["N"]) {
                        $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                            $("<h6>").html("Notes: " + jsonData[years[y]][months[m]][days[d]]["N"]).css("font-weight", "normal")
                        );
                    }

                    $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                        $("<button>").addClass("button").attr("onclick", "window.open('./hours.html?d=" + years[y] + "-" + months[m] + "-" + days[d] + "')").css("width", "100px").append(
                            $("<span>").html("Details")
                        )
                    );

                    if (totalHours > maxHours) {
                        maxHours = totalHours;
                        maxHoursDate = years[y] + "-" + months[m] + "-" + days[d]
                    } else if (totalHours < minHours && totalHours > 0) {
                        minHours = totalHours;
                        minHoursDate = years[y] + "-" + months[m] + "-" + days[d]
                    }
                    monthlyHourTotal += totalHours;
                }

                var monthBlob = $("#" + years[y] + "-" + months[m]);
                var monthlyAverage = monthlyHourTotal / days.length;
                monthBlob.append(
                    $("<div>").addClass("grid-item").append(
                        $("<h3>").html("Totals")
                    ).append(
                        $("<h6>").html(days.length + " days worked.").css("font-weight", "normal")
                    ).append(
                        $("<h6>").html(monthlyHourTotal + " hours worked.").css("font-weight", "normal")
                    ).append(
                        $("<h6>").html(monthlyAverage.toFixed(2) + " hours/day, average").css("font-weight", "bold").css("color", "yellow")
                    ).append(
                        $("<button>").addClass("button").attr("onclick", "window.open('time/gg/" + years[y] + "-" + months[m] + "-GG.png')").css("width", "100px").append(
                            $("<span>").html("G&G")
                        )
                    ).append(
                        $("<br>")
                    ).append(
                        $("<button>").addClass("button").attr("onclick", "window.open('time/bn/" + years[y] + "-" + months[m] + "-BN.pdf')").css("width", "100px").append(
                            $("<span>").html("Bruce")
                        )
                    )
                );
            }
        }
        console.log("Max hours: " + maxHours + " on " + maxHoursDate);
        console.log("Min hours: " + minHours + " on " + minHoursDate);
    }).then(() => {
        var d = new Date();
        var currentMonthID = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2);
        console.log(currentMonthID);
        showCalendar(currentMonthID);
    });
}

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

var weekHTML = "<div class='grid-item'><h2>Sunday</h2></div><div class='grid-item'><h2>Monday</h2></div><div class='grid-item'><h2>Tuesday</h2></div><div class='grid-item'><h2>Wednesday</h2></div><div class='grid-item'><h2>Thursday</h2></div><div class='grid-item'><h2>Friday</h2></div><div class='grid-item'><h2>Saturday</h2></div>"

var calIndex = 0;

function switchView(n) {
    showCalendars(calIndex += n);
}

function showCalendars(n) {
    var i;
    var cals = document.getElementsByClassName("month-view");
    calIndex = n;
    if (n >= cals.length) { calIndex = 0 }
    if (n < 0) { calIndex = cals.length - 1 }
    for (i = 0; i < cals.length; i++) {
        cals[i].style.display = "none";
    }
    cals[calIndex].style.display = "block";
}

function showCalendar(id) {
    var i;
    var cals = document.getElementsByClassName("month-view");
    var found = false;
    for (i = 0; i < cals.length; i++) {
        if (id + "-blob" == cals[i].id) {
            cals[i].style.display = "block";
            calIndex = i;
            found = true;
        } else {
            cals[i].style.display = "none";
        }
    }
    if (!found) {
        showCalendars(0);
        console.log("No data for specified month, defaulting to latest one.");
    }
}

function showModal(id) {
    $('#main').css('filter', 'blur(25px)');
    $(id).fadeIn();
    $(id).css('filter', 'none');
}

function hideModal(id) {
    $('#main').css('filter', 'none');
    $(".modal").fadeOut();
}

loadHoursFromJSON();