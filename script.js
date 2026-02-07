// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    menuToggle.innerHTML = mainNav.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Active Nav Link on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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

// Slideshow Functionality
let slideIndex = 1;
let slideshowInterval;
showSlides(slideIndex);
startSlideshow();

function preloadImages() {
    const slides = document.querySelectorAll('.mySlides img');
    slides.forEach(img => {
        const prelink = document.createElement('link');
        prelink.rel = 'preload';
        prelink.as = 'image';
        prelink.href = img.src;
        document.head.appendChild(prelink);
    });
}

function startSlideshow() {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
        plusSlides(1, true);
    }, 5000);
}

function plusSlides(n, auto = false) {
    showSlides(slideIndex += n);
    if (!auto) startSlideshow();
}

function currentSlide(n) {
    showSlides(slideIndex = n);
    startSlideshow();
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    // Remove active class from all slides and dots
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active-slide");
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Show current slide with transition
    if (slides[slideIndex-1]) {
        slides[slideIndex-1].classList.add("active-slide");
    }
    if (dots[slideIndex-1]) {
        dots[slideIndex-1].className += " active";
    }
}

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

// Custom Visitor Counter
function updateVisitorCount() {
    // We'll use a base number + persistent increment in localStorage
    const BASE_COUNT = 1542;
    let visits = localStorage.getItem('alpine_ascents_visits');
    
    if (!visits) {
        visits = 1;
    } else {
        // Increment only once per session
        if (!sessionStorage.getItem('alpine_ascents_session_active')) {
            visits = parseInt(visits) + 1;
            sessionStorage.setItem('alpine_ascents_session_active', 'true');
        }
    }
    
    localStorage.setItem('alpine_ascents_visits', visits);
    
    const totalVisits = BASE_COUNT + parseInt(visits);
    const element = document.getElementById('totalVisits');
    if (element) {
        element.textContent = totalVisits.toLocaleString();
    }
}

// Update Location Display in Status Box
function updateStatusLocation(city, country) {
    const element = document.getElementById('userLocationDisplay');
    if (element && city) {
        element.textContent = country ? `${city}, ${country}` : city;
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize AOS animations
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    updateVisitorCount();
    preloadImages();
    
    // Status Box Toggle
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
    
    // Update time every second
    setInterval(updateDateTime, 1000);
    
    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        }
    });
});