

//voor Blacklist 
function openEditModal(blacklistId, reason, dialog) {
    document.getElementById('editBlacklistId').value = blacklistId;
    document.getElementById('editQuote').value = reason;
    document.getElementById('quoteText').textContent = '"' + dialog + '"';
    document.getElementById('quoteModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('quoteModal').style.display = 'none';
}

function openDeleteModal(blacklistId) {
    document.getElementById('deleteBlacklistId').value = blacklistId;
    document.getElementById('confirmDeleteModal').style.display = 'flex';
}

function closeConfirmDeleteModal() {
    document.getElementById('confirmDeleteModal').style.display = 'none';
}