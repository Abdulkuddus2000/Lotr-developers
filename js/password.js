let usernames = [];
let passwords = [];

// clearArray(usernames);
// clearArray(passwords);

// toggle visbility password
function togglePasswordOnMouseDown(event) {
  let password = event.target.previousElementSibling; // geklikte icon ogen
  let eyeIcon = event.target;

  password.type = "text";
  eyeIcon.classList.remove("fa-eye");
  eyeIcon.classList.add("fa-eye-slash");
}

function togglePasswordOnMouseUp(event) {
  let password = event.target.previousElementSibling; // geklikte icon ogen
  let eyeIcon = event.target;

  password.type = "password";
  eyeIcon.classList.remove("fa-eye-slash");
  eyeIcon.classList.add("fa-eye");
}

console.log(ShowAllUsernames());

// registration
document.addEventListener("DOMContentLoaded", () => {
    let submitRegistration = document.getElementById("submitRegistration");
  

    submitRegistration.addEventListener("click", (event) => {
    event.preventDefault(); // Voorkomt herladen van de pagina
    
    let username = document.getElementById("username").value;
    let passwordRegistrationPage = document.getElementById("passwordRegistrationPage").value;
    let resetPasswordRegistrationPage = document.getElementById("confirm-passwordRegistrationPage").value;
    let form = document.querySelector("form");

    let existingMessage = document.querySelector(".successOrFailureMessage");
    if (existingMessage) {
      existingMessage.remove();
    }

    let message = document.createElement('label');
    message.className = "successOrFailureMessage";
    

    if (checkLength(username, 5) && checkPattren(username) && IsUnique(username, usernames)) {
      if (AreIdentical(passwordRegistrationPage, resetPasswordRegistrationPage)) {
        usernames.push(username);
        passwords.push(passwordRegistrationPage);
        message.textContent = "Je bent successvol geregistreerd !!!";
        message.style.color = "green";
        
      } else {
        message.textContent = "De wachtwoorden komen niet overeen, gebruik het oog-icoontje ter controle.";
        message.style.color = "red";
      }
    } else {
      if (!(checkLength(username, 5))) {
        message.textContent = "Gebruikersnaam is te kort, deze moet minstens 5 karakters lang zijn";
      } else if (!(checkPattren(username))) {
        message.textContent = "De gebruikersnaam voldoet niet aan het formaat: min. 1 hoofdletter, min. 1 kleine letter, min. 1 cijfer, min. 1 vreemd karakter";
      }
      else {
        message.textContent = "De gebruikersnaam bestaat al";
      }
      message.style.color = "red";
    }
    form.appendChild(message);
  });
});
// end registration


// toon alle gebruikersnamen
function ShowAllUsernames() {
  return usernames.map((username) => username);
}


function AreIdentical(a, b) {
  return a === b;
}

function IsUnique(element, array) {
  return !array.includes(element);
}

// check of element bestaat uit letters en cijfers
function checkPattren(element) {
  //minstens 1 letter, 1 cijfer, 1 speciaal teken
  return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/.test(element);
}

// check of element een langte heeft van meer dan n
function checkLength(element, n) {
  return element.length >= n;
}

// reset password
function ResetPassword() {
  // let submitResetPassword = document.getElementById("submitResetPassword");

  // submitResetPassword.addEventListener("click", (event) => {
  //   event.preventDefault(); // voorkomt het standaard versturen van het formulier

  let newPassword1 = document.getElementById("resetPassword1");
  let newPassword2 = document.getElementById("resetPassword2");

  let existingMessage = document.getElementById("message");

  if (existingMessage) {
    existingMessage.remove();
  }

  if (AreIdentical(newPassword1, newPassword2) && checkLength()) {
    showMessage("Je wachtwoord is succesvol gewijzigd!", "#00ff00");
  } else {
    showMessage("De wachtwoorden komen niet overeen!", "#ff0000");
  }
  // });
}

// showing message of success or failure
function showMessage(text, color) {
  let main = document.querySelector("main");
  let form = document.querySelector("form");

  if (form) {
    form.remove();
  }

  let pEl = document.createElement("p");
  pEl.id = "message";
  pEl.style.color = color;
  pEl.style.fontSize = "18px";
  pEl.style.fontWeight = "bold";
  pEl.style.textAlign = "center";
  pEl.textContent = text;

  main.appendChild(pEl);
}

function clearArray(array) {
  for (let i = 0; i < array.length; i++) {
    delete (array[i]);
  }
  console.log(`Array ${array} is leeggemaakt.`);
  console.log("inhoud van de array:")
  for (let i = 0; i < array.length; i++) {
    console.log(array[i]);
  }
}
