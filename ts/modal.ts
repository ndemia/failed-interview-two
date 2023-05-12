import { resetQuantities, enableMarketActionsButtons } from "./market.js";

const openModalButtons = document.querySelectorAll('[data-modal-target]') as NodeListOf<HTMLButtonElement>;
const closeModalButtons = document.querySelectorAll('[data-close-button]') as NodeListOf<HTMLButtonElement>;
const overlay = document.querySelector('.overlay') as HTMLDivElement;
let previousActiveElement: HTMLElement;

export const openModal = (modal: HTMLDivElement): void => {
	// Save a reference to the previous active element, to restore this once the modal is closed
	previousActiveElement = document.activeElement as HTMLElement;
	// Make the rest of the document inert so that it's not available with keyboard or screen reader.
	// A filter is used because the array ends up collecting the script tags that are not necessary
	let bodyElements = Array.from(document.body.children).filter(element => element.localName != 'script');
	bodyElements.forEach((element) => {
		if (element.getAttribute('role') !== 'dialog') {
			(element as HTMLElement).inert = true;
		}
	});
	// Move focus into the modal
	modal.querySelector('button')!.focus();
	// Open the modal
	if (modal == null) {
		return;
	} else {
		modal.classList.add('active');
		overlay.classList.add('active');
		modal.setAttribute('aria-hidden', 'false');
	}
};

export const closeModal = (modal: HTMLDivElement): void => {
	// Remove the inert attribute from elements
	const bodyElements = Array.from(document.body.children).filter(element => element.localName != 'script');
	bodyElements.forEach((element) => {
		if (element.getAttribute('role') !== 'dialog') {
			(element as HTMLElement).inert = false;
		}
	});
	// Close the modal
	if (modal == null) {
		return;
	} else {
		modal.classList.remove('active');
		overlay.classList.remove('active');
		resetQuantities();
		enableMarketActionsButtons();
	}
	// Restore focus to the previous active element
	previousActiveElement.focus();
};

document.addEventListener('DOMContentLoaded', () => {
	openModalButtons.forEach(button => {
		button.addEventListener('click', () => {
			const modal = document.querySelector('.modal') as HTMLDivElement;
			openModal(modal);
		});
	});
	closeModalButtons.forEach(button => {
		button.addEventListener('click', () => {
			const modal = document.querySelector('.modal') as HTMLDivElement;
			closeModal(modal);
		});
	});
});