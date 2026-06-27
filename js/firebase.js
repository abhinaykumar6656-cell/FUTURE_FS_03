const PRODUCT_STORAGE_KEY = "sweetcrumbsProducts";
const PRODUCT_COLLECTION = "products";

const defaultProducts = [
    {
        id: "default-cake",
        name: "Chocolate Celebration Cake",
        category: "Cakes",
        price: "$42",
        description: "Layered chocolate sponge, cream, berries, and glossy ganache.",
        image: "/assets/images/hero/cake.png"
    },
    {
        id: "default-cupcake",
        name: "Strawberry Cream Cupcake",
        category: "Cupcakes",
        price: "$6",
        description: "Vanilla sponge, whipped cream, chocolate drizzle, and fresh strawberry.",
        image: "/assets/images/hero/cupcake.png"
    },
    {
        id: "default-croissant",
        name: "Golden Butter Croissant",
        category: "Croissants",
        price: "$5",
        description: "Classic laminated pastry with crisp edges and a honeyed finish.",
        image: "/assets/images/hero/croissant.png"
    },
    {
        id: "default-cookie",
        name: "Dark Chocolate Cookie",
        category: "Cookies",
        price: "$4",
        description: "Soft center cookie with rich chocolate chunks and a toasted edge.",
        image: "/assets/images/hero/cookie.png"
    }
];

const getStoredProducts = () => {
    try {
        const saved = localStorage.getItem(PRODUCT_STORAGE_KEY);
        if (!saved) return [...defaultProducts];
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length ? parsed : [...defaultProducts];
    } catch (error) {
        return [...defaultProducts];
    }
};

const saveProducts = (products) => {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
};

const initializeFirebase = () => {
    if (!window.firebase || !window.firebase.apps || !window.firebaseConfig || window.firebaseConfig.projectId === "YOUR_PROJECT_ID") {
        return null;
    }

    if (!window.firebase.apps.length) {
        window.firebase.initializeApp(window.firebaseConfig);
    }

    return window.firebase.apps[0];
};

const getFirebaseDb = () => {
    const app = initializeFirebase();
    if (!app || !window.firebase.firestore) {
        return null;
    }
    return window.firebase.firestore();
};

const setupFirebaseProducts = async () => {
    const db = getFirebaseDb();
    if (!db) {
        return false;
    }

    const snapshot = await db.collection(PRODUCT_COLLECTION).get();
    const firestoreProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (firestoreProducts.length) {
        saveProducts(firestoreProducts);
    }

    return true;
};

const syncProductsToFirebase = async (products) => {
    const db = getFirebaseDb();
    if (!db) {
        return false;
    }

    const batch = db.batch();
    const collection = db.collection(PRODUCT_COLLECTION);
    const existing = await collection.get();

    existing.docs.forEach((doc) => batch.delete(doc.ref));
    products.forEach((product) => {
        const docRef = collection.doc(product.id);
        batch.set(docRef, product);
    });

    await batch.commit();
    return true;
};

const addProduct = (product) => {
    const products = getStoredProducts();
    const nextProduct = {
        ...product,
        id: product.id || `product-${Date.now()}`
    };
    products.unshift(nextProduct);
    saveProducts(products);
    syncProductsToFirebase(products).catch(() => {});
    return nextProduct;
};

const updateProduct = (product) => {
    const products = getStoredProducts();
    const nextProducts = products.map((item) => item.id === product.id ? product : item);
    saveProducts(nextProducts);
    syncProductsToFirebase(nextProducts).catch(() => {});
    return nextProducts;
};

const deleteProduct = (productId) => {
    const products = getStoredProducts().filter((item) => item.id !== productId);
    saveProducts(products);
    syncProductsToFirebase(products).catch(() => {});
    return products;
};

const getProducts = () => getStoredProducts();

window.addEventListener("DOMContentLoaded", () => {
    setupFirebaseProducts().catch(() => {});
});
