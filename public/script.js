// Importando Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import firebaseConfig from "./firebase-config.js";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let cart = [];
let loadedProducts = [];

// Funções de UI
document.addEventListener("DOMContentLoaded", () => {
    loadProductsFromFirebase();
});

const defaultProducts = [
    { name: 'Top de Crochê Sereia', price: 89.90, images: ['images/top.png'], category: 'Tops', isNews: true },
    { name: 'Amigurumi Ursinho', price: 120.00, images: ['images/amigurumi.png'], category: 'Tops', isNews: true },
    { name: 'Bolsa de Crochê Praia', price: 150.00, images: ['https://via.placeholder.com/400x400/FCEFE0/003399?text=Bolsa+Croch%C3%AA'], category: 'Bolsas', isNews: true }
];

function loadProductsFromFirebase() {
    const productsRef = ref(db, 'products');
    
    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        let productsList = [];
        
        if (data) {
            productsList = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
        } else {
            productsList = defaultProducts;
        }

        loadedProducts = productsList;
        window.loadedProducts = productsList; 
        renderProducts();
        renderLatestReleases(); // Nova função
        loadNewsMarquee();
    });
}

function renderLatestReleases() {
    const slider = document.getElementById('latest-slider');
    if (!slider) return;

    const newsItems = loadedProducts.filter(p => p.isNews);
    slider.innerHTML = '';

    if (newsItems.length === 0) {
        slider.innerHTML = '<p style="color: #666; padding: 20px;">Adicione produtos marcados como "Novidade" no painel admin.</p>';
        return;
    }

    newsItems.forEach(p => {
        const actualIndex = loadedProducts.findIndex(origP => origP.name === p.name);
        const oldPrice = p.price * 1.3; // Simula um preço antigo 30% maior
        const discount = 23; // Simula fixo ou calculado
        const installment = p.price / 2;

        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <div class="news-card-image" onclick="openProductModal(${actualIndex})">
                <img src="${p.images[0]}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400'">
            </div>
            <div class="news-card-info">
                <h4 onclick="openProductModal(${actualIndex})">${p.name}</h4>
                <div class="news-price-box">
                    <span class="news-main-price">R$ ${p.price.toFixed(2).replace('.', ',')}</span>
                    <span class="news-discount">-${discount}% OFF</span>
                    <span class="news-old-price">R$ ${oldPrice.toFixed(2).replace('.', ',')}</span>
                </div>
                <button class="news-btn-buy" onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price})">Comprar</button>
            </div>
        `;
        slider.appendChild(card);
    });
}

window.moveSlider = (direction) => {
    const slider = document.getElementById('latest-slider');
    if (!slider) return;
    const scrollAmount = slider.clientWidth * 0.8;
    slider.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
};


function renderProducts(filter = 'all') {
    const grid = document.querySelector('.products-grid');
    if(!grid) return;

    grid.innerHTML = '';
    
    let filteredProducts = loadedProducts;
    if (filter !== 'all') {
        filteredProducts = loadedProducts.filter(p => p.category === filter);
    }

    if (filteredProducts.length === 0) {
        grid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; padding: 2rem; color: #888;">Nenhum produto encontrado nesta categoria.</p>`;
        return;
    }

    filteredProducts.forEach((p) => {
        const actualIndex = loadedProducts.findIndex(origP => origP.name === p.name);
        let firstImg = (p.images && p.images.length > 0) ? p.images[0] : '';
        grid.innerHTML += `
            <div class="product-card">
                <div class="product-image" onclick="openProductModal(${actualIndex})" style="cursor: pointer;">
                    <img src="${firstImg}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x400/FCEFE0/003399?text=Imagem'">
                    ${p.isNews ? '<span class="news-badge" style="position:absolute; top:20px; left:20px; background:var(--navy-blue); color:white; padding:5px 15px; border-radius:30px; font-weight:bold; font-size:0.8rem; box-shadow:0 5px 15px rgba(0,0,0,0.2);">NOVO</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 onclick="openProductModal(${actualIndex})" style="cursor: pointer;">${p.name}</h3>
                    <p class="price">R$ ${p.price.toFixed(2).replace('.', ',')}</p>
                    <button class="btn-add" onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price})">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
    });
}

function loadNewsMarquee() {
    const marquee = document.getElementById('news-marquee');
    if (!marquee) return;

    const newsItems = loadedProducts.filter(p => p.isNews);

    if (newsItems.length === 0) {
        marquee.innerHTML = `
            <div class="marquee-item"><span>Novidades</span> UseLicecroche: Peças únicas feitas com amor</div>
            <div class="marquee-item"><span>Novidades</span> Confira nossa nova coleção de crochê</div>
            <div class="marquee-item"><span>Novidades</span> UseLicecroche: Artesanato com alma</div>
        `;
    } else {
        let content = '';
        const repeatedItems = [...newsItems, ...newsItems, ...newsItems];
        repeatedItems.forEach(item => {
            content += `
                <div class="marquee-item" onclick="openProductModal(${loadedProducts.findIndex(p => p.name === item.name)})" style="cursor: pointer;">
                    <img src="${item.images[0]}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,0.3);">
                    <span>Novidade</span> ${item.name} - R$ ${item.price.toFixed(2).replace('.', ',')}
                </div>
            `;
        });
        marquee.innerHTML = content;
    }
}

// Tornando as funções globais para o HTML conseguir chamar
window.toggleCart = () => {
    const overlay = document.getElementById('cart-overlay');
    overlay.classList.toggle('active');
};

window.closeCart = (e) => {
    if (e.target.id === 'cart-overlay') {
        document.getElementById('cart-overlay').classList.remove('active');
    }
};

window.toggleSidebar = () => {
    const overlay = document.getElementById('sidebar-overlay');
    overlay.classList.toggle('active');
};

window.closeSidebar = (e) => {
    if (e.target.id === 'sidebar-overlay') {
        document.getElementById('sidebar-overlay').classList.remove('active');
    }
};

window.filterByCategory = (category) => {
    document.querySelectorAll('.sidebar-menu li').forEach(li => {
        li.classList.remove('active');
        if (li.innerText.includes(category) || (category === 'all' && li.innerText.includes('Todos'))) {
            li.classList.add('active');
        }
    });

    renderProducts(category);
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar-overlay').classList.remove('active');
    }
    scrollToProducts();
};

window.scrollToProducts = () => {
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
};

window.openProductModal = (index) => {
    const product = loadedProducts[index];
    if (!product) return;
    
    document.getElementById('modal-title').innerText = product.name;
    document.getElementById('modal-price').innerText = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
    
    const descEl = document.getElementById('modal-description');
    const detailsEl = document.getElementById('modal-details');
    
    descEl.innerText = product.description || "Este produto é feito à mão com todo carinho e dedicação.";
    detailsEl.innerText = product.details || "Material: Barbante de Algodão\nProdução: 100% artesanal";

    const mainImg = document.getElementById('modal-main-image');
    const thumbnailsBox = document.getElementById('modal-thumbnails');
    thumbnailsBox.innerHTML = '';
    
    const imagesArray = product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/400/FCEFE0'];
    mainImg.src = imagesArray[0];
    
    imagesArray.forEach((imgUrl, i) => {
        const thumb = document.createElement('img');
        thumb.src = imgUrl;
        if (i === 0) thumb.classList.add('active');
        thumb.onclick = () => {
            document.querySelectorAll('.modal-thumbnails img').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainImg.src = imgUrl;
        };
        thumbnailsBox.appendChild(thumb);
    });
    
    document.getElementById('modal-add-btn').onclick = () => {
        addToCart(product.name, product.price);
        closeProductModal(null, true);
    };

    document.getElementById('product-modal').classList.add('active');
};

window.closeProductModal = (e, force = false) => {
    if (force || (e && e.target.id === 'product-modal')) {
        document.getElementById('product-modal').classList.remove('active');
    }
};

window.addToCart = (name, price) => {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartUI();
    
    const countElement = document.getElementById('cart-count');
    countElement.style.transform = 'scale(1.5)';
    setTimeout(() => {
        countElement.style.transform = 'scale(1)';
    }, 200);
};

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    cartItemsContainer.innerHTML = '';
    
    let totalItems = 0;
    let totalPrice = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #888; font-style: italic;">Seu carrinho está vazio.</p>';
    } else {
        cart.forEach((item, index) => {
            totalItems += item.quantity;
            let currentItemTotal = item.price * item.quantity;
            totalPrice += currentItemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.quantity}x ${item.name}</h4>
                    <p>R$ ${currentItemTotal.toFixed(2).replace('.', ',')} 
                       <span style="font-size:0.8rem; color:#888; font-weight:normal;">(R$ ${item.price.toFixed(2).replace('.', ',')} un)</span>
                    </p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})" title="Remover Todos">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
    
    cartCount.innerText = totalItems;
    cartTotalPrice.innerText = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
}

window.checkoutWhatsApp = () => {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    
    const waNumber = "558187230143";
    let message = "Olá UseLicecroche! 🥰\nGostaria de fazer o seguinte pedido:\n\n";
    
    let total = 0;
    cart.forEach(item => {
        let currentItemTotal = item.price * item.quantity;
        message += `🛍️ ${item.quantity}x ${item.name} - R$ ${currentItemTotal.toFixed(2).replace('.', ',')}\n`;
        total += currentItemTotal;
    });
    
    message += `\n*Total estimado: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

