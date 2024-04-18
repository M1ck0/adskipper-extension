const defined = (v) => v !== null && v !== undefined;

const clickSkipButton = (adElement) => {
  const skipButton = adElement.querySelector(".ytp-ad-skip-button-modern");

  if (defined(skipButton)) {
    skipButton.click();

    return true;
  }
};

const stopYoutubeAd = () => {
  const adElement = document.querySelector(".ad-showing");

  if (defined(adElement)) {
    const skipped = clickSkipButton(adElement);

    if (!skipped) {
      const video = adElement?.querySelector("video");

      video.currentTime = video.duration;

      clickSkipButton(adElement);
    }
  }

  const overlayAds = document.querySelectorAll(".ytp-ad-overlay-slot");

  for (const overlayAd of overlayAds) {
    overlayAd.style.visibility = "hidden";
  }
};

const hideYoutubeShorts = () => {
  const shortsHomePage = document.querySelectorAll("[is-shorts]");
  const shortsHistoryPage = document.querySelectorAll(
    "ytd-reel-shelf-renderer",
  );
  const shortsSidebar = document.querySelector('[title="Shorts"]');

  if (shortsHomePage?.length) {
    shortsHomePage.forEach((item) => item.remove());
  }

  if (shortsHistoryPage?.length) {
    shortsHistoryPage.forEach((item) => item.remove());
  }

  if (shortsSidebar) {
    shortsSidebar.remove();
  }
};

const removeRecommendationsAtTheEnd = () => {
  const recommendations = document.querySelectorAll(
    ".ytd-player .ytp-ce-element",
  );

  if (recommendations?.length) {
    recommendations.forEach((item) => item.remove());
  }
};

if (typeof window !== "undefined") {
  chrome.storage.sync
    .get([
      "youtube-ads",
      "youtube-shorts",
      "youtube-errors",
      "youtube-recommendations",
    ])
    .then(
      ({
        "youtube-ads": youtubeAds,
        "youtube-shorts": youtubeShorts,
        "youtube-errors": youtubeErrors,
        "youtube-recommendations": youtubeRecommendations,
      }) => {
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
        }).observe(document.querySelector(".html5-video-player"), {
          attributes: true,
        });
      },
    );
}
