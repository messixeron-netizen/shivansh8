const dishes = [
  {id:1,name:"Truffle Margherita",cat:"Pizza",price:399,emoji:"🍕",desc:"Wood-fired pizza, tomato, mozzarella & truffle oil."},
  {id:2,name:"Smoky BBQ Burger",cat:"Burger",price:349,emoji:"🍔",desc:"Grilled patty, smoky BBQ sauce, cheese & crispy onions."},
  {id:3,name:"Creamy Alfredo",cat:"Pasta",price:329,emoji:"🍝",desc:"Silky parmesan cream sauce with herbs and mushrooms."},
  {id:4,name:"Crispy Ramen",cat:"Asian",price:289,emoji:"🍜",desc:"Rich broth, noodles, vegetables and a soft egg."},
  {id:5,name:"Paneer Tikka Pizza",cat:"Pizza",price:379,emoji:"🫓",desc:"Tandoori paneer, peppers, onion and house masala."},
  {id:6,name:"Spicy Chicken Burger",cat:"Burger",price:369,emoji:"🍔",desc:"Crispy chicken, lettuce, spicy mayo and pickles."},
  {id:7,name:"Pesto Penne",cat:"Pasta",price:309,emoji:"🍝",desc:"Basil pesto, cherry tomatoes, parmesan and penne."},
  {id:8,name:"Veggie Sushi",cat:"Asian",price:319,emoji:"🍣",desc:"Fresh avocado, cucumber and sesame with soy dip."},
  {id:9,name:"Chocolate Lava Cake",cat:"Dessert",price:199,emoji:"🍫",desc:"Warm chocolate cake with a molten centre."},
  {id:10,name:"Berry Cheesecake",cat:"Dessert",price:229,emoji:"🍰",desc:"Creamy cheesecake with a bright berry topping."},
  {id:11,name:"Mango Fizz",cat:"Drinks",price:149,emoji:"🥭",desc:"Chilled mango, lime and sparkling soda."},
  {id:12,name:"Iced Mocha",cat:"Drinks",price:179,emoji:"🧋",desc:"Cold brew, chocolate, milk and a creamy finish."}
];

let cart = JSON.parse(localStorage.getItem("savoriaCart") || "[]");
let activeCategory = "All";

const grid = document.getElementById("menuGrid");
const empty = document.getElementById("emptyState");
const search = document.getElementById("searchInput");

function renderMenu(){
  const q = search.value.toLowerCase().trim();
  const filtered = dishes.filter(d => (activeCategory==="All" || d.cat===activeCategory) &&
    (d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)));
  grid.innerHTML = filtered.map(d => `
    <article class="dish">
      <div class="dish-img">${d.emoji}</div>
      <div class="dish-body">
        <div class="dish-top"><h3>${d.name}</h3><span class="price">₹${d.price}</span></div>
        <p>${d.desc}</p>
        <button class="add-btn" onclick="addToCart(${d.id})">+ Add to order</button>
      </div>
    </article>`).join("");
  empty.style.display = filtered.length ? "none" : "block";
}

function addToCart(id){
  const found = cart.find(i => i.id === id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  saveCart();
  openCart();
}

function changeQty(id, amount){
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += amount;
  if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
}

function removeItem(id){
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function saveCart(){
  localStorage.setItem("savoriaCart", JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  const items = document.getElementById("cartItems");
  document.getElementById("cartCount").textContent = cart.reduce((s,i)=>s+i.qty,0);
  if(!cart.length){
    items.innerHTML = '<div style="text-align:center;color:#888;padding:60px 10px">Your cart is empty.<br>Add something delicious! 🍽️</div>';
  } else {
    items.innerHTML = cart.map(i => {
      const d = dishes.find(x=>x.id===i.id);
      return `<div class="cart-item">
        <div class="cart-thumb">${d.emoji}</div>
        <div><h4>${d.name}</h4><div class="qty">
          <button onclick="changeQty(${d.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${d.id},1)">+</button>
          <button class="remove" onclick="removeItem(${d.id})">Remove</button>
        </div></div>
        <strong>₹${d.price*i.qty}</strong>
      </div>`;
    }).join("");
  }
  const subtotal = cart.reduce((s,i)=>s + dishes.find(d=>d.id===i.id).price*i.qty,0);
  const delivery = subtotal ? 40 : 0;
  document.getElementById("subtotal").textContent = `₹${subtotal}`;
  document.getElementById("delivery").textContent = `₹${delivery}`;
  document.getElementById("total").textContent = `₹${subtotal+delivery}`;
}

function openCart(){document.getElementById("cartPanel").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("overlay").classList.remove("show")}

document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
search.addEventListener("input",renderMenu);

document.getElementById("categories").addEventListener("click",e=>{
  if(e.target.tagName!=="BUTTON") return;
  activeCategory=e.target.dataset.category;
  document.querySelectorAll(".categories button").forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active");
  renderMenu();
});

document.getElementById("checkoutBtn").onclick=()=>{
  if(!cart.length){alert("Your cart is empty!");return}
  document.getElementById("checkoutModal").classList.add("open");
};
document.getElementById("closeModal").onclick=()=>document.getElementById("checkoutModal").classList.remove("open");

document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  document.getElementById("successMsg").style.display="block";
  cart=[];
  saveCart();
  setTimeout(()=>{
    document.getElementById("checkoutModal").classList.remove("open");
    document.getElementById("successMsg").style.display="none";
    e.target.reset();
    closeCart();
  },1800);
});

renderMenu();
renderCart();
