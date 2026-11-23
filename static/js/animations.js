document.addEventListener("DOMContentLoaded", () => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth <= 768;

    requestAnimationFrame(() => {
        document.body.classList.add("page-loaded");
    });

    document.querySelectorAll(".stagger-grid, [data-stagger-container]").forEach(container => {
        container.querySelectorAll(".reveal, .reveal-up, .reveal-scale, .stagger-item, .vth-fleet-card, .service-card-item, .destination-card, .place-card-ref, .col-lg-4, .col-md-6, .col-lg-3, .col-lg-2").forEach((el, idx) => {
            if (!el.classList.contains("stagger-item") && !el.classList.contains("reveal")) {
                el.classList.add("stagger-item");
            }
            el.style.transitionDelay = (idx % 6 * 100) + "ms";
        });
    });

    const selector = ".reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade, .stagger-item, .dest-card-ref, .place-card-ref, [data-reveal]";
    const revealEls = document.querySelectorAll(selector);

    if (!isReducedMotion && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    target.classList.add("active", "is-visible");
                    target.querySelectorAll(selector).forEach((child, i) => {
                        setTimeout(() => {
                            child.classList.add("active", "is-visible");
                        }, 50 * i);
                    });
                    obs.unobserve(target);
                }
            });
        }, {
            root: null,
            rootMargin: "50px 0px 50px 0px",
            threshold: 0.05
        });

        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add("active", "is-visible"));
    }

    if (!isReducedMotion && !isMobile) {
        const heroBg = document.querySelector(".vth-hero-bg-img");
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.pageYOffset || window.scrollY;
            if (heroBg && scrollY < 800) {
                const yPos = (scrollY * 0.12).toFixed(1);
                heroBg.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
            ticking = false;
        };

        window.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });

        const tiltCards = document.querySelectorAll(".vth-fleet-card, .hero-mini-card, .package-card, .blog-card");
        tiltCards.forEach(card => {
            let rAF = null;
            let bounds = null;

            card.addEventListener("mouseenter", () => {
                bounds = card.getBoundingClientRect();
            });

            card.addEventListener("mousemove", e => {
                if (!bounds) bounds = card.getBoundingClientRect();
                if (rAF) cancelAnimationFrame(rAF);
                rAF = requestAnimationFrame(() => {
                    const x = e.clientX - bounds.left;
                    const y = e.clientY - bounds.top;
                    const cx = bounds.width / 2;
                    const cy = bounds.height / 2;
                    const rx = ((y - cy) / cy * -2.5).toFixed(2);
                    const ry = ((x - cx) / cx * 2.5).toFixed(2);
                    card.style.transform = `perspective(1000px) translateY(-6px) scale(1.01) rotateX(${rx}deg) rotateY(${ry}deg)`;
                });
            });

            card.addEventListener("mouseleave", () => {
                if (rAF) cancelAnimationFrame(rAF);
                card.style.transform = "";
                bounds = null;
            });
        });
    }

    const counterEls = document.querySelectorAll(".stat-number, .counter-value, .counter-number");
    if (counterEls.length > 0 && "IntersectionObserver" in window && !isReducedMotion) {
        const counterObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    let target = el.getAttribute("data-target");
                    let currentText = el.innerText.trim();
                    if (!target && currentText) {
                        const m = currentText.replace(/,/g, "").match(/(\d+)/);
                        if (m) target = m[1];
                    }
                    if (target) {
                        const targetNum = parseInt(target, 10);
                        const hasPlus = currentText.includes("+") || el.innerText.includes("+") ? "+" : "";
                        const duration = 1200;
                        const startTime = performance.now();
                        const animateCount = now => {
                            const progress = Math.min((now - startTime) / duration, 1);
                            const ease = 1 - Math.pow(1 - progress, 2);
                            const currentVal = Math.floor(ease * targetNum);
                            el.innerText = currentVal.toLocaleString() + hasPlus;
                            if (progress < 1) {
                                requestAnimationFrame(animateCount);
                            } else {
                                el.innerText = targetNum.toLocaleString() + hasPlus;
                            }
                        };
                        requestAnimationFrame(animateCount);
                    }
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        counterEls.forEach(el => counterObs.observe(el));
    }
});
