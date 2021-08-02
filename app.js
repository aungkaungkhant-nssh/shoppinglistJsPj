// variables
const cartBtn=document.querySelector(".cart-btn");
const closeCartBtn=document.querySelector(".close-cart");
const clearCartBtn=document.querySelector(".clear-cart");
const cartDom=document.querySelector('.cart');
const cartOverlay=document.querySelector('.cart-overlay');
const cartItems=document.querySelector('.cart-items');
const cartTotal=document.querySelector('.cart-total');
const cartContent=document.querySelector('.cart-content');
const productDom=document.querySelector('.products-center');



//cart
let cart=[];
//buttonDom
let buttonDom=[]
//getting products
class Products{
    async getProducts(){
        let data=await fetch("products.json");
        let result=await data.json();
        let products=result.items;
        products=products.map((product)=>{
            const {title,price}=product.fields;
            const {id}=product.sys;
           const image=product.fields.image.fields.file.url;
           return {title,price,id,image}
        })
        return products
    }
}
//getting Ui
class UI{
    displayProducts(products){
        let text="";
        products.map((p)=>{
            text+=`
            <article class="product">
                <div class="img-container">
                    <img src="${p.image}" alt="" class="product-img">
                    <button class="bag-btn" data-id=${p.id}>
                        <i class="fas fa-shopping-cart">add to bag</i>
                    </button>
                </div>
                <h3>${p.title}</h3>
                <h4>$${p.price}</h4>
            </article>
            `
        })
        productDom.innerHTML=text
    }
    getBagButtons(){
        let btns=[...document.querySelectorAll('.bag-btn')];
        buttonDom=[...btns];
        btns.forEach(btn =>{
            let id=btn.dataset.id;
            let inCart=cart.find(item => item.id==id);
            if(inCart){
                btn.innerText="In Cart";
                btn.disabled=true;
            }else{
                btn.addEventListener(("click"),(e)=>{
                    e.target.innerText="In Cart"
                    e.target.disabled=true;
                    //getProducts
                    let cartItem={...Storage.getProducts(id),amount:1};
                    cart=[...cart,cartItem]
                    //save to locastorage
                    Storage.saveCart(cart);
                    //setCartValues
                    this.setCartValues(cart);
                    //add Cart Item;
                    this.addCartItem(cartItem);
                    ///show cart
                    this.showCart()
                })
            }
        })
    }
    setCartValues(cart){
        let tempsTotal=0;
        let itemsTotal=0;
        cart.map(item =>{
            tempsTotal+=item.price*item.amount;
            itemsTotal+=item.amount;
        })
        cartTotal.innerText=parseFloat(tempsTotal.toFixed(2));
        cartItems.innerText=itemsTotal;
    }
    addCartItem(item){
        let div=document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML=`
                <img src="${item.image}" alt="">
                <div>
                    <h4>${item.title}</h4>
                    <h5>$${item.title}</h5>
                    <span class="remove-item" data-id=${item.id}>remove</span>
                </div>
                <div>
                    <i class="fas fa-chevron-up"  data-id=${item.id}></i>
                    <p class="item-amount">${item.amount}</p>
                    <i class="fas fa-chevron-down"  data-id=${item.id}></i>
                </div>
        
        `
        cartContent.appendChild(div);
        
    }
    showCart(){
        cartOverlay.classList.add("transparentBcg");
        cartDom.classList.add("showCart");
    }
    hideCart(){
        cartOverlay.classList.remove("transparentBcg");
        cartDom.classList.remove("showCart");
    }
    setUpApp(){
        cart=Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener("click",this.showCart)
        closeCartBtn.addEventListener("click",this.hideCart)
        
    }
    populateCart(cart){
        cart.map(c =>this.addCartItem(c))
    }
    cartLogic(){
        ///clear cart
        clearCartBtn.addEventListener("click",()=>{
            this.clearCart()
        })
        /// clear functionality
        cartContent.addEventListener("click",event=>{
            if(event.target.classList.contains("remove-item")){
               let id=event.target.dataset.id;
               this.removeCart(id);
               cartContent.removeChild(event.target.parentElement.parentElement)
            }
        })
    }
    clearCart(){
        let cartItems=cart.map(item =>item.id)
        cartItems.forEach(id => this.removeCart(id))
        if(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[1])
        }
        this.hideCart()
    }
    removeCart(id){
        cart=cart.filter(item =>item.id!==id);
        Storage.saveCart(cart);
        this.setCartValues(cart);
        let button=this.singleButton(id);
        button.disabled=false;
        button.innerHTML=` <i class="fas fa-shopping-cart">add to bag</i>`
    }
    singleButton(id){
        return buttonDom.find(btn =>btn.dataset.id===id)
    }
}
 //localstorage
 class Storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products))
    }
    static getProducts(id){
        let products=JSON.parse(localStorage.getItem("products"));
        return products.find(product =>product.id===id);
    }
    static saveCart(cart){
        localStorage.setItem("carts",JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem("carts")?JSON.parse(localStorage.getItem("carts")):[];
    }
 }

document.addEventListener("DOMContentLoaded",()=>{
        const products=new Products();
        const ui=new UI();
        ui.setUpApp();
        products.getProducts().then((products)=> {
            ui.displayProducts(products);
            Storage.saveProducts(products)
        })
        .then(()=>{
            ui.getBagButtons()
            ui.cartLogic()
        })
})