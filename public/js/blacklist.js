
let currentQuoteItem = null; 
let currentAction = null;


function openModal(quote) {
    currentAction = 'edit';
    document.getElementById('quoteText').innerText = quote;
    document.getElementById('editQuote').value = quote; 
    document.getElementById('quoteModal').style.display = "block";
}


function closeModal() {
    document.getElementById('quoteModal').style.display = "none";
    currentAction = null;
}


function saveQuote() {
    const newQuote = document.getElementById('editQuote').value;
    if (currentQuoteItem && currentAction === 'edit') {
        currentQuoteItem.querySelector('span').innerText = newQuote;
    }
    closeModal(); 
    currentQuoteItem = null;
}


function openConfirmDeleteModal() {
    currentAction = 'delete';
    document.getElementById('confirmDeleteModal').style.display = 'block';
}


function closeConfirmDeleteModal() {
    currentAction = 'delete';
    document.getElementById('confirmDeleteModal').style.display = 'none';
    currentQuoteItem = null;
}

// Klik handler voor save button
document.querySelectorAll('.icon-edit').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); 
        const quoteText = button.closest('.blacklist-item').querySelector('span').innerText;
        currentQuoteItem = button.closest('.blacklist-item'); 
        openModal(quoteText);
    });
});


document.querySelectorAll('.fa-trash').forEach((trashIcon) => {
    trashIcon.addEventListener('click', function (event) {
        event.preventDefault(); 
        event.stopPropagation();
        currentQuoteItem = this.closest('.blacklist-item');
        openConfirmDeleteModal(); 
    });
});


document.getElementById('confirmDelete').addEventListener('click', function () {
    if (currentQuoteItem && currentAction === 'delete') {
        currentQuoteItem.remove(); 
        closeConfirmDeleteModal();
        currentQuoteItem = null; 
    }
});

document.getElementById('cancelDelete').addEventListener('click', function () {
    closeConfirmDeleteModal();
    currentQuoteItem = null; 
}
);
