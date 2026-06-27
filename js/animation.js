const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loader = document.querySelector("[data-loader]");

window.addEventListener("load", () => {
    window.setTimeout(() => {
        loader?.classList.add("hidden");
    }, 450);
});

if (window.Lenis && !prefersReducedMotion) {
    const lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        lerp: 0.08
    });

    const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
}

if (window.gsap && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(".hero-content > *, .hero-visual > *", {
        opacity: 0,
        y: 30
    });

    gsap.timeline({ defaults: { ease: "power3.out" } })
        .to(".hero-content > *", {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.09,
            delay: 0.45
        })
        .to(".hero-visual > *", {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08
        }, "-=0.55");

    gsap.utils.toArray(".story-card, .product-card, .gallery-grid img, .quote-card, .contact-grid > *").forEach((element) => {
        gsap.from(element, {
            opacity: 0,
            y: 42,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 86%"
            }
        });
    });

    gsap.to(".main-cake", {
        yPercent: -9,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".story-card", {
        y: (index) => index % 2 === 0 ? -24 : 24,
        ease: "none",
        scrollTrigger: {
            trigger: ".story",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    const parallaxWrap = document.querySelector("[data-parallax-wrap]");

    parallaxWrap?.addEventListener("mousemove", (event) => {
        const bounds = parallaxWrap.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        gsap.utils.toArray("[data-parallax]").forEach((element) => {
            const speed = Number(element.dataset.parallax || 12);

            gsap.to(element, {
                x: x * speed,
                y: y * speed,
                duration: 0.65,
                ease: "power3.out"
            });
        });
    });

    parallaxWrap?.addEventListener("mouseleave", () => {
        gsap.to("[data-parallax]", {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });
}
