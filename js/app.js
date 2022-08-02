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

document.getElementById('gold-balance').innerText = `${service.user.balance} gold`;
document.getElementById('user-name').innerText = `${service.user.login}`;

let container = document.getElementById('stock');
let currentStock = service.items;
currentStock.forEach(item => {

    container.insertAdjacentHTML('afterend', `<p class="dashboard__item">${item.name}: ${item.quantity}</p>`)

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

// Event listeners for opening and closing the modal
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

overlay.addEventListener('click', () => {

    // Detect the active modal
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        closeModal(modal);
    })
})