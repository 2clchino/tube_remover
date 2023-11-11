var url = ""
function temp() {
    browser.storage.local.get("channels").then(result => {
        const subscribedChannels = result.channels;
        if (subscribedChannels && Array.isArray(subscribedChannels)) {
            const querySelector = '#video-title';
            // console.log(subscribedChannels)
            let targetElement = null;
            if (url.includes('/watch?')) {
                targetElement = document
                    .getElementById('related')
                    ?.querySelector('#items');
                console.log(targetElement)
            } else {
                targetElement = document.getElementById('contents');
            }
            // targetElement = document.getElementById('contents');
            if (targetElement != null) {
                const removeElement = remove(querySelector)(subscribedChannels);
                removeElement(targetElement.childNodes);
                // observe(removeElement, targetElement);
            }
        } else {
            console.log("channelsが見つかりません。");
        }
    }).catch(error => {
        console.error("値の取得中にエラーが発生しました: " + error);
    });
}

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "initRemover"){
        url = message.url;
        console.log(url)
        console.log("tube remover initialized.")
    }
});

const remove = (querySelector) => (subscribedChannels) => (targetNodes) => {
    var removed = []
    targetNodes.forEach((node) => {
        node.querySelectorAll(querySelector).forEach((titleElement) => {
            const videoInfo = getVideoInfo(titleElement.outerHTML)
            if (videoInfo != null){
                // console.log(`${videoInfo.chName}: ${videoInfo.viewCnt}`)
                if (!subscribedChannels.includes(videoInfo.chName) && videoInfo.viewCnt < 2000) {
                    node.remove();
                    if (!removed.includes(videoInfo.chName)) {
                        removed.push(videoInfo.chName);
                    }
                }
            }
        });
    });
    if (removed.length > 0) {
        console.log(removed)
    }
    browser.storage.local.get("removed").then(result => {
        let last_removed = result.removed || [];
        var array = [...new Set([...removed, ...last_removed])];
        if (array.length > 10) {
            array = array.slice(0, 10)
        }
        browser.storage.local.set({ "removed": array });
    });
};

function getVideoInfo(text){
    if (text == null)
    return;
    const info = text.match(/作成者: (.*?) 回視聴/);
    if (info == null)
    return;
    if (info.length > 0) {
        const array = info[0].split(" ");
        const viewStr = array[array.length - 2];
        const viewCnt = parseInt(viewStr.replace(/,/g, ''), 10);
        const chName = array.slice(1, -2).join(" ")
        return { viewCnt: viewCnt, chName: chName }
    }
}
  
function observe(func, targetElement) {
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            func(mutation.addedNodes);
        });
    });
  
    const observeConfig = {
        attributes: false,
        characterData: false,
        childList: true,
    };
  
    mutationObserver.observe(targetElement, observeConfig);
}

/*
window.onload = function() {
    console.log("すべてのリソースが読み込まれました");
    temp();
};*/

const mainInterval = setInterval(temp, 1000);