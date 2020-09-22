var request = new XMLHttpRequest();
request.open("GET", "./js/BrowserHistory.json", false);
request.overrideMimeType("application/json");
request.send(null);
var jsonData = JSON.parse(request.responseText);
console.log(jsonData);