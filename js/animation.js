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

    gsap.utils.toArray(".product-card, .gallery-grid img, .quote-card, .contact-grid > *").forEach((element) => {
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

    const bakeStory = document.querySelector("[data-bake-story]");

    if (bakeStory) {
        const steps = [
            {
                step: "01 / 07",
                title: "Ingredients arrive",
                text: "Eggs, flour, butter, milk, and chocolate drift into place before the first mix begins."
            },
            {
                step: "02 / 07",
                title: "Into the bowl",
                text: "The ingredients fall together, landing softly in the mixing bowl."
            },
            {
                step: "03 / 07",
                title: "Batter in motion",
                text: "Cream, chocolate, and butter fold into a glossy batter with a slow spiral."
            },
            {
                step: "04 / 07",
                title: "Tray and oven",
                text: "The batter pours into a tray and slides into the warm oven glow."
            },
            {
                step: "05 / 07",
                title: "Cake rises",
                text: "Heat lifts the sponge into soft layers with a rich chocolate crumb."
            },
            {
                step: "06 / 07",
                title: "Decoration",
                text: "Cream, berries, chocolate drizzle, and gold details finish the surface."
            },
            {
                step: "07 / 07",
                title: "Ready to serve",
                text: "The finished cake opens into the bakery's featured products."
            }
        ];

        const stepNode = document.querySelector("[data-bake-step]");
        const titleNode = document.querySelector("[data-bake-title]");
        const textNode = document.querySelector("[data-bake-text]");
        let activeStep = -1;

        const updateBakeCopy = (progress) => {
            const nextStep = Math.min(steps.length - 1, Math.floor(progress * steps.length));

            if (nextStep === activeStep) return;

            activeStep = nextStep;
            const current = steps[nextStep];

            gsap.to([titleNode, textNode, stepNode], {
                opacity: 0,
                y: 10,
                duration: 0.16,
                overwrite: true,
                onComplete: () => {
                    stepNode.textContent = current.step;
                    titleNode.textContent = current.title;
                    textNode.textContent = current.text;

                    gsap.to([stepNode, titleNode, textNode], {
                        opacity: 1,
                        y: 0,
                        duration: 0.28,
                        stagger: 0.03,
                        overwrite: true
                    });
                }
            });
        };

        gsap.set("[data-batter], [data-swirl], [data-pour], [data-tray], [data-oven], [data-rising-cake], [data-decorations] > *, [data-final-cake], [data-bake-products], [data-oven-glow]", {
            opacity: 0
        });

        const bakeTimeline = gsap.timeline({
            defaults: {
                ease: "power2.inOut"
            },
            scrollTrigger: {
                trigger: bakeStory,
                start: "top top+=88",
                end: "+=4200",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                onUpdate: (self) => {
                    updateBakeCopy(self.progress);
                    gsap.set("[data-bake-progress]", {
                        width: `${self.progress * 100}%`
                    });
                }
            }
        });

        bakeTimeline
            .from("[data-ingredient]", {
                y: -90,
                opacity: 0.42,
                scale: 0.72,
                stagger: 0.08,
                duration: 0.8
            })
            .to("[data-ingredient]", {
                y: (index) => [190, 178, 112, 72, 166][index],
                x: (index) => [190, -190, 230, -190, -18][index],
                scale: 0.58,
                stagger: 0.05,
                duration: 1
            })
            .to("[data-batter]", {
                opacity: 1,
                scaleX: 1,
                duration: 0.8
            }, "<0.35")
            .to("[data-ingredient]", {
                opacity: 0,
                scale: 0.18,
                duration: 0.45
            }, "<0.25")
            .to("[data-swirl]", {
                opacity: 1,
                scale: 1,
                rotate: 360,
                duration: 1.4,
                stagger: 0.08
            })
            .to("[data-bowl]", {
                rotate: -8,
                x: -28,
                duration: 0.55
            })
            .to("[data-pour]", {
                opacity: 1,
                height: 220,
                duration: 0.65
            }, "<0.15")
            .to("[data-tray]", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7
            }, "<0.05")
            .to("[data-tray-batter]", {
                scaleX: 1,
                duration: 0.8
            }, "<0.12")
            .to("[data-bowl], [data-swirl], [data-batter], [data-pour]", {
                opacity: 0,
                y: -80,
                duration: 0.65
            })
            .to("[data-oven], [data-oven-glow]", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8
            }, "<0.2")
            .to("[data-tray]", {
                y: -74,
                scale: 0.74,
                duration: 0.8
            }, "<0.15")
            .to("[data-tray]", {
                opacity: 0,
                duration: 0.45
            })
            .to("[data-rising-cake]", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1
            }, "<0.1")
            .to(".layer-top", {
                y: -18,
                duration: 0.7
            }, "<0.2")
            .to("[data-oven]", {
                opacity: 0,
                y: 80,
                scale: 0.9,
                duration: 0.75
            })
            .to("[data-decorations] > *", {
                opacity: 1,
                y: -18,
                scale: 1,
                stagger: 0.08,
                duration: 0.8
            }, "<0.15")
            .to("[data-rising-cake], [data-decorations] > *", {
                opacity: 0,
                scale: 0.8,
                duration: 0.65
            })
            .to("[data-final-cake]", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.85
            }, "<0.12")
            .to("[data-bake-products]", {
                opacity: 1,
                y: -18,
                duration: 0.7
            }, "<0.35");
    }

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
