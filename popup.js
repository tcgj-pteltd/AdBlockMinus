const toggle = document.querySelector(".switch input");

window.onload = () => {
    chrome.storage.sync.get("isActive", ({ isActive }) => {
        toggle.checked = isActive;
    });
};

toggle.addEventListener("click", function () {
    chrome.storage.sync.set({ isActive: this.checked });
});
