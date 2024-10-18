import { localStorageGet } from './utils.js';

// Update the storage display with current resource quantities
const updateStorageDisplay = () => {
    for (let resourceNum = 1; resourceNum <= 15; resourceNum++) {
        const resourceQty = localStorageGet(`resource${resourceNum}Qty`, 0);
        $(`#resource${resourceNum}`).text(resourceQty);
    }
};

// Event listener for document ready to load storage information
$(document).ready(function () {
    updateStorageDisplay();

    // Optionally, add a return to main page button listener
    $('#mainPageButton').on('click', function () {
        window.location.href = 'index.html';
    });
});
