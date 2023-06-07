import { user, item } from './types';
import { service } from './service.js';
import { showWarning } from './warnings.js';
import './inert.min.js';

///// Marketplace /////
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
				<img src="images/${item.filename}.png" class="item__image" alt="A ${item.name}"/>
				<div class="item__info">
					<h3 class="item__name">${item.name}</h3>
					<p class="item__quantity" data-item-id="${item.id}">Quantity: ${item.quantity}</p>
					<p class="item__price" data-item-id="${item.id}">Price: ${item.price} gold</p>
				</div>
			</li>`
		);
		// Product list for the modal.
		modalProductList.insertAdjacentHTML(
			'beforeend',
			`<li class="products__item">
				<div class="item__container">
					<div class="item__info">
						<img src="images/${item.filename}.png" class="item__image" alt="A ${item.name}">
						<p class="item__name">${item.name}</p>
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

const showGoldBalance = (goldAmount: number): void => {
	const goldBalance = document.getElementById('gold-balance') as HTMLSpanElement;
	goldBalance.innerText = `${goldAmount} gold`;
};

const showUserLogin = (login: string): void => {
	const userName = document.getElementById('user-name') as HTMLSpanElement;
	userName.innerText = `${login}`;
};

const disableIncreaseButtons = (): void => {
	let quantityIncreaseButtons = document.querySelectorAll('.js-market-increase') as NodeListOf<HTMLButtonElement>;
	quantityIncreaseButtons.forEach((button) => {
		button.classList.add('btn--disabled');
		button.disabled = true;
	});
};

const enableIncreaseButtons = (): void => {
	let quantityIncreaseButtons = document.querySelectorAll('.js-market-increase') as NodeListOf<HTMLButtonElement>;
	quantityIncreaseButtons.forEach((button) => {
		button.classList.remove('btn--disabled');
		button.disabled = false;
	});
};

const disableDecreaseButtons = (): void => {
	let quantityDecreaseButtons = document.querySelectorAll('.js-market-decrease') as NodeListOf<HTMLButtonElement>;
	quantityDecreaseButtons.forEach((button) => {
		button.classList.add('btn--disabled');
		button.disabled = true;
	});
};

const enableDecreaseButtons = (): void => {
	let quantityDecreaseButtons = document.querySelectorAll('.js-market-decrease') as NodeListOf<HTMLButtonElement>;
	quantityDecreaseButtons.forEach((button) => {
		button.classList.remove('btn--disabled');
		button.disabled = false;
	});
};

const disableMarketActionsButtons = (): void => {
	let marketActionsButtons = document.querySelectorAll('.js-market-action') as NodeListOf<HTMLButtonElement>;
	marketActionsButtons.forEach((button) => {
		button.classList.add('btn--disabled');
		button.disabled = true;
	});
};

const enableMarketActionsButtons = (): void => {
	let marketActionsButtons = document.querySelectorAll('.js-market-action') as NodeListOf<HTMLButtonElement>;
	marketActionsButtons.forEach((button) => {
		button.classList.remove('btn--disabled');
		button.disabled = false;
	});
};

const showLoader = (): void => {
	const loader = document.querySelector('.loader') as HTMLSpanElement;
	loader.classList.remove('hidden');
};

const hideLoader = (): void => {
	const loader = document.querySelector('.loader') as HTMLSpanElement;
	loader.classList.add('hidden');
};

const removeWarning = (): void => {
	const warningContainer = document.querySelector('.market__warnings') as HTMLElement;
	warningContainer.classList.add('hidden');
};

const updateItemCost = (quantity: number, id: string | number, currentStock: item[]): number => {
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

const checkAvailableStock = (itemQuantity: number, itemId: number | string, stock: item[]): boolean => {
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

const updateTotalCost = async (): Promise<void> => {
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

const resetQuantities = (): void => {
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

const buyItems = (): void => {
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

///// Modal /////
// UI Variables //
const openModalButtons = document.querySelectorAll('[data-modal-open]') as NodeListOf<HTMLButtonElement>;
const closeModalButtons = document.querySelectorAll('[data-modal-close]') as NodeListOf<HTMLButtonElement>;
const buyButton = document.querySelector('.js-modal-buy') as HTMLButtonElement;
const resetButton = document.querySelector('.js-quantity-reset') as HTMLButtonElement;
const overlay = document.querySelector('.overlay') as HTMLDivElement;
let previousActiveElement: HTMLElement;

// Functions //
const openModal = (modal: HTMLDivElement): void => {
	// Save a reference to the previous active element, to restore this once the modal is closed.
	previousActiveElement = document.activeElement as HTMLElement;
	// Make the rest of the document inert so that it's not reachable with keyboard navigation.
	// Filter because the array ends up collecting script tags that are not necessary.
	let bodyElements = Array.from(document.body.children).filter((element) => element.localName != 'script');
	bodyElements.forEach((element) => {
		if (element.getAttribute('role') !== 'dialog') {
			(element as HTMLElement).inert = true;
		}
	});
	// Move focus into the modal.
	modal.querySelector('button')!.focus();
	// Open the modal.
	if (modal == null) {
		return;
	} else {
		modal.classList.add('active');
		overlay.classList.add('active');
		modal.setAttribute('aria-hidden', 'false');
	}
};

const closeModal = (modal: HTMLDivElement): void => {
	// Remove the inert attribute from elements.
	const bodyElements = Array.from(document.body.children).filter((element) => element.localName != 'script');
	bodyElements.forEach((element) => {
		if (element.getAttribute('role') !== 'dialog') {
			(element as HTMLElement).inert = false;
		}
	});
	// Close the modal.
	if (modal != null) {
		modal.classList.remove('active');
		overlay.classList.remove('active');
		enableMarketActionsButtons();
		resetQuantities();
		removeWarning();
	}
	// Restore focus to the previous active element.
	previousActiveElement.focus();
};

const loadModalFunctionality = (stock: item[]): void => {
	let itemQuantityInputs = document.querySelectorAll('.market .item__quantity') as NodeListOf<HTMLInputElement>;
	let quantityIncreaseButtons = document.querySelectorAll('.js-market-increase') as NodeListOf<HTMLButtonElement>;
	let quantityDecreaseButtons = document.querySelectorAll('.js-market-decrease') as NodeListOf<HTMLButtonElement>;
	buyButton.addEventListener('click', buyItems);
	resetButton.addEventListener('click', resetQuantities);

	openModalButtons.forEach((button) => {
		button.addEventListener('click', () => {
			const modal = document.querySelector('.modal') as HTMLDivElement;
			openModal(modal);
		});
	});

	closeModalButtons.forEach((button) => {
		button.addEventListener('click', () => {
			const modal = document.querySelector('.modal') as HTMLDivElement;
			closeModal(modal);
		});
	});

	// Typing any quantity updates the costs, and checks for constraints
	itemQuantityInputs.forEach((input) => {
		input.addEventListener('change', (e: Event) => {
			let eventTarget = e.target as HTMLInputElement;
			let itemId: number = Number(eventTarget.dataset.itemId);
			let itemQuantity: number = Number(eventTarget.value);
			let updatedPrice: number = updateItemCost(itemQuantity, itemId, stock);
			if (checkAvailableStock(itemQuantity, itemId, stock) === true) {
				let itemPrice = eventTarget.parentElement!.nextElementSibling as HTMLSpanElement;
				itemPrice.innerText = `${updatedPrice} gold`;
				updateTotalCost();
			} else {
				showWarning('notEnoughStock');
				disableIncreaseButtons();
				disableMarketActionsButtons();
			}
		});
	});

	quantityIncreaseButtons.forEach((button) => {
		button.addEventListener('click', (e: Event) => {
			let pressedButton = e.target as HTMLButtonElement;
			let input = pressedButton.previousElementSibling as HTMLInputElement;
			let inputValue: number = Number(input.value);
			inputValue++;
			input.value = inputValue.toString();
			let itemId: number = Number(pressedButton.parentElement!.dataset.itemId);
			let itemQuantity: number = Number(inputValue);
			if (checkAvailableStock(itemQuantity, itemId, stock) === true) {
				let totalItemCost = updateItemCost(itemQuantity, itemId, stock);
				let itemPrice = pressedButton.parentElement!.nextElementSibling as HTMLInputElement;
				itemPrice.innerText = `${totalItemCost} gold`;
				updateTotalCost();
			} else {
				disableIncreaseButtons();
				disableMarketActionsButtons();
				showWarning('notEnoughStock');
			}
		});
	});

	quantityDecreaseButtons.forEach((button: HTMLButtonElement) => {
		button.addEventListener('click', (e: Event) => {
			const pressedButton = e.target as HTMLButtonElement;
			const input = pressedButton.nextElementSibling as HTMLInputElement;
			let inputValue: number = Number(input.value);
			const itemId: number = Number(pressedButton.parentElement!.dataset.itemId);
			if (inputValue <= 0) {
				return;
			} else {
				inputValue--;
				input.value = inputValue.toString();
			}
			let itemQuantity: number = Number(inputValue);
			if (checkAvailableStock(itemQuantity, itemId, stock) === true) {
				let totalItemCost = updateItemCost(itemQuantity, itemId, stock);
				let itemPrice = pressedButton.parentElement!.nextElementSibling as HTMLInputElement;
				itemPrice.innerText = `${totalItemCost} gold`;
				removeWarning();
				updateTotalCost();
				enableIncreaseButtons();
				enableMarketActionsButtons();
			} else {
				showWarning('notEnoughStock');
				disableMarketActionsButtons();
			}
		});
	});
};

///// Go! /////
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
		.catch((error) => console.log(error));
});
