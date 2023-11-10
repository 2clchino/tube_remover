browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("hello")
    browser.tabs.sendMessage(tabs[0].id, {
        command: "hello"
    });
});