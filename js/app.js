import { service } from './service.js';
import './inert.min.js';
///// Marketplace /////
// UI Variables //
const dashboardProductList = document.getElementById('stock');
const modalProductList = document.querySelector('.products__list');
// Functions //
const showCurrentStock = (stock) => {
    stock.forEach((item) => {
        // Product list for the dashboard.
        dashboardProductList.insertAdjacentHTML('beforeend', `<li class="dashboard__item">
				<img src="images/${item.filename}.png" class="item__image" alt="A ${item.name}"/>
				<div class="item__info">
					<h3 class="item__name">${item.name}</h3>
					<p class="item__quantity" data-item-id="${item.id}">Quantity: ${item.quantity}</p>
					<p class="item__price" data-item-id="${item.id}">Price: ${item.price} gold</p>
				</div>
			</li>`);
        // Product list for the modal.
        modalProductList.insertAdjacentHTML('beforeend', `<li class="products__item">
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
			</li>`);
    });
};
const showGoldBalance = (goldAmount) => {
    const goldBalance = document.getElementById('gold-balance');
    goldBalance.innerText = `${goldAmount} gold`;
};
const showUserLogin = (login) => {
    const userName = document.getElementById('user-name');
    userName.innerText = `${login}`;
};
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
const enableMarketActionsButtons = () => {
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
    const warningContainer = document.querySelector('.market__warnings');
    const warningText = document.querySelector('.warning__text');
    switch (warningType) {
        case 'exceededBalance':
            warningContainer.classList.remove('hidden');
            warningText.innerText = `The total cost exceeds your current gold balance.`;
            break;
        case 'notEnoughStock':
            warningContainer.classList.remove('hidden');
            warningText.innerText = `You have exceeded the maximum quantity for this item.`;
            break;
        case 'failedProcess':
            warningContainer.classList.remove('hidden');
            warningText.innerText = `There was a problem processing your purchase. Please try again later.`;
            break;
        default:
            warningContainer.classList.remove('hidden');
            warningText.innerText = `There was a general error. Please try again later.`;
    }
};
const updateItemCost = (quantity, id, currentStock) => {
    let itemID = Number(id);
    let updatedPrice = 0;
    currentStock.forEach((item) => {
        if (item.id === itemID) {
            updatedPrice = quantity * item.price;
        }
    });
    return updatedPrice;
};
const checkTotalCostDoesNotExceedBalance = (totalCost) => {
    let warningContainer = document.querySelector('.market__warnings');
    service.getUser()
        .then((user) => {
        if ('balance' in user) {
            if (totalCost <= user.balance) {
                if (warningContainer) {
                    // If total cost comes down back to current balance, remove warning
                    warningContainer.classList.add('hidden');
                    // enableIncreaseButtons();
                }
            }
            else {
                showWarning('exceededBalance');
                // disableIncreaseButtons();
                // disableMarketActionsButtons();
            }
        }
    });
};
const checkAvailableStock = (itemQuantity, itemId, stock) => {
    itemId = Number(itemId);
    let availableStock = 0;
    stock.forEach(item => {
        if (item.id === itemId) {
            availableStock = item.quantity;
        }
    });
    if (itemQuantity <= availableStock) {
        // enableIncreaseButtons();
        return true;
    }
    else {
        // disableIncreaseButtons();
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
const resetQuantities = () => {
    let costs = document.querySelectorAll('.market .item__cost');
    let itemQuantityInputs = document.querySelectorAll('.market .item__quantity');
    itemQuantityInputs.forEach(input => {
        input.value = '0';
        costs.forEach(cost => {
            cost.innerText = '0 gold';
        });
        updateTotalCost();
    });
};
// const updateAvailableStock = (): void => {
// 	const productQuantities = document.querySelectorAll('.dashboard .item__quantity[data-item-id]') as NodeListOf<HTMLParagraphElement>;
// 	for (let i = 0; i < productQuantities.length; i++) {
// 		if (Number(productQuantities[i].dataset.itemId) === currentStock[i].id) {
// 			productQuantities[i].innerText = `Quantity: ${currentStock[i].quantity}`;
// 		}
// 	};
// };
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
        //updateAvailableStock();
        // Update gold balance
        let finalGold = Number(document.querySelector('.market .total__value').innerText.slice(0, -5));
        //service.user.balance -= finalGold;
        //showGoldBalance();
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
///// Modal /////
// UI Variables //
const openModalButtons = document.querySelectorAll('[data-modal-open]');
const closeModalButtons = document.querySelectorAll('[data-modal-close]');
const buyButton = document.querySelector('.js-modal-buy');
const resetButton = document.querySelector('.js-quantity-reset');
const overlay = document.querySelector('.overlay');
let previousActiveElement;
// Functions //
const openModal = (modal) => {
    // Save a reference to the previous active element, to restore this once the modal is closed.
    previousActiveElement = document.activeElement;
    // Make the rest of the document inert so that it's not reachable with keyboard navigation.
    // Filter because the array ends up collecting script tags that are not necessary.
    let bodyElements = Array.from(document.body.children).filter(element => element.localName != 'script');
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
const closeModal = (modal) => {
    // Remove the inert attribute from elements.
    const bodyElements = Array.from(document.body.children).filter(element => element.localName != 'script');
    bodyElements.forEach((element) => {
        if (element.getAttribute('role') !== 'dialog') {
            element.inert = false;
        }
    });
    // Close the modal.
    if (modal == null) {
        return;
    }
    else {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        resetQuantities();
        // enableMarketActionsButtons();
    }
    // Restore focus to the previous active element.
    previousActiveElement.focus();
};
const loadModalFunctionality = (stock) => {
    let itemQuantityInputs = document.querySelectorAll('.market .item__quantity');
    let quantityIncreaseButtons = document.querySelectorAll('.js-market-increase');
    let quantityDecreaseButtons = document.querySelectorAll('.js-market-decrease');
    let marketActionsButtons = document.querySelectorAll('.market__actions .btn');
    buyButton.addEventListener('click', buyItems);
    resetButton.addEventListener('click', resetQuantities);
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
    // Typing any quantity updates the costs, and checks for constraints
    itemQuantityInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            let eventTarget = e.target;
            let itemId = Number(eventTarget.dataset.itemId);
            let itemQuantity = Number(eventTarget.value);
            let updatedPrice = updateItemCost(itemQuantity, itemId, stock);
            // If there's enough stock
            if (checkAvailableStock(itemQuantity, itemId, stock) === true) {
                let itemPrice = eventTarget.parentElement.nextElementSibling;
                // Update costs
                itemPrice.innerText = `${updatedPrice} gold`;
                updateTotalCost();
            }
            else {
                showWarning('notEnoughStock');
                // disableMarketActionsButtons();
            }
        });
    });
    quantityIncreaseButtons.forEach(button => {
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
                showWarning('notEnoughStock');
                // disableMarketActionsButtons();
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
                updateTotalCost();
                // enableMarketActionsButtons();
            }
            else {
                showWarning('notEnoughStock');
                // disableMarketActionsButtons();
            }
        });
    });
};
///// Go! /////
document.addEventListener('DOMContentLoaded', () => {
    service.getUser()
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
