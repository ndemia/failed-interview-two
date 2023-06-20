export const showWarning = (warningType) => {
    const dashboardWarningContainer = document.querySelector('.dashboard__warning-container');
    const dashboardWarning = document.querySelector('.dashboard__warning');
    const dashboardWarningText = document.querySelector('.dashboard__warning .warning__text');
    const marketWarningContainer = document.querySelector('.market__warning-container');
    const marketWarning = document.querySelector('.market__warning');
    const marketWarningText = document.querySelector('.market__warning .warning__text');
    switch (warningType) {
        case 'exceededBalance':
            marketWarningContainer.classList.remove('hidden');
            marketWarningText.innerText = `The total cost exceeds your current gold balance.`;
            break;
        case 'notEnoughStock':
            marketWarningContainer.classList.remove('hidden');
            marketWarningText.innerText = `You have exceeded the maximum quantity for this item.`;
            break;
        case 'failedProcess':
            marketWarningContainer.classList.remove('hidden');
            marketWarningText.innerText = `There was a problem processing your purchase. Try again.`;
            break;
        case 'failedFetch':
            dashboardWarningContainer.classList.remove('hidden');
            dashboardWarning.classList.add('warning--secondary');
            dashboardWarningText.innerText = `We had a problem getting the information from the database. Try reloading the page to fix it.`;
            break;
        default:
            marketWarningContainer.classList.remove('hidden');
            marketWarningText.innerText = `There was a general error. Try again later.`;
    }
};
export const removeWarning = () => {
    const warningContainer = document.querySelector('.market__warning');
    warningContainer.classList.add('hidden');
};
