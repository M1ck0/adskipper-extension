const defined = v => v !== null && v !== undefined;

const stopYoutubeAd = () => {
  const adElement = document.querySelector(".ad-showing");
  const video = adElement?.querySelector("video");
  
  if (defined(adElement) && defined(video)) {
    // Check if video.duration is a finite number before assigning it to currentTime
    const duration = video.duration;
    if (typeof duration === 'number' && isFinite(duration)) {
      video.currentTime = duration;
    } else {
      // invalid video duration
      video.currentTime = 9999999;
    }
  }
  
  const skipButtons = document.querySelectorAll(".ytp-ad-skip-button-modern");
  if (defined(skipButtons)) {
    for (const skipButton of skipButtons) {
      skipButton.click();
    }
  }
  
  const overlayAds = document.querySelectorAll(".ytp-ad-overlay-slot");
  for (const overlayAd of overlayAds) {
    overlayAd.style.visibility = "hidden";
  }
};


const hideYoutubeShorts = () => {
  const shortsHomePage = document.querySelectorAll('[is-shorts]')
  const shortsHistoryPage = document.querySelectorAll('ytd-reel-shelf-renderer')
  const shortsSidebar = document.querySelector('[title="Shorts"]')
  
  if (shortsHomePage?.length) {
    shortsHomePage.forEach(item => item.remove())
  }
  
  if (shortsHistoryPage?.length) {
    shortsHistoryPage.forEach(item => item.remove())
  }
  
  if (shortsSidebar) {
    shortsSidebar.remove()
  }
}

const removeRecommendationsAtTheEnd = () => {
  const recommendations = document.querySelectorAll('.ytd-player .ytp-ce-element')
  
  
  if(recommendations?.length) {
    recommendations.forEach(item => item.remove())
  }
}


if (typeof window !== "undefined") {
  chrome.storage.sync.get(["youtube-ads", "youtube-shorts", "youtube-errors", "youtube-recommendations"])
    .then(({"youtube-ads": youtubeAds, "youtube-shorts": youtubeShorts, "youtube-errors": youtubeErrors, "youtube-recommendations": youtubeRecommendations}) => {
      new MutationObserver(() => {
        if (youtubeAds === true || youtubeAds === undefined) {
          try {
            stopYoutubeAd();
          } catch (e) {
            if (youtubeErrors) {
              // Extract relevant information from the error object
              const errorInfo = {
                stack: e.stack,
              };
              
              // Save the error information to chrome storage
              chrome.storage.sync.set({"youtube-error-message": errorInfo});
            }
          }
        }
        
        
        if (youtubeShorts) {
          try {
            hideYoutubeShorts();
          } catch (e) {
            console.error(e);
          }
        }
        
        if(youtubeRecommendations) {
          try {
            removeRecommendationsAtTheEnd()
          }  catch (e) {
            console.error(e);
          }
        }
      }).observe(document.querySelector('body'), {
        characterData: true,
        childList: true,
        attributes: true,
        subtree: true
      });
    });
}
