// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.querySelector('.mode-toggle');
    const icon = modeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
    
    // Remove loading state
    document.body.classList.remove('loading');
    
    modeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });
    
    function updateIcon(theme) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
});

// Update mode icon based on current theme
function updateModeIcon(theme) {
    const modeToggle = document.querySelector('.mode-toggle i');
    if (theme === 'dark') {
        modeToggle.className = 'fas fa-sun';
    } else {
        modeToggle.className = 'fas fa-moon';
    }
}