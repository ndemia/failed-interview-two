export const showMessage = (messageType: string, itemName?: string): void => {
	const dashboardMessageContainer = document.querySelector('.dashboard__warning-container') as HTMLElement;
	const dashboardMessage = document.querySelector('.dashboard__warning') as HTMLElement;
	const dashboardMessageText = document.querySelector('.dashboard__warning .warning__text') as HTMLElement;
	const marketMessageContainer = document.querySelector('.market__warning-container') as HTMLElement;
	const marketMessage = document.querySelector('.market__warning') as HTMLElement;
	const marketMessageText = document.querySelector('.market__warning .warning__text') as HTMLSpanElement;

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
			break;
		case 'successfulPurchase':
			dashboardMessageContainer.classList.remove('hidden');
			dashboardMessage.classList.add('warning--secondary');
			dashboardMessageText.innerText = `Your purchase was successful.`;
		default:
			marketMessageContainer.classList.remove('hidden');
			marketMessageText.innerText = `There was a general error. Try reloading the page to fix it.`;
	}
};

export const removeMessage = (): void => {
	const marketWarningContainer = document.querySelector('.market__warning-container') as HTMLElement;
	marketWarningContainer.classList.add('hidden');
};
