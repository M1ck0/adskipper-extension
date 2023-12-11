const defined = v => v !== null && v !== undefined;

const stopPornhubAds = () => {
  const skipButton = document.querySelector('.mgp_adRollSkipButton')
  const pausedVideoPopupAd = document.querySelector('#pb_template')
  
  if(defined(pausedVideoPopupAd)) {
    pausedVideoPopupAd.style.display = 'none'
  }
  
  if (defined(skipButton)) {
    const videoAd = document.querySelector('.mgp_videoElement')
    
    if(defined(videoAd)) {
      videoAd.currentTime = videoAd.duration;
      
      setTimeout(() => {
        skipButton.click();
      }, 100)
    }
  }
}

if (typeof window !== "undefined") {
  chrome.storage.sync.get(["youtube-ads", "youtube-shortcuts"])
    .then(({"pornhub-ads": pornhubAds}) => {
      setInterval(() => {
        if (pornhubAds === true || pornhubAds === undefined) {
          try {
            stopPornhubAds();
          } catch (e) {
            console.error(e);
          }
        }
      }, 100)
    });
}
