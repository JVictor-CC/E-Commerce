var client = contentful.createClient({
    space: 'p5789iutdp9p',
    accessToken: 'w5dT3we2fB34eCFrxI0T_yWnkvUQKVqYZW8WQvnXtUg',
  });


// Cart

const cartBtn = document.querySelector('.cart-btn');
const cartClose = document.querySelector('.cart-close');
const cartClear = document.querySelector('.cart-clear');
const cartContent = document.querySelector('.cart-content');
const cartAmount = document.querySelector('.cart-amount');
const cartTotal = document.querySelector('.cart-total');
const cartDom = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const productsDom = document.querySelector('.prod-items');
const cartToggler = document.querySelector('.cart-toggler');


let cart = [];
let buttonsDom = [];
// Get products from .json file
class Products{
    async getProducts(){
        try {
            /* To load content from JSON
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            */
            

            // Load content from contentful
            let contentful = await client.getEntries({
                content_type: "bullsportsProducts"
            });

            let products = contentful.items;
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
class UI{
    displayProducts(products){
        let result = "";
        products.forEach(product => {
            result += `
            <article class="prod-images-col">
                <div>
                    <img class="prod-img" src=${product.image} alt="product" width="100%">
                    <button  class="slide-btn add-cart" data-id=${product.id}>add to cart</button>
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

    getAddCartBtns(){
        const addCart = [...document.querySelectorAll(".add-cart")];
        buttonsDom = addCart;
        addCart.forEach(button =>{
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                button.innerText = "In Cart";
                button.disabled = true;
            }
                button.addEventListener('click', event =>{
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;
                    
                    let cartItem = {...Storage.getProduct(id),amount: 1};
                    // Put in Cart
                    cart = [...cart, cartItem];
                    //Save Cart locally
                    Storage.saveCart(cart);
                    //Cart Values
                    this.setCartValues(cart);
                    //Display items in Cart
                    this.addCartItem(cartItem);
                    //Open cart when add a Product
                    this.showCart(cart)
                });
        });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartAmount.innerText = itemsTotal;
    }
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt="product">
        <div>
            <h2>${item.title}</h2>
            <h2>$${item.price}</h2>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <span class="amount-up" data-id=${item.id}>&xwedge;</span>
            <p class="item-amount">${item.amount}</p>
            <span class="amount-down" data-id=${item.id}>&xvee;</span>
        </div>
        `;
        cartContent.appendChild(div);
    }
    showCart(){
        cartDom.classList.add('cart-toggler');
    }
    hideCart(){
        cartDom.classList.remove('cart-toggler');
    }
    setupCart(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        // Open and Close cart tab
        cartBtn.addEventListener('click', this.showCart);
        cartClose.addEventListener('click', this.hideCart);
    }
    populateCart(){
        cart.forEach(item => this.addCartItem(item));
    }
    cartLogic(){
        cartClear.addEventListener('click', () => {
            this.clearCart();
        });
        cartContent.addEventListener('click', event =>{
            if (event.target.classList.contains('remove-item')) {
                let removeItems = event.target;
                let id = removeItems.dataset.id;
                cartContent.removeChild(removeItems.parentElement.parentElement);
                this.removeItem(id);
            }
            else if(event.target.classList.contains('amount-up')){
                let amountUp = event.target;
                let id = amountUp.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount++;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                amountUp.nextElementSibling.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains('amount-down')){
                let amountDown = event.target;
                let id = amountDown.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount--;
                if (tempItem.amount>0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    amountDown.previousElementSibling.innerText = tempItem.amount;
                }else{
                    cartContent.removeChild(amountDown.parentElement.parentElement);
                    this.removeItem(id);
                }
                
                
            }
        });
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart(cart);
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleAddCartBtn(id);
        button.disabled = false;
        button.innerHTML = `add to cart`;
    }
    getSingleAddCartBtn(id){
        return buttonsDom.find(button => button.dataset.id === id);
    }
}

// Create a Local Storage for this project
class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    ui.setupCart();

    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then( () => {
        ui.getAddCartBtns();
        ui.cartLogic();
    });
});


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
