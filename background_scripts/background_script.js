browser.tabs.onUpdated.addListener((tabId, info, tab) => {
    if (info.status === "complete" && tab.url && tab.url.includes('www.youtube.com'))
    browser.tabs.sendMessage(tabId, {
        command: "initRemover",
        url: tab.url
    });
});

browser.tabs.executeScript({file: "/content_scripts/rm_videos.js"})