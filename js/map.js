let points = {};
let validDates = [];
let dateIndex = 0;
let streetMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlNDA0ZGV2cyIsImEiOiJjbDM3Z2Q4YXYzam9xM2RvNTMzZjh4b3UzIn0.nf9h5X2OtPsIZ9Q10xXb2A', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGhlNDA0ZGV2cyIsImEiOiJjbDM3Z2Q4YXYzam9xM2RvNTMzZjh4b3UzIn0.nf9h5X2OtPsIZ9Q10xXb2A'
});

let darkMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlNDA0ZGV2cyIsImEiOiJjbDM3Z2Q4YXYzam9xM2RvNTMzZjh4b3UzIn0.nf9h5X2OtPsIZ9Q10xXb2A', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGhlNDA0ZGV2cyIsImEiOiJjbDM3Z2Q4YXYzam9xM2RvNTMzZjh4b3UzIn0.nf9h5X2OtPsIZ9Q10xXb2A'
});

let satMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlNDA0ZGV2cyIsImEiOiJjbDM3Z2Q4YXYzam9xM2RvNTMzZjh4b3UzIn0.nf9h5X2OtPsIZ9Q10xXb2A', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGhlNDA0ZGV2cyIsImEiOiJjbDM3Z2Q4YXYzam9xM2RvNTMzZjh4b3UzIn0.nf9h5X2OtPsIZ9Q10xXb2A'
});

let map = L.map('map', { layers: streetMap }).setView([43.819, -79.237], 11);
let mapTypes = { "Street (Light)": streetMap, "Street (Dark)": darkMap, "Satellite": satMap };
let layerControl = L.control.layers(mapTypes).addTo(map);

let lineGroup = L.layerGroup().addTo(map);
let markerGroup = L.layerGroup().addTo(map);
const request = new XMLHttpRequest();
request.open("GET", "./js/data/location.csv", false);
request.send(null);
const csvData = new Array();
const jsonObject = request.responseText.split(/\r?\n|\r/);
for (let i = 0; i < jsonObject.length; i++) {
    csvData.push(jsonObject[i].split(','));
}

csvData.forEach(point => {
    if (point[0] != "timestamp" && point[0] != "") {
        const timestamp = new Date(point[0]);
        const lat = +point[1];
        const lng = +point[2];
        let date = dateFromTimestamp(timestamp);
        if (!points[date]) {
            points[date] = [];
        }
        points[date].push({
            timestamp: timestamp,
            lat: lat,
            lng: lng
        });
        pusher(date, timestamp, lat, lng, "JSON");
    }
});

request.open("GET", "./kml/list.txt", false);
request.send(null);
const kmlList = request.responseText.split(/\r?\n|\r/);
kmlList.forEach(function(filename) {
    if (filename.length <= 0) {
        return;
    }
    request.open("GET", "./kml/" + filename, false);
    request.send(null);
    const jsonData = toGeoJSON.kml(request.responseXML);
    jsonData.features.forEach(feature => {
        const startTimestamp = new Date(feature.properties.timespan.begin);
        const endTimestamp = new Date(feature.properties.timespan.end);
        if (feature.geometry.type == "Point") {
            const lat = feature.geometry.coordinates[1];
            const lng = feature.geometry.coordinates[0];
            const startDate = dateFromTimestamp(startTimestamp);
            const endDate = dateFromTimestamp(endTimestamp);
            pusher(startDate, startTimestamp, lat, lng, "KML - Inferred Start");
            pusher(endDate, endTimestamp, lat, lng, "KML - Inferred End");
        } else if (feature.geometry.type == "LineString") {
            let inferredTimes = [];
            inferredTimes.push(startTimestamp);
            const delta = endTimestamp - startTimestamp;
            const numPoints = feature.geometry.coordinates.length;
            for (let i = 1; i < numPoints - 1; i++) {
                inferredTimes.push(new Date(startTimestamp.getTime() + delta * i / numPoints));
            }
            inferredTimes.push(endTimestamp);
            // console.log(inferredTimes);
            let x = 0;
            feature.geometry.coordinates.forEach(coord => {
                const timestamp = inferredTimes[x];
                const lat = coord[1];
                const lng = coord[0];
                const date = dateFromTimestamp(timestamp);
                pusher(date, timestamp, lat, lng, "KML- LineString");
                x++;
            });
        }
    });
});

validDates = Object.keys(points);

function pusher(date, timestamp, lat, lng, source) {
    if (!points[date]) {
        points[date] = [];
    }
    points[date].push({
        timestamp: timestamp,
        lat: lat,
        lng: lng,
        source: source
    });
}

function dateFromTimestamp(timestamp) {
    return timestamp.getFullYear() + "-" + ("0" + (timestamp.getMonth() + 1)).slice(-2) + "-" + ("0" + timestamp.getDate()).slice(-2);
}

function addDataToMap(date) {
    let data = [];
    if (points[date]) {
        data = points[date].sort((a, b) => {
            return a.timestamp - b.timestamp; //Ensure chronological order, if we have data from multiple sources
        });
    } else {
        alert("No data for " + date + "!");
        return;
    }

    let totalSegments = data.length - 1;
    let x = 0;
    let latSum = 0;
    let lngSum = 0;
    dateIndex = validDates.indexOf(date);
    console.log(date, dateIndex);
    markerGroup.clearLayers();
    lineGroup.clearLayers();
    let lineArr = [];
    let dateHasJSON = false;
    data.forEach(point => {
        if (point.source == "JSON") {
            dateHasJSON = true;
        }

        // skip this point if source is KML LineString and there's JSON for this date
        if (!(point.source == "KML- LineString" && dateHasJSON)) {
            lineArr.push([point.lat, point.lng, x]);
            let color = "red";
            if (x == 0) {
                color = "blue";
            } else if (x == data.length - 1) {
                color = "green";
            }
            let circle = L.circle([point.lat, point.lng], {
                color: color,
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 2
            }).addTo(markerGroup);
            timestr = point.timestamp.toString();
            circle.bindTooltip(timestr.substring(0, timestr.indexOf("GMT")) + "<br>" + point.source);
            x++;
            latSum += point.lat;
            lngSum += point.lng;
            const palette = { 0.0: 'red', 0.2: 'orange', 0.4: 'yellow', 0.6: 'green', 0.8: 'blue', 0.9: 'indigo', 1.0: 'violet' };
            L.hotline(lineArr, { palette: palette, opacity: 0.5, min: 0, max: totalSegments, outlineWidth: 0.2, outlineColor: '#808080' }).addTo(lineGroup, true);
        }
    });
    let avgLat = latSum / x;
    let avgLng = lngSum / x;
    map.setView([avgLat, avgLng], 12);
    console.log("Added " + x + " points to map.");
    let fancyDate = timestr.substring(0, timestr.indexOf(":") - 3).replace(
        "Sun", "Sunday,"
    ).replace(
        "Mon", "Monday,"
    ).replace(
        "Tue", "Tuesday,"
    ).replace(
        "Wed", "Wednesday,"
    ).replace(
        "Thu", "Thursday,"
    ).replace(
        "Fri", "Friday,"
    ).replace(
        "Sat", "Saturday,"
    );
    $("#date-head").text(fancyDate);
}

function getDateInput() {
    const date = $("#date-sel").val();
    addDataToMap(date);
}

function switchView(x) {
    if (dateIndex + x < 0) {
        dateIndex = validDates.length - 1;
    } else if (dateIndex + x >= validDates.length) {
        dateIndex = 0;
    } else {
        dateIndex += x;
    }
    addDataToMap(validDates[dateIndex]);
}

function getDateFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedDate = urlParams.get('d');
    if (requestedDate) {
        addDataToMap(requestedDate);
    }
    return true;
}

addDataToMap(validDates[validDates.length - 1]);
getDateFromURL();