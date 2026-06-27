const adminEmail = "admin@sweetcrumbs.com";
const adminPassword = "admin@123";
const loginForm = document.querySelector("[data-login-form]");
const loginStatus = document.querySelector(".login-status");
const roleKey = "sweetcrumbsRole";
const emailKey = "sweetcrumbsUserEmail";

const setRole = (role, email) => {
    localStorage.setItem(roleKey, role);
    localStorage.setItem(emailKey, email);
};

const clearRole = () => {
    localStorage.removeItem(roleKey);
    localStorage.removeItem(emailKey);
};

const navigate = (role) => {
    if (role === "admin") {
        window.location.href = "./pages/dashboard.html";
    } else {
        window.location.href = "./index.html";
    }
};

const getCurrentRole = () => localStorage.getItem(roleKey);
const isAdmin = () => getCurrentRole() === "admin";

const applyRoleUI = () => {
    const adminControls = document.querySelectorAll(".admin-only");
    const loginLink = document.querySelector(".login-btn");

    if (!isAdmin()) {
        adminControls.forEach((btn) => btn.remove());
    }

    if (loginLink) {
        loginLink.textContent = isAdmin() ? "Dashboard" : "Login";
        loginLink.href = isAdmin() ? "./pages/dashboard.html" : "./login.html";
    }
};

if (window.location.href.includes("pages/dashboard.html")) {
    if (!isAdmin()) {
        clearRole();
        window.location.href = "../login.html";
    }
}

if (window.location.href.includes("login.html") && isAdmin()) {
    navigate("admin");
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        clearRole();
        window.location.href = "../login.html";
    });
}

const addProductBtn = document.getElementById("addProductBtn");
if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
        alert("Product management will be connected to Firestore in the next step.");
    });
}

applyRoleUI();

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const email = formData.get("email")?.toString().trim();
        const password = formData.get("password")?.toString();

        if (!email || !password) {
            loginStatus.textContent = "Please enter a valid email and password.";
            return;
        }

        if (email.toLowerCase() === adminEmail && password === adminPassword) {
            setRole("admin", email.toLowerCase());
            navigate("admin");
            return;
        }

        setRole("customer", email.toLowerCase());
        navigate("customer");
    });
}
