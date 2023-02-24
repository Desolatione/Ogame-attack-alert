// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "notification") {
        // Create desktop notification
        chrome.notifications.create({
            type: "basic",
            title: "Ogame Attack Notifier",
            message: "You are under attack!",
            iconUrl: "128.png"
        });
    }
});

// Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        // Open options page after installation
        chrome.runtime.openOptionsPage();
    } else if (details.reason === "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from version " + details.previousVersion + " to " + thisVersion + ".");
    }
});

// Set up periodic check for new attacks
setInterval(function() {
    // Send message to content script to check for new attacks
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "check_attacks"});
    });
}, 60000); // Check every minute
