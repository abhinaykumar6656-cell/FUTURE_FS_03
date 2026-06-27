const dashboardLinks = document.querySelectorAll(".dashboard-nav a");
const dashboardSections = Array.from(document.querySelectorAll(".dashboard-panel, #overview"));

const handleNavClick = (event) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) return;

    const section = document.querySelector(targetId);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
    dashboardLinks.forEach((link) => link.classList.remove("active"));
    event.currentTarget.classList.add("active");
};

const updateActiveLink = (sectionId) => {
    dashboardLinks.forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("active", href === sectionId);
    });
};

const productModal = document.getElementById("productModal");
const addProductBtn = document.getElementById("addProductBtn");
const closeProductModal = document.getElementById("closeProductModal");
const cancelProductBtn = document.getElementById("cancelProductBtn");
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const productImageInput = document.getElementById("productImageInput");
const productImagePreview = document.getElementById("productImagePreview");

let products = getProducts();
let editProductId = null;

const createProductCard = (product) => {
    const card = document.createElement("article");
    card.className = "dashboard-product-card";
    card.innerHTML = `
        <div class="product-card-meta">
            <img src="${product.image || "../assets/images/hero/cake.png"}" alt="${product.name}">
            <div>
                <span>${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
            </div>
        </div>
        <div class="product-card-actions">
            <strong>${product.price}</strong>
            <div>
                <button class="btn btn-secondary edit-item-btn" data-id="${product.id}">Edit</button>
                <button class="btn btn-secondary delete-item-btn" data-id="${product.id}">Delete</button>
            </div>
        </div>
    `;

    return card;
};

const renderProducts = () => {
    if (!productList) return;
    productList.innerHTML = "";

    products.forEach((product) => {
        const card = createProductCard(product);
        productList.appendChild(card);
    });

    document.querySelectorAll(".edit-item-btn").forEach((button) => {
        button.addEventListener("click", () => openProductModal(button.dataset.id));
    });

    document.querySelectorAll(".delete-item-btn").forEach((button) => {
        button.addEventListener("click", () => removeProduct(button.dataset.id));
    });
};

const openProductModal = (id = null) => {
    if (!productModal) return;
    productModal.setAttribute("aria-hidden", "false");
    productModal.classList.add("open");
    if (!productForm) return;

    const title = document.getElementById("productModalTitle");
    const fields = Object.fromEntries(new FormData(productForm).entries());

    if (id) {
        editProductId = id;
        const product = products.find((item) => item.id === id);
        if (!product) return;
        title.textContent = "Edit Bakery Item";
        productForm.name.value = product.name;
        productForm.category.value = product.category;
        productForm.price.value = product.price;
        productForm.description.value = product.description;
        productForm.id.value = product.id;
        productImagePreview.textContent = product.image ? "Image ready" : "No image selected";
    } else {
        editProductId = null;
        title.textContent = "Add New Bakery Item";
        productForm.reset();
        productForm.id.value = "";
        productImagePreview.textContent = "No image selected";
    }
};

const closeProductModalFn = () => {
    if (!productModal) return;
    productModal.setAttribute("aria-hidden", "true");
    productModal.classList.remove("open");
};

const removeProduct = (id) => {
    products = deleteProduct(id);
    renderProducts();
    window.dispatchEvent(new Event("storage"));
};

const handleFilePreview = () => {
    const file = productImageInput?.files?.[0];
    if (!file || !productImagePreview) return;
    productImagePreview.textContent = file.name;
};

if (dashboardLinks.length) {
    dashboardLinks.forEach((link) => link.addEventListener("click", handleNavClick));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    updateActiveLink(`#${entry.target.id}`);
                }
            });
        },
        {
            root: null,
            threshold: 0.45,
        }
    );

    dashboardSections.forEach((section) => {
        if (section) observer.observe(section);
    });
}

if (addProductBtn) {
    addProductBtn.addEventListener("click", () => openProductModal());
}
if (closeProductModal) {
    closeProductModal.addEventListener("click", closeProductModalFn);
}
if (cancelProductBtn) {
    cancelProductBtn.addEventListener("click", closeProductModalFn);
}
if (productImageInput) {
    productImageInput.addEventListener("change", handleFilePreview);
}
if (productForm) {
    productForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(productForm);
        const newProduct = {
            id: formData.get("id") || Date.now().toString(),
            name: formData.get("name")?.toString().trim(),
            category: formData.get("category")?.toString().trim(),
            price: formData.get("price")?.toString().trim(),
            description: formData.get("description")?.toString().trim(),
            image: productImageInput?.files?.[0] ? URL.createObjectURL(productImageInput.files[0]) : "",
        };

        if (editProductId) {
            products = updateProduct({ ...newProduct, id: editProductId });
        } else {
            addProduct(newProduct);
            products = getProducts();
        }

        renderProducts();
        window.dispatchEvent(new Event("storage"));
        closeProductModalFn();
    });
}

renderProducts();
