import { user, item } from './types';
import { service } from './service.js';
import { removeMessage, showMessage } from './messages.js';
import { closeModal, loadModalFunctionality } from './modal.js';

// UI Variables //
const dashboardProductList = document.getElementById('stock') as HTMLUListElement;
const modalProductList = document.querySelector('.products__list') as HTMLUListElement;

// Functions //
const showCurrentStock = (stock: item[]): void => {
	stock.forEach((item) => {
		// Product list for the dashboard.
		dashboardProductList.insertAdjacentHTML(
			'beforeend',
			`<li class="dashboard__item">
				<div class="item__container item__container--texture">
					<img src="images/${item.filename}.png" class="item__image" alt="A ${item.name}"/>
					<div class="item__info">
						<h3 class="item__name">${item.name}</h3>
						<div class="item__info--container">
							<span class="item__quantity" data-item-id="${item.id}">Quantity: ${item.quantity}</span>
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
				<img src="images/${item.filename}.png" class="item__image" alt="A ${item.name}">
					<div class="item__info">
						<h3 class="item__name">${item.name}</h3>
						<div class="item__details">
							<span class="item__quantity" data-item-id="${item.id}">Quantity: ${item.quantity}</span>
							<span class="item__price" data-item-id="${item.id}">Price: ${item.price}</span>
						</div>
					</div>
					<div class="item__actions" data-item-id="${item.id}">
						<button class="item__decrease js-market-decrease" aria-label="Decrease ${item.name} quantity">-</button>
						<input type="number" name="item__quantity" class="item__quantity" value="0" min="0" max="${item.quantity}" data-item-id="${item.id}" data-item-name="${item.name}" aria-label="${item.name} quantity" role="status">
						<button class="item__increase js-market-increase" aria-label="Increase ${item.name} quantity">+</button>	
					</div>
					<span class="item__cost" role="status">0 gold</span>
				</div>
			</li>`
		);
	});
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

// Updates the total cost per item
export const updateItemCost = (quantity: number, id: string | number, stock: item[]): number => {
	let itemID = Number(id);
	let updatedPrice: number = 0;
	stock.forEach((item) => {
		if (item.id === itemID) {
			updatedPrice = quantity * item.price;
		}
	});
	return updatedPrice;
};

const doesTotalCostExceedBalance = (totalCost: number, userBalance: number): boolean => {
	if (totalCost <= userBalance) {
		return false;
	} else {
		return true;
	}
};

export const isThereStockAvailable = (itemQuantity: number, itemId: number | string, stock: item[]): boolean => {
	itemId = Number(itemId);
	let availableStock: number = 0;
	stock.forEach((item) => {
		if (item.id === itemId) {
			availableStock = item.quantity;
		}
	});
	if (itemQuantity <= availableStock) {
		return true;
	} else {
		return false;
	}
};

export const updateTotalCost = (userBalance: number): void => {
	const costs = document.querySelectorAll('.item__cost') as NodeListOf<HTMLSpanElement>;
	const totalValue = document.querySelector('.total__value') as HTMLSpanElement;
	let totalCost: number = 0;
	costs.forEach((cost) => {
		totalCost += Number(cost.innerText.slice(0, -5));
	});
	totalValue.innerText = `${totalCost} gold`;
	const result = doesTotalCostExceedBalance(totalCost, userBalance);
	if (result === true) {
		showMessage('exceededBalance');
		disableIncreaseButtons();
		disableMarketActionsButtons();
	}
};

export const resetQuantities = (): void => {
	const itemQuantityInputs = document.querySelectorAll('.market .item__quantity') as NodeListOf<HTMLInputElement>;
	const costs = document.querySelectorAll('.market .item__cost') as NodeListOf<HTMLInputElement>;
	const totalValue = document.querySelector('.js-total-value') as HTMLSpanElement;
	itemQuantityInputs.forEach((input) => {
		input.value = '0';
	});
	costs.forEach((cost) => {
		cost.innerText = '0 gold';
	});
	totalValue.innerText = '0 gold';
};

// Updates stock after purchase
const updateAvailableStock = (): void => {
	const productQuantities = document.querySelectorAll('.dashboard .item__quantity[data-item-id]') as NodeListOf<HTMLParagraphElement>;
	service
		.getItems()
		.then((items) => {
			if ('filter' in items) {
				for (let i = 0; i < productQuantities.length; i++) {
					if (Number(productQuantities[i].dataset.itemId) === items[i].id) {
						productQuantities[i].innerText = `Quantity: ${items[i].quantity}`;
					}
				}
			}
		})
		.catch(() => showMessage('failedFetch'));
};

// export const buyItems = (): void => {
// 	let finalItemQuantities = document.querySelectorAll('input.item__quantity') as NodeListOf<HTMLInputElement>;
// 	let finalGoldAmount: number = Number((document.querySelector('.market .total__value') as HTMLInputElement).innerText.slice(0, -5));
// 	toggleInteractionsAndLoader('disable', 'modal');
// 	service
// 		.getItems()
// 		.then((items) => {
// 			if ('filter' in items) {
// 				for (let i = 0; i < finalItemQuantities.length; i++) {
// 					// If items have the same ID
// 					if (items[i].id === Number(finalItemQuantities[i].dataset.itemId)) {
// 						// Substract the bought amount from the current stock
// 						items[i].quantity -= Number(finalItemQuantities[i].value);
// 					} else {
// 						return;
// 					}
// 				}
// 				updateAvailableStock();
// 				toggleInteractionsAndLoader('enable', 'modal');
// 				closeModal(document.querySelector('.modal') as HTMLDivElement);
// 				showMessage('successfulPurchase');
// 				setTimeout(() => {
// 					removeMessage('dashboard');
// 				}, 5000);
// 			}
// 		})
// 		.then(service.getUser)
// 		.then((user) => {
// 			if ('balance' in user) {
// 				user.balance -= finalGoldAmount;
// 				showGoldBalance(user.balance);
// 			}
// 		})
// 		.catch(() => {
// 			toggleInteractionsAndLoader('enable', 'modal');
// 			showMessage('failedProcess');
// 		});
// };

export const buyItems2 = async (): Promise<void> => {
	toggleInteractionsAndLoader('disable', 'modal');
	let finalItemQuantities = document.querySelectorAll('input.item__quantity') as NodeListOf<HTMLInputElement>;
	let finalGoldAmount: number = Number((document.querySelector('.market .total__value') as HTMLInputElement).innerText.slice(0, -5));

	try {
		const items = (await service.getItems().then((items) => items)) as item[];
		const user = (await service.getUser().then((user) => user)) as user;

		// Identify each element and compare they are the same
		for (let i = 0; i < finalItemQuantities.length; i++) {
			if (items[i].id === Number(finalItemQuantities[i].dataset.itemId)) {
				// Subtract the bought amount from the current stock
				items[i].quantity -= Number(finalItemQuantities[i].value);
			}
		}

		// Subtract the final cost from the user's balance
		user.balance -= finalGoldAmount;
		showGoldBalance(user.balance);

		updateAvailableStock();
		toggleInteractionsAndLoader('enable', 'modal');
		closeModal(document.querySelector('.modal') as HTMLDivElement);
		showMessage('successfulPurchase');
		// Remove the successful message from the dashboard
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
	try {
		showLoader('dashboard');
		const items = (await service.getItems().then((items) => items)) as item[];
		const user = (await service.getUser().then((user) => user)) as user;

		showGoldBalance(user.balance);
		showUserLogin(user.login);
		hideLoader('dashboard');
		// Show stock on the dashboard
		showCurrentStock(items);
		// Pass the user and item stock so that it can be used inside the modal to calculate stock and prices
		loadModalFunctionality(user, items);
	} catch (error) {
		hideLoader('dashboard');
		showMessage(error as string);
	}
});
