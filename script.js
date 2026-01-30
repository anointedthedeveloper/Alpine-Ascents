// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
    });
});

// Active Nav Link on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Initialize Map
function initMap() {
    const map = L.map('map').setView([28.3949, 84.1240], 3); // Centered on Nepal
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Sample club locations
    const clubs = [
        { name: "Alpine Club - Nepal", lat: 27.7172, lon: 85.3240 },
        { name: "American Alpine Club", lat: 39.7392, lon: -104.9903 },
        { name: "Alpine Club - Switzerland", lat: 46.8182, lon: 8.2275 },
        { name: "Japanese Alpine Club", lat: 35.6762, lon: 139.6503 },
        { name: "British Mountaineering Council", lat: 53.4808, lon: -2.2426 }
    ];
    
    clubs.forEach(club => {
        L.marker([club.lat, club.lon])
            .addTo(map)
            .bindPopup(`<b>${club.name}</b>`);
    });
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', initMap);