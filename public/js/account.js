
function openAvatarSelection() {
    document.getElementById('avatar-modal').style.display = 'block';
}

function closeAvatarSelection() {
    document.getElementById('avatar-modal').style.display = 'none';
}

function selectAvatar(src) {
    document.getElementById('avatar').src = src;
    closeAvatarSelection(); 
}

function save() {

    const username = document.getElementById('username').value;
    const bio = document.getElementById('bio').value;
    const avatar = document.getElementById('avatar').src;
            
    // Opslaan in lokale opslag of verzenden naar server//
    localStorage.setItem('profile', JSON.stringify({
        username,
        bio,
        avatar,
        quizWins: document.getElementById('quiz-wins').textContent,
        suddenDeathWins: document.getElementById('sudden-death-wins').textContent,
        tenRoundsWins: document.getElementById('ten-rounds-wins').textContent
    }));
            
    alert('Profiel opgeslagen!');
}

// Laad opgeslagen profiel bij het laden van de pagina//
window.onload = function() {
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        document.getElementById('username').value = profile.username || '';
        document.getElementById('bio').value = profile.bio || '';
        document.getElementById('avatar').src = profile.avatar || 'assets/character_aragorn.png';
        document.getElementById('quiz-wins').textContent = profile.quizWins || '4';
        document.getElementById('sudden-death-wins').textContent = profile.suddenDeathWins || '2';
        document.getElementById('ten-rounds-wins').textContent = profile.tenRoundsWins || '1';
    }

};

// Modal sluiten als er buiten wordt geklikt//
window.onclick = function(event) {
    const modal = document.getElementById('avatar-modal');
        if (event.target === modal) {
        closeAvatarSelection();
    }
};
