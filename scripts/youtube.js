const defined = v => v !== null && v !== undefined;

const stopAd = (selectors, skipButtonSelector, videoSelector, overlaySelector) => {
  const adElement = document.querySelector(selectors);
  const overlayAds = document.querySelectorAll(overlaySelector);
  
  if (defined(adElement)) {
    const video = document.querySelector(videoSelector);
    
    if (defined(video)) {
      video.currentTime = video.duration;
      
      setTimeout(() => {
        const skipButtons = document.querySelectorAll(skipButtonSelector);
        
        for (const skipButton of skipButtons) {
          skipButton.click();
        }
      }, 100);
    }
  }
  
  for (const overlayAd of overlayAds) {
    overlayAd.style.visibility = "hidden";
  }
};

const stopYoutubeAd = () => {
  stopAd('.ad-showing', '.ytp-ad-skip-button-modern', 'video', '.ytp-ad-overlay-slot');
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
  chrome.storage.sync.get(["youtube", "youtube-shorts"]).then(({youtube, "youtube-shorts": youtubeShorts}) => {
    setInterval(() => {
      if(youtube) {
        try {
          stopYoutubeAd();
        } catch (e) {
          console.error(e);
        }
      }
      
      if(youtubeShorts) {
        try {
          hideYoutubeShorts();
        } catch (e) {
          console.error(e);
        }
      }
    }, 100);
  });
}
