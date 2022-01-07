const extToggle = document.getElementById("ext-toggle").firstElementChild;

window.onload = () => {
    chrome.storage.sync.get("isActive", ({ isActive }) => {
        extToggle.checked = isActive;
    });
};

extToggle.addEventListener("click", function () {
    chrome.storage.sync.set({ isActive: this.checked });
});
