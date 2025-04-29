const customAlert = document.querySelector(".customAlert");

function ShowAlert() {
    customAlert.style.display = 'flex';
}

function HideAlert() {   
    customAlert.style.display = 'none';
}


// dropdown voor li
// window.onclick = function (event) {
//     if (!event.target.matches('.dropdown_li')) {
//         let dropdowns = document.querySelectorALl(".dropdown_li_content");
//         for (let i = 0; i < dropdowns.length; i++) {
//             let openDropdown = dropdowns[i];
//             if (openDropdown.classList.contains('show')) {
//                 openDropdown.classList.remove('show')
//             }
//         }
//     }
// }

window.onclick = function (event) {
    if (!event.target.matches('.dropdown_li')) {
        let dropdowns = document.querySelectorAll(".dropdown_li_content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
