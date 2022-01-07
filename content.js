let adList = [];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};

function getRandomAd(min = 1, max = 13) {
    const index = getRandomInt(min, max);
    switch (index) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 9:
        case 10:
            return `ads/ad${index}.png`;
        case 2:
        case 6:
        case 11:
        case 12:
        case 13:
            return `ads/ad${index}.gif`;
        case 4:
            return `ads/ad${index}.jpeg`;
        default:
            return `ads/ernest.png`;
    }
}

function getRandomSidebarAd(min = 1, max = 3) {
    const index = getRandomInt(min, max);
    switch (index) {
        case 1:
        case 2:
            return `ads/sidebar-${index}.jpg`;
        case 3:
            return `ads/sidebar-${index}.png`;
        default:
            return `ads/ernest.png`;
    }
}

function preventVideoSeek() {
    var video = document.getElementById("add-media");
    var supposedCurrentTime = 0;
    video.addEventListener("timeupdate", function () {
        if (!video.seeking) {
            supposedCurrentTime = video.currentTime;
        }
    });
    // prevent user from seeking
    video.addEventListener("seeking", function () {
        // guard agains infinite recursion:
        // user seeks, seeking is fired, currentTime is modified, seeking is fired, current time is modified, ....
        var delta = video.currentTime - supposedCurrentTime;
        if (Math.abs(delta) > 0.01) {
            console.log("Seeking is disabled");
            video.currentTime = supposedCurrentTime;
        }
    });
    // delete the following event handler if rewind is not required
    video.addEventListener("ended", function () {
        // reset state in order to allow for rewind
        supposedCurrentTime = 0;
        // allow user to close the video
        document.getElementById("close").style.display = "block";
    });
}

function addOverlayAd() {
    var vidURL = chrome.runtime.getURL("ads/video1.mp4");
    var div = document.createElement("DIV");
    div.id = "add-overlay";
    var vid = document.createElement("VIDEO");

    vid.setAttribute("controls", "true");
    vid.setAttribute("disablePictureInPicture", "true");
    vid.setAttribute("controlsList", "nodownload noplaybackrate nopictureinpicture");

    vid.id = "add-media";
    vid.src = vidURL;
    div.appendChild(vid);
    var button = document.createElement("button");
    button.id = "close";
    button.onclick = removeOverlayAd;
    // hide the button to close the video, until user finishes watching the video
    button.style.display = "none";
    button.textContent = "Close Ad";
    div.appendChild(button);
    document.body.appendChild(div);
    adList.push(div);
}

function removeOverlayAd() {
    if (document.getElementById("add-overlay")) {
        document.getElementById("add-overlay").remove();
    }
}

function addHeaderAd() {
    const imageHref = getRandomAd();
    var imgURL = chrome.runtime.getURL(imageHref);
    var div = document.createElement("DIV");
    div.id = "add-header";
    var img = document.createElement("IMG");
    img.id = "add-media";
    img.src = imgURL;
    img.alt = "Header Ad";
    div.appendChild(img);
    document.body.prepend(div);
    adList.push(div);

    setTimeout(() => {
        const innerImageHref = getRandomAd();
        var newImgURL = chrome.runtime.getURL(innerImageHref);
        var div2 = document.createElement("DIV");
        div2.id = "add-subheader";
        var img2 = document.createElement("IMG");
        img2.id = "add-media";
        img2.src = newImgURL;
        div2.appendChild(img2);

        const sectionHeader = document.querySelector(".section-header");
        if (sectionHeader)
            sectionHeader.prepend(div2);
        else
            document.querySelector(".main-content")?.prepend(div2);
        adList.push(div2);
    }, 1000);
}

function addSidebarAd() {
    const imageHref = getRandomSidebarAd();
    var imgURL = chrome.runtime.getURL(imageHref);
    var div = document.createElement("DIV");
    div.id = "add-side";
    var img = document.createElement("IMG");
    img.id = "add-media";
    img.src = imgURL;
    img.alt = "Sidebar Ad";
    div.appendChild(img);
    document.body.prepend(div);
    adList.push(div);
}

function loadAddAd() {
    chrome.storage.sync.get([
        "isActive",
        "overlayActive",
        "headerActive",
        "sidebarActive",
        "footerActive"
    ], ({ isActive, overlayActive, headerActive, sidebarActive, footerActive }) => {
        if (isActive) {
            if (overlayActive) {
                addOverlayAd();
                preventVideoSeek();
            }
            if (headerActive) {
                addHeaderAd();
            }
            if (sidebarActive) {
                addSidebarAd();
            }
        }
    });
};

function removeAllAds() {
    adList.forEach(ad => ad.remove());
    adList = [];
}

let hasLoadedBefore = false;

chrome.runtime.onMessage.addListener(function (message) {
    if (!message.refresh)
        return;

    removeAllAds();
    loadAddAd();

    hasLoadedBefore = true;
});

let currentPage = location.href;

setInterval(function()
{
    if (currentPage != location.href && hasLoadedBefore)
    {
        // page has changed, set new page as 'current'
        currentPage = location.href;
        removeAllAds();
        loadAddAd();
    }
}, 500);

window.onload = loadAddAd;
