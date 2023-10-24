function listenForClicks() {
    document.addEventListener("click", (e) => {
        function updateChannels(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "updateChannels"
            });
        }
        function reportError(error) {
            console.error(`Could not setting: ${error}`);
        }
        if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
            return;
        } 
        browser.tabs.query({active: true, currentWindow: true})
            .then(updateChannels)
            .catch(reportError);
    });
}

function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute Update Channels: ${error.message}`);
}

browser.tabs.executeScript({file: "/content_scripts/subscribe_list.js"})
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
  