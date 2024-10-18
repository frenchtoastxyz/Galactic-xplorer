import { localStorageGet, localStorageSet } from './utils.js';

// Update the research buttons and prerequisites
const updateResearchButtons = () => {
    const researchBoost1Unlocked = localStorageGet('researchBoost1Unlocked', false);
    const storageUpgrade1Unlocked = localStorageGet('storageUpgrade1Unlocked', false);
    const researchBoost2Unlocked = localStorageGet('researchBoost2Unlocked', false);
    const storageUpgrade2Unlocked = localStorageGet('storageUpgrade2Unlocked', false);
    const researchBoost3Unlocked = localStorageGet('resourceBoost3Unlocked', false);
    const storageUpgrade3Unlocked = localStorageGet('storageUpgrade3Unlocked', false);
    const automation1Unlocked = localStorageGet('automation1Unlocked', false);
    const automation2Unlocked = localStorageGet('automation2Unlocked', false);
    const enhancedEfficiencyUnlocked = localStorageGet('enhancedEfficiencyUnlocked', false);

    // Unlock Resource Boost II and Storage Upgrade II
    if (researchBoost1Unlocked) {
        $('#researchBoost2').removeClass('disabled').removeAttr('disabled');
    }
    if (storageUpgrade1Unlocked) {
        $('#storageUpgrade2').removeClass('disabled').removeAttr('disabled');
    }
    if (researchBoost2Unlocked) {
        $('#researchBoost3').removeClass('disabled').removeAttr('disabled');
    }
    if (storageUpgrade2Unlocked) {
        $('#storageUpgrade3').removeClass('disabled').removeAttr('disabled');
    }
    if (researchBoost3Unlocked && storageUpgrade3Unlocked) {
        $('#automation2').removeClass('disabled').removeAttr('disabled');
    }
    if (automation1Unlocked) {
        $('#automation2').removeClass('disabled').removeAttr('disabled');
    }
    if (automation2Unlocked) {
        $('#enhancedEfficiency').removeClass('disabled').removeAttr('disabled');
    }
};

// Unlock the research if the player has enough resources
const unlockResearch = (researchId, bqbCost, resource1Cost, resource2Cost, resource3Cost, unlockedKey) => {
    if (hasEnoughResources(bqbCost, resource1Cost, resource2Cost, resource3Cost)) {
        deductResources(bqbCost, resource1Cost, resource2Cost, resource3Cost);
        localStorageSet(unlockedKey, true);
        $(`#${researchId}`).addClass('disabled').attr('disabled', true).text('Research Completed');
        updateResearchButtons();
    } else {
        alert('Not enough resources or BQB to complete this research!');
    }
};

// Check if player has enough BQB and resources for research
const hasEnoughResources = (bqbCost, resource1Cost, resource2Cost, resource3Cost) => {
    const currentBQB = localStorageGet('spendableBQB', 0);
    const currentResource1 = localStorageGet('resource1Qty', 0);
    const currentResource2 = localStorageGet('resource2Qty', 0);
    const currentResource3 = localStorageGet('resource3Qty', 0);

    return currentBQB >= bqbCost &&
           currentResource1 >= resource1Cost &&
           currentResource2 >= resource2Cost &&
           currentResource3 >= resource3Cost;
};

// Deduct the resources and BQB when research is completed
const deductResources = (bqbCost, resource1Cost, resource2Cost, resource3Cost) => {
    const currentBQB = localStorageGet('spendableBQB', 0) - bqbCost;
    localStorageSet('spendableBQB', currentBQB);

    const currentResource1 = localStorageGet('resource1Qty', 0) - resource1Cost;
    const currentResource2 = localStorageGet('resource2Qty', 0) - resource2Cost;
    const currentResource3 = localStorageGet('resource3Qty', 0) - resource3Cost;

    localStorageSet('resource1Qty', currentResource1);
    localStorageSet('resource2Qty', currentResource2);
    localStorageSet('resource3Qty', currentResource3);
};

// Event listeners for research buttons
$(document).ready(function () {
    updateResearchButtons();

    $('#researchBoost1').on('click', function () {
        unlockResearch('researchBoost1', 100, 50, 20, 10, 'researchBoost1Unlocked');
    });

    $('#storageUpgrade1').on('click', function () {
        unlockResearch('storageUpgrade1', 150, 100, 50, 25, 'storageUpgrade1Unlocked');
    });

    $('#researchBoost2').on('click', function () {
        unlockResearch('researchBoost2', 200, 150, 100, 50, 'researchBoost2Unlocked');
    });

    $('#storageUpgrade2').on('click', function () {
        unlockResearch('storageUpgrade2', 300, 200, 150, 100, 'storageUpgrade2Unlocked');
    });

    $('#automation1').on('click', function () {
        unlockResearch('automation1', 500, 500, 300, 150, 'automation1Unlocked');
    });

    $('#resourceBoost3').on('click', function () {
        unlockResearch('resourceBoost3', 500, 400, 200, 100, 'resourceBoost3Unlocked');
    });

    $('#storageUpgrade3').on('click', function () {
        unlockResearch('storageUpgrade3', 600, 500, 250, 150, 'storageUpgrade3Unlocked');
    });

    $('#automation2').on('click', function () {
        unlockResearch('automation2', 1000, 600, 400, 200, 'automation2Unlocked');
    });

    $('#enhancedEfficiency').on('click', function () {
        unlockResearch('enhancedEfficiency', 1200, 800, 500, 300, 'enhancedEfficiencyUnlocked');
    });

    $('#mainPageButton').on('click', function () {
        window.location.href = 'index.html';
    });
});
