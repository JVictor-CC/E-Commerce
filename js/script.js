
// Hamburguer menu toggler

const menu_icon = document.getElementsByClassName('menu-icon')[0]
const menu_toggler =document.getElementsByClassName('menu-toggler')[0]

menu_icon.addEventListener('click', () =>{
    menu_toggler.classList.toggle('active')
});

// Prod details images

function changeImg(img, path){
    document.getElementById(img).src = path;
}