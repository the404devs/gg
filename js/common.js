//common.js should always be linked before other scripts

function scrollToElem(id) {
    console.log(id);
    const elem = document.getElementById(id);
    if (elem == null) {
        $("#errmsg").css("opacity", "1");
        setTimeout(() => { $("#errmsg").css("opacity", "0"); }, 2000);
        return;
    }
    const offset = elem.offsetTop - 0;
    window.scrollTo({
        top: offset,
        behavior: "smooth"
    });
}

function getJSON(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let status = xhr.status;
        if (status === 200) {
            callback(null, xhr.responseText);
        } else {
            callback(status, xhr.responseText);
        }
    };
    xhr.send();
}

function getDateFromURL() {
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

function showPanes(n) {
    let i;
    const panes = document.getElementsByClassName("pane");
    const tabs = document.getElementsByClassName("tab");

    if (n > panes.length) { n = 1; } //don't fuck up
    if (n < 1) { n = panes.length; }

    for (i = 0; i < panes.length; i++) {
        if (i != n - 1) {
            //yeet all the other panes out of existence
            const id = "#" + panes[i].id;
            $(id).css("opacity", "0");
            $(id).css("height", "0");
            $(id).css("z-index", "-1");
            $(id).css("display", "none");
        }
    }
    for (i = 0; i < tabs.length; i++) {
        //remove the "active" class from all the tabs
        tabs[i].className = tabs[i].className.replace(" active", "");
    }

    //fade in the correct pane
    const id = "#" + panes[n - 1].id;
    $(id).css("display", "block");
    $(id).css("height", "auto");
    const h = $(id).height();
    $(id).css("height", h);
    $(id).css("opacity", "1");
    $(id).css("z-index", "auto");

    //give the corresponding tab the "active" class
    tabs[n - 1].className += " active";
}

function firefoxCheck() {
    if (navigator.userAgent.indexOf("Firefox") > -1) {
        //Firefox doesn't support CSS backdrop-filter out of the box yet.
        $(".header").css("background-color", "rgba(24, 21, 36, 1)");
    }
}
firefoxCheck();