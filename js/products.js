const productGridHome = document.getElementById("homeProductGrid");
const productGridPage = document.getElementById("productsPageGrid");

const renderProductCards = (container, products) => {
    if (!container) return;
    container.innerHTML = "";

    products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <button class="favorite-btn" aria-label="Favorite ${product.name}">♡</button>
            <img src="${product.image || "/assets/images/hero/cake.png"}" alt="${product.name}">
            <div>
                <span>${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <strong>${product.price}</strong>
            </div>
        `;
        container.appendChild(card);
    });
};

const loadProducts = () => {
    const products = getProducts();
    renderProductCards(productGridHome, products.slice(0, 6));
    renderProductCards(productGridPage, products);
};

window.addEventListener("storage", loadProducts);
loadProducts();
