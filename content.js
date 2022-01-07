function addAd() {
    var nav = document.getElementsByTagName("nav");
    if (nav[0] !== undefined) {
        console.log(nav[0]);
        console.log(nav[0].nextElementSibling);
    }

    var mainNav = document.getElementsByTagName("main-nav");
    if (mainNav[0] !== undefined) {
        console.log(mainNav[0]);
        console.log(mainNav[0].nextElementSibling);
    }

    var vidURL = chrome.runtime.getURL("woolooloo.mp4");
    var div = document.createElement("DIV");
    div.id = "addad420";
    var vid = document.createElement("VIDEO");

    vid.setAttribute("controls", "true");
    vid.setAttribute("disablePictureInPicture", "true");
    vid.setAttribute("controlsList", "nodownload noplaybackrate nopictureinpicture");

    vid.id = "addad69";
    vid.src = vidURL;
    div.appendChild(vid);
    var button = document.createElement("button");
    button.id = "close";
    button.onclick = removeAd;
    // hide the button to close the video, until user finishes watching the video
    button.style.display = "none";
    button.textContent = "Close Ad";
    div.appendChild(button);
    document.body.appendChild(div);
}

function removeAd() {
    if (document.getElementById("addad420")) {
        document.getElementById("addad420").remove();
    }
}

function preventSeeking() {
    var video = document.getElementById('addad69');
    var supposedCurrentTime = 0;
    video.addEventListener('timeupdate', function () {
        if (!video.seeking) {
            supposedCurrentTime = video.currentTime;
        }
    });
    // prevent user from seeking
    video.addEventListener('seeking', function () {
        // guard agains infinite recursion:
        // user seeks, seeking is fired, currentTime is modified, seeking is fired, current time is modified, ....
        var delta = video.currentTime - supposedCurrentTime;
        if (Math.abs(delta) > 0.01) {
            console.log("Seeking is disabled");
            video.currentTime = supposedCurrentTime;
        }
    });
    // delete the following event handler if rewind is not required
    video.addEventListener('ended', function () {
        // reset state in order to allow for rewind
        supposedCurrentTime = 0;
        // allow user to close the video
        document.getElementById("close").style.display = "block";
    });
}

window.onload = () => {
    chrome.storage.sync.get("isActive", ({ isActive }) => {
        if (isActive) {
            addAd();
            preventSeeking();
        }
    });
};
