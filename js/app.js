const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = document.querySelectorAll(".nav-link");
const contactForm = document.querySelector(".contact-form");

const setHeaderState = () => {
    header?.classList.toggle("scrolled", window.scrollY > 16);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navMenu?.classList.remove("open");
        navToggle?.classList.remove("active");
        navToggle?.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
    });
});

const sections = [...document.querySelectorAll("[data-section]")];

const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, {
    rootMargin: "-42% 0px -52% 0px",
    threshold: 0
});

sections.forEach((section) => activeObserver.observe(section));

contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.reset();
});
