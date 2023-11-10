function temp() {
    browser.storage.local.get("channels").then(result => {
        const subscribedChannels = result.channels;
        if (subscribedChannels && Array.isArray(subscribedChannels)) {
            const querySelector = '#video-title';
            console.log(subscribedChannels)
            let targetElement = null;
            /*
            if (~url.indexOf('/watch?')) {
                targetElement = document
                  .getElementById('related')
                  ?.querySelector('#items');
            } else {
                targetElement = document.getElementById('contents');
            }*/
            targetElement = document.getElementById('contents');
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

const remove = (querySelector) => (subscribedChannels) => (targetNodes) => {
    var removed = []
    targetNodes.forEach((node) => {
        node.querySelectorAll(querySelector).forEach((titleElement) => {
            // console.log(`${videoInfo.chName}: ${videoInfo.viewCnt}`)
            const videoInfo = getVideoInfo(titleElement.outerHTML)
            if (videoInfo != null){
                if (!subscribedChannels.includes(videoInfo.chName) && videoInfo.viewCnt < 2000) {
                    node.remove();
                    if (!removed.includes(videoInfo.chName)) {
                        removed.push(videoInfo.chName);
                    }
                }
            }
        });
    });
    console.log(removed)
    browser.storage.local.set({ "removed": removed });
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

window.onload = function() {
    console.log("すべてのリソースが読み込まれました");
};

const mainInterval = setInterval(temp, 1000);