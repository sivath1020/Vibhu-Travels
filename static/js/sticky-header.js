document.addEventListener("DOMContentLoaded", function () {
    const header = document.getElementById("siteHeader");
    if (!header) return;

    let isScrolled = false;
    let ticking = false;

    window.addEventListener("scroll", function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                const currentScrollY = window.pageYOffset || window.scrollY;
                if (currentScrollY > 80 && !isScrolled) {
                    header.classList.add("scrolled");
                    isScrolled = true;
                } else if (currentScrollY <= 80 && isScrolled) {
                    header.classList.remove("scrolled");
                    isScrolled = false;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
});
