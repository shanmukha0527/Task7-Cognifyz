/**
 * Custom JavaScript for Bootstrap Component-Based Website
 * Handles animations, interactions, and enhanced functionality
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

/**
 * Initialize all website functionality
 */
function initializeWebsite() {
    initSmoothScrolling();
    initNavbarEffects();
    initScrollAnimations();
    initFormHandling();
    initProgressBars();
    initCounterAnimation();
    initButtonEffects();
    initTooltips();
    initParallaxEffects();
    initTypewriterEffect();
}

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`a[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

/**
 * Navbar effects on scroll
 */
function initNavbarEffects() {
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Change navbar background on scroll
        if (currentScrollY > 50) {
            navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
        }
        
        // Hide/show navbar on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        
        // Update active section in navigation
        updateActiveSection();
    });
}

/**
 * Update active section based on scroll position
 */
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation delay for child elements
                const children = entry.target.querySelectorAll('.card-custom, .testimonial-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe all animation elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
        animationObserver.observe(el);
    });
}

/**
 * Initialize form handling
 */
function initFormHandling() {
    const form = document.querySelector('#contact form');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmission);
    
    // Real-time form validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearValidationError);
    });
}

/**
 * Handle form submission
 */
function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateForm(form)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success state
        submitButton.innerHTML = '<i class="bi bi-check-circle me-2"></i>Sent!';
        submitButton.classList.remove('loading');
        submitButton.classList.add('btn-success');
        
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        form.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('btn-success');
        }, 3000);
    }, 2000);
}

/**
 * Validate individual input
 */
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    let isValid = true;
    
    // Remove existing validation classes
    input.classList.remove('is-valid', 'is-invalid');
    
    // Check if required field is empty
    if (input.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Email validation
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Add validation class
    input.classList.add(isValid ? 'is-valid' : 'is-invalid');
    
    return isValid;
}

/**
 * Clear validation error on input
 */
function clearValidationError(e) {
    const input = e.target;
    if (input.classList.contains('is-invalid') && input.value.trim()) {
        input.classList.remove('is-invalid');
    }
}

/**
 * Validate entire form
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateInput({ target: input })) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-radius: 8px;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Initialize progress bar animations
 */
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar-custom');
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.style.width;
                
                // Reset and animate
                progressBar.style.width = '0%';
                progressBar.style.transition = 'none';
                
                setTimeout(() => {
                    progressBar.style.transition = 'width 2s ease-in-out';
                    progressBar.style.width = targetWidth;
                }, 200);
                
                // Unobserve after animation
                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

/**
 * Initialize counter animations
 */
function initCounterAnimation() {
    const counterElements = document.querySelectorAll('.card-icon + h4');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                const number = parseInt(text);
                
                if (!isNaN(number)) {
                    animateCounter(element, 0, number, 2000);
                    counterObserver.unobserve(element);
                }
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(element => {
        const text = element.textContent;
        if (text.includes('+') || !isNaN(parseInt(text))) {
            counterObserver.observe(element);
        }
    });
}

/**
 * Animate counter from start to end value
 */
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue + '+';
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * Initialize button effects
 */
function initButtonEffects() {
    // Ripple effect for buttons
    document.querySelectorAll('.btn-custom').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.type !== 'submit') {
                createRippleEffect(this, e);
            }
        });
    });
    
    // Loading state for non-submit buttons
    document.querySelectorAll('.btn-custom:not([type="submit"])').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    });
}

/**
 * Create ripple effect on button click
 */
function createRippleEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Initialize Bootstrap tooltips
 */
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize parallax effects
 */
function initParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-section::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

/**
 * Initialize typewriter effect for hero text
 */
function initTypewriterEffect() {
    const heroTitle = document.querySelector('.hero-section h1');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid white';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 1000);
        }
    };
    
    // Start typewriter effect after a delay
    setTimeout(typeWriter, 1000);
}

/**
 * Initialize carousel auto-play with pause on hover
 */
function initCarouselEnhancements() {
    const carousel = document.querySelector('#portfolioCarousel');
    if (!carousel) return;
    
    const carouselInstance = new bootstrap.Carousel(carousel, {
        interval: 5000,
        ride: 'carousel'
    });
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        carouselInstance.pause();
    });
    
    carousel.addEventListener('mouseleave', () => {
        carouselInstance.cycle();
    });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Initialize search functionality (if needed)
 */
function initSearch() {
    const searchInput = document.querySelector('#searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const searchableElements = document.querySelectorAll('[data-searchable]');
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            const parent = element.closest('.card-custom, .testimonial-card');
            
            if (text.includes(query) || query === '') {
                parent.style.display = 'block';
                parent.style.opacity = '1';
            } else {
                parent.style.display = 'none';
                parent.style.opacity = '0';
            }
        });
    });
}

/**
 * Initialize theme switcher (dark/light mode)
 */
function initThemeSwitcher() {
    const themeToggle = document.querySelector('#themeToggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/**
 * Initialize scroll to top button
 */
function initScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollTopBtn.className = 'btn btn-custom scroll-to-top';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: none;
        z-index: 1000;
        padding: 0;
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top on click
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize performance optimizations
 */
function initPerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.onscroll = function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(function() {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 16); // ~60fps
    };
    
    // Preload critical resources
    const preloadLinks = [
        'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

/**
 * Initialize error handling
 */
function initErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        showNotification('An error occurred. Please refresh the page.', 'error');
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        showNotification('A network error occurred. Please try again.', 'error');
    });
}

// CSS for ripple animation
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .scroll-to-top {
        transition: all 0.3s ease;
        opacity: 0.8;
    }
    
    .scroll-to-top:hover {
        opacity: 1;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(rippleStyles);

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initCarouselEnhancements();
    initLazyLoading();
    initSearch();
    initThemeSwitcher();
    initScrollToTop();
    initPerformanceOptimizations();
    initErrorHandling();
});

// Export functions for external use (if needed)
window.WebsiteUtils = {
    showNotification,
    animateCounter,
    createRippleEffect,
    validateForm
};