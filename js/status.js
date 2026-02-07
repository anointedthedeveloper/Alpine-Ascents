// Date and Time Ticker
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const dateTimeString = now.toLocaleDateString('en-US', options);
    const dateTimeElement = document.getElementById('currentDateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = dateTimeString;
    }

    // Update footer year automatically
    const yearElement = document.getElementById('footerYear');
    if (yearElement) {
        yearElement.textContent = now.getFullYear();
    }
}

// Status Box Toggle logic
function initStatusBox() {
    const statusBoxContainer = document.getElementById('statusBoxContainer');
    const statusToggle = document.getElementById('statusToggle');
    
    if (statusToggle && statusBoxContainer) {
        statusToggle.addEventListener('click', () => {
            statusBoxContainer.classList.toggle('minimized');
            const icon = statusToggle.querySelector('i');
            if (statusBoxContainer.classList.contains('minimized')) {
                icon.className = 'fas fa-chevron-up';
            } else {
                icon.className = 'fas fa-info-circle';
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    initStatusBox();
    
    // Update time every second
    setInterval(updateDateTime, 1000);
});
