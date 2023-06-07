import { user, item } from './types';
import { showWarning, removeWarning } from './warnings.js';
import {
	enableDecreaseButtons,
	enableIncreaseButtons,
	enableMarketActionsButtons,
	disableMarketActionsButtons,
	resetQuantities,
	buyItems,
	updateItemCost,
	checkAvailableStock,
	disableDecreaseButtons,
	disableIncreaseButtons,
	updateTotalCost,
} from './app.js';

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
		resetQuantities();
		removeWarning();
	}
	// Restore focus to the previous active element.
	previousActiveElement.focus();
};

export const loadModalFunctionality = (stock: item[]): void => {
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
