// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuBtn.innerHTML = mainNav.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Slideshow functionality
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slideshow-dot');
let currentSlide = 0;
const slideInterval = 5000; // 5 seconds

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

// Initialize first slide
showSlide(0);

// Auto-advance slides
let slideTimer = setInterval(() => {
    let nextSlide = (currentSlide + 1) % slides.length;
    showSlide(nextSlide);
}, slideInterval);

// Dot click event
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(slideTimer);
        showSlide(index);
        // Restart timer
        slideTimer = setInterval(() => {
            let nextSlide = (currentSlide + 1) % slides.length;
            showSlide(nextSlide);
        }, slideInterval);
    });
});

// Booking form submission
const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData);
    
    // Form validation
    if (!formObject.fullName || !formObject.email || !formObject.phone || !formObject.checkIn || !formObject.checkOut) {
        alert('Please fill in all required fields marked with *');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject.email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Phone validation (basic)
    if (formObject.phone.length < 8) {
        alert('Please enter a valid phone number');
        return;
    }
    
    // Date validation
    const checkInDate = new Date(formObject.checkIn);
    const checkOutDate = new Date(formObject.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
        alert('Check-in date cannot be in the past');
        return;
    }
    
    if (checkOutDate <= checkInDate) {
        alert('Check-out date must be after check-in date');
        return;
    }
    
    // In a real application, you would send this data to a server
    // For this demo, we'll just show an alert
    alert(`Thank you ${formObject.fullName}! Your booking request has been submitted. We will contact you at ${formObject.email} or ${formObject.phone} within 24 hours.`);
    
    // Reset form
    this.reset();
    
    // Set minimum date for check-in to today
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').min = todayStr;
    
    // Scroll to top of form
    document.querySelector('#booking').scrollIntoView({ behavior: 'smooth' });
});

// Set minimum date for check-in to today
const today = new Date().toISOString().split('T')[0];
document.getElementById('checkIn').min = today;

// Update check-out min date when check-in changes
document.getElementById('checkIn').addEventListener('change', function() {
    document.getElementById('checkOut').min = this.value;
    
    // If check-out is before new check-in, update it
    if (document.getElementById('checkOut').value < this.value) {
        const nextDay = new Date(this.value);
        nextDay.setDate(nextDay.getDate() + 1);
        document.getElementById('checkOut').value = nextDay.toISOString().split('T')[0];
    }
});

// Add loading animation to submit button
bookingForm.addEventListener('submit', function() {
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Reset button after 3 seconds (simulating server processing)
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 3000);
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .promotion-card, .gallery-item').forEach(el => {
    observer.observe(el);
});

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
    .service-card, .promotion-card, .gallery-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .service-card.animate-in, 
    .promotion-card.animate-in, 
    .gallery-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Current year in footer
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.querySelector('.copyright p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
});