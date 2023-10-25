function listenForClicks() {
    document.addEventListener("click", (e) => {
        function updateChannels(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "updateChannels"
            });
        }

        function reportError(error) {
            console.error(`Could not update channels: ${error}`);
        }

        if (e.target.classList.contains("add")) {
            const inputElement = document.querySelector("input[type='text']");
            const channelName = inputElement.value;
            browser.storage.local.get("channels").then(result => {
                let channels = result.channels || [];
                if (!channels.includes(channelName)) {
                    channels.push(channelName);
                } else {
                    const messageElement = document.createElement("p");
                    messageElement.textContent = "Channel is already added";
                    document.getElementById("popup-content").appendChild(messageElement);
                }
                return browser.storage.local.set({ channels });
            })
            .then(() => {
                const messageElement = document.createElement("p");
                messageElement.textContent = "Channel added: " + channelName;
                document.getElementById("popup-content").appendChild(messageElement);
            })
            .catch(reportError);
        } else if (e.target.classList.contains("clear")) {
            browser.storage.local.set({ channels: [] });
            const messageElement = document.createElement("p");
            messageElement.textContent = "Channels cleared.";
            document.getElementById("popup-content").appendChild(messageElement);
        } else if (e.target.classList.contains("update")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(updateChannels)
                .catch(reportError);
        }
    });
}

function onActivePopup() {
    browser.storage.local.get("removed").then(result => {
        let blocked = result.removed || [];
        const buttonsContainer = document.getElementById("buttons-container");

        blocked.forEach(site => {
            const buttonContainer = document.createElement("div");
            buttonContainer.id = "button-container";
            const buttonElement = document.createElement("button");
            buttonElement.textContent = "+";
            buttonElement.addEventListener("click", () => {
                console.log("Unblocking: " + site);
            });
            const pElement = document.createElement("p");
            pElement.textContent = site;
            buttonContainer.appendChild(buttonElement);
            buttonContainer.appendChild(pElement);
            buttonsContainer.appendChild(buttonContainer)
        });
    }).catch(error => {
        console.error("値の取得中にエラーが発生しました: " + error);
    });
}
onActivePopup();
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute Update Channels: ${error.message}`);
}

browser.tabs.executeScript({file: "/content_scripts/subscribe_list.js"})
    .then(listenForClicks)
    .catch(reportExecuteScriptError);