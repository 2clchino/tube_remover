var url = "";
let currentObserver = null;
const videoNodeSelector = 'ytd-rich-grid-media, ytd-compact-video-renderer';
function temp() {
    browser.storage.local.get("channels").then(result => {
        const subscribedChannels = result.channels;
        if (subscribedChannels && Array.isArray(subscribedChannels)) {
            const querySelector = 'ytd-rich-grid-media, ytd-compact-video-renderer';
            let targetElement = null;
            if (url.includes('/watch?')) {
                targetElement = document
                    .getElementById('related')
                    ?.querySelector('#items');
            } else {
                targetElement = document.getElementById('contents');
            }

            if (targetElement) {
                const removeElement = remove(querySelector)(subscribedChannels);
                removeElement(targetElement.childNodes);

                if (currentObserver) currentObserver.disconnect();
                currentObserver = observe(removeElement, targetElement);
            }
        } else {
            console.log("channelsが見つかりません。");
        }
    }).catch(e => console.error("値の取得中にエラーが発生しました:", e));
}

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

function getVideoInfo(text) {
    if (!text) return;
    const chMatch = text.match(/<div[^>]*id=["']tooltip["'][^>]*>([\s\S]*?)<\/div>/);
    if (!chMatch) return;
    const chName = chMatch[1].trim();
    const patterns = [
        /([\d,.]+)\s*([万億])?\s*回視聴/,
        /([\d,.]+)\s*([万億])?\s*人が視聴中/,
        /作成者:\s*.*?\s+([\d,]+)\s*回視聴/
    ];

    for (const re of patterns) {
        const m = text.match(re);
        if (!m) continue;
        const rawNum = m[1].replace(/,/g, '');
        const unit   = m[2] || '';
        let viewCnt  = parseFloat(rawNum);
        switch (unit) {
            case '万': viewCnt *= 1e4; break;
            case '億': viewCnt *= 1e8; break;
        }
        return { chName, viewCnt: Math.round(viewCnt) };
    }
}

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "initRemover") {
        url = message.url;
        temp();
    }
});

document.addEventListener('yt-navigate-finish', () => {
    url = location.pathname + location.search;
    temp();
});

function observe(func, targetElement) {
    const mo = new MutationObserver(mutations => {
        mutations.forEach(m => func(m.addedNodes));
    });
    mo.observe(targetElement, { childList: true });
    return mo;
}