export const showWarning = (warningType) => {
    const warningContainer = document.querySelector('.market__warnings');
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
            warningText.innerText = `There was a problem processing your purchase. Please try again later.`;
            break;
        default:
            warningContainer.classList.remove('hidden');
            warningText.innerText = `There was a general error. Please try again later.`;
    }
};
