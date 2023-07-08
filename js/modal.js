import { showMessage, removeMessage } from './messages.js';
import { enableIncreaseButtons, disableIncreaseButtons, enableMarketActionsButtons, disableMarketActionsButtons, updateTotalItemCost, isThereStockAvailable, updateTotalCost, resetQuantities, buyItems, } from './app.js';
import * as sound from './sounds.js';
import './inert.min.js';
// UI Variables //
const openModalButtons = document.querySelectorAll('[data-modal-open]');
const closeModalButtons = document.querySelectorAll('[data-modal-close]');
const buyButton = document.querySelector('.js-modal-buy');
const resetButton = document.querySelector('.js-quantity-reset');
const overlay = document.querySelector('.overlay');
let previousActiveElement;
// Functions //
export const openModal = (modal) => {
    const itemQuantityInputs = document.querySelectorAll('.market .js-item-quantity');
    const itemCosts = document.querySelectorAll('.market .js-item-cost');
    // Save a reference to the previous active element, to restore focus to it once the modal is closed.
    previousActiveElement = document.activeElement;
    // Make inert.
    let bodyElements = Array.from(document.body.children).filter((element) => element.localName != 'script');
    // Filter because the array ends up collecting script tags from the HTML that are not necessary.
    bodyElements.forEach((element) => {
        // Make the rest of the document inert so that it's not reachable with keyboard navigation.
        if (element.getAttribute('role') !== 'dialog') {
            element.inert = true;
        }
    });
    // Open the modal.
    if (modal != null) {
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
        modal.querySelector('button').focus();
    }
};
export const closeModal = (modal) => {
    const itemQuantityInputs = document.querySelectorAll('.market .js-item-quantity');
    const itemCosts = document.querySelectorAll('.market .js-item-cost');
    // Remove the inert attribute.
    const bodyElements = Array.from(document.body.children).filter((element) => element.localName != 'script');
    bodyElements.forEach((element) => {
        if (element.getAttribute('role') !== 'dialog') {
            element.inert = false;
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
export const loadModalFunctionality = (user, stock) => {
    const itemQuantityInputs = document.querySelectorAll('.market .js-item-quantity');
    const quantityIncreaseButtons = document.querySelectorAll('.js-market-increase');
    const quantityDecreaseButtons = document.querySelectorAll('.js-market-decrease');
    resetButton.addEventListener('click', () => {
        sound.resetQuantities.play();
        resetQuantities();
    });
    buyButton.addEventListener('click', buyItems);
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
    // Typing any quantity updates the costs, also checks for constraints.
    itemQuantityInputs.forEach((input) => {
        input.addEventListener('change', (e) => {
            const eventTarget = e.target;
            const itemQuantity = Number(eventTarget.value);
            const itemId = Number(eventTarget.dataset.itemId);
            const updatedPrice = updateTotalItemCost(itemQuantity, itemId, stock);
            const itemPrice = eventTarget.parentElement.nextElementSibling;
            // Allow only positive numbers.
            if (itemQuantity >= 0) {
                // Check for stock.
                if (isThereStockAvailable(itemQuantity, itemId, stock) === true) {
                    itemPrice.innerText = `${updatedPrice} gold`;
                    updateTotalCost(user.balance);
                }
                else {
                    showMessage('notEnoughStock');
                    disableIncreaseButtons();
                    disableMarketActionsButtons();
                }
            }
            else {
                itemPrice.innerText = `0 gold`;
                eventTarget.value = '0';
            }
        });
    });
    quantityIncreaseButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const pressedButton = e.target;
            const inputElement = pressedButton.previousElementSibling;
            let inputValue = Number(inputElement.value);
            const itemId = Number(pressedButton.parentElement.dataset.itemId);
            const itemName = inputElement.dataset.itemName;
            // Increase item quantity by one.
            inputValue++;
            // Show it on the UI.
            inputElement.value = inputValue.toString();
            sound.increase.play();
            // Save updated item quantity
            const itemQuantity = Number(inputValue);
            // Check quantity against stock, available when creating the modal.
            // Update the UI information accordingly.
            if (isThereStockAvailable(itemQuantity, itemId, stock) === true) {
                const totalItemCost = updateTotalItemCost(itemQuantity, itemId, stock);
                const itemPrice = pressedButton.parentElement.nextElementSibling;
                // Update total item's cost
                itemPrice.innerText = `${totalItemCost} gold`;
                updateTotalCost(user.balance);
            }
            else {
                // If no stock available, show warning message and disable interactions.
                showMessage('notEnoughStock', itemName);
                disableIncreaseButtons();
                disableMarketActionsButtons();
            }
        });
    });
    quantityDecreaseButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const pressedButton = e.target;
            const input = pressedButton.nextElementSibling;
            const itemId = Number(pressedButton.parentElement.dataset.itemId);
            let inputValue = Number(input.value);
            // If item quantity is less than 0, do nothing. Else, keep decreasing the item quantity.
            if (inputValue <= 0) {
                return;
            }
            else {
                inputValue--;
                input.value = inputValue.toString();
                sound.decrease.play();
            }
            // Save updated item quantity
            const itemQuantity = Number(inputValue);
            // Check against the available stock.
            if (isThereStockAvailable(itemQuantity, itemId, stock) === true) {
                const totalItemCost = updateTotalItemCost(itemQuantity, itemId, stock);
                const itemPrice = pressedButton.parentElement.nextElementSibling;
                // Update total item's cost.
                itemPrice.innerText = `${totalItemCost} gold`;
                // Remove warning message that showed because of exceeding item quantity.
                removeMessage('modal');
                // Re-enable interactions.
                enableIncreaseButtons();
                enableMarketActionsButtons();
                updateTotalCost(user.balance);
            }
            else {
                showMessage('notEnoughStock');
                disableMarketActionsButtons();
            }
        });
    });
};
