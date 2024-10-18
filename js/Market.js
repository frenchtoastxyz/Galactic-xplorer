import { localStorageGet, localStorageSet } from './Utils.js';

// Cached DOM element for spendable BQB
const $spendableBQB = $('#spendableBQB');

// Prices for buying and selling resources
const marketPrices = {
    1: { buy: 10, sell: 5 },
    2: { buy: 20, sell: 10 },
    3: { buy: 50, sell: 25 },
    4: { buy: 100, sell: 50 },
    5: { buy: 200, sell: 100 },
    6: { buy: 500, sell: 250 },
    7: { buy: 1000, sell: 500 },
    8: { buy: 2000, sell: 1000 },
    9: { buy: 5000, sell: 2500 },
    10: { buy: 10000, sell: 5000 },
    11: { buy: 20000, sell: 10000 },
    12: { buy: 50000, sell: 25000 },
    13: { buy: 100000, sell: 50000 },
    14: { buy: 200000, sell: 100000 },
    15: { buy: 500000, sell: 250000 }
};

// Update quantities of resources in the market
const updateMarketDisplay = () => {
    for (let resourceNum = 1; resourceNum <= 15; resourceNum++) {
        const resourceQty = localStorageGet(`resource${resourceNum}Qty`, 0);
        $(`#quantity${resourceNum}`).text(resourceQty);
    }

    const spendableBQB = localStorageGet('spendableBQB', 0);
    $spendableBQB.text(spendableBQB.toFixed(2));
};

// Buy a resource
const buyResource = (resourceId) => {
    const buyPrice = marketPrices[resourceId].buy;
    let spendableBQB = localStorageGet('spendableBQB', 0);

    if (spendableBQB >= buyPrice) {
        spendableBQB -= buyPrice;
        localStorageSet('spendableBQB', spendableBQB);

        const currentQty = localStorageGet(`resource${resourceId}Qty`, 0);
        localStorageSet(`resource${resourceId}Qty`, currentQty + 1);

        updateMarketDisplay();
        alert(`Bought 1 Resource ${resourceId}`);
    } else {
        alert('Not enough BQB to buy this resource.');
    }
};

// Sell a resource
const sellResource = (resourceId) => {
    const sellPrice = marketPrices[resourceId].sell;
    let currentQty = localStorageGet(`resource${resourceId}Qty`, 0);

    if (currentQty > 0) {
        currentQty -= 1;
        localStorageSet(`resource${resourceId}Qty`, currentQty);

        let spendableBQB = localStorageGet('spendableBQB', 0);
        spendableBQB += sellPrice;
        localStorageSet('spendableBQB', spendableBQB);

        updateMarketDisplay();
        alert(`Sold 1 Resource ${resourceId}`);
    } else {
        alert('Not enough of this resource to sell.');
    }
};

// Event listeners for market actions
$(document).ready(function () {
    updateMarketDisplay();

    $('.buyButton').on('click', function () {
        const resourceId = $(this).data('resource');
        buyResource(resourceId);
    });

    $('.sellButton').on('click', function () {
        const resourceId = $(this).data('resource');
        sellResource(resourceId);
    });

    $('#mainPageButton').on('click', function () {
        window.location.href = 'Index.html';
    });
});
