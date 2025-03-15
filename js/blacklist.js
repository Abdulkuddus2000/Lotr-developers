document.addEventListener('DOMContentLoaded', function () {
    let currentQuoteItem;

    function openModal(quote) {
        closeConfirmDeleteModal();
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
        closeModal();
        document.getElementById('confirmDeleteModal').style.display = 'block';
    }

    function closeConfirmDeleteModal() {
        document.getElementById('confirmDeleteModal').style.display = 'none';
    }

    document.querySelectorAll('.icon-edit i.fa-info-circle').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const quoteText = button.closest('.blacklist-item').querySelector('span').innerText;
            openModal(quoteText);
            currentQuoteItem = button.closest('.blacklist-item');
        });
    });

    document.querySelectorAll('.fa-trash').forEach(function (trashIcon) {
        trashIcon.addEventListener('click', function () {
            currentQuoteItem = this.closest('.blacklist-item');
            openConfirmDeleteModal();
        });
    });

    document.getElementById('confirmDelete').addEventListener('click', function () {
        if (currentQuoteItem) {
            currentQuoteItem.remove();
            closeConfirmDeleteModal();
        }
    });

    
    document.getElementById('cancelDelete').addEventListener('click', closeConfirmDeleteModal);


    document.getElementById('saveQuote').addEventListener('click', saveQuote);

});
