
let currentQuoteItem = null; 


function openModal(quote) {
    document.getElementById('quoteText').innerText = quote;
    document.getElementById('editQuote').value = quote; 
    document.getElementById('quoteModal').style.display = "block";
}


function closeModal() {
    document.getElementById('quoteModal').style.display = "none";
}


function saveQuote() {
    const newQuote = document.getElementById('editQuote').value;
    if (currentQuoteItem) {
        currentQuoteItem.querySelector('span').innerText = newQuote;
    }
    closeModal(); 
}


function openConfirmDeleteModal() {
    document.getElementById('confirmDeleteModal').style.display = 'block';
}


function closeConfirmDeleteModal() {
    document.getElementById('confirmDeleteModal').style.display = 'none';
}


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
        currentQuoteItem = this.closest('.blacklist-item');
        openConfirmDeleteModal(); 
    });
});


document.getElementById('confirmDelete').addEventListener('click', function () {
    if (currentQuoteItem) {
        currentQuoteItem.remove(); 
        closeConfirmDeleteModal();
        currentQuoteItem = null; 
    }
});
