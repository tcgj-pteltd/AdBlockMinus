chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        isActive: true,
        overlayActive: true,
        headerActive: true,
        sidebarActive: true,
        footerActive: true,
        popupActive: true,
        redirectActive: true,
    });
    console.log("AddAd Installed!");
});
