document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.mobile-hamburger');
    const overlay = document.querySelector('.navbar-overlay');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const modeToggle = document.querySelector('.mode-toggle');

    function closeDrawer() {
        overlay.classList.remove('active');
        navbar.classList.remove('open');
    }

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        overlay.classList.toggle('active');
        navbar.classList.toggle('open');
    });

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeDrawer();
    });

    // Optional: close on ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeDrawer();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeDrawer();
        });
    });

    if (modeToggle) {
        modeToggle.addEventListener('click', function() {
            closeDrawer();
        });
    }
});