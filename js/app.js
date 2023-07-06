import { service } from './service.js';
import { removeMessage, showMessage } from './messages.js';
import { closeModal, loadModalFunctionality } from './modal.js';
import * as sound from './sounds.js';
// UI Variables //
const dashboardProductList = document.getElementById('stock');
const modalProductList = document.querySelector('.products__list');
const soundControl = document.querySelector('.sound__control');
// Functions //
const showCurrentStock = (stock) => {
    stock.forEach((item) => {
        // Product list for the dashboard.
        dashboardProductList.insertAdjacentHTML('beforeend', `<li class="dashboard__item">
				<div class="item__container item__container--texture">
					<img src="assets/images/${item.filename}.png" class="item__image" alt="A ${item.name}"/>
					<div class="item__info">
						<h3 class="item__name">${item.name}</h3>
						<div class="item__info--container">
							<span class="item__quantity js-item-quantity" data-item-id="${item.id}">Quantity: ${item.quantity}</span>
							<span class="item__price" data-item-id="${item.id}">Price: ${item.price} gold</span>
						</div>
					</div>
				</div>
			</li>`);
        // Product list for the modal.
        modalProductList.insertAdjacentHTML('beforeend', `<li class="products__item">
				<div class="item__container">
				<img src="assets/images/${item.filename}.png" class="item__image" alt="A ${item.name}">
					<div class="item__info">
						<h3 class="item__name">${item.name}</h3>
						<div class="item__details">
							<span class="item__quantity js-item-description-quantity" data-item-id="${item.id}">Quantity: ${item.quantity}</span>
							<span class="item__price" data-item-id="${item.id}">Price: ${item.price}</span>
						</div>
					</div>
					<div class="item__actions" data-item-id="${item.id}">
						<button class="item__decrease js-market-decrease" aria-label="Decrease ${item.name} quantity">-</button>
						<input type="number" name="item__quantity" class="item__quantity js-item-quantity" value="0" min="0" max="${item.quantity}" data-item-id="${item.id}" data-item-name="${item.name}" aria-label="${item.name} quantity" role="status">
						<button class="item__increase js-market-increase" aria-label="Increase ${item.name} quantity">+</button>	
					</div>
					<span class="item__cost js-item-cost" role="status">0 gold</span>
				</div>
			</li>`);
    });
};
const areSoundsEnabled = () => {
    return localStorage.getItem('sounds') === 'on' ? true : false;
};
export const showGoldBalance = (goldAmount) => {
    const goldBalance = document.querySelectorAll('.gold-balance');
    goldBalance.forEach((balance) => {
        balance.innerText = `${goldAmount} gold`;
    });
};
export const showUserLogin = (login) => {
    const userName = document.getElementById('user-name');
    userName.innerText = `${login}`;
};
export const disableIncreaseButtons = () => {
    let quantityIncreaseButtons = document.querySelectorAll('.js-market-increase');
    quantityIncreaseButtons.forEach((button) => {
        button.classList.add('btn--disabled');
        button.disabled = true;
    });
};
export const enableIncreaseButtons = () => {
    let quantityIncreaseButtons = document.querySelectorAll('.js-market-increase');
    quantityIncreaseButtons.forEach((button) => {
        button.classList.remove('btn--disabled');
        button.disabled = false;
    });
};
export const disableDecreaseButtons = () => {
    let quantityDecreaseButtons = document.querySelectorAll('.js-market-decrease');
    quantityDecreaseButtons.forEach((button) => {
        button.classList.add('btn--disabled');
        button.disabled = true;
    });
};
export const enableDecreaseButtons = () => {
    let quantityDecreaseButtons = document.querySelectorAll('.js-market-decrease');
    quantityDecreaseButtons.forEach((button) => {
        button.classList.remove('btn--disabled');
        button.disabled = false;
    });
};
export const disableMarketActionsButtons = () => {
    let marketActionsButtons = document.querySelectorAll('.js-market-action');
    marketActionsButtons.forEach((button) => {
        button.classList.add('btn--disabled');
        button.disabled = true;
    });
};
export const enableMarketActionsButtons = () => {
    let marketActionsButtons = document.querySelectorAll('.js-market-action');
    marketActionsButtons.forEach((button) => {
        button.classList.remove('btn--disabled');
        button.disabled = false;
    });
};
export const showLoader = (location) => {
    let loader;
    switch (location) {
        case 'dashboard':
            loader = document.querySelector('.js-loader-dashboard');
            break;
        case 'modal':
            loader = document.querySelector('.js-loader-modal');
            break;
        default:
            loader = document.querySelector('.js-loader-modal');
            break;
    }
    loader.classList.remove('hidden');
};
export const hideLoader = (location) => {
    let loader;
    switch (location) {
        case 'dashboard':
            loader = document.querySelector('.js-loader-dashboard');
            break;
        case 'modal':
            loader = document.querySelector('.js-loader-modal');
            break;
        default:
            loader = document.querySelector('.js-loader-modal');
            break;
    }
    loader.classList.add('hidden');
};
export const toggleInteractionsAndLoader = (state, location) => {
    if (state === 'disable') {
        showLoader(location);
        disableIncreaseButtons();
        disableDecreaseButtons();
        disableMarketActionsButtons();
    }
    else {
        hideLoader(location);
        enableIncreaseButtons();
        enableDecreaseButtons();
        enableMarketActionsButtons();
    }
};
export const isThereStockAvailable = (itemQuantity, id, stock) => {
    const itemId = Number(id);
    let availableItemStock = 0;
    // Match the item's ID and save its available stock.
    stock.forEach((item) => {
        if (item.id === itemId) {
            availableItemStock = item.quantity;
        }
    });
    // Check stock availability.
    if (itemQuantity <= availableItemStock) {
        return true;
    }
    else {
        return false;
    }
};
// Updates the total cost per item.
export const updateTotalItemCost = (quantity, id, stock) => {
    const itemID = Number(id);
    let updatedTotalItemCost = 0;
    // Match the item's ID
    // Get the cost of the item from the db and return it.
    stock.forEach((item) => {
        if (item.id === itemID) {
            updatedTotalItemCost = quantity * item.price;
        }
    });
    return updatedTotalItemCost;
};
const doesTotalCostExceedBalance = (totalCost, userBalance) => {
    if (totalCost <= userBalance) {
        return false;
    }
    else {
        return true;
    }
};
export const updateTotalCost = (userBalance) => {
    const itemCosts = document.querySelectorAll('.js-item-cost');
    const totalCostElement = document.querySelector('.js-total-value');
    let totalCost = 0;
    itemCosts.forEach((cost) => {
        // Get and save each cost from each item.
        totalCost += Number(cost.innerText.slice(0, -5));
    });
    // Show total cost in the UI.
    totalCostElement.innerText = `${totalCost} gold`;
    // Check against user's balance.
    const result = doesTotalCostExceedBalance(totalCost, userBalance);
    // If it exceeds the user's balance, disable and show warning message.
    if (result === true) {
        showMessage('exceededBalance');
        disableIncreaseButtons();
        disableMarketActionsButtons();
    }
};
export const resetQuantities = () => {
    const itemQuantityInputs = document.querySelectorAll('.market .js-item-quantity');
    const itemCosts = document.querySelectorAll('.market .js-item-cost');
    const totalCostElement = document.querySelector('.js-total-value');
    itemQuantityInputs.forEach((input) => {
        input.value = '0';
    });
    itemCosts.forEach((cost) => {
        cost.innerText = '0 gold';
    });
    totalCostElement.innerText = '0 gold';
    removeMessage('modal');
};
// Reflect stock changes on the dashboard and modal after purchase.
const updateAvailableStock = (stock) => {
    const dashboardItemQuantities = document.querySelectorAll('.dashboard .js-item-quantity');
    const marketItemQuantities = document.querySelectorAll('.market .js-item-description-quantity');
    for (let i = 0; i < dashboardItemQuantities.length; i++) {
        // Compare item's IDs.
        if (Number(dashboardItemQuantities[i].dataset.itemId) === stock[i].id) {
            // Update the item's quantities on the dashboard and modal.
            dashboardItemQuantities[i].innerText = `Quantity: ${stock[i].quantity}`;
            marketItemQuantities[i].innerText = `Quantity: ${stock[i].quantity}`;
        }
    }
};
export const buyItems = async () => {
    // Remove message warning in case it's present after a failed purchase
    removeMessage('modal');
    toggleInteractionsAndLoader('disable', 'modal');
    let finalItemQuantities = document.querySelectorAll('input.item__quantity');
    let finalGoldAmount = Number(document.querySelector('.market .total__value').innerText.slice(0, -5));
    try {
        // Get information from the db.
        const items = (await service.getItems().then((items) => items));
        const user = (await service.getUser().then((user) => user));
        // Identify each item and compare IDs.
        for (let i = 0; i < finalItemQuantities.length; i++) {
            if (items[i].id === Number(finalItemQuantities[i].dataset.itemId)) {
                // Subtract that item's quantity from the db.
                items[i].quantity -= Number(finalItemQuantities[i].value);
            }
        }
        // Update the stock after the purchase providing the updated stock (new quantities).
        updateAvailableStock(items);
        // Subtract the final cost from the user's balance, and show it on the UI.
        user.balance -= finalGoldAmount;
        showGoldBalance(user.balance);
        // Re-enable interactions
        toggleInteractionsAndLoader('enable', 'modal');
        closeModal(document.querySelector('.modal'));
        showMessage('successfulPurchase');
        sound.coins.play();
        // Remove the successful message from the dashboard.
        setTimeout(() => {
            removeMessage('dashboard');
        }, 5000);
    }
    catch (error) {
        toggleInteractionsAndLoader('enable', 'modal');
        showMessage('failedProcess');
    }
};
///// Go /////
document.addEventListener('DOMContentLoaded', async () => {
    // If no previous sounds setting is found, set 'sounds off' as default for the first time.
    if (localStorage.getItem('sounds') === null) {
        localStorage.setItem('sounds', 'off');
    }
    else {
        // Check the sound setting and set the corresponding one.
        if (areSoundsEnabled() === true) {
            sound.enableSounds();
        }
        else {
            sound.disableSounds();
        }
    }
    try {
        showLoader('dashboard');
        // Get information from the db.
        const items = (await service.getItems().then((items) => items));
        const user = (await service.getUser().then((user) => user));
        showGoldBalance(user.balance);
        showUserLogin(user.login);
        hideLoader('dashboard');
        // Show stock on the dashboard.
        showCurrentStock(items);
        // Pass the user and item stock to the modal/marketpalce so that it can be used to calculate stock and prices later.
        loadModalFunctionality(user, items);
    }
    catch (error) {
        hideLoader('dashboard');
        showMessage(error);
    }
});
soundControl.addEventListener('pointerdown', () => {
    // Toggle sounds on or off
    if (localStorage.getItem('sounds') === 'off') {
        localStorage.setItem('sounds', 'on');
        sound.soundsOn.play();
        sound.enableSounds();
    }
    else {
        localStorage.setItem('sounds', 'off');
        sound.soundsOff.play();
        sound.disableSounds();
    }
});
