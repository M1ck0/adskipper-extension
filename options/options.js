// Defining constants
const WEBSITES = [
  {domain: "https://youtube.com", name: "youtube", sidebarName: "YouTube"},
  {domain: "https://xvideos.com", name: "xvideos", sidebarName: "XVideos"},
  {domain: "https://pornhub.com", name: "pornhub", sidebarName: "PornHub"},
];

const OPTIONS = {
  "youtube": ["ads", "shorts"],
  "xvideos": ["ads", "popup"],
  "pornhub": ["ads"],
};
const SAVE_BUTTON_ID = 'save';

// const DEFAULT_OPTIONS = {
//   "youtube-ads": true,
//   "youtube-shorts": false
// };
//
// chrome.runtime.onInstalled.addListener(() => {
//   // Store the default options in chrome.storage.sync
//   chrome.storage.sync.set(DEFAULT_OPTIONS);
// });

// Generic functions to operate on websites
const resetWebsiteAppearance = (website) => {
  document.getElementById(`data-item-${website.name}`).style.display = "none";
  document.getElementById(`link-item-${website.name}`).style.backgroundColor = "#fff";
}

const setActiveWebsite = (website) => {
  document.getElementById(`link-item-${website.name}`).style.backgroundColor = "#eee";
  document.getElementById(`data-item-${website.name}`).style.display = "flex";
}

// Adding Event Listeners to the links
document.addEventListener('DOMContentLoaded', function() {
  WEBSITES.forEach(function(website) {
    document.getElementById(`link-item-${website.name}`).addEventListener('click', function() {
      WEBSITES.forEach(resetWebsiteAppearance);
      setActiveWebsite(website);
    });
  });
  
  document.getElementById(`link-item-${WEBSITES[0].name}`).click();
});

// Restore and Save functions for options
const restoreOptions = () => {
  chrome.storage.sync.get((items) => {
    WEBSITES.forEach(website => {
      OPTIONS[website.name].forEach((option) => {
        const storedValue = items[`${website.name}-${option}`];
        
        // By default, set `ads` option to true. Other options default to false.
        const defaultValue = option === 'ads';
        
        document.getElementById(`switch-${website.name}-${option}`).checked = (storedValue !== undefined) ? storedValue : defaultValue;
      });
    });
  });
};

const saveOptions = () => {
  let options = {};
  WEBSITES.forEach(website => {
    OPTIONS[website.name].forEach(option => {
      options[`${website.name}-${option}`] = document.getElementById(`switch-${website.name}-${option}`).checked;
    });
  });
  
  chrome.storage.sync.set(options, function() {
    // Show message when item is saved
    document.getElementById('status').innerHTML = 'Options saved successfully.';
    
    setTimeout(() => {
      document.getElementById('status').innerHTML = '';
    }, 1500)
  });
};

// Adding Event Listeners for save button and initial load
document.addEventListener('DOMContentLoaded', function() {
  restoreOptions();
  document.getElementById(SAVE_BUTTON_ID).addEventListener('click', saveOptions);
  document.getElementById(`link-item-${WEBSITES[0].name}`).click();
});

// Use the Array.prototype.map method to create HTML for each website
const websiteHtml = WEBSITES.map((website) =>
  `<div class="link-item" id="link-item-${website.name}">
    <div class="link-item-title">
      <img
        src="https://www.google.com/s2/favicons?domain=${website.domain}&sz=128"
        alt="${website.name} logo"
        width="24"
      />
      <h5>${website.sidebarName}</h5>
    </div>
    <p>Toggle ${website.sidebarName} features on or off</p>
  </div>`
).join('');

// Add the generated HTML to your page
document.querySelector('.links').innerHTML = websiteHtml + document.querySelector('.links').innerHTML;
