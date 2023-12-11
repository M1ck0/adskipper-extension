const defined = v => v !== null && v !== undefined;

const url = new URL(window.location.href);
let baseDomain = url.hostname;

// Check if there are subdomains and retrieve only the base domain
if (baseDomain.split('.').length > 2) {
  baseDomain = baseDomain.split('.').slice(-2).join('.');
}

const stopYoutubeAd = () => {
  const adElement = document.querySelector(".ad-showing");
  const overlayAds = document.querySelectorAll(".ytp-ad-overlay-slot");
  
  if (defined(adElement)) {
    const video = document.querySelector("video");
    
    video.currentTime = video?.duration || 9999; // if video?.duration is NaN set video to 9999 sec to make sure it goes to the end
    
    const skipButtons = document.querySelectorAll(".ytp-ad-skip-button-modern");
    
    for (const skipButton of skipButtons) {
      skipButton.click();
    }
  }
  
  for (const overlayAd of overlayAds) {
    overlayAd.style.visibility = "hidden";
  }
};

const hideYoutubeShorts = () => {
  const shortsHomePage = document.querySelectorAll('[is-shorts]')
  const shortsHistoryPage = document.querySelectorAll('ytd-reel-shelf-renderer')
  const shortsSidebar = document.querySelector('[title="Shorts"]')
  
  if(shortsHomePage?.length) {
    Array.from(shortsHomePage)?.map(item => item.style.display = 'none')
  }
  
  if(shortsHistoryPage?.length) {
    Array.from(shortsHistoryPage)?.map(item => item.style.display = 'none')
  }
  
  if(shortsSidebar) {
    shortsSidebar.style.display = 'none';
  }
}

if (typeof window !== "undefined") {
  chrome.storage.sync.get(["youtube-ads", "youtube-shortcuts"])
    .then(({"youtube-ads": youtubeAds, "youtube-shortcuts": youtubeShortcuts}) => {
      setInterval(() => {
        if (youtubeAds === true || youtubeAds === undefined) {
          try {
            stopYoutubeAd();
          } catch (e) {
            console.error(e);
          }
        }

        if (youtubeShortcuts) {
          try {
            hideYoutubeShorts();
          } catch (e) {
            console.error(e);
          }
        }
      }, 100)
    });
}
