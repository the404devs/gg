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