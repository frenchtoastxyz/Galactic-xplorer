import { localStorageGet, localStorageSet, getRandomNumber, shouldAddAdditionalRow } from './Utils.js';

// Cache DOM elements for efficiency
const $tableBody = $('#planetTable tbody');
const $totalBQBValue = $('#totalBQBValue');
const $spendableBQB = $('#spendableBQB');

// Function to add a new row
$(document).on('click', '#addRowButton', function () {
    const rowData = {
        planet: getRandomNumber(2, 20),
        moons: getRandomNumber(0, 1000),
        asteroids: getRandomNumber(5000, 100000),
    };

    const resources = calculateResources(rowData.planet, rowData.moons, rowData.asteroids);
    const bqbValue = calculateBQBValue(rowData.planet, rowData.moons, rowData.asteroids);
    const newRow = createTableRow('Class 1', rowData, resources, bqbValue);

    // Add row to table
    $tableBody.append(newRow);
    addResourcesToStorage(resources);

    // Check for Automation II benefit
    const automation2Unlocked = localStorageGet('automation2Unlocked', false);
    if (automation2Unlocked && shouldAddAdditionalRow()) {
        const additionalRow = createTableRow('Class 1', rowData, resources, bqbValue);
        $tableBody.append(additionalRow);
        addResourcesToStorage(resources);
    }

    updateTotalBQBValue();
    saveTableState();
});

// Function to calculate resources
const calculateResources = (planet, moons, asteroids) => {
    let resourceBoostMultiplier = 1;
    const resourceBoost1Unlocked = localStorageGet('researchBoost1Unlocked', false);
    const resourceBoost2Unlocked = localStorageGet('researchBoost2Unlocked', false);
    const resourceBoost3Unlocked = localStorageGet('resourceBoost3Unlocked', false);

    if (resourceBoost1Unlocked) resourceBoostMultiplier += 0.1;
    if (resourceBoost2Unlocked) resourceBoostMultiplier += 0.2;
    if (resourceBoost3Unlocked) resourceBoostMultiplier += 0.3;

    const resourceOne = resourceBoostMultiplier * (planet / 10 + moons / 500 + asteroids / 10000);
    const resourceTwo = resourceOne * 5;
    const resourceThree = resourceOne * 50;

    return [resourceOne, resourceTwo, resourceThree];
};

// Function to create a table row
const createTableRow = (dataClass, rowData, resources, bqbValue) => {
    const row = `<tr>
        <td><input type="checkbox" class="row-select"></td>
        <td class="data-class">${dataClass}</td>
        <td>${rowData.planet}</td>
        <td>Type A</td>
        <td>${rowData.moons}</td>
        <td>Type B</td>
        <td>${rowData.asteroids}</td>
        <td>Type C</td>
        <td>${rowData.planet + rowData.moons + rowData.asteroids}</td>
        <td class="resource-1">Resource 1: ${resources[0].toFixed(2)}</td>
        <td class="resource-2">Resource 2: ${resources[1].toFixed(2)}</td>
        <td class="resource-3">Resource 3: ${resources[2].toFixed(2)}</td>
        <td>${bqbValue.toFixed(2)}</td>
    </tr>`;
    return row;
};

// Function to calculate BQB value
const calculateBQBValue = (planet, moons, asteroids) => {
    return planet * 2 + moons * 0.5 + asteroids * 0.1;
};

// Function to add resources to storage
const addResourcesToStorage = (resources) => {
    for (let i = 0; i < resources.length; i++) {
        const resourceQty = localStorageGet(`resource${i + 1}Qty`, 0) + resources[i];
        localStorageSet(`resource${i + 1}Qty`, resourceQty);
    }
};

// Function to update total BQB value
const updateTotalBQBValue = () => {
    let totalBQB = 0;
    $tableBody.find('tr').each(function () {
        totalBQB += parseFloat($(this).find('td').eq(12).text());
    });
    $totalBQBValue.text(totalBQB.toFixed(2));

    // Update spendable BQB
    const spendableBQB = localStorageGet('spendableBQB', 0) + totalBQB;
    localStorageSet('spendableBQB', spendableBQB);
    $spendableBQB.text(spendableBQB.toFixed(2));
};

// Function to save table state
const saveTableState = () => {
    const tableData = [];
    $tableBody.find('tr').each(function () {
        const $cells = $(this).find('td');
        tableData.push({
            dataClass: $cells.eq(1).text(),
            planet: parseInt($cells.eq(2).text()),
            moons: parseInt($cells.eq(4).text()),
            asteroids: parseInt($cells.eq(6).text()),
            resources: [
                parseFloat($cells.eq(9).text().split(': ')[1]),
                parseFloat($cells.eq(10).text().split(': ')[1]),
                parseFloat($cells.eq(11).text().split(': ')[1]),
            ],
            bqbValue: parseFloat($cells.eq(12).text()),
        });
    });
    localStorageSet('tableData', tableData);
};

// Function to delete selected rows
$(document).on('click', '#deleteButton', function () {
    // Find checked rows and remove them
    $('.row-select:checked').closest('tr').remove();
    updateTotalBQBValue();
    saveTableState();
});

// Function to upgrade rows
const upgradeRows = (currentClass, nextClass, newResources) => {
    const rowsToUpgrade = [];
    const rows = $tableBody.find('tr');

    // Find rows of the current class
    rows.each(function () {
        const $row = $(this);
        const rowClass = $row.find('.data-class').text();

        if (rowClass === currentClass) {
            rowsToUpgrade.push($row);
        }
    });

    // Upgrade if between 5 and 11 rows of the same class exist
    if (rowsToUpgrade.length >= 5 && rowsToUpgrade.length <= 11) {
        rowsToUpgrade.forEach($row => {
            // Upgrade class
            $row.find('.data-class').text(nextClass);

            // Reduce resources by 20% and assign new resources for the upgraded class
            for (let i = 1; i <= 3; i++) {
                const currentResourceValue = parseFloat($row.find(`.resource-${i}`).text().split(': ')[1]) * 0.8;
                const newResourceNumber = newResources[i - 1];
                $row.find(`.resource-${i}`).text(`Resource ${newResourceNumber}: ${currentResourceValue.toFixed(2)}`);
            }
        });
        saveTableState();
    }
};

// Event listener for upgrade button
$(document).on('click', '#upgradeButton', function () {
    upgradeRows('Class 1', 'Class 2', [4, 5, 6]);
    upgradeRows('Class 2', 'Class 3', [7, 8, 9]);
    upgradeRows('Class 3', 'Class 4', [10, 11, 12]);
    upgradeRows('Class 4', 'Class 5', [13, 14, 15]);
});

// Navigation buttons
$(document).on('click', '#researchButton', function () {
    window.location.href = 'Research.html';
});

$(document).on('click', '#marketButton', function () {
    window.location.href = 'Market.html';
});

$(document).on('click', '#storageButton', function () {
    window.location.href = 'Storage.html';
});
