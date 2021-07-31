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
    displayProducts(product){
        let text="";
        product.map((p)=>{
            text+=`
            <article class="product">
                <div class="img-container">
                    <img src="${p.image}" alt="" class="product-img">
                    <button class="bag-btn" data-id="${p.id}">
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
}
 //localstorage
 class LocalStorage{

 }

document.addEventListener("DOMContentLoaded",()=>{
        const products=new Products();
        const ui=new UI();
        products.getProducts().then((product)=> ui.displayProducts(product))
})