const defined = v => v !== null && v !== undefined;

const stopXVideosAds = () => {
  const videoAd = document.querySelectorAll('.videoad-video')[0]
  
  if(defined(videoAd)) {
    videoAd.currentTime = videoAd.duration;
    
    setTimeout(() => {
      const skipButtons = document.querySelectorAll('[class*="videoad-skip"]')
      
      for(const skipButton of skipButtons){
        skipButton.click();
      }
    }, 100)
  }
}

const removeBigPopupAd = () => {
  const bigPopupAd = document.querySelectorAll('.ex-over-btn')[0]
  
  if (defined(bigPopupAd)) {
    bigPopupAd.click()
  }
}

if (typeof window !== "undefined") {
  chrome.storage.sync.get(["xvideos-ads", "xvideos-popup"])
    .then(({"xvideos-ads": xvideosAds, "xvideos-popup": xvideosPopup}) => {
      setInterval(() => {
        if (xvideosAds === true || xvideosAds === undefined) {
          try {
            stopXVideosAds();
          } catch (e) {
            console.error(e);
          }
        }
        
        if (xvideosPopup === true || xvideosPopup === undefined) {
          try {
            removeBigPopupAd();
          } catch (e) {
            console.error(e);
          }
        }
      }, 100)
    });
}
