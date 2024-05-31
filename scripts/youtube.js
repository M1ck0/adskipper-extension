// const defined = (v) => v !== null && v !== undefined;
//
// const clickSkipButton = (adElement) => {
//   const skipButton = adElement.querySelector(".ytp-ad-skip-button-modern");
//
//   if (defined(skipButton)) {
//     skipButton.click();
//
//     return true;
//   }
// };
//
// const stopYoutubeAd = () => {
//   const adElement = document.querySelector(".ad-showing");
//
//   if (defined(adElement)) {
//     const video = adElement?.querySelector("video");
//
//     if (defined(video)) {
//       // const skipped = clickSkipButton(adElement);
//       //
//       // if (!skipped) {
//       video.currentTime = 99999;
//
//       clickSkipButton(adElement);
//
//       // }
//     }
//   }
//
//   const overlayAds = document.querySelectorAll(".ytp-ad-overlay-slot");
//
//   for (const overlayAd of overlayAds) {
//     overlayAd.style.visibility = "hidden";
//   }
// };
//
// const hideYoutubeShorts = () => {
//   const shortsHomePage = document.querySelectorAll("[is-shorts]");
//   const shortsHistoryPage = document.querySelectorAll(
//     "ytd-reel-shelf-renderer",
//   );
//   const shortsSidebar = document.querySelector('[title="Shorts"]');
//
//   if (shortsHomePage?.length) {
//     shortsHomePage.forEach((item) => item.remove());
//   }
//
//   if (shortsHistoryPage?.length) {
//     shortsHistoryPage.forEach((item) => item.remove());
//   }
//
//   if (shortsSidebar) {
//     shortsSidebar.remove();
//   }
// };
//
// const removeRecommendationsAtTheEnd = () => {
//   const recommendations = document.querySelectorAll(
//     ".ytd-player .ytp-ce-element",
//   );
//
//   if (recommendations?.length) {
//     recommendations.forEach((item) => item.remove());
//   }
// };
//
// chrome.storage.sync
//   .get([
//     "youtube-ads",
//     "youtube-shorts",
//     "youtube-errors",
//     "youtube-recommendations",
//   ])
//   .then(
//     ({
//       "youtube-ads": youtubeAds,
//       "youtube-shorts": youtubeShorts,
//       "youtube-errors": youtubeErrors,
//       "youtube-recommendations": youtubeRecommendations,
//     }) => {
//       setInterval(() => {
//         if (youtubeAds === true || youtubeAds === undefined) {
//           try {
//             stopYoutubeAd();
//           } catch (e) {
//             if (youtubeErrors) {
//               // Extract relevant information from the error object
//               const errorInfo = {
//                 stack: e.stack,
//               };
//
//               // Save the error information to chrome storage
//               chrome.storage.sync.set({ "youtube-error-message": errorInfo });
//             }
//           }
//         }
//
//         if (youtubeShorts) {
//           try {
//             hideYoutubeShorts();
//           } catch (e) {
//             console.error(e);
//           }
//         }
//
//         if (youtubeRecommendations) {
//           try {
//             removeRecommendationsAtTheEnd();
//           } catch (e) {
//             console.error(e);
//           }
//         }
//       }, 70);
//     },
//   );

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
};

const stopYoutubeAd = () => {
  const adElement = document.querySelector(".ad-showing");

  if (defined(adElement)) {
    const video = adElement.querySelector("video");

    if (defined(video) && video.closest(".ad-interrupting")) {
      video.currentTime = video.duration;
    }
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

// Function to start observing the DOM based on user settings
const startObservers = (settings) => {
  const {
    "youtube-ads": youtubeAds,
    "youtube-shorts": youtubeShorts,
    "youtube-errors": youtubeErrors,
    "youtube-recommendations": youtubeRecommendations,
  } = settings;

  const observerCallback = (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "attributes") {
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
      }
    });
  };

  const observer = new MutationObserver(observerCallback);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });

  // Initial check in case elements are already present
  if (youtubeAds !== false) {
    stopYoutubeAd();
  }
  if (youtubeShorts) {
    hideYoutubeShorts();
  }
  if (youtubeRecommendations) {
    removeRecommendationsAtTheEnd();
  }
};

// Load user settings and start observers
chrome.storage.sync
  .get([
    "youtube-ads",
    "youtube-shorts",
    "youtube-errors",
    "youtube-recommendations",
  ])
  .then((settings) => {
    startObservers(settings);
  });
