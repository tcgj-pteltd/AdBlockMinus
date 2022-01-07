const extToggle = document.getElementById("ext-toggle");

const overlayToggle = document.getElementById("overlay-toggle").firstElementChild;
const headerToggle = document.getElementById("header-toggle").firstElementChild;
const footerToggle = document.getElementById("footer-toggle").firstElementChild;
const toggles = document.getElementById("options").querySelectorAll(".switch");

const refreshBtn = document.getElementById("refresh-ext");

window.onload = () => {
    chrome.storage.sync.get([
        'isActive',
        'overlayActive',
        'headerActive',
        'footerActive'
    ], ({ isActive, overlayActive, headerActive, footerActive }) => {
        extToggle.classList.toggle("disabled", !isActive);
        toggles.forEach(toggle => toggle.classList.toggle("disabled", !isActive));
        overlayToggle.checked = overlayActive;
        headerToggle.checked = headerActive;
        footerToggle.checked = footerActive;
    });
};

extToggle.addEventListener("click", function () {
    chrome.storage.sync.get("isActive", ({ isActive }) => {
        chrome.storage.sync.set({ isActive: !isActive });
        extToggle.classList.toggle("disabled", isActive);
        toggles.forEach(toggle => toggle.classList.toggle("disabled", isActive));
    });
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

refreshBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { refresh: true });
    });
});
