const extToggle = document.getElementById("ext-toggle").firstElementChild;

const overlayToggle = document.getElementById("overlay-toggle").firstElementChild;
const headerToggle = document.getElementById("header-toggle").firstElementChild;
const footerToggle = document.getElementById("footer-toggle").firstElementChild;


window.onload = () => {
    chrome.storage.sync.get([
        'isActive',
        'overlayActive',
        'headerActive',
        'footerActive'
       ], ({ isActive, overlayActive, headerActive, footerActive }) => {
        extToggle.checked = isActive;
        overlayToggle.checked = overlayActive;
        headerToggle.checked = headerActive;
        footerToggle.checked = footerActive;
    });
};

extToggle.addEventListener("click", function () {
    chrome.storage.sync.set({ isActive: this.checked });
});

overlayToggle.addEventListener("click", function () {
    chrome.storage.sync.set({ overlayActive: this.checked });
});

headerToggle.addEventListener("click", function () {
    chrome.storage.sync.set({ headerActive: this.checked });
});

footerToggle.addEventListener("click", function () {
    chrome.storage.sync.set({ footerActive: this.checked });
});
