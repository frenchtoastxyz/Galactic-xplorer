// Function to get an item from localStorage with a fallback default value
export const localStorageGet = (key, defaultValue) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
};

// Function to set an item in localStorage
export const localStorageSet = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

// Function to generate a random number between min and max (inclusive)
export const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to determine if an additional row should be added (for Automation II)
export const shouldAddAdditionalRow = () => {
    const chance = Math.random();
    return chance <= 0.10; // 10% chance
};
