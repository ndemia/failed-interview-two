// $(function() {
//     service.getUser()
//         .then(function (user) {
//             $("#user-name").text(user.login);
//             $("#gold-balance").text(user.balance);
//         })
//         .then(service.list)
//         .then(function(items) {
//             var container = $("#stock");
//             items.forEach(function (item) {
//                 container.append(item.name + ": " + item.quantity + "<br/>");
//             });
//         });
// });


///// Show name and gold balance
document.getElementById('gold-balance').innerText = `${service.user.balance} gold`;
document.getElementById('user-name').innerText = `${service.user.login}`;

///// Show current stock
// UI variables
const container = document.getElementById('stock');
const productsList = document.querySelector('.products__list');
const currentStock = service.items;

currentStock.forEach(item => {
    container.insertAdjacentHTML('beforeend', 
    `<li class="dashboard__item">
        <img src="images/${item.filename}.png" class="item__image" alt="A ${item.name}"/>
        <div class="item__info">
            <p class="item__name">${item.name}</p>
            <p class="item__quantity">Quantity: ${item.quantity}</p>
        </div>
    </li>`);
    
    // Load the market as if it was not defined in the HTML
    productsList.insertAdjacentHTML('beforeend',
    `<li class="products__item">
        <div class="item__container">
            <img src="images/${item.filename}.png" class="item__image">
            <h4 class="item__name">${item.name}</h4>
            <div data-item-id="${item.id}" class="item__actions">
                <button class="item__decrease">-</button>
                <input type="number" name="item__quantity" class="item__quantity">
                <button class="item__increase">+</button>	
                <span class="item__cost">0 gold</span>
            </div>
        </div>
    </li>`);
});


///// Modal functionality
// UI variables
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.querySelector('.overlay');

const openModal = function(modal) {

    if (modal == null) {
        return;
    } else {
        modal.classList.add('active');
        overlay.classList.add('active');
    }
};

const closeModal = function(modal) {
    if (modal == null) {
        return;
    } else {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }
};

openModalButtons.forEach(button => {

    button.addEventListener('click', () => {

        // Detect, from the clicked button, which modal will be opened
        const modal = document.querySelector(button.dataset.modalTarget);
        openModal(modal);
    })

});

closeModalButtons.forEach(button => {

    button.addEventListener('click', () => {

        const modal = button.closest('.modal');
        closeModal(modal);
    })
});

// Close the modal by clicking the overlay
overlay.addEventListener('click', () => {

    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        closeModal(modal);
    })
})


///// Market operations
// UI Variables
const quantityIncreaseButtons = document.querySelectorAll('.item__increase');
const quantityDecreaseButtons = document.querySelectorAll('.item__decrease');

const updateItemCost = function(itemQuantity, itemId) {

    // Because itemId arrives as a string from the object
    itemId = Number(itemId)

    let updatedPrice;

    currentStock.forEach(item => {
        if(item.id === itemId) {
            updatedPrice = itemQuantity * item.price;
        }
    });

    return updatedPrice;
};

const updateTotalCost = function() {

    let totalCost = 0;
    
    document.querySelectorAll('.item__cost').forEach(cost => {

        totalCost += Number(cost.innerText.slice(0, -5));

    })

    document.querySelector('.total__value').innerText = `${totalCost} gold`;

};

quantityIncreaseButtons.forEach(button => {

    button.addEventListener('click', (e) => {

        // Identify and save the pressed button in order to have a better context of where and which inputs/values to update
        const pressedButton = e.target;

        // Save the item's ID to find the price
        const itemId = pressedButton.parentElement.dataset.itemId;
      
        pressedButton.previousElementSibling.value++;

        // Save the newly updated item quantity
        let itemQuantity = pressedButton.previousElementSibling.value;

        let totalItemCost = updateItemCost(itemQuantity, itemId);

        pressedButton.nextElementSibling.innerText = `${totalItemCost} gold`;

        updateTotalCost();

    });

})

quantityDecreaseButtons.forEach(button => {

    button.addEventListener('click', (e) => {

        // Identify and save the pressed button in order to have a better context of where and which inputs/values to update
        const pressedButton = e.target;

        // Save the item's ID to find the price
        const itemId = pressedButton.parentElement.dataset.itemId;

        if (button.nextElementSibling.value <= 0) {
            return;
        } else {
            button.nextElementSibling.value--;
        }

        // Save the newly updated item quantity
        let itemQuantity = pressedButton.nextElementSibling.value;

        let totalItemCost = updateItemCost(itemQuantity, itemId);

        pressedButton.nextElementSibling.nextElementSibling.nextElementSibling.innerText = `${totalItemCost} gold`;

        updateTotalCost();
    });

})