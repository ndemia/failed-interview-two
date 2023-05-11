import { service, currentStock, showGoldBalance } from "./app.js";
import { closeModal } from "./modal.js";
const quantityIncreaseButtons = document.querySelectorAll('.item__increase');
const quantityDecreaseButtons = document.querySelectorAll('.item__decrease');
const marketActionsButtons = document.querySelectorAll('.market__actions .btn');
const itemQuantityInputs = document.querySelectorAll('.market .item__quantity');
const disableIncreaseButtons = () => {
    quantityIncreaseButtons.forEach(button => {
        button.classList.add('btn--disabled');
        button.disabled = true;
    });
};
const enableIncreaseButtons = () => {
    quantityIncreaseButtons.forEach(button => {
        button.classList.remove('btn--disabled');
        button.disabled = false;
    });
};
const disableDecreaseButtons = () => {
    quantityDecreaseButtons.forEach(button => {
        button.classList.add('btn--disabled');
        button.disabled = true;
    });
};
const enableDecreaseButtons = () => {
    quantityDecreaseButtons.forEach(button => {
        button.classList.remove('btn--disabled');
        button.disabled = false;
    });
};
const disableMarketActionsButtons = () => {
    marketActionsButtons.forEach(button => {
        button.classList.add('btn--disabled');
        button.disabled = true;
    });
};
export const enableMarketActionsButtons = () => {
    marketActionsButtons.forEach(button => {
        button.classList.remove('btn--disabled');
        button.disabled = false;
    });
};
const showLoader = () => {
    const loader = document.querySelector('.loader');
    loader.classList.remove('hidden');
};
const hideLoader = () => {
    const loader = document.querySelector('.loader');
    loader.classList.add('hidden');
};
const showWarning = (warningType) => {
    const warningText = document.querySelector('.warning__text');
    const warningContainer = document.querySelector('.market__warnings');
    switch (warningType) {
        case 'exceededBalance':
            warningText.innerText = `The total cost exceeds your current gold balance.`;
            warningContainer.classList.remove('hidden');
            break;
        case 'notEnoughStock':
            warningText.innerText = `You have exceeded the maximum quantity for this item.`;
            warningContainer.classList.remove('hidden');
            break;
        case 'failedProcess':
            warningText.innerText = `There was a problem processing your purchase. Please try again later.`;
            warningContainer.classList.remove('hidden');
            break;
        default:
            console.log('default');
    }
};
const updateItemCost = (quantity, id) => {
    // Because item ID can arrive as a string from the service object
    let itemID = Number(id);
    let updatedPrice = 0;
    currentStock.forEach(item => {
        if (item.id === itemID) {
            updatedPrice = quantity * item.price;
        }
    });
    return updatedPrice;
};
const checkTotalCostDoesNotExceedBalance = (totalCost) => {
    const warningContainer = document.querySelector('.market__warnings');
    if (totalCost <= service.user.balance) {
        if (warningContainer) {
            // If total cost comes down back to current balance, remove warning
            warningContainer.classList.add('hidden');
            enableIncreaseButtons();
        }
        return;
    }
    else {
        showWarning('exceededBalance');
        disableIncreaseButtons();
        disableMarketActionsButtons();
    }
};
const checkAvailableStock = (itemQuantity, itemId) => {
    // Because itemId arrives as a string from the object
    itemId = Number(itemId);
    // Get item's available stock
    let availableStock = 0;
    currentStock.forEach(item => {
        if (item.id === itemId) {
            availableStock = item.quantity;
        }
    });
    if (itemQuantity <= availableStock) {
        enableIncreaseButtons();
        return true;
    }
    else {
        disableIncreaseButtons();
        return false;
    }
};
const updateTotalCost = () => {
    const costs = document.querySelectorAll('.item__cost');
    const totalValue = document.querySelector('.total__value');
    let totalCost = 0;
    costs.forEach(cost => {
        totalCost += Number(cost.innerText.slice(0, -5));
    });
    totalValue.innerText = `${totalCost} gold`;
    checkTotalCostDoesNotExceedBalance(totalCost);
};
export const resetQuantities = () => {
    const costs = document.querySelectorAll('.market .item__cost');
    itemQuantityInputs.forEach(input => {
        input.value = '0';
        costs.forEach(cost => {
            cost.innerText = '0 gold';
        });
        updateTotalCost();
    });
};
const updateAvailableStock = () => {
    const productQuantities = document.querySelectorAll('.dashboard .item__quantity[data-item-id]');
    for (let i = 0; i < productQuantities.length; i++) {
        if (Number(productQuantities[i].dataset.itemId) === currentStock[i].id) {
            productQuantities[i].innerText = `Quantity: ${currentStock[i].quantity}`;
        }
    }
    ;
};
// Typing any quantity updates the costs, and checks for constraints
itemQuantityInputs.forEach(input => {
    input.addEventListener('change', (e) => {
        let eventTarget = e.target;
        let itemId = Number(eventTarget.dataset.itemId);
        let itemQuantity = Number(eventTarget.value);
        let updatedPrice = updateItemCost(itemQuantity, itemId);
        // If there's enough stock
        if (checkAvailableStock(itemQuantity, itemId) === true) {
            let itemPrice = eventTarget.parentElement.nextElementSibling;
            // Update costs
            itemPrice.innerText = `${updatedPrice} gold`;
            updateTotalCost();
        }
        else {
            showWarning('notEnoughStock');
            disableMarketActionsButtons();
        }
    });
});
quantityIncreaseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Identify and save the pressed button in order to have a better context of where and which inputs/values to update
        const pressedButton = e.target;
        const updatedInput = pressedButton.previousElementSibling;
        let updatedInputValue = Number(updatedInput.value);
        // Save the item's ID to find the price
        const itemId = Number(pressedButton.parentElement.dataset.itemId);
        updatedInputValue++;
        // Save the newly updated item quantity
        let itemQuantity = Number(updatedInputValue);
        // If there's enough stock
        if (checkAvailableStock(itemQuantity, itemId) === true) {
            let totalItemCost = updateItemCost(itemQuantity, itemId);
            let itemPrice = pressedButton.parentElement.nextElementSibling;
            itemPrice.innerText = `${totalItemCost} gold`;
            updateTotalCost();
        }
        else {
            showWarning('notEnoughStock');
            disableMarketActionsButtons();
        }
    });
});
quantityDecreaseButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        // Identify and save the pressed button in order to have a better context of where and which inputs/values to update
        const pressedButton = e.target;
        const updatedInput = pressedButton.nextElementSibling;
        let updatedInputValue = Number(updatedInput.value);
        // Save the item's ID to find the price
        const itemId = Number(pressedButton.parentElement.dataset.itemId);
        if (updatedInputValue <= 0) {
            return;
        }
        else {
            updatedInputValue--;
        }
        // Save the newly updated item quantity
        let itemQuantity = Number(updatedInputValue);
        if (checkAvailableStock(itemQuantity, itemId) === true) {
            let totalItemCost = updateItemCost(itemQuantity, itemId);
            let itemPrice = pressedButton.parentElement.nextElementSibling;
            itemPrice.innerText = `${totalItemCost} gold`;
            updateTotalCost();
            // Re-enable action buttons after decreasing the quantity because the stock limit was reached
            enableMarketActionsButtons();
        }
        else {
            showWarning('notEnoughStock');
            disableMarketActionsButtons();
        }
    });
});
const buyItems = () => {
    showLoader();
    disableIncreaseButtons();
    disableDecreaseButtons();
    disableMarketActionsButtons();
    service.simulateRequest().then(() => {
        // Save each input in order to gather from them each item quantity
        let finalItems = document.querySelectorAll('.market .item__quantity');
        for (let i = 0; i < finalItems.length; i++) {
            // Validate that the items are the same
            if (Number(currentStock[i].id) === Number(finalItems[i].dataset.itemId)) {
                // Substract the bought amount from the current stock
                currentStock[i].quantity -= Number(finalItems[i].value);
            }
            else {
                return;
            }
        }
        updateAvailableStock();
        // Update gold balance
        let finalGold = Number(document.querySelector('.market .total__value').innerText.slice(0, -5));
        service.user.balance -= finalGold;
        showGoldBalance();
        hideLoader();
        enableIncreaseButtons();
        enableDecreaseButtons();
        enableMarketActionsButtons();
        closeModal(document.querySelector('.modal'));
    }).catch(() => {
        hideLoader();
        enableIncreaseButtons();
        enableDecreaseButtons();
        enableMarketActionsButtons();
        showWarning('failedProcess');
    });
};
document.querySelector('.market .action__buy').addEventListener('click', buyItems);
document.querySelector('.action__reset').addEventListener('click', resetQuantities);
