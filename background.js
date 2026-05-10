chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'foldersUpdated') {
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'foldersUpdated',
                    folders: message.folders
                }).catch(() => {});
            });
        });
    }
});

