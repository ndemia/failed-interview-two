import { user, item } from './types';
import { service } from './service.js';
import { removeMessage, showMessage } from './messages.js';
import { closeModal, loadModalFunctionality } from './modal.js';
import * as sound from './sounds.js';

// UI Variables //
const dashboardProductList = document.getElementById('stock') as HTMLUListElement;
const modalProductList = document.querySelector('.products__list') as HTMLUListElement;
const soundControl = document.querySelector('.sound__control') as HTMLButtonElement;

// Functions //
const showCurrentStock = (stock: item[]): void => {
	stock.forEach((item) => {
		// Product list for the dashboard.
		dashboardProductList.insertAdjacentHTML(
			'beforeend',
			`<li class="dashboard__item">
				<div class="item__container item__container--texture">
					<img src="assets/images/${item.filename}.png" class="item__image" alt="A ${item.name}"/>
					<div class="item__info">
						<h3 class="item__name">${item.name}</h3>
						<div class="item__info--container">
							<span class="item__quantity js-item-quantity" data-item-id="${item.id}">Quantity: ${item.quantity}</span>
							<span class="item__price" data-item-id="${item.id}">Price: ${item.price} gold</span>
						</div>
					</div>
				</div>
			</li>`
		);
		// Product list for the modal.
		modalProductList.insertAdjacentHTML(
			'beforeend',
			`<li class="products__item">
				<div class="item__container">
				<img src="assets/images/${item.filename}.png" class="item__image" alt="A ${item.name}">
					<div class="item__info">
						<h3 class="item__name">${item.name}</h3>
						<div class="item__details">
							<span class="item__quantity js-item-description-quantity" data-item-id="${item.id}">Quantity: ${item.quantity}</span>
							<span class="item__price" data-item-id="${item.id}">Price: ${item.price}</span>
						</div>
					</div>
					<div class="item__actions" data-item-id="${item.id}">
						<button class="item__decrease js-market-decrease" aria-label="Decrease ${item.name} quantity">-</button>
						<input type="number" name="item__quantity" class="item__quantity js-item-quantity" value="0" min="0" max="${item.quantity}" data-item-id="${item.id}" data-item-name="${item.name}" aria-label="${item.name} quantity" role="status">
						<button class="item__increase js-market-increase" aria-label="Increase ${item.name} quantity">+</button>	
					</div>
					<span class="item__cost js-item-cost" role="status">0 gold</span>
				</div>
			</li>`
		);
	});
};

const areSoundsEnabled = (): boolean => {
	return localStorage.getItem('sounds') === 'on' ? true : false;
};

const enableSounds = (): void => {
	const soundIcon = document.querySelector('.js-button-sound') as HTMLButtonElement;
	soundIcon.innerHTML = `<svg viewBox="294 384 24 24" class="sound__icon">
		<path d="M296,391.625c0,0.173,0.14,0.313,0.313,0.313h1.25v12.188c0,0.026,0.022,0.043,0.028,0.067s-0.006,0.049,0.005,0.072c0.01,0.021,0.03,0.031,0.044,0.049c0.014,0.017,0.024,0.03,0.041,0.044c0.056,0.047,0.121,0.079,0.193,0.08c0,0,0,0,0.001,0s0,0,0,0c0.047,0,0.094-0.011,0.139-0.032l4.235-2.118l4.235,2.118c0.044,0.021,0.093,0.032,0.14,0.032c0.073,0,0.139-0.033,0.195-0.081c0.016-0.013,0.025-0.025,0.039-0.042c0.015-0.018,0.035-0.028,0.046-0.05c0.012-0.024,0-0.05,0.005-0.074c0.006-0.024,0.027-0.04,0.027-0.065v-12.188c4.819,0,7.813,1.317,7.813,3.438c0,0.173,0.14,0.313,0.313,0.313s0.313-0.14,0.313-0.313v-8.75c0-0.173-0.14-0.313-0.313-0.313s-0.313,0.14-0.313,0.313c0,2.12-2.993,3.438-7.813,3.438h-10.625c-0.173,0-0.313,0.14-0.313,0.313V391.625z"/>
	</svg>Sounds are on`;
	sound.coins.muted = false;
	sound.drawerOpen.muted = false;
	sound.drawerClose.muted = false;
};

const disableSounds = (): void => {
	const soundIcon = document.querySelector('.js-button-sound') as HTMLButtonElement;
	soundIcon.innerHTML = `<svg viewBox="294 384 24 24" class="sound__icon">
		<path d="M306.938,396.938c4.819,0,7.813,1.317,7.813,3.438c0,0.173,0.14,0.313,0.313,0.313s0.313-0.14,0.313-0.313v-8.75c0-0.173-0.14-0.313-0.313-0.313s-0.313,0.14-0.313,0.313c0,2.12-2.993,3.438-7.813,3.438h-10.625c-0.173,0-0.313,0.14-0.313,0.313v1.25c0,0.173,0.14,0.313,0.313,0.313h1.25H306.938z"/>
	</svg>Sounds are off`;
	sound.coins.muted = true;
	sound.drawerOpen.muted = true;
	sound.drawerClose.muted = true;
};

export const showGoldBalance = (goldAmount: number): void => {
	const goldBalance = document.querySelectorAll('.gold-balance') as NodeListOf<HTMLSpanElement>;
	goldBalance.forEach((balance) => {
		balance.innerText = `${goldAmount} gold`;
	});
};

export const showUserLogin = (login: string): void => {
	const userName = document.getElementById('user-name') as HTMLSpanElement;
	userName.innerText = `${login}`;
};

export const disableIncreaseButtons = (): void => {
	let quantityIncreaseButtons = document.querySelectorAll('.js-market-increase') as NodeListOf<HTMLButtonElement>;
	quantityIncreaseButtons.forEach((button) => {
		button.classList.add('btn--disabled');
		button.disabled = true;
	});
};

export const enableIncreaseButtons = (): void => {
	let quantityIncreaseButtons = document.querySelectorAll('.js-market-increase') as NodeListOf<HTMLButtonElement>;
	quantityIncreaseButtons.forEach((button) => {
		button.classList.remove('btn--disabled');
		button.disabled = false;
	});
};

export const disableDecreaseButtons = (): void => {
	let quantityDecreaseButtons = document.querySelectorAll('.js-market-decrease') as NodeListOf<HTMLButtonElement>;
	quantityDecreaseButtons.forEach((button) => {
		button.classList.add('btn--disabled');
		button.disabled = true;
	});
};

export const enableDecreaseButtons = (): void => {
	let quantityDecreaseButtons = document.querySelectorAll('.js-market-decrease') as NodeListOf<HTMLButtonElement>;
	quantityDecreaseButtons.forEach((button) => {
		button.classList.remove('btn--disabled');
		button.disabled = false;
	});
};

export const disableMarketActionsButtons = (): void => {
	let marketActionsButtons = document.querySelectorAll('.js-market-action') as NodeListOf<HTMLButtonElement>;
	marketActionsButtons.forEach((button) => {
		button.classList.add('btn--disabled');
		button.disabled = true;
	});
};

export const enableMarketActionsButtons = (): void => {
	let marketActionsButtons = document.querySelectorAll('.js-market-action') as NodeListOf<HTMLButtonElement>;
	marketActionsButtons.forEach((button) => {
		button.classList.remove('btn--disabled');
		button.disabled = false;
	});
};

export const showLoader = (location: string): void => {
	let loader;
	switch (location) {
		case 'dashboard':
			loader = document.querySelector('.js-loader-dashboard') as HTMLSpanElement;
			break;
		case 'modal':
			loader = document.querySelector('.js-loader-modal') as HTMLSpanElement;
			break;
		default:
			loader = document.querySelector('.js-loader-modal') as HTMLSpanElement;
			break;
	}
	loader.classList.remove('hidden');
};

export const hideLoader = (location: string): void => {
	let loader;
	switch (location) {
		case 'dashboard':
			loader = document.querySelector('.js-loader-dashboard') as HTMLSpanElement;
			break;
		case 'modal':
			loader = document.querySelector('.js-loader-modal') as HTMLSpanElement;
			break;
		default:
			loader = document.querySelector('.js-loader-modal') as HTMLSpanElement;
			break;
	}
	loader.classList.add('hidden');
};

export const toggleInteractionsAndLoader = (state: 'enable' | 'disable', location: string): void => {
	if (state === 'disable') {
		showLoader(location);
		disableIncreaseButtons();
		disableDecreaseButtons();
		disableMarketActionsButtons();
	} else {
		hideLoader(location);
		enableIncreaseButtons();
		enableDecreaseButtons();
		enableMarketActionsButtons();
	}
};

export const isThereStockAvailable = (itemQuantity: number, id: number | string, stock: item[]): boolean => {
	const itemId = Number(id);
	let availableItemStock: number = 0;
	// Match the item's ID and save its available stock.
	stock.forEach((item) => {
		if (item.id === itemId) {
			availableItemStock = item.quantity;
		}
	});
	// Check stock availability.
	if (itemQuantity <= availableItemStock) {
		return true;
	} else {
		return false;
	}
};

// Updates the total cost per item.
export const updateTotalItemCost = (quantity: number, id: string | number, stock: item[]): number => {
	const itemID = Number(id);
	let updatedTotalItemCost: number = 0;
	// Match the item's ID
	// Get the cost of the item from the db and return it.
	stock.forEach((item) => {
		if (item.id === itemID) {
			updatedTotalItemCost = quantity * item.price;
		}
	});
	return updatedTotalItemCost;
};

const doesTotalCostExceedBalance = (totalCost: number, userBalance: number): boolean => {
	if (totalCost <= userBalance) {
		return false;
	} else {
		return true;
	}
};

export const updateTotalCost = (userBalance: number): void => {
	const itemCosts = document.querySelectorAll('.js-item-cost') as NodeListOf<HTMLSpanElement>;
	const totalCostElement = document.querySelector('.js-total-value') as HTMLSpanElement;
	let totalCost: number = 0;
	itemCosts.forEach((cost) => {
		// Get and save each cost from each item.
		totalCost += Number(cost.innerText.slice(0, -5));
	});
	// Show total cost in the UI.
	totalCostElement.innerText = `${totalCost} gold`;
	// Check against user's balance.
	const result = doesTotalCostExceedBalance(totalCost, userBalance);
	// If it exceeds the user's balance, disable and show warning message.
	if (result === true) {
		showMessage('exceededBalance');
		disableIncreaseButtons();
		disableMarketActionsButtons();
	}
};

export const resetQuantities = (): void => {
	const itemQuantityInputs = document.querySelectorAll('.market .js-item-quantity') as NodeListOf<HTMLInputElement>;
	const itemCosts = document.querySelectorAll('.market .js-item-cost') as NodeListOf<HTMLInputElement>;
	const totalCostElement = document.querySelector('.js-total-value') as HTMLSpanElement;
	itemQuantityInputs.forEach((input) => {
		input.value = '0';
	});
	itemCosts.forEach((cost) => {
		cost.innerText = '0 gold';
	});
	totalCostElement.innerText = '0 gold';
	removeMessage('modal');
};

// Reflect stock changes on the dashboard and modal after purchase.
const updateAvailableStock = (stock: item[]): void => {
	const dashboardItemQuantities = document.querySelectorAll('.dashboard .js-item-quantity') as NodeListOf<HTMLSpanElement>;
	const marketItemQuantities = document.querySelectorAll('.market .js-item-description-quantity') as NodeListOf<HTMLSpanElement>;

	for (let i = 0; i < dashboardItemQuantities.length; i++) {
		// Compare item's IDs.
		if (Number(dashboardItemQuantities[i].dataset.itemId) === stock[i].id) {
			// Update the item's quantities on the dashboard and modal.
			dashboardItemQuantities[i].innerText = `Quantity: ${stock[i].quantity}`;
			marketItemQuantities[i].innerText = `Quantity: ${stock[i].quantity}`;
		}
	}
};

export const buyItems = async (): Promise<void> => {
	// Remove message warning in case it's present after a failed purchase
	removeMessage('modal');
	toggleInteractionsAndLoader('disable', 'modal');
	let finalItemQuantities = document.querySelectorAll('input.item__quantity') as NodeListOf<HTMLInputElement>;
	let finalGoldAmount: number = Number((document.querySelector('.market .total__value') as HTMLInputElement).innerText.slice(0, -5));

	try {
		// Get information from the db.
		const items = (await service.getItems().then((items) => items)) as item[];
		const user = (await service.getUser().then((user) => user)) as user;

		// Identify each item and compare IDs.
		for (let i = 0; i < finalItemQuantities.length; i++) {
			if (items[i].id === Number(finalItemQuantities[i].dataset.itemId)) {
				// Subtract that item's quantity from the db.
				items[i].quantity -= Number(finalItemQuantities[i].value);
			}
		}
		// Update the stock after the purchase providing the updated stock (new quantities).
		updateAvailableStock(items);

		// Subtract the final cost from the user's balance, and show it on the UI.
		user.balance -= finalGoldAmount;
		showGoldBalance(user.balance);

		// Re-enable interactions
		toggleInteractionsAndLoader('enable', 'modal');
		closeModal(document.querySelector('.modal') as HTMLDivElement);
		showMessage('successfulPurchase');
		sound.coins.play();
		// Remove the successful message from the dashboard.
		setTimeout(() => {
			removeMessage('dashboard');
		}, 5000);
	} catch (error) {
		toggleInteractionsAndLoader('enable', 'modal');
		showMessage('failedProcess');
	}
};

///// Go /////
document.addEventListener('DOMContentLoaded', async (): Promise<void> => {
	// If no previous sounds setting is found, set 'sounds off' as default for the first time.
	if (localStorage.getItem('sounds') === null) {
		localStorage.setItem('sounds', 'off');
	} else {
		// Check the sound setting and set the corresponding one.
		if (areSoundsEnabled() === true) {
			enableSounds();
		} else {
			disableSounds();
		}
	}

	try {
		showLoader('dashboard');

		// Get information from the db.
		const items = (await service.getItems().then((items) => items)) as item[];
		const user = (await service.getUser().then((user) => user)) as user;

		showGoldBalance(user.balance);
		showUserLogin(user.login);

		hideLoader('dashboard');
		// Show stock on the dashboard.
		showCurrentStock(items);
		// Pass the user and item stock to the modal/marketpalce so that it can be used to calculate stock and prices later.
		loadModalFunctionality(user, items);
	} catch (error) {
		hideLoader('dashboard');
		showMessage(error as string);
	}
});

soundControl.addEventListener('pointerdown', () => {
	// Toggle sounds on or off
	if (localStorage.getItem('sounds') === 'off') {
		localStorage.setItem('sounds', 'on');
		sound.soundsOn.play();
		enableSounds();
	} else {
		localStorage.setItem('sounds', 'off');
		sound.soundsOff.play();
		disableSounds();
	}
});
