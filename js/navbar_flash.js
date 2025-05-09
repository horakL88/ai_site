document.addEventListener('DOMContentLoaded', function() {
    const logoText = document.querySelector('.logo-text');
    const logoLink = document.querySelector('.logo a');
    logoLink.addEventListener('click', function(e) {
        e.preventDefault();
        // Only animate if text is visible (navbar hovered)
        if (window.getComputedStyle(logoText).display !== 'none') {
            logoText.classList.remove('logo-animate'); // reset if needed
            void logoText.offsetWidth; // force reflow for retrigger
            logoText.classList.add('logo-animate');
        }
    });
    logoText.addEventListener('animationend', function() {
        logoText.classList.remove('logo-animate');
        // Reset color to original
        logoText.style.background = '';
        logoText.style.webkitBackgroundClip = '';
        logoText.style.webkitTextFillColor = '';
    });
});