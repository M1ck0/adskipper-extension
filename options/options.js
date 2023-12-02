// Defining constants
const WEBSITES = [
  {domain: "https://youtube.com", name: "youtube"},
];
const OPTIONS = {
  "youtube": ["ads", "shorts"],
};
const SAVE_BUTTON_ID = 'save';

// Generic functions to operate on websites
const resetWebsiteAppearance = (website) => {
  console.log('here: ', website)
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
      OPTIONS[website.name].forEach(option => {
        document.getElementById(`switch-${website.name}-${option}`).checked = items[`${website.name}-${option}`];
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
    <img
      src="https://www.google.com/s2/favicons?domain=${website.domain}&sz=128"
      alt="${website.name} logo"
      width="24"
    />
    <div>
      <h5>${website.name.charAt(0).toUpperCase() + website.name.slice(1)}</h5>
      <p>Toggle ${website.name.charAt(0).toUpperCase() + website.name.slice(1)} features on or off</p>
    </div>
  </div>`
).join('');

// Add the generated HTML to your page
document.querySelector('.links').innerHTML = websiteHtml + document.querySelector('.links').innerHTML;
