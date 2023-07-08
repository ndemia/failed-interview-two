import { user, item } from './types';
import { showMessage, removeMessage } from './messages.js';
import {
	enableIncreaseButtons,
	disableIncreaseButtons,
	enableMarketActionsButtons,
	disableMarketActionsButtons,
	updateTotalItemCost,
	isThereStockAvailable,
	updateTotalCost,
	resetQuantities,
	buyItems,
} from './app.js';
import * as sound from './sounds.js';
import './inert.min.js';

// UI Variables //
const openModalButtons = document.querySelectorAll('[data-modal-open]') as NodeListOf<HTMLButtonElement>;
const closeModalButtons = document.querySelectorAll('[data-modal-close]') as NodeListOf<HTMLButtonElement>;

const buyButton = document.querySelector('.js-modal-buy') as HTMLButtonElement;
const resetButton = document.querySelector('.js-quantity-reset') as HTMLButtonElement;
const overlay = document.querySelector('.overlay') as HTMLDivElement;
let previousActiveElement: HTMLElement;

// Functions //
const checkCloseModal = (e: KeyboardEvent) => {
	const modal = document.querySelector('.modal') as HTMLDivElement;
	if (e.code === 'Escape') {
		closeModal(modal);
	}
};

export const openModal = (modal: HTMLDivElement): void => {
	const itemQuantityInputs = document.querySelectorAll('.market .js-item-quantity') as NodeListOf<HTMLInputElement>;
	const itemCosts = document.querySelectorAll('.market .js-item-cost') as NodeListOf<HTMLSpanElement>;
	// Save a reference to the previous active element, to restore focus to it once the modal is closed.
	previousActiveElement = document.activeElement as HTMLElement;

	// Make inert.
	let bodyElements = Array.from(document.body.children).filter((element) => element.localName != 'script');
	// Filter because the array ends up collecting script tags from the HTML that are not necessary.
	bodyElements.forEach((element) => {
		// Make the rest of the document inert so that it's not reachable with keyboard navigation.
		if (element.getAttribute('role') !== 'dialog') {
			(element as HTMLElement).inert = true;
		}
	});

	// Open the modal.
	if (modal != null) {
		// Remove the aria-live="off" attribute in the case the modal is being reopened.
		itemCosts.forEach((cost) => {
			cost.removeAttribute('aria-live');
		});
		itemQuantityInputs.forEach((input) => {
			input.removeAttribute('aria-live');
		});
		sound.drawerOpen.play();
		modal.classList.add('active');
		overlay.classList.add('active');
		modal.setAttribute('aria-hidden', 'false');
		// Move focus into the modal.
		modal.querySelector('button')!.focus();
		document.addEventListener('keydown', checkCloseModal);
	}
};

export const closeModal = (modal: HTMLDivElement): void => {
	const itemQuantityInputs = document.querySelectorAll('.market .js-item-quantity') as NodeListOf<HTMLInputElement>;
	const itemCosts = document.querySelectorAll('.market .js-item-cost') as NodeListOf<HTMLSpanElement>;

	// Remove the inert attribute.
	const bodyElements = Array.from(document.body.children).filter((element) => element.localName != 'script');
	bodyElements.forEach((element) => {
		if (element.getAttribute('role') !== 'dialog') {
			(element as HTMLElement).inert = false;
		}
	});

	// Close the modal.
	if (modal != null) {
		// Add aria-live=off so that the screen reader doesn't read all the values when they return to 0.
		// At the moment of this happening, these values are not relevant.
		itemCosts.forEach((cost) => {
			cost.setAttribute('aria-live', 'off');
		});
		itemQuantityInputs.forEach((input) => {
			input.setAttribute('aria-live', 'off');
		});
		sound.drawerClose.play();
		modal.classList.remove('active');
		overlay.classList.remove('active');
		enableMarketActionsButtons();
		enableIncreaseButtons();
		resetQuantities();
		removeMessage('modal');
		// Restore focus to the previous active element.
		previousActiveElement.focus();
	}
};

export const loadMarketFunctionality = (user: user, stock: item[]): void => {
	const itemQuantityInputs = document.querySelectorAll('.market .js-item-quantity') as NodeListOf<HTMLInputElement>;
	const quantityIncreaseButtons = document.querySelectorAll('.js-market-increase') as NodeListOf<HTMLButtonElement>;
	const quantityDecreaseButtons = document.querySelectorAll('.js-market-decrease') as NodeListOf<HTMLButtonElement>;

	buyButton.addEventListener('click', buyItems);
	resetButton.addEventListener('click', () => {
		sound.resetQuantities.play();
		resetQuantities();
	});

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

	// Typing any quantity updates the costs, also checks for constraints.
	itemQuantityInputs.forEach((input) => {
		input.addEventListener('change', (e: Event) => {
			const eventTarget = e.target as HTMLInputElement;
			const itemQuantity: number = Number(eventTarget.value);
			const itemId: number = Number(eventTarget.dataset.itemId);
			const updatedPrice: number = updateTotalItemCost(itemQuantity, itemId, stock);
			const itemPrice = eventTarget.parentElement!.nextElementSibling as HTMLSpanElement;

			// Allow only positive numbers.
			if (itemQuantity >= 0) {
				// Check for stock.
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
			const pressedButton = e.target as HTMLButtonElement;
			const inputElement = pressedButton.previousElementSibling as HTMLInputElement;
			let inputValue: number = Number(inputElement.value);
			const itemId: number = Number(pressedButton.parentElement!.dataset.itemId);
			const itemName: string = inputElement.dataset.itemName!;

			// Increase item quantity by one.
			inputValue++;
			// Show it on the UI.
			inputElement.value = inputValue.toString();
			sound.increase.play();

			// Save updated item quantity
			const itemQuantity: number = Number(inputValue);
			// Check quantity against stock, available when creating the modal.
			// Update the UI information accordingly.
			if (isThereStockAvailable(itemQuantity, itemId, stock) === true) {
				const totalItemCost = updateTotalItemCost(itemQuantity, itemId, stock);
				const itemPrice = pressedButton.parentElement!.nextElementSibling as HTMLSpanElement;
				// Update total item's cost
				itemPrice.innerText = `${totalItemCost} gold`;
				updateTotalCost(user.balance);
			} else {
				// If no stock available, show warning message and disable interactions.
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
			const itemId: number = Number(pressedButton.parentElement!.dataset.itemId);
			let inputValue: number = Number(input.value);

			// If item quantity is less than 0, do nothing. Else, keep decreasing the item quantity.
			if (inputValue <= 0) {
				return;
			} else {
				inputValue--;
				input.value = inputValue.toString();
				sound.decrease.play();
			}

			// Save updated item quantity
			const itemQuantity: number = Number(inputValue);
			// Check against the available stock.
			if (isThereStockAvailable(itemQuantity, itemId, stock) === true) {
				const totalItemCost = updateTotalItemCost(itemQuantity, itemId, stock);
				const itemPrice = pressedButton.parentElement!.nextElementSibling as HTMLSpanElement;

				// Update total item's cost.
				itemPrice.innerText = `${totalItemCost} gold`;

				// Remove warning message that showed because of exceeding item quantity.
				removeMessage('modal');
				// Re-enable interactions.
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
