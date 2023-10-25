// const newStyle = document.createElement('style');
// newStyle.innerText = '.ytd-video-meta-block{display:none!important;}';
function getVideoInfo() {
    meta_blks = document.getElementsByClassName("ytd-rich-item-renderer");
    browser.storage.local.get("channels").then(result => {
        const subscribedChannels = result.channels;
        if (subscribedChannels && Array.isArray(subscribedChannels)) {
            var removed = []
            for (let i = 0; i < meta_blks.length; i++) {
                const viewCnt = findElementsWithClass(meta_blks[i], '.inline-metadata-item.style-scope.ytd-video-meta-block');
                const chName = findElementsWithClass(meta_blks[i], '.style-scope.ytd-channel-name.complex-string');
                // console.log(chName)
                // console.log(viewCnt)
                var remove = false;
                if (filterByViewCount(viewCnt)) {
                    console.log(chName[0].textContent);
                    if (chName.length > 0) {
                        let element = chName[0]
                        if (!subscribedChannels.includes(element.textContent)) {
                            remove = true;
                            console.log(element.textContent);
                            if (!removed.includes(element.textContent)) {
                                removed.push(element.textContent);
                            }
                        }
                    }
                }
                meta_blks[i].style.visibility = remove ? "hidden" : "visible";
            }
            console.log(removed)
            browser.storage.local.set({ "removed": removed });
        } else {
            console.log("channelsが見つかりません。");
        }
    }).catch(error => {
        console.error("値の取得中にエラーが発生しました: " + error);
    });
}

// 再生回数が少なければ true
function filterByViewCount(elements) {
    for (let i = 0; i < elements.length; i++) {
        if (elements[0].textContent.match("視聴") || elements[0].textContent.match("待機")) {
            const num = extractAndConvertViews(elements[0].textContent)
            // console.log(num);
            if (num < 2000) {
                return true;
            }
        }
    }
    return false;
}

function findElementsWithClass(container, className) {
    const elements = container.querySelectorAll(className);
    return Array.from(elements);
}

function extractAndConvertViews(viewsText) {
    const match = viewsText.match(/[\d.]+/);
    if (match) {
        const number = parseFloat(match[0]);
        if (viewsText.includes("万")) {
            return number * 10000;
        }
        if (viewsText.includes("億")) {
            return number * 100000000;
        }
        return number;
    }
    return null;
}

const youtubeLogoButton = document.querySelector('#logo');
if (youtubeLogoButton) {
    youtubeLogoButton.addEventListener('click', function() {
        setTimeout(removeVideos, 1000);
    });
}

function removeVideos(){
    getVideoInfo();
}

setTimeout(removeVideos, 1000);