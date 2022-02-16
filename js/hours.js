function loadHoursFromJSON() {
    let maxHours = 0;
    let maxHoursDate = "";
    let minHours = Infinity;
    let minHoursDate = "";

    $.getJSON("./js/data/hours.json", function(jsonData) {
        const years = Object.keys(jsonData).sort();
        $("#loading-box").hide();
        for (let y = 0; y < years.length; y++) {
            // $("#main").append($("<div>").addClass("blob").attr("id", years[y]).append($("<h3>").html(years[y])))
            const months = Object.keys(jsonData[years[y]]).sort();
            for (let m = 0; m < months.length; m++) {
                $("#main").append(
                    $("<div>").addClass("blob").attr("id", years[y] + "-" + months[m]).append(
                        $("<h3>").html(monthNames[parseInt(months[m])] + " " + years[y])
                    )
                );

                $("#link-zone").append(
                    $("<a>").html(monthNames[parseInt(months[m])] + " " + years[y]).addClass("link").attr("onclick", "scrollToElem('" + years[y] + "-" + months[m] + "')")
                ).append($("<br>")).append($("<br>"))
                const days = Object.keys(jsonData[years[y]][months[m]]).sort();
                let monthlyHourTotal = 0;
                let numberOfNAVGDays = 0;

                $("#" + years[y] + "-" + months[m]).append(
                    $("<div>").addClass("month-totals")
                );
                for (let d = 0; d < days.length; d++) {
                    const date = new Date(years[y] + "-" + months[m] + "-" + days[d]);
                    let totalHours = 0;

                    $("#" + years[y] + "-" + months[m]).append(
                        $("<div>").addClass("blob").append(
                            $("<h3>").html(years[y] + "-" + months[m] + "-" + days[d] + " (" + weekdays[date.getDay()] + ")")
                        ).attr("id", years[y] + "-" + months[m] + "-" + days[d])
                    );

                    if (jsonData[years[y]][months[m]][days[d]]["D"]) {
                        $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                            $("<h6>").html("Left for work at: " + jsonData[years[y]][months[m]][days[d]]["D"]).css("font-weight", "bold")
                        );
                    }

                    if (jsonData[years[y]][months[m]][days[d]]["A"]) {
                        $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                            $("<h6>").html("Arrived home at: " + jsonData[years[y]][months[m]][days[d]]["A"]).css("font-weight", "bold")
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
                    if (totalHours > 8) {
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

                    const currentDate = new Date(years[y] + "-" + months[m] + "-" + days[d]);
                    const histStart = new Date("2019-09-28");
                    const histEnd = new Date("2020-09-20");
                    if (currentDate >= histStart && currentDate <= histEnd) {
                        $("#" + years[y] + "-" + months[m] + "-" + days[d]).append(
                            $("<button>").addClass("button").attr("onclick", "window.open('./history.html?d=" + years[y] + "-" + months[m] + "-" + days[d] + "')").css("width", "270px").append(
                                $("<span>").html("Browsing History for this Day")
                            )
                        );
                    }


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
                monthBlob.children(".month-totals").append(
                    $("<h6>").html((days.length - numberOfNAVGDays) + " days worked.").css("font-weight", "normal")
                ).append(
                    $("<h6>").html(monthlyHourTotal + " hours worked.").css("font-weight", "normal")
                ).append(
                    $("<h6>").html(monthlyAverage.toFixed(2) + " hours/day, average").css("font-weight", "bold").css("color", "yellow")
                );
                monthBlob.children(".month-totals").append(
                    $("<button>").addClass("button").attr("onclick", "window.open('time/gg/" + years[y] + "-" + months[m] + "-GG.pdf')").css("width", "270px").append(
                        $("<span>").html("G&G Timesheet for this Month")
                    )
                ).append(
                    $("<button>").addClass("button").attr("onclick", "window.open('time/bn/" + years[y] + "-" + months[m] + "-BN.pdf')").css("width", "270px").css("margin-left", "5px").append(
                        $("<span>").html("Bruce Timesheet for this Month")
                    )
                ).append(
                    $("<br>")
                ).append(
                    $("<br>")
                );

            }
        }
        console.log("Max hours: " + maxHours + " on " + maxHoursDate);
        console.log("Min hours: " + minHours + " on " + minHoursDate);
    }).then(() => { getDateFromURL() });
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

loadHoursFromJSON();