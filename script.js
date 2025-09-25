// Load Lessons (Categories)
const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/categories')
        .then(response => response.json())
        .then(data => displayLessons(data.categories))
}

const displayLessons = lessons => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = '';
    for (let lesson of lessons) {
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
        <button id="btn-${lesson.id}" onclick="loadCategory(${lesson.id})" 
            class="btn w-45 justify-start border-0">
            ${lesson.category_name}
        </button>
        `;
        levelContainer.appendChild(btnDiv);
    }
}
loadLessons();


// Load Category by ID
const manageSpinner = (isLoading) => {
    if (isLoading === true){
        document.getElementById('loading-spinner').classList.remove('hidden');
        document.getElementById('card-container').classList.add('hidden');
    }
    else{
        document.getElementById('loading-spinner').classList.add('hidden');
        document.getElementById('card-container').classList.remove('hidden');
    }
}

const loadCategory = (id = 1) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/category/${id}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            highlightActiveButton(id);
            loadCategoryDetails(data.plants);
        });
}

const highlightActiveButton = (id) => {
    const allButtons = document.querySelectorAll('#level-container button');
    allButtons.forEach(btn => {
        btn.classList.remove("bg-[#15803d]", "text-white");
    });

    const activeBtn = document.getElementById(`btn-${id}`);
    if (activeBtn) {
        activeBtn.classList.add("bg-[#15803d]", "text-white");
    }
}


// ------------------ CART SYSTEM ------------------
let cart = [];
const cartContainer = document.querySelector(".card-mark");

// Cart List
const cartList = document.createElement("div");
cartList.id = "cart-list";
cartList.className = "mt-4";
cartContainer.appendChild(cartList);

// Total
const totalEl = document.createElement("h2");
totalEl.className = "font-bold text-xl mt-4";
cartContainer.appendChild(totalEl);

// Add to Cart
function addToCart(plant) {
    const existing = cart.find(item => item.id === plant.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...plant, quantity: 1 });
    }
    renderCart();
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// Render Cart
function renderCart() {
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const row = document.createElement("div");
        row.className =
            "flex justify-between items-center bg-green-100 p-2 rounded-lg mb-2";

        row.innerHTML = `
          <div> <span class=" font-bold">${item.name}</span> <br>  <i class="fa-solid fa-bangladeshi-taka-sign"></i>${item.price} × ${item.quantity}</div>
          <button class="text-red-600 font-bold" onclick="removeFromCart(${item.id})">✕</button>
        `;
        cartList.appendChild(row);
    });

    totalEl.textContent = `Total: ৳${total}`;
}


// ------------------ SHOW PRODUCTS ------------------

const loadPlantDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/plant/${id}`;
    // console.log(url);
    const res = await fetch(url);
    const details = await res.json();
    displayPlantDetails(details.plants);
}

const displayPlantDetails = (plant) => {
    console.log(plant);
    const detailBox = document.getElementById('modal-content');
    detailBox.innerHTML = `
    <img src="${plant.image}" alt="${plant.name}" class="rounded-xl w-full h-48 mb-5" />
    <h2 class="card-title font-bold text-2xl mb-3">${plant.name}</h2>
    <p class="mb-3">${plant.description}</p>
    <p class="font-bold text-xl mb-3"><i class="fa-solid fa-bangladeshi-taka-sign"></i>${plant.price}</p>
    <button class="btn bg-[#15803d] text-white rounded-3xl w-full"
        onclick='addToCart(${JSON.stringify(plant)})'>
        Add to Cart
    </button>

    `;
    document.getElementById('my_modal_5').showModal();
}


const loadCategoryDetails = (plants) => {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    for (let plant of plants) {
        const cardDiv = document.createElement('div');
        cardDiv.innerHTML = `
        <div class="card bg-base-100 w-full h-full space-y-5 p-5 shadow-sm">
          <img src="${plant.image}" alt="${plant.name}"
            class="rounded-xl w-full h-48" />
          <div>
            <!-- modal open -->
            <h2 onclick="loadPlantDetails(${plant.id})" 
                class="card-title font-bold text-2xl cursor-pointer">
                ${plant.name}
            </h2>
            <p>${plant.description}</p>
          </div>
          <div class="flex justify-between items-center">
            <p class="bg-[#dcfce7] text-[#15803d] text-xl font-medium p-2 rounded-full">Fruit Tree</p>
            <p class="font-bold text-xl"><i class="fa-solid fa-bangladeshi-taka-sign"></i>${plant.price}</p>
          </div>
          <div class="card-actions">
            <button class="btn bg-[#15803d] text-white rounded-3xl w-full"
              onclick='addToCart(${JSON.stringify(plant)})'>
              Add to Cart
            </button>
          </div>
        </div>
        `;
        cardContainer.appendChild(cardDiv);
    }
    manageSpinner(false);
}


// Initial Load
loadCategory();
