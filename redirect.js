function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};

function getRandomAd(min = 1, max = 4) {
    const index = getRandomInt(min, max);
    return `ads/redirect${index}.gif`;
}

window.onload = function () {
    let ad = document.getElementById("advertisement");
    ad.src = chrome.runtime.getURL(getRandomAd());

    setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const href = params.get("href");
        location.href = href;
    }, 5000)
}
