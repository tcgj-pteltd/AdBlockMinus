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

function getRandomSidebarAd(min = 1, max = 7) {
    const index = getRandomInt(min, max);
    switch (index) {
        case 1:
        case 2:
        case 5:
            return `ads/sidebar-${index}.jpg`;
        case 3:
        case 4:
            return `ads/sidebar-${index}.png`;
        case 6:
        case 7:
            return `ads/sidebar-${index}.gif`;
        default:
            return `ads/ernest.png`;
    }
}

function preventVideoSeek() {
    const video = document.getElementById("add-media");
    let supposedCurrentTime = 0;
    video.addEventListener("timeupdate", function () {
        if (!video.seeking) {
            supposedCurrentTime = video.currentTime;
        }
    });
    // prevent user from seeking
    video.addEventListener("seeking", function () {
        // guard agains infinite recursion:
        // user seeks, seeking is fired, currentTime is modified, seeking is fired, current time is modified, ....
        const delta = video.currentTime - supposedCurrentTime;
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
    const vidURL = chrome.runtime.getURL("ads/video1.mp4");
    const div = document.createElement("DIV");
    div.id = "add-overlay";
    const vid = document.createElement("VIDEO");

    vid.setAttribute("controls", "true");
    vid.setAttribute("disablePictureInPicture", "true");
    vid.setAttribute("controlsList", "nodownload noplaybackrate nopictureinpicture");

    vid.id = "add-media";
    vid.src = vidURL;
    div.appendChild(vid);
    const button = document.createElement("button");
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
    document.getElementById("add-overlay")?.remove();
}

function addHeaderAd() {
    const imageHref = getRandomAd();
    const imgURL = chrome.runtime.getURL(imageHref);
    const div = document.createElement("DIV");
    div.id = "add-header";
    const img = document.createElement("IMG");
    img.id = "add-media";
    img.src = imgURL;
    img.alt = "Header Ad";
    div.appendChild(img);
    document.body.prepend(div);
    adList.push(div);

    setTimeout(() => {
        const innerImageHref = getRandomAd();
        const newImgURL = chrome.runtime.getURL(innerImageHref);
        const div2 = document.createElement("DIV");
        div2.id = "add-subheader";
        const img2 = document.createElement("IMG");
        img2.id = "add-media";
        img2.src = newImgURL;
        div2.appendChild(img2);

        const sectionHeader = document.querySelector(".section-header");
        if (sectionHeader)
            sectionHeader.prepend(div2);
        else
            document.querySelector(".main-content")?.prepend(div2);
        adList.push(div2);

        hasLoadedBefore = true;
    }, 1000);
}

function addSidebarAd() {
    const imageHref = getRandomSidebarAd();
    const imgURL = chrome.runtime.getURL(imageHref);
    const div = document.createElement("DIV");
    div.id = "add-side";
    setTimeout(() => {
        div.classList.add("opened");
    }, 2000);
    const close = document.createElement("DIV");
    close.id = "add-close";
    close.addEventListener("click", function () {
        div.classList.remove("opened");
        setTimeout(() => {
            div.classList.add("opened");
        }, 20000);
    });
    div.appendChild(close);
    const img = document.createElement("IMG");
    img.id = "add-media";
    img.src = imgURL;
    img.alt = "Sidebar Ad";
    div.appendChild(img);
    document.body.prepend(div);
    adList.push(div);
}

function addPopupAd() {
    const div = document.createElement("DIV");
    div.id = "add-pop";
    div.addEventListener("click", function () {
        div.classList.add("disabled");
        window.open(chrome.runtime.getURL('ads/popup1.html'), '_blank', 'toolbar=0,location=0,menubar=0');
    });
    document.body.prepend(div);
    adList.push(div);
}

function loadAddAd(loadVideos = true) {
    chrome.storage.sync.get([
        "isActive",
        "overlayActive",
        "headerActive",
        "sidebarActive",
        "footerActive",
        "popupActive"
    ], ({ isActive, overlayActive, headerActive, sidebarActive, footerActive, popupActive }) => {
        if (isActive) {
            if (overlayActive && loadVideos) {
                addOverlayAd();
                preventVideoSeek();
            }
            if (headerActive) {
                addHeaderAd();
            }
            if (sidebarActive) {
                addSidebarAd();
            }
            if (popupActive) {
                addPopupAd();
            }
        }
    });
};

function removeAllAds(removeOtherAdds = true) {
    adList.forEach(ad => {
        if (ad.id === "add-subheader" || ad.id === "add-header" || removeOtherAdds) {
            ad.remove();
        }
    });
    adList = [];
}

let hasLoadedBefore = false;

chrome.runtime.onMessage.addListener(function (message) {
    if (!message.refresh)
        return;

    removeAllAds();
    loadAddAd();
});

let currentPage = location.href;

setInterval(function () {
    if (currentPage != location.href && hasLoadedBefore) {
        // page has changed, set new page as 'current'
        currentPage = location.href;
        removeAllAds(false);
        loadAddAd(false);
    }
}, 5000);

window.onload = loadAddAd;
