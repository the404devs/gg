function loadHoursFromJSON() {
    let maxHours = 0;
    let maxHoursDate = "";
    let minHours = Infinity;
    let minHoursDate = "";

    $.getJSON("./js/data/hours.json", function(jsonData) {
        const years = Object.keys(jsonData).sort().reverse();
        $("#loading-box").hide();
        for (let y = 0; y < years.length; y++) {
            const months = Object.keys(jsonData[years[y]]).sort().reverse();
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
                    ).append(
                        $("<div>").addClass("prev bottom button").attr("onclick", "switchView(1)").append(
                            $("<span>").text("❮")
                        )
                    ).append(
                        $("<div>").addClass("next bottom button").attr("onclick", "switchView(-1)").append(
                            $("<span>").text("❯")
                        )
                    ).attr("id", years[y] + "-" + months[m] + "-blob")
                );

                $("#month-select-body").prepend($("<br>")).prepend($("<br>")).prepend(
                    $("<a>").html(monthNames[parseInt(months[m])] + " " + years[y]).addClass("link").attr("onclick", "showCalendar('" + years[y] + "-" + months[m] + "')")
                )

                const days = Object.keys(jsonData[years[y]][months[m]]).sort();
                let monthlyHourTotal = 0;
                let numberOfNAVGDays = 0;

                $("#" + years[y] + "-" + months[m]).html(weekHTML);

                for (let d = 0; d < days.length; d++) {
                    const date = new Date(years[y] + "-" + months[m] + "-" + days[d]);
                    let totalHours = 0;

                    let index = date.getDay() + 2;
                    if (index > 7) { index = 1 }

                    $("#" + years[y] + "-" + months[m]).append(
                        $("<div>").addClass("grid-item").append(
                            $("<h3>").html(days[d])
                        ).attr("id", years[y] + "-" + months[m] + "-" + days[d]).css("grid-column-start", index + "")
                    );

                    if (jsonData[years[y]][months[m]][days[d]]["D"]) {
                        $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                            $("<h6>").html("Work: " + jsonData[years[y]][months[m]][days[d]]["D"]).css("font-weight", "bold")
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

                    let hourColour = "yellow";
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

                    // $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                    //     $("<button>").addClass("button").attr("onclick", "window.open('./hours.html?d=" + years[y] + "-" + months[m] + "-" + days[d] + "')").css("width", "100px").append(
                    //         $("<span>").html("Details")
                    //     )
                    // );

                    if (totalHours > maxHours) {
                        maxHours = totalHours;
                        maxHoursDate = years[y] + "-" + months[m] + "-" + days[d]
                    } else if (totalHours < minHours && totalHours > 0) {
                        minHours = totalHours;
                        minHoursDate = years[y] + "-" + months[m] + "-" + days[d]
                    }

                    if (!jsonData[years[y]][months[m]][days[d]]["NAVG"]) {
                        monthlyHourTotal += totalHours;
                    } else {
                        numberOfNAVGDays++;
                        $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                            $("<h6>").html("This day is not included in the monthly average.").css("font-weight", "bold")
                        );
                    }
                }

                const monthBlob = $("#" + years[y] + "-" + months[m]);
                const monthlyAverage = monthlyHourTotal / (days.length - numberOfNAVGDays);
                monthBlob.append(
                    $("<div>").addClass("grid-item").append(
                        $("<h3>").html("Totals")
                    ).append(
                        $("<h6>").html((days.length - numberOfNAVGDays) + " days worked.").css("font-weight", "normal")
                    ).append(
                        $("<h6>").html(monthlyHourTotal + " hours worked.").css("font-weight", "normal")
                    ).append(
                        $("<h6>").html(monthlyAverage.toFixed(2) + " hours/day, average").css("font-weight", "bold").css("color", "yellow")
                    ).append(
                        $("<button>").addClass("button").attr("onclick", "window.open('time/gg/" + years[y] + "-" + months[m] + "-GG.pdf')").css("width", "100px").append(
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

const weekHTML = "<div class='grid-item'><h2>Sunday</h2></div><div class='grid-item'><h2>Monday</h2></div><div class='grid-item'><h2>Tuesday</h2></div><div class='grid-item'><h2>Wednesday</h2></div><div class='grid-item'><h2>Thursday</h2></div><div class='grid-item'><h2>Friday</h2></div><div class='grid-item'><h2>Saturday</h2></div>"

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
    $('#main').css('filter', 'blur(25px)');
    $('#head').css('filter', 'blur(25px)');
    $(id).fadeIn();
    $(id).css('filter', 'none');
}

function hideModal(id) {
    $('#main').css('filter', 'none');
    $('#head').css('filter', 'none');
    $(".modal").fadeOut();
}

$(document).keyup(function(e) {
    if (e.key === "Escape") {
        hideModal('#month-select');
    }
});

loadHoursFromJSON();