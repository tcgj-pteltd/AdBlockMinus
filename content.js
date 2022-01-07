function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};

function getRandomAd(min = 1, max = 13) {
    const index = getRandomInt(min, max);
    switch(index) {
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

function getRandomSidebarAd(min = 1, max = 1) {
    const index = getRandomInt(min, max);
    switch(index) {
        case 1:
            return `ads/sidebar-${index}.jpg`;
        default:
            return `ads/ernest.png`;
    }
}

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
    const imageHref = getRandomAd();
    var imgURL = chrome.runtime.getURL(imageHref);
    var div = document.createElement("DIV");
    div.id = "header";
    var img = document.createElement("IMG");
    img.id = "ad-media";
    img.src = imgURL;
    img.alt = "Header Ad";
    div.appendChild(img);
    document.body.prepend(div);

    setTimeout(() => {
        const innerImageHref = getRandomAd();
        var newImgURL = chrome.runtime.getURL(innerImageHref);
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

function addAdToSidebar() {
    var div = document.createElement("div");
    div.id = "wrap";
    // Move the body's children into this wrapper
    while (document.body.firstChild)
    {
        div.appendChild(document.body.firstChild);
    }
    // Append the wrapper to the body
    document.body.appendChild(div);

    const imageHref = getRandomSidebarAd();
    var imgURL = chrome.runtime.getURL(imageHref);
    var div = document.createElement("DIV");
    div.id = "sidenav";
    var img = document.createElement("IMG");
    img.id = "ad-media";
    img.src = imgURL;
    img.alt = "Sidebar Ad";
    div.appendChild(img);
    document.body.prepend(div);
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

            if (footerActive) {
                addAdToSidebar();
            }
        }
    });
};
