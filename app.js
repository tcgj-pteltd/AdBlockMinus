window.onload = () => {
  document.getElementById("ads").onclick = () => {
    chrome.extension.getBackgroundPage().addAds();
  };
};
