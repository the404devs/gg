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
        let lat = +point[1];
        let lng = +point[2];
        let date = timestamp.getFullYear() + "-" + ("0" + (timestamp.getMonth() + 1)).slice(-2) + "-" + ("0" + timestamp.getDate()).slice(-2);
        if (!points[date]) {
            points[date] = [];
        }
        points[date].push({
            timestamp: timestamp,
            lat: lat,
            lng: lng
        });
    }
});
validDates = Object.keys(points);

function addDataToMap(date) {
    let data = points[date];
    let totalSegments = data.length - 1;
    let x = 0;
    let latSum = 0;
    let lngSum = 0;
    if (!data) {
        alert("No data for " + date + "!");
        return;
    }
    dateIndex = validDates.indexOf(date);
    console.log(date, dateIndex);
    markerGroup.clearLayers();
    lineGroup.clearLayers();
    let lineArr = [];
    data.forEach(point => {
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
        circle.bindTooltip(timestr.substring(0, timestr.indexOf("GMT")));
        x++;
        latSum += point.lat;
        lngSum += point.lng;
        const palette = { 0.0: 'red', 0.2: 'orange', 0.4: 'yellow', 0.6: 'green', 0.8: 'blue', 0.9: 'indigo', 1.0: 'violet' };
        L.hotline(lineArr, { palette: palette, opacity: 0.5, min: 0, max: totalSegments, outlineWidth: 0.2, outlineColor: '#808080' }).addTo(lineGroup, true);
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

addDataToMap("2022-05-14");
getDateFromURL();