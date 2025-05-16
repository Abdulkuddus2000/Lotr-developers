// Filter van de character
function filterByCharacter(character) {
    const quoteCards = document.querySelectorAll('.favoriteQuotes-card');
    const showAllBtn = document.querySelector('.filter-btn-all');
    
    quoteCards.forEach(card => {
        if (card.dataset.character === character) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
    
    //
    showAllBtn.style.display = 'inline-block';
    
    // Update page titel
    const pageTitle = document.querySelector('.favoritePage-title');
    pageTitle.textContent = `Favoriete Quotes van ${character}`;
}

// toon alle quotes
function showAllQuotes() {
    const quoteCards = document.querySelectorAll('.favoriteQuotes-card');
    const showAllBtn = document.querySelector('.filter-btn-all');
    const pageTitle = document.querySelector('.favoritePage-title');
    
    quoteCards.forEach(card => {
        card.style.display = 'flex';
    });
    
    // Verberg alles weergeven knop
    showAllBtn.style.display = 'none';
    
    // Reset page titel
    pageTitle.textContent = 'Mijn favoriete Quotes';
}

// verwijder favorite quote
async function removeFavorite(quoteId) {
    if (confirm('ben je zeker dat je deze quote wilt verwijderen?')) {
        try {
            const response = await fetch(`/api/favorites/${quoteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                location.reload();
            } else {
                alert('fout is opgetreden bij het verwijderen');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Er is een fout opgetreden');
        }
    }
}

// Export quotes naar text files
async function exportQuotes() {
    try {
        const response = await fetch('/api/favorites/export');
        const blob = await response.blob();
        
        // maak download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'favoriete-quotes.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error:', error);
        alert('Er is een fout opgetreden bij het exporteren');
    }
}