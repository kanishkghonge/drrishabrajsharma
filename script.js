// DOM Elements
const header = document.getElementById('header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const statNumbers = document.querySelectorAll('.stat-number');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// State
let currentTestimonial = 0;
let statsAnimated = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollEffects();
    initMobileMenu();
    initTestimonialSlider();
    initTransformationSlideshow();
    initSmoothScrolling();
    initAnimationObserver();
    initServiceCards();
});

// Header scroll effect
function initScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header background effect
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Animate stats counter when in view
        if (!statsAnimated && isElementInViewport(document.querySelector('.stats-counter'))) {
            animateStats();
            statsAnimated = true;
        }
    });
}

// Mobile menu functionality
function initMobileMenu() {
    mobileMenuToggle.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (mobileMenuToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            
            // Reset hamburger menu
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Stats counter animation
function animateStats() {
    // Only target stats in the hero section, not transformation stats
    const heroStatNumbers = document.querySelectorAll('.hero .stat-number');
    
    heroStatNumbers.forEach(stat => {
        const targetAttr = stat.getAttribute('data-target');
        
        // If no data-target attribute, generate random numbers
        if (!targetAttr) {
            const randomTarget = Math.floor(Math.random() * 500) + 100; // Random between 100-600
            stat.setAttribute('data-target', randomTarget);
        }
        
        const target = parseInt(stat.getAttribute('data-target')) || 0;
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                stat.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Transformation slideshow functionality
function initTransformationSlideshow() {
    const slides = document.querySelectorAll('.transformation-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    let slideInterval;
    
    if (slides.length === 0) return;
    
    // Show specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Update indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show current slide
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    // Auto-play slideshow
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }
    
    function stopSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopSlideshow();
            startSlideshow(); // Restart auto-play
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopSlideshow();
            startSlideshow(); // Restart auto-play
        });
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopSlideshow();
            startSlideshow(); // Restart auto-play
        });
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    const slideContainer = document.querySelector('.slideshow-container');
    if (slideContainer) {
        slideContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        slideContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    prevSlide();
                }
                stopSlideshow();
                startSlideshow(); // Restart auto-play
            }
        }
        
        // Pause auto-play on hover
        slideContainer.addEventListener('mouseenter', stopSlideshow);
        slideContainer.addEventListener('mouseleave', startSlideshow);
    }
    
    // Initialize
    showSlide(0);
    startSlideshow();
}

// Testimonial Slider functionality
function initTestimonialSlider() {
    if (testimonialCards.length === 0) return;
    
    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });
        currentTestimonial = index;
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTestimonial);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevTestimonial);
    }
    
    // Initialize first testimonial
    showTestimonial(0);
}

// Service Cards flip functionality
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });
}

// Intersection Observer for animations
function initAnimationObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .before-after-card, .contact-item, .testimonial-card');
    
    animatedElements.forEach(el => {
        el.classList.add('slide-up');
        observer.observe(el);
    });
}

// Utility function to check if element is in viewport
function isElementInViewport(el) {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Parallax effect for hero section
function initParallaxEffect() {
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const speed = 0.5;
            heroBackground.style.transform = `translateY(${scrollTop * speed}px)`;
        });
    }
}

// Add floating animation to service cards
function initFloatingAnimation() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'floatAnimation 2s ease-in-out infinite';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });
}

// Form validation (if contact form is added later)
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !phone || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (!isValidPhone(phone)) {
                showNotification('Please enter a valid phone number', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            this.reset();
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
}

// WhatsApp Chat Widget functionality
function initWhatsAppWidget() {
    const whatsappToggle = document.getElementById('whatsapp-toggle');
    const whatsappChat = document.getElementById('whatsapp-chat');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    let isOpen = false;
    
    if (whatsappToggle && whatsappChat) {
        // Toggle chat widget
        whatsappToggle.addEventListener('click', function(e) {
            e.preventDefault();
            isOpen = !isOpen;
            
            if (isOpen) {
                whatsappChat.classList.add('active');
                setTimeout(() => {
                    chatInput.focus();
                }, 400);
            } else {
                whatsappChat.classList.remove('active');
            }
        });
        
        // Send message functionality
        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                const encodedMessage = encodeURIComponent(message);
                const whatsappURL = `https://wa.me/919797387668?text=${encodedMessage}`;
                window.open(whatsappURL, '_blank');
                chatInput.value = '';
                whatsappChat.classList.remove('active');
                isOpen = false;
            }
        }
        
        // Send button click
        if (chatSend) {
            chatSend.addEventListener('click', sendMessage);
        }
        
        // Enter key to send
        if (chatInput) {
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
        
        // Close chat when clicking outside
        document.addEventListener('click', function(e) {
            if (isOpen && !whatsappToggle.contains(e.target) && !whatsappChat.contains(e.target)) {
                whatsappChat.classList.remove('active');
                isOpen = false;
            }
        });
        
        // Close chat with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                whatsappChat.classList.remove('active');
                isOpen = false;
            }
        });
    }
}

// Performance optimization
function optimizePerformance() {
    // Debounce scroll events
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header effect
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initParallaxEffect();
    initFloatingAnimation();
    initFormValidation();
    initLazyLoading();
    initWhatsAppWidget();
    optimizePerformance();
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        
        // Reset hamburger menu
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
    
    // Arrow keys for testimonial navigation
    if (e.key === 'ArrowLeft' && document.activeElement.closest('.testimonials')) {
        currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    if (e.key === 'ArrowRight' && document.activeElement.closest('.testimonials')) {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
});

// Touch/swipe support for testimonials
function initTouchSupport() {
    const slider = document.querySelector('.testimonials-slider');
    let startX = 0;
    let endX = 0;
    
    if (slider) {
        slider.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        slider.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe left - next testimonial
                    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
                } else {
                    // Swipe right - previous testimonial
                    currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
                }
                showTestimonial(currentTestimonial);
            }
        }
    }
}

// Initialize touch support
document.addEventListener('DOMContentLoaded', function() {
    initTouchSupport();
});

// Preloader (optional)
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        window.addEventListener('load', function() {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }
}

// Error handling for images
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn(`Failed to load image: ${this.src}`);
        });
    });
}

// Initialize error handling
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initImageErrorHandling();
});

// Accessibility improvements
function initAccessibility() {
    // Focus management for mobile menu
    const focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    
    // Trap focus in mobile menu when open
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab' && mobileNav.classList.contains('active')) {
            const focusableContent = mobileNav.querySelectorAll(focusableElements);
            const firstFocusableElement = focusableContent[0];
            const lastFocusableElement = focusableContent[focusableContent.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
    
    // Add aria-labels for screen readers
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.setAttribute('aria-label', 'Contact us via WhatsApp');
    }
    
    const socialLinks = document.querySelectorAll('.social-icons a');
    socialLinks.forEach(link => {
        const platform = link.href.includes('instagram') ? 'Instagram' : 'WhatsApp';
        link.setAttribute('aria-label', `Follow us on ${platform}`);
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
    initAccessibility();
});

// Console welcome message
console.log('%c🎉 Raj Aesthetics Website Loaded Successfully! 🎉', 'color: #d4a574; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with care for exceptional user experience', 'color: #8b6f47; font-size: 12px;');