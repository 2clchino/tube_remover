function getVideoByRow() {
    browser.storage.local.get("channels").then(result => {
        const subscribedChannels = result.channels;
        if (subscribedChannels && Array.isArray(subscribedChannels)) {
            var removed = []
            const richGridRows = document.querySelectorAll('.style-scope.ytd-rich-grid-row#contents');
            const richGridRowsArray = Array.from(richGridRows);
            richGridRowsArray.forEach(function(richGridRow) {
                const itemRenderers = richGridRow.querySelectorAll('.ytd-rich-grid-media');
                const itemRendererArray = Array.from(itemRenderers);
                console.log(itemRendererArray.length)
                for (let j = 0; j < itemRendererArray.length; j++) {
                    const itemRenderer = itemRendererArray[j];
                    const viewCnt = findElementsWithClass(itemRenderer, '.inline-metadata-item.style-scope.ytd-video-meta-block');
                    const chName = findElementsWithClass(itemRenderer, '.style-scope.ytd-channel-name.complex-string');
                    var remove = false;
                    if (chName.length > 0) {
                        let element = chName[0]
                        remove = !subscribedChannels.includes(element.textContent) && filterByViewCount(viewCnt) < 2000
                        console.log(`${element.textContent}: ${filterByViewCount(viewCnt)} views. ${!subscribedChannels.includes(element.textContent)}, ${filterByViewCount(viewCnt) < 2000}, ${remove}`)
                        if (remove) {
                            var parentElement = itemRenderer.parentNode.parentNode.parentNode;
                            parentElement.style.display = remove ? "none" : "inline";
                            if (!removed.includes(element.textContent)) {
                                removed.push(element.textContent);
                            }
                        } 
                    }
                }
                console.log(removed)
                browser.storage.local.set({ "removed": removed });
            });
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
            return num;
        }
    }
    return 0;
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
var subInterval;
const youtubeLogoButton = document.querySelector('#logo');
if (youtubeLogoButton) {
    youtubeLogoButton.addEventListener('click', function() {
        setTimeout(getVideoByRow, 1000);
    });
}

window.onload = function() {
    console.log("すべてのリソースが読み込まれました");
};

const mainInterval = setInterval(getVideoByRow, 500);