export const showWarning = (warningType) => {
    const warningContainer = document.querySelector('.market__warnings');
    const warning = document.querySelector('.warning');
    const warningText = document.querySelector('.warning__text');
    switch (warningType) {
        case 'exceededBalance':
            warningContainer.classList.remove('hidden');
            warningText.innerText = `The total cost exceeds your current gold balance.`;
            break;
        case 'notEnoughStock':
            warningContainer.classList.remove('hidden');
            warningText.innerText = `You have exceeded the maximum quantity for this item.`;
            break;
        case 'failedProcess':
            warningContainer.classList.remove('hidden');
            warningText.innerText = `There was a problem processing your purchase. Try again.`;
            break;
        case 'failedFetch':
            warningContainer.classList.remove('hidden');
            warning.classList.add('warning--secondary');
            warningText.innerText = `We had a problem getting the information from the database. Reloading the page should fix it.`;
            break;
        default:
            warningContainer.classList.remove('hidden');
            warningText.innerText = `There was a general error. Try again later.`;
    }
};
export const removeWarning = () => {
    const warningContainer = document.querySelector('.market__warnings');
    warningContainer.classList.add('hidden');
};
