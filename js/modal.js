// Variables
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.querySelector('.overlay');
let previousActiveElement;

const openModal = function (modal) {

    // Save a reference to the previous active element
    // To restore this once the modal is closed
    previousActiveElement = document.activeElement;

    // Make the rest of the document inert so that it's not available with keyboard or screen reader.
    Array.from(document.body.children).forEach(child => {
        if (child.getAttribute('role') !== 'dialog') {
            child.inert = true;
        }
    });

    // Move focus into the modal
    modal.querySelector('button').focus();

    // Open the modal
    if (modal == null) {
        return;
    } else {
        modal.classList.add('active');
        overlay.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }
};

const closeModal = function (modal) {

    // Uninert elements
    Array.from(document.body.children).forEach(child => {
        if (child.getAttribute('role') !== 'dialog') {
            child.inert = false;
        }
    });

    // Close the modal
    if (modal == null) {
        return;
    } else {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        resetQuantities();
        enableMarketActionsButtons();
    }

    // Restore focus to the previous active element
    previousActiveElement.focus();
};

openModalButtons.forEach(button => {

    button.addEventListener('click', () => {

        // Detect, from the clicked button, which modal will be opened
        const modal = document.querySelector(button.dataset.modalTarget);
        openModal(modal);
        
    });

});

closeModalButtons.forEach(button => {

    button.addEventListener('click', () => {

        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

// Close the modal by clicking the overlay
overlay.addEventListener('click', () => {

    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        closeModal(modal);
    });
});
