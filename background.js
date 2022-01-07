let isActive = true;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ isActive });
    console.log("AddAds Installed!");
});
