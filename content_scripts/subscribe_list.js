browser.runtime.onMessage.addListener((message) => {
    console.log(message.command);
    if (message.command === "updateChannels") {
        const subscribedChannels = getSubscribedChannels().slice(12, -17);
        console.log(subscribedChannels);
        updateSubscribedChannels(subscribedChannels);
    }
});

async function updateSubscribedChannels(subscribedChannels) {
    try {
        const result = await browser.storage.local.get("channels");
        const last_data = result.channels || [];
        subscribedChannels.forEach(channel => {
            if (!last_data.includes(channel)) {
                last_data.push(channel);
            }
        });

        await browser.storage.local.set({ "channels": last_data });
        console.log("データが保存されました。");
    } catch (error) {
        console.error("エラーが発生しました: " + error);
    }
}

function getSubscribedChannels() {
    meta_blks = document.getElementsByClassName("title style-scope ytd-guide-entry-renderer");
    console.log(meta_blks);
    const channels = [];
    for (let i = 0; i < meta_blks.length; i++) {
        const element = meta_blks[i];
        channels.push (element.textContent);
    }
    return channels;
}