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


// document.querySelector('#buy').addEventListener('click', function() {

//     document.querySelector('.market').style.display = 'block';

// });

// document.querySelector('.action-cancel').addEventListener('click', function() {

//     document.querySelector('.market').style.display = 'none';

// });

// document.querySelector('.close-market').addEventListener('click', function() {

//     document.querySelector('.market').style.display = 'none';

// });

const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.querySelector('.overlay');


function openModal(modal) {
    if (modal == null) {
        return;
    } else {
        modal.classList.add('active');
        overlay.classList.add('active')
    }
}

function closeModal(modal) {
    if (modal == null) {
        return;
    } else {
        modal.classList.remove('active');
        overlay.classList.remove('active')
    }
}


openModalButtons.forEach(button => {

    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })

});

closeModalButtons.forEach(button => {

    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal)
    })
});