import { showWarning, removeWarning } from './warnings.js';
import { enableIncreaseButtons, disableIncreaseButtons, enableMarketActionsButtons, disableMarketActionsButtons, updateItemCost, checkAvailableStock, updateTotalCost, buyItems, resetQuantities, } from './app.js';
// UI Variables //
const openModalButtons = document.querySelectorAll('[data-modal-open]');
const closeModalButtons = document.querySelectorAll('[data-modal-close]');
const buyButton = document.querySelector('.js-modal-buy');
const resetButton = document.querySelector('.js-quantity-reset');
const overlay = document.querySelector('.overlay');
let previousActiveElement;
// Functions //
export const openModal = (modal) => {
    // Save a reference to the previous active element, to restore this once the modal is closed.
    previousActiveElement = document.activeElement;
    // Make the rest of the document inert so that it's not reachable with keyboard navigation.
    // Filter because the array ends up collecting script tags that are not necessary.
    let bodyElements = Array.from(document.body.children).filter((element) => element.localName != 'script');
    bodyElements.forEach((element) => {
        if (element.getAttribute('role') !== 'dialog') {
            element.inert = true;
        }
    });
    // Move focus into the modal.
    modal.querySelector('button').focus();
    // Open the modal.
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
    // Remove the inert attribute from elements.
    const bodyElements = Array.from(document.body.children).filter((element) => element.localName != 'script');
    bodyElements.forEach((element) => {
        if (element.getAttribute('role') !== 'dialog') {
            element.inert = false;
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
export const loadModalFunctionality = (stock) => {
    let itemQuantityInputs = document.querySelectorAll('.market .item__quantity');
    let quantityIncreaseButtons = document.querySelectorAll('.js-market-increase');
    let quantityDecreaseButtons = document.querySelectorAll('.js-market-decrease');
    buyButton.addEventListener('click', buyItems);
    resetButton.addEventListener('click', resetQuantities);
    openModalButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modal = document.querySelector('.modal');
            openModal(modal);
        });
    });
    closeModalButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modal = document.querySelector('.modal');
            closeModal(modal);
        });
    });
    // Typing any quantity updates the costs, and checks for constraints
    itemQuantityInputs.forEach((input) => {
        input.addEventListener('change', (e) => {
            let eventTarget = e.target;
            let itemId = Number(eventTarget.dataset.itemId);
            let itemQuantity = Number(eventTarget.value);
            let updatedPrice = updateItemCost(itemQuantity, itemId, stock);
            if (checkAvailableStock(itemQuantity, itemId, stock) === true) {
                let itemPrice = eventTarget.parentElement.nextElementSibling;
                itemPrice.innerText = `${updatedPrice} gold`;
                updateTotalCost();
            }
            else {
                showWarning('notEnoughStock');
                disableIncreaseButtons();
                disableMarketActionsButtons();
            }
        });
    });
    quantityIncreaseButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            let pressedButton = e.target;
            let input = pressedButton.previousElementSibling;
            let inputValue = Number(input.value);
            inputValue++;
            input.value = inputValue.toString();
            let itemId = Number(pressedButton.parentElement.dataset.itemId);
            let itemQuantity = Number(inputValue);
            if (checkAvailableStock(itemQuantity, itemId, stock) === true) {
                let totalItemCost = updateItemCost(itemQuantity, itemId, stock);
                let itemPrice = pressedButton.parentElement.nextElementSibling;
                itemPrice.innerText = `${totalItemCost} gold`;
                updateTotalCost();
            }
            else {
                disableIncreaseButtons();
                disableMarketActionsButtons();
                showWarning('notEnoughStock');
            }
        });
    });
    quantityDecreaseButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const pressedButton = e.target;
            const input = pressedButton.nextElementSibling;
            let inputValue = Number(input.value);
            const itemId = Number(pressedButton.parentElement.dataset.itemId);
            if (inputValue <= 0) {
                return;
            }
            else {
                inputValue--;
                input.value = inputValue.toString();
            }
            let itemQuantity = Number(inputValue);
            if (checkAvailableStock(itemQuantity, itemId, stock) === true) {
                let totalItemCost = updateItemCost(itemQuantity, itemId, stock);
                let itemPrice = pressedButton.parentElement.nextElementSibling;
                itemPrice.innerText = `${totalItemCost} gold`;
                removeWarning();
                updateTotalCost();
                enableIncreaseButtons();
                enableMarketActionsButtons();
            }
            else {
                showWarning('notEnoughStock');
                disableMarketActionsButtons();
            }
        });
    });
};
