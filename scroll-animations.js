document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el, index) => {
        // Optional: Add stagger delay automatically for grid items if they don't have it
        if (el.classList.contains('stagger-auto')) {
            el.style.transitionDelay = `${(index % 3) * 0.15}s`; // Stagger by column (approx)
        }
        observer.observe(el);
    });
});
