let submitButton = document.getElementById("submit");

submitButton.addEventListener("click", (event) => {
  event.preventDefault(); // voorkomt het standaard versturen van het formulier

  let newPassword1 = document.getElementById("resetPassword1").value;
  let newPassword2 = document.getElementById("resetPassword2").value;

  let existingMessage = document.getElementById("message");

  // verwijder meldingen die er mss al zijn:
  if (existingMessage) {
    existingMessage.remove();
  }

  if (newPassword1 === newPassword2 && newPassword1.length > 0) {
    showMessage("Je wachtwoord is succesvol gewijzigd!", "#00ff00");
  } else {
    showMessage("De wachtwoorden komen niet overeen!", "#ff0000");
  }
});

function showMessage(text, color) {
  let main = document.querySelector("main");
  let form = document.querySelector("form");

  // Verwijder het formulier als het bestaat
  if (form) {
    form.remove();
  }

  // Maak een nieuw <p>-element voor het bericht
  let pEl = document.createElement("p");
  pEl.id = "message";
  pEl.style.color = color;
  pEl.style.fontSize = "18px";
  pEl.style.fontWeight = "bold";
  pEl.style.textAlign = "center";
  pEl.textContent = text;

  // Voeg het bericht toe aan <main>
  main.appendChild(pEl);
}

// toggle visbility password
function togglePasswordVisibility(event) {
  let password = document.querySelector(".eyeIcon").target.previousSibling; // geklikte icon opvragen

  if (passwordInput.type === "password") {
    password.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    password.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
}
