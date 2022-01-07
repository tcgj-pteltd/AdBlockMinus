function addAd() {
    var vidURL = chrome.runtime.getURL("woolooloo.mp4");
    var div = document.createElement("DIV");
    div.id = "overlay-ad";
    var vid = document.createElement("VIDEO");

    vid.setAttribute("controls", "true");
    vid.setAttribute("disablePictureInPicture", "true");
    vid.setAttribute("controlsList", "nodownload noplaybackrate nopictureinpicture");

    vid.id = "ad-media";
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
    if (document.getElementById("overlay-ad")) {
        document.getElementById("overlay-ad").remove();
    }
}

function addAdToHeader() {
    var imgURL = chrome.runtime.getURL("ads/ad1.png");
    var div = document.createElement("DIV");
    div.id = "header";
    var img = document.createElement("IMG");
    img.id = "ad-media";
    img.src = imgURL;
    img.alt = "Header Ad";
    div.appendChild(img);
    document.body.prepend(div);


    // Add ads to luminus section header
    setTimeout(() => {
        var newImgURL = chrome.runtime.getURL("ads/ad5.png");
        var div2 = document.createElement("DIV");
        div2.id = "header";
        var img2 = document.createElement("IMG");
        img2.id = "ad-media";
        img2.src = newImgURL;
        div2.appendChild(img2);

        const sectionHeader = document.querySelector(".section-header");
        sectionHeader?.prepend(div2);

        const mainContent = document.querySelector(".main-content");
        mainContent?.prepend(div2);
    }, 1000);
}

function preventSeeking() {
    var video = document.getElementById('ad-media');
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
    chrome.storage.sync.get([
        'isActive',
        'overlayActive',
        'headerActive',
        'footerActive'
    ], ({ isActive, overlayActive, headerActive, footerActive }) => {
        if (isActive) {
            if (overlayActive) {
                addAd();
                preventSeeking();
            }

            if (headerActive) {
                addAdToHeader();
            }
        }
    });
};
