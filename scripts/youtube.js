const defined = (v) => v !== null && v !== undefined;
let _seekingInterval = null;

const clickSkipButton = () => {
  const skipButton = document.querySelector(".ytp-skip-ad-button");
  const skipButtonModern = document.querySelector(".ytp-ad-skip-button-modern");

  if (defined(skipButtonModern)) {
    skipButtonModern.click();
    clearInterval(_seekingInterval);
  }

  if (defined(skipButton)) {
    skipButton.click();
    clearInterval(_seekingInterval);
  }
};

const clickConfirmDialogButton = () => {
  const confirmButton = document.querySelector(
    ".style-scope.yt-confirm-dialog-renderer",
  );

  if (confirmButton) {
    confirmButton.click();
  }
};

const stopYoutubeAd = () => {
  const adElement = document.querySelector(".ad-showing.ad-interrupting video");

  if (adElement && adElement.readyState >= 3) {
    adElement.currentTime = adElement.currentTime + 10;
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

const checkAdBlockerMessage = () => {
  const enforcementMessageElement = document.querySelector(
    ".ytd-enforcement-message-view-model",
  );
  const playabilityErrorElement = document.querySelector(
    ".yt-playability-error-supported-renderers",
  );

  if (enforcementMessageElement && playabilityErrorElement) {
    window.location.reload();
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
    "youtube-errors": youtubeErrors,
    "youtube-recommendations": youtubeRecommendations,
    "youtube-continue-watching": continueWatching,
    "youtube-reload": youtubeReload,
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

  if (youtubeRecommendations) {
    try {
      removeRecommendationsAtTheEnd();
    } catch (e) {
      console.error(e);
    }
  }

  if (continueWatching) {
    try {
      clickConfirmDialogButton();
    } catch (e) {
      console.error(e);
    }
  }

  if (youtubeReload !== false) {
    try {
      checkAdBlockerMessage();
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
  const isWatchPage = window.location.pathname.includes("/watch");

  if (isWatchPage && !actionIntervalId && chrome?.storage?.sync) {
    chrome.storage.sync
      .get([
        "youtube-ads",
        "youtube-errors",
        "youtube-recommendations",
        "youtube-continue-watching",
        "youtube-reload",
      ])
      .then((settings) => {
        startActionsInterval(settings);
      });
  }
};

// check youtube shorts separately because the function should be ran
// on every page and not just /watch
const checkAndStartYouTubeShort = () => {
  if (chrome?.storage?.sync) {
    chrome.storage.sync.get(["youtube-shorts"]).then((settings) => {
      const { "youtube-shorts": yotubeShorts } = settings;

      if (yotubeShorts) {
        try {
          setInterval(() => {
            hideYoutubeShorts();
          }, 500);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
};

checkAndStartYouTubeShort();

let checkIntervalId = setInterval(checkAndStartActions, 1000);
