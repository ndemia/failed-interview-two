import { user, item } from './types';
import { service } from './service.js';
import { showWarning, removeWarning } from './warnings.js';
import { openModal, closeModal, loadModalFunctionality } from './modal.js';
import './inert.min.js';

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
						<span class="item__quantity" data-item-id="${item.id}">Quantity: ${item.quantity}</span>
					</div>
					<div class="item__actions" data-item-id="${item.id}">
						<button class="item__decrease js-market-decrease" aria-label="Decrease ${item.name} quantity">-</button>
						<input type="number" name="item__quantity" class="item__quantity" value="0" min="0" max="${item.quantity}" data-item-id="${item.id}" aria-label="${item.name} quantity" role="status">
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

export const showLoader = (): void => {
	const loader = document.querySelector('.loader') as HTMLSpanElement;
	loader.classList.remove('hidden');
};

export const hideLoader = (): void => {
	const loader = document.querySelector('.loader') as HTMLSpanElement;
	loader.classList.add('hidden');
};

export const updateItemCost = (quantity: number, id: string | number, currentStock: item[]): number => {
	let itemID = Number(id);
	let updatedPrice: number = 0;
	currentStock.forEach((item) => {
		if (item.id === itemID) {
			updatedPrice = quantity * item.price;
		}
	});
	return updatedPrice;
};

const checkTotalCostDoesNotExceedBalance = (totalCost: number): Promise<boolean> => {
	return service
		.getUser()
		.then((user) => {
			if ('balance' in user) {
				if (totalCost <= user.balance) {
					return false;
				} else {
					return true;
				}
			}
			throw new Error('User balance is missing');
		})
		.catch((error) => {
			console.log(error);
			throw new Error('Failed to fetch user data');
		});
};

export const checkAvailableStock = (itemQuantity: number, itemId: number | string, stock: item[]): boolean => {
	itemId = Number(itemId);
	let availableStock: number = 0;
	stock.forEach((item) => {
		if (item.id === itemId) {
			availableStock = item.quantity;
		}
	});
	if (itemQuantity <= availableStock) {
		// enableIncreaseButtons();
		return true;
	} else {
		// disableIncreaseButtons();
		return false;
	}
};

export const updateTotalCost = async (): Promise<void> => {
	const costs = document.querySelectorAll('.item__cost') as NodeListOf<HTMLSpanElement>;
	const totalValue = document.querySelector('.total__value') as HTMLSpanElement;
	let totalCost: number = 0;
	costs.forEach((cost) => {
		totalCost += Number(cost.innerText.slice(0, -5));
	});
	totalValue.innerText = `${totalCost} gold`;
	const result = await checkTotalCostDoesNotExceedBalance(totalCost);
	if (result === true) {
		showWarning('exceededBalance');
		disableIncreaseButtons();
		disableMarketActionsButtons();
	}
};

export const resetQuantities = (): void => {
	let costs = document.querySelectorAll('.market .item__cost') as NodeListOf<HTMLInputElement>;
	let itemQuantityInputs = document.querySelectorAll('.market .item__quantity') as NodeListOf<HTMLInputElement>;
	itemQuantityInputs.forEach((input) => {
		input.value = '0';
		costs.forEach((cost) => {
			cost.innerText = '0 gold';
		});
		updateTotalCost();
	});
};

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
		.catch((error) => console.log(error));
};

export const buyItems = (): void => {
	let finalItemQuantities = document.querySelectorAll('.market .item__quantity') as NodeListOf<HTMLInputElement>;
	showLoader();
	disableIncreaseButtons();
	disableDecreaseButtons();
	disableMarketActionsButtons();
	service
		.getItems()
		.then((items) => {
			if ('filter' in items) {
				for (let i = 0; i < finalItemQuantities.length; i++) {
					if (Number(items[i].id) === Number(finalItemQuantities[i].dataset.itemId)) {
						// Substract the bought amount from the current stock
						items[i].quantity -= Number(finalItemQuantities[i].value);
					} else {
						return;
					}
				}
				updateAvailableStock();
				// Update gold balance
				let finalGold: number = Number((document.querySelector('.market .total__value') as HTMLInputElement).innerText.slice(0, -5));
				//service.user.balance -= finalGold;
				//showGoldBalance();
				hideLoader();
				enableIncreaseButtons();
				enableDecreaseButtons();
				enableMarketActionsButtons();
				closeModal(document.querySelector('.modal') as HTMLDivElement);
			}
		})
		.catch(() => {
			hideLoader();
			enableIncreaseButtons();
			enableDecreaseButtons();
			enableMarketActionsButtons();
			showWarning('failedProcess');
		});
};

///// Go /////
document.addEventListener('DOMContentLoaded', (): void => {
	service
		.getUser()
		.then((user) => {
			if ('balance' in user) {
				showGoldBalance(user.balance);
				showUserLogin(user.login);
			}
		})
		.then(service.getItems)
		.then((items) => {
			if ('filter' in items) {
				showCurrentStock(items);
				loadModalFunctionality(items);
			}
		})
		.catch((error) => showWarning(error));
});
