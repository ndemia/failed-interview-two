export const showWarning = (warningType: string): void => {
	const dashboardWarningContainer = document.querySelector('.dashboard__warning-container') as HTMLElement;
	const dashboardWarning = document.querySelector('.dashboard__warning') as HTMLElement;
	const dashboardWarningText = document.querySelector('.dashboard__warning .warning__text') as HTMLElement;
	const marketWarningContainer = document.querySelector('.market__warning-container') as HTMLElement;
	const marketWarning = document.querySelector('.market__warning') as HTMLElement;
	const marketWarningText = document.querySelector('.market__warning .warning__text') as HTMLSpanElement;

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

export const removeWarning = (): void => {
	const warningContainer = document.querySelector('.market__warning') as HTMLElement;
	warningContainer.classList.add('hidden');
};
