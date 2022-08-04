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


// Show name and gold balance
document.getElementById('gold-balance').innerText = `${service.user.balance} gold`;
document.getElementById('user-name').innerText = `${service.user.login}`;


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
    
    //Load the market as if it was not defined in the HTML
    // productsList.insertAdjacentHTML('afterbegin',
    // `<li class="products__item">
    //     <div class="item__container">
    //         <img src="images/${item.filename}.png" class="item__image">
    //         <h4 class="item__name">${item.name}</h4>
    //         <div class="item__actions">
    //             <button class="item__decrease"><img src="icons/minus.png"></button>
    //             <input type="number" name="item__quantity" class="item__quantity">
    //             <button class="item__increase"><img src="icons/plus.png"></button>	
    //             <span class="item__cost">${item.price} gold</span>
    //         </div>
    //     </div>
    // </li>`);
});


///// Modal functionality
// UI variables
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.querySelector('.overlay');

// Functions made with the idea of more modals being present
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

        // Detect, from the clicked button, which modal will be closed 
        const modal = button.closest('.modal');
        closeModal(modal);
    })
});

// Close the modal by clicking the overlay
overlay.addEventListener('click', () => {

    // Detect the active modal to close it
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        closeModal(modal);
    })
})


///// Market operations
// UI Variables
const quantityIncreaseButtons = document.querySelectorAll('.item__increase');
const quantityDecreaseButtons = document.querySelectorAll('.item__decrease');

quantityIncreaseButtons.forEach(button => {

    button.addEventListener('click', () => {

        button.previousElementSibling.value++;
    })

})

quantityDecreaseButtons.forEach(button => {

    button.addEventListener('click', () => {

        if (button.nextElementSibling.value <= 0) {
            return;
        } else {
            button.nextElementSibling.value--;
        }
    })

})