// Slideshow Functionality
let slideIndex = 1;
let slideshowInterval;

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
    
    if (!slides.length) return;

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

// Make functions global for onclick handlers
window.plusSlides = plusSlides;
window.currentSlide = currentSlide;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    showSlides(slideIndex);
    startSlideshow();
    preloadImages();
});
