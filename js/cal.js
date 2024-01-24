function loadHoursFromJSON() {
    let maxHours = 0;
    let maxHoursDate = "";
    let minHours = Infinity;
    let minHoursDate = "";

    $.getJSON("./js/data/hours.json", function(jsonData) {
        const years = Object.keys(jsonData).sort().reverse();
        $("#loading-box").hide();
        for (let y = 0; y < years.length; y++) {
            let maxYearlyHours = 0;
            let minYearlyHours = Infinity;
            let maxYearlyHoursDate = "";
            let minYearlyHoursDate = "";
            const months = Object.keys(jsonData[years[y]]).sort().reverse();
            for (let m = 0; m < months.length; m++) {
                $("#main").append(
                    $("<div>").addClass("blob month-view").append(
                        $("<div>").addClass("prev button")
                        .attr("onclick", "switchView(1)")
                        .append(
                            $("<span>").text("❮")
                        )
                    ).append(
                        $("<div>").addClass("next button")
                        .attr("onclick", "switchView(-1)")
                        .append(
                            $("<span>").text("❯")
                        )
                    ).append(
                        $("<h3>").addClass("cal-month-head")
                        .attr("onclick", "showModal('#month-select')")
                        .attr("title", "Click to Select Month")
                        .html(monthNames[parseInt(months[m])] + " " + years[y])
                    ).append(
                        $("<div>").addClass("grid-container")
                        .attr("id", years[y] + "-" + months[m])
                    ).append(
                        $("<div>").addClass("prev bottom button")
                        .attr("onclick", "switchView(1)")
                        .append(
                            $("<span>").text("❮")
                        )
                    ).append(
                        $("<div>").addClass("next bottom button")
                        .attr("onclick", "switchView(-1)")
                        .append(
                            $("<span>").text("❯")
                        )
                    ).attr("id", years[y] + "-" + months[m] + "-blob")
                );

                $("#month-select-body")
                    .prepend($("<br>"))
                    .prepend($("<br>"))
                    .prepend(
                        $("<a>").addClass("link")
                        .attr("onclick", "showCalendar('" + years[y] + "-" + months[m] + "')")
                        .html(monthNames[parseInt(months[m])] + " " + years[y])
                    )

                const days = Object.keys(jsonData[years[y]][months[m]]).sort();
                let monthlyHourTotal = 0;
                let numberOfNAVGDays = 0;

                $("#" + years[y] + "-" + months[m]).html(weekHTML);

                for (let d = 0; d < days.length; d++) {
                    const dateId = years[y] + "-" + months[m] + "-" + days[d];
                    const date = new Date(dateId);
                    const dateData = jsonData[years[y]][months[m]][days[d]];

                    let totalHours = 0;

                    let index = date.getDay() + 2;
                    if (index > 7) { index = 1 }

                    $("#" + years[y] + "-" + months[m]).append(
                        $("<div>").addClass("grid-item").append(
                            $("<h3>").html(days[d]).addClass("cal-day")
                        ).attr("id", dateId).css("grid-column-start", index + "")
                    );

                    if (dateData["D"]) {
                        $("#" + dateId).append(
                            $("<h6>").html("Work: " + dateData["D"]).addClass('cal-d')
                        );
                    }

                    if (dateData["A"]) {
                        $("#" + dateId).append(
                            $("<h6>").html("Home: " + dateData["A"]).addClass('cal-a')
                        );
                    }

                    if (dateData["H"]) {
                        $("#" + dateId).append(
                            $("<h6>").html("WFH").addClass('cal-h')
                        );
                    }

                    if (dateData["gg"]) {
                        $("#" + dateId).append(
                            $("<h6>").html("G&G: " + dateData["gg"] + " hours").addClass('cal-gg')
                        );
                        totalHours += dateData["gg"];
                    }

                    if (dateData["bn"]) {
                        $("#" + dateId).append(
                            $("<h6>").html("Bruce: " + dateData["bn"] + " hours").addClass('cal-bn')
                        );
                        totalHours += dateData["bn"];
                    }

                    if (dateData["ag"]) {
                        $("#" + dateId).append(
                            $("<h6>").html("Alex: " + dateData["ag"] + " hours").addClass('cal-ag')
                        );
                        totalHours += dateData["ag"];
                    }

                    if (dateData["ge"]) {
                        $("#" + dateId).append(
                            $("<h6>").html("Gold: " + dateData["ge"] + " hours").addClass('cal-ge')
                        );
                        totalHours += dateData["ge"];
                    }

                    let hourColour = "yellow";
                    if (totalHours == 0) {
                        hourColour = "red";
                    }
                    if (totalHours >= 7) {
                        hourColour = "orange";
                    }
                    $("#" + dateId).append(
                        $("<h6>").html("Total: " + totalHours + " hours").addClass('cal-t')
                    );

                    if (dateData["N"]) {
                        $("#" + dateId).append(
                            $("<h6>").html("Notes: " + dateData["N"]).addClass('cal-n')
                        );
                    }

                    // $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                    //     $("<button>").addClass("button").attr("onclick", "window.open('./hours.html?d=" + years[y] + "-" + months[m] + "-" + days[d] + "')").css("width", "100px").append(
                    //         $("<span>").html("Details")
                    //     )
                    // );

                    if (totalHours > maxYearlyHours) {
                        maxYearlyHours = totalHours;
                        maxYearlyHoursDate = dateId;
                    } else if (totalHours < minYearlyHours && totalHours > 0) {
                        minYearlyHours = totalHours;
                        minYearlyHoursDate = dateId;
                    }

                    if (totalHours > maxHours) {
                        maxHours = totalHours;
                        maxHoursDate = dateId
                    } else if (totalHours < minHours && totalHours > 0) {
                        minHours = totalHours;
                        minHoursDate = dateId
                    }

                    if (!dateData["NAVG"]) {
                        monthlyHourTotal += totalHours;
                    } else {
                        numberOfNAVGDays++;
                        $("#" + dateId).append(
                            $("<h6>").html("This day is not included in the monthly average.").addClass('cal-navg')
                        );
                    }

                    if (date >= new Date("2017-03-19")) {
                        $("#" + dateId).append(
                            $("<button>").addClass("button").attr("onclick", "window.open('./map.html?d=" + dateId + "')").append(
                                $("<span>").html("Map")
                            )
                        )
                    }
                }

                const monthBlob = $("#" + years[y] + "-" + months[m]);
                const monthlyAverage = monthlyHourTotal / (days.length - numberOfNAVGDays);
                console.log(years[y] + "-" + months[m] + ": " + monthlyAverage.toFixed(2));
                monthBlob.append(
                    $("<div>").addClass("grid-item").append(
                        $("<h3>").html("Totals").addClass('cal-day')
                    ).append(
                        $("<h6>").html((days.length - numberOfNAVGDays) + " days worked.").css("font-weight", "normal")
                    ).append(
                        $("<h6>").html(monthlyHourTotal + " hours worked.").css("font-weight", "normal")
                    ).append(
                        $("<h6>").html(monthlyAverage.toFixed(2) + " hours/day, average").css("font-weight", "bold")
                    ).append(
                        $("<button>").addClass("button").attr("onclick", "window.open('time/gg/" + years[y] + "-" + months[m] + "-GG.pdf')").append(
                            $("<span>").html("G&G")
                        )
                    ).append(
                        $("<button>").addClass("button").attr("onclick", "window.open('time/bn/" + years[y] + "-" + months[m] + "-BN.pdf')").append(
                            $("<span>").html("Bruce")
                        )
                    )
                );
            }
            console.log("%c" + years[y] + " max hours: " + maxYearlyHours + " on " + maxYearlyHoursDate, "color: lightgreen;");
            console.log("%c" + years[y] + " min hours: " + minYearlyHours + " on " + minYearlyHoursDate, "color: pink;");
            console.log("------------------");
        }
        console.log("Max hours: " + maxHours + " on " + maxHoursDate);
        console.log("Min hours: " + minHours + " on " + minHoursDate);
    }).then(() => {
        const d = new Date();
        const currentMonthID = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2);
        // console.log(currentMonthID);
        showCalendar(currentMonthID);
    });
}

const weekdays = {
    "0": "Monday",
    "1": "Tuesday",
    "2": "Wednesday",
    "3": "Thursday",
    "4": "Friday",
    "5": "Saturday",
    "6": "Sunday"
}

const monthNames = {
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

const weekHTML = "<div class='grid-item weekday'><h2>Sunday</h2></div><div class='grid-item weekday'><h2>Monday</h2></div><div class='grid-item weekday'><h2>Tuesday</h2></div><div class='grid-item weekday'><h2>Wednesday</h2></div><div class='grid-item weekday'><h2>Thursday</h2></div><div class='grid-item weekday'><h2>Friday</h2></div><div class='grid-item weekday'><h2>Saturday</h2></div>"

let calIndex = 0;

function switchView(n) {
    showCalendars(calIndex += n);
}

function showCalendars(n) {
    let i;
    const cals = document.getElementsByClassName("month-view");
    calIndex = n;
    if (n >= cals.length) { calIndex = 0 }
    if (n < 0) { calIndex = cals.length - 1 }
    for (i = 0; i < cals.length; i++) {
        cals[i].classList.remove("active");
    }
    cals[calIndex].classList.add("active");
}

function showCalendar(id) {
    let i;
    const cals = document.getElementsByClassName("month-view");
    let found = false;
    for (i = 0; i < cals.length; i++) {
        if (id + "-blob" == cals[i].id) {
            cals[i].classList.add("active");
            calIndex = i;
            found = true;
        } else {
            cals[i].classList.remove("active");
        }
    }
    if (!found) {
        showCalendars(0);
        console.log("No data for specified month, defaulting to latest one.");
    }
}

function showModal(id) {
    $('.content').css('filter', 'blur(25px)');
    $('.header').css('filter', 'blur(25px)');
    $(id).fadeIn();
    $(id).css('filter', 'none');
}

function hideModal(id) {
    $('.content').css('filter', 'none');
    $('.header').css('filter', 'none');
    $(".modal").fadeOut();
}

$(document).keyup(function(e) {
    if (e.key === "Escape") {
        hideModal('#month-select');
    }
});

loadHoursFromJSON();