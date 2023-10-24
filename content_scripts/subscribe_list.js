browser.runtime.onMessage.addListener((message) => {
    const subscribedChannels = getSubscribedChannel().slice(12, -17);;
    console.log(subscribedChannels)
    browser.storage.local.set({ "channels" : subscribedChannels });
});

function getSubscribedChannel() {
    meta_blks = document.getElementsByClassName("title style-scope ytd-guide-entry-renderer");
    console.log(meta_blks);
    const channels = [];
    for (let i = 0; i < meta_blks.length; i++) {
        const element = meta_blks[i];
        channels.push (element.textContent);
    }
    return channels;
}