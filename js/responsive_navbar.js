// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const modeToggle = document.querySelector('.mode-toggle');
    const modeIcon = modeToggle.querySelector('i');
    const hamburger = document.querySelector('.mobile-hamburger');
    const overlay = document.querySelector('.navbar-overlay');
    const navbar = document.querySelector('.navbar');

    // Toggle mobile menu
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle menu icon animation
        menuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // Close mobile menu when clicking on a link
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Get the navbar dimensions
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar.offsetHeight;
                const navbarWidth = navbar.offsetWidth;
                
                // Calculate the target position
                const targetRect = targetElement.getBoundingClientRect();
                const targetPosition = targetRect.top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1500;
                let start = null;

                // Easing function for smooth acceleration and deceleration
                function easeInOutQuad(t) {
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                }

                function animateScroll(timestamp) {
                    if (!start) start = timestamp;
                    const elapsed = timestamp - start;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Apply easing function
                    const easeProgress = easeInOutQuad(progress);
                    
                    // Calculate new position
                    const newPosition = startPosition + (distance * easeProgress);
                    
                    // Use scrollTo with behavior: 'auto' to prevent conflicts
                    window.scrollTo({
                        top: newPosition,
                        behavior: 'auto'
                    });

                    // Continue animation if not complete
                    if (progress < 1) {
                        requestAnimationFrame(animateScroll);
                    }
                }

                // Start the animation
                requestAnimationFrame(animateScroll);
            }
        });
    });

    // Add active class to nav links based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    // Initial call to set active link
    updateActiveNavLink();

    // Theme toggle functionality
    modeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add transition class to body
        document.body.classList.add('theme-transitioning');
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update icon with fade effect
        modeIcon.style.opacity = '0';
        setTimeout(() => {
            modeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            modeIcon.style.opacity = '1';
        }, 250);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 500);
        
        // Save theme preference
        localStorage.setItem('theme', newTheme);
    });

    function isMobile() {
        return window.innerWidth <= 600;
    }

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

    // Close drawer when a nav link is clicked (on mobile)
    navItems.forEach(link => {
        link.addEventListener('click', function() {
            if (isMobile()) {
                closeDrawer();
            }
        });
    });

    // Disable hover extension on mobile
    function updateNavbarHover() {
        if (isMobile()) {
            navbar.classList.remove('hover-enabled');
        } else {
            navbar.classList.add('hover-enabled');
        }
    }
    updateNavbarHover();
    window.addEventListener('resize', updateNavbarHover);

    // Optionally, you can use .hover-enabled in your CSS to only allow hover on desktop:
    // .hover-enabled:hover { ... }
});
