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