
// Hamburguer menu toggler

const menuIcon = document.querySelector('.menu-icon');
const menu = document.querySelector('.menu');

menuIcon.addEventListener('click', () =>{
    menu.classList.toggle('menu-toggler')
});

// Changes Product image on details page

function changeImg(img, path){
    document.getElementById(img).src = path;
}


// Cart

const cartBtn = document.querySelector('.cart-btn');
const cartClose = document.querySelector('.cart-close');
const cartClear = document.querySelector('.cart-clear');
const cartContent = document.querySelector('.cart-content');
const cartItem = document.querySelector('.cart-item');
const cartTotal = document.querySelector('cart-total');
const cartDom = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const productsDom = document.querySelector('.prod-items');
const cartToggler = document.querySelector('.cart-toggler');

// Open and Close cart tab
cartBtn.addEventListener('click', () =>{
    cartDom.classList.toggle('cart-toggler')
});

cartClose.addEventListener('click', () =>{
    cartDom.classList.remove('cart-toggler')
});


let cart = [];

// Get products from .json file
class Products{
    async getProducts(){
        try {
            let result = await fetch("products.json");
            let data = await result.json();

            let products = data.items;
            products = products.map(item =>{
                const {title, price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title, price, id, image};
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}
// Display each product dynamically on products page
class Display{
    displayProducts(products){
        let result = "";
        products.forEach(product => {
            result += `
            <article class="prod-images-col">
                <div>
                    <img class="prod-img" src=${product.image} alt="product" width="100%">
                    <button  class="bag-btn" data-id=${product.id}>add to cart</button>
                </div>
                <a href="products-details.html"><p>${product.title}</p></a>
                <p>$${product.price}</p>
                <div>
                    <p id="star">&#9733; &#9733; &#9733; &#9733; &#10032;</p>
                </div>
            </article>
            `;
        });
    productsDom.innerHTML += result;
    } 
}

// Create a Local Storage for this project
class Storage{
    static saveCart(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    
}

document.addEventListener("DOMContentLoaded", () => {
    const display = new Display();
    const products = new Products();

    products.getProducts().then(products => {
        display.displayProducts(products);
        Storage.saveCart(products);
    });
});
