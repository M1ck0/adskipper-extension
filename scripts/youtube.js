const defined = (v) => v !== null && v !== undefined;

const clickSkipButton = () => {
  const skipButton = document.querySelector(".ytp-skip-ad-button");
  const skipButtonModern = document.querySelector(".ytp-ad-skip-button-modern");

  if (defined(skipButton)) {
    skipButton.click();
    return true;
  }

  if (defined(skipButtonModern)) {
    skipButtonModern.click();
    return true;
  }

  return false;
};

const stopYoutubeAd = () => {
  const adElement = document.querySelector(
    ".ad-showing .ad-interrupting video",
  );

  if (adElement && adElement.readyState >= 3) {
    adElement.currentTime = adElement.duration - 1;
  }

  clickSkipButton();

  const overlayAds = document.querySelectorAll(".ytp-ad-overlay-slot");
  overlayAds.forEach((overlayAd) => {
    overlayAd.style.visibility = "hidden";
  });
};

const hideYoutubeShorts = () => {
  const shortsHomePage = document.querySelectorAll("[is-shorts]");
  const shortsHistoryPage = document.querySelectorAll(
    "ytd-reel-shelf-renderer",
  );
  const shortsSidebar = document.querySelector('[title="Shorts"]');

  shortsHomePage.forEach((item) => item.remove());
  shortsHistoryPage.forEach((item) => item.remove());
  if (shortsSidebar) {
    shortsSidebar.remove();
  }
};

const removeRecommendationsAtTheEnd = () => {
  const recommendations = document.querySelectorAll(
    ".ytd-player .ytp-ce-element",
  );
  recommendations.forEach((item) => item.remove());
};

let actionIntervalId = null;

const performActions = (settings) => {
  const {
    "youtube-ads": youtubeAds,
    "youtube-shorts": youtubeShorts,
    "youtube-errors": youtubeErrors,
    "youtube-recommendations": youtubeRecommendations,
  } = settings;

  if (youtubeAds !== false) {
    try {
      stopYoutubeAd();
    } catch (e) {
      if (youtubeErrors) {
        const errorInfo = { stack: e.stack };
        chrome.storage.sync.set({ "youtube-error-message": errorInfo });
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

  if (youtubeRecommendations) {
    try {
      removeRecommendationsAtTheEnd();
    } catch (e) {
      console.error(e);
    }
  }
};

const startActionsInterval = (settings) => {
  actionIntervalId = setInterval(() => {
    if (window.location.pathname === "/watch") {
      performActions(settings);
    } else {
      clearInterval(actionIntervalId);
      actionIntervalId = null;
      checkAndStartActions();
    }
  }, 300);
};

const checkAndStartActions = () => {
  const isWatchPage = window.location.pathname === "/watch";

  if (isWatchPage && !actionIntervalId) {
    chrome.storage.sync
      .get([
        "youtube-ads",
        "youtube-shorts",
        "youtube-errors",
        "youtube-recommendations",
      ])
      .then((settings) => {
        startActionsInterval(settings);
      });
  }
};

let checkIntervalId = setInterval(checkAndStartActions, 1000);
