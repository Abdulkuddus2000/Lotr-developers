
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

function logout() {
    alert("U bent uitgelogd!");
}
