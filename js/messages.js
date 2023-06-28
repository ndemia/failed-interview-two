export const showMessage = (messageType, itemName) => {
    const dashboardMessageContainer = document.querySelector('.dashboard__message-container');
    const dashboardMessage = document.querySelector('.dashboard__message');
    const dashboardMessageText = document.querySelector('.dashboard__message .message__text');
    const marketMessageContainer = document.querySelector('.market__message-container');
    const marketMessage = document.querySelector('.market__message');
    const marketMessageText = document.querySelector('.market__message .message__text');
    const iconContainer = document.querySelector('.message__icon');
    switch (messageType) {
        case 'exceededBalance':
            marketMessageContainer.classList.remove('hidden');
            marketMessageText.innerText = `The total cost exceeds your current gold balance.`;
            break;
        case 'notEnoughStock':
            marketMessageContainer.classList.remove('hidden');
            marketMessageText.innerText = `You have exceeded the maximum quantity for ${itemName}.`;
            break;
        case 'failedProcess':
            marketMessageContainer.classList.remove('hidden');
            marketMessageText.innerText = `There was a problem processing your purchase. Try again.`;
            break;
        case 'failedFetch':
            dashboardMessageContainer.classList.remove('hidden');
            dashboardMessage.classList.add('warning--secondary');
            dashboardMessageText.innerText = `We had a problem getting the information from the database. Try reloading the page to fix it.`;
            iconContainer.insertAdjacentHTML('afterbegin', `<svg viewBox="0 0 24 24" class="message__icon">
					<path d="m19.63 10.572 1.386-4.2c0.042-0.126 0.042-0.252-0.042-0.378s-0.21-0.168-0.336-0.168h-5.3338v-1.05c0-1.008-0.84-1.806-1.806-1.806h-8.2742v-1.05c0-0.252-0.168-0.42-0.42-0.42h-1.428c-0.252 0-0.42 0.168-0.42 0.42v20.16c0 0.252 0.168 0.42 0.42 0.42h1.428c0.252 0 0.42-0.168 0.42-0.42v-9.66h7.812v1.05c0 1.008 0.84 1.848 1.848 1.848h5.7542c0.126 0 0.252-0.084 0.336-0.168 0.084-0.126 0.084-0.252 0.042-0.378z"
					/>
				</svg>`);
            break;
        case 'successfulPurchase':
            dashboardMessageContainer.classList.remove('hidden');
            dashboardMessage.classList.add('warning--secondary');
            dashboardMessageText.innerText = `Your purchase was successful.`;
            iconContainer.insertAdjacentHTML('afterbegin', `<svg viewBox="0 0 24 24" class="message__icon">
					<path d="M20.521,3.79l-8.229-2.743c-0.19-0.063-0.396-0.063-0.586,0L3.479,3.79C3.09,3.92,2.836,4.294,2.857,4.705v5.952
					c-0.008,5.577,3.559,10.529,8.85,12.289c0.096,0.028,0.193,0.044,0.293,0.046c0.098,0.014,0.195,0.014,0.293-0.001
					c5.307-1.764,8.878-6.74,8.85-12.333V4.705C21.165,4.293,20.911,3.92,20.521,3.79z M17.323,9.909l-5.484,5.487
					c-0.173,0.172-0.406,0.267-0.649,0.265c-0.244,0.002-0.477-0.093-0.648-0.265l-2.744-2.743c-0.358-0.359-0.358-0.941,0-1.298
					c0.359-0.358,0.939-0.358,1.299,0l2.094,2.103l4.835-4.847c0.359-0.358,0.94-0.358,1.299,0C17.681,8.968,17.681,9.549,17.323,9.909z
					"
					/>
				</svg>`);
        default:
            marketMessageContainer.classList.remove('hidden');
            marketMessageText.innerText = `There was a general error. Try reloading the page to fix it.`;
    }
};
export const removeMessage = () => {
    const marketWarningContainer = document.querySelector('.market__message-container');
    marketWarningContainer.classList.add('hidden');
};
