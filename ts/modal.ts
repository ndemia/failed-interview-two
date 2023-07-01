import { user, item } from './types';
import { showMessage, removeMessage } from './messages.js';
import {
	enableDecreaseButtons,
	enableIncreaseButtons,
	disableDecreaseButtons,
	disableIncreaseButtons,
	enableMarketActionsButtons,
	disableMarketActionsButtons,
	updateItemCost,
	isThereStockAvailable,
	updateTotalCost,
	buyItems2,
	resetQuantities,
} from './app.js';
import './inert.min.js';

// UI Variables //
const openModalButtons = document.querySelectorAll('[data-modal-open]') as NodeListOf<HTMLButtonElement>;
const closeModalButtons = document.querySelectorAll('[data-modal-close]') as NodeListOf<HTMLButtonElement>;
const buyButton = document.querySelector('.js-modal-buy') as HTMLButtonElement;
const resetButton = document.querySelector('.js-quantity-reset') as HTMLButtonElement;
const overlay = document.querySelector('.overlay') as HTMLDivElement;
let previousActiveElement: HTMLElement;

// Functions //
export const openModal = (modal: HTMLDivElement): void => {
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

export const closeModal = (modal: HTMLDivElement): void => {
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
		enableIncreaseButtons();
		resetQuantities();
		removeMessage('modal');
	}
	// Restore focus to the previous active element.
	previousActiveElement.focus();
};

export const loadModalFunctionality = (user: user, stock: item[]): void => {
	let itemQuantityInputs = document.querySelectorAll('.market .item__quantity') as NodeListOf<HTMLInputElement>;
	let quantityIncreaseButtons = document.querySelectorAll('.js-market-increase') as NodeListOf<HTMLButtonElement>;
	let quantityDecreaseButtons = document.querySelectorAll('.js-market-decrease') as NodeListOf<HTMLButtonElement>;
	resetButton.addEventListener('click', resetQuantities);
	buyButton.addEventListener('click', buyItems2);

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
			let itemQuantity: number = Number(eventTarget.value);
			let itemId: number = Number(eventTarget.dataset.itemId);
			let updatedPrice: number = updateItemCost(itemQuantity, itemId, stock);
			let itemPrice = eventTarget.parentElement!.nextElementSibling as HTMLSpanElement;
			// Check to allow only positive numbers
			if (itemQuantity >= 0) {
				if (isThereStockAvailable(itemQuantity, itemId, stock) === true) {
					itemPrice.innerText = `${updatedPrice} gold`;
					updateTotalCost(user.balance);
				} else {
					showMessage('notEnoughStock');
					disableIncreaseButtons();
					disableMarketActionsButtons();
				}
			} else {
				itemPrice.innerText = `0 gold`;
				eventTarget.value = '0';
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
			let itemName: string = input.dataset.itemName!;
			let itemQuantity: number = Number(inputValue);
			if (isThereStockAvailable(itemQuantity, itemId, stock) === true) {
				let totalItemCost = updateItemCost(itemQuantity, itemId, stock);
				let itemPrice = pressedButton.parentElement!.nextElementSibling as HTMLSpanElement;
				itemPrice.innerText = `${totalItemCost} gold`;
				updateTotalCost(user.balance);
			} else {
				showMessage('notEnoughStock', itemName);
				disableIncreaseButtons();
				disableMarketActionsButtons();
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
			if (isThereStockAvailable(itemQuantity, itemId, stock) === true) {
				let totalItemCost = updateItemCost(itemQuantity, itemId, stock);
				let itemPrice = pressedButton.parentElement!.nextElementSibling as HTMLSpanElement;
				itemPrice.innerText = `${totalItemCost} gold`;
				removeMessage('modal');
				enableIncreaseButtons();
				enableMarketActionsButtons();
				updateTotalCost(user.balance);
			} else {
				showMessage('notEnoughStock');
				disableMarketActionsButtons();
			}
		});
	});
};
