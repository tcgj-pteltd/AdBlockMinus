const extToggle = document.getElementById("ext-toggle");

const overlayToggle = document.getElementById("overlay-toggle").firstElementChild;
const headerToggle = document.getElementById("header-toggle").firstElementChild;
const sidebarToggle = document.getElementById("sidebar-toggle").firstElementChild;
const footerToggle = document.getElementById("footer-toggle").firstElementChild;
const popupToggle = document.getElementById("popup-toggle").firstElementChild;
const redirectToggle = document.getElementById("redirect-toggle").firstElementChild;
const toggles = document.getElementById("options").querySelectorAll(".switch");

const refreshBtn = document.getElementById("refresh-ext");

window.onload = () => {
    chrome.storage.sync.get([
        "isActive",
        "overlayActive",
        "headerActive",
        "sidebarActive",
        "footerActive",
        "popupActive",
        "redirectActive"
    ], ({
        isActive,
        overlayActive,
        headerActive,
        sidebarActive,
        footerActive,
        popupActive,
        redirectActive
    }) => {
        extToggle.classList.toggle("disabled", !isActive);
        toggles.forEach(toggle => toggle.classList.toggle("disabled", !isActive));
        overlayToggle.checked = overlayActive;
        headerToggle.checked = headerActive;
        sidebarToggle.checked = sidebarActive;
        footerToggle.checked = footerActive;
        popupToggle.checked = popupActive;
        redirectToggle.checked = redirectActive;
    });
};

extToggle.addEventListener("click", function () {
    chrome.storage.sync.get("isActive", ({ isActive }) => {
        chrome.storage.sync.set({ isActive: !isActive });
        extToggle.classList.toggle("disabled", isActive);
        toggles.forEach(toggle => toggle.classList.toggle("disabled", isActive));
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { state: false });
        });
    });
});

overlayToggle.addEventListener("click", function () {
    chrome.storage.sync.set({ overlayActive: this.checked });
});

headerToggle.addEventListener("click", function () {
    chrome.storage.sync.set({ headerActive: this.checked });
});

sidebarToggle.addEventListener("click", function () {
    chrome.storage.sync.set({ sidebarActive: this.checked });
});

footerToggle.addEventListener("click", function () {
    chrome.storage.sync.set({ footerActive: this.checked });
});

popupToggle.addEventListener("click", function () {
    chrome.storage.sync.set({ popupActive: this.checked });
});

redirectToggle.addEventListener("click", function () {
    chrome.storage.sync.set({ redirectActive: this.checked });
});

refreshBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { refresh: true });
    });
});
