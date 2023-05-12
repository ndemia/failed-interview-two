import { resetQuantities, enableMarketActionsButtons } from "./market.js";
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.querySelector('.overlay');
let previousActiveElement;
export const openModal = (modal) => {
    // Save a reference to the previous active element, to restore this once the modal is closed
    previousActiveElement = document.activeElement;
    // Make the rest of the document inert so that it's not available with keyboard or screen reader.
    let bodyElements = Array.from(document.body.children).filter(element => element.localName != 'script');
    bodyElements.forEach((element) => {
        if (element.getAttribute('role') !== 'dialog') {
            element.inert = true;
        }
    });
    // Move focus into the modal
    modal.querySelector('button').focus();
    // Open the modal
    if (modal == null) {
        return;
    }
    else {
        modal.classList.add('active');
        overlay.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }
};
export const closeModal = (modal) => {
    const childrenArray = Array.from(document.body.children);
    childrenArray.forEach((child) => {
        if (child.getAttribute('role') !== 'dialog') {
            child.inert = false;
        }
    });
    // Close the modal
    if (modal == null) {
        return;
    }
    else {
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
            const modal = document.querySelector('.modal');
            openModal(modal);
        });
    });
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector('.modal');
            closeModal(modal);
        });
    });
    overlay.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            closeModal(modal);
        });
    });
});
