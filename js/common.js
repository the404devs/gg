//common.js should always be linked before other scripts

var scrollToElem = function(id) {
    console.log(id);
    var elem = document.getElementById(id);
    if (elem == null) {
        $("#errmsg").css("opacity", "1");
        setTimeout(() => { $("#errmsg").css("opacity", "0"); }, 2000);
        return;
    }
    var offset = elem.offsetTop - 0;
    window.scrollTo({
        top: offset,
        behavior: "smooth"
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
}

var getDateFromURL = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedDate = urlParams.get('d');
    if (requestedDate != null) {
        if (document.getElementById(requestedDate)) {
            console.log("Scrolling to " + requestedDate);
            scrollToElem(requestedDate);
        } else {
            alert("Nothing for " + requestedDate + "!");
        }
    }
}