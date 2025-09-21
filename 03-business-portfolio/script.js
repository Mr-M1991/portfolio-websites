// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initSkillBars();
    initCounterAnimations();
    initContactForm();
    initNavbarScrollEffect();
    initAccessibilityFeatures();
    initPerformanceOptimizations();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', function() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            navToggle.focus();
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === targetId) {
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.text-block, .experience-card, .skill-category, .project-card, .testimonial-card, .contact-item');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                skillBar.style.width = width + '%';
                skillObserver.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target') || counter.textContent.replace(/[^\d]/g, ''));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Handle different counter formats
        if (element.textContent.includes('+')) {
            element.textContent = Math.floor(current) + '+';
        } else if (element.textContent.includes('%')) {
            element.textContent = Math.floor(current) + '%';
        } else if (element.textContent.includes('K')) {
            element.textContent = (current / 1000).toFixed(1) + 'K+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    // Form validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Open email client with pre-filled content
            const emailSubject = encodeURIComponent(subject);
            const emailBody = encodeURIComponent(`Hej Mike,\n\n${message}\n\nMed venlig hilsen,\n${name}\n${email}`);
            const mailtoLink = `mailto:Andersenmike91@gmail.com?subject=${emailSubject}&body=${emailBody}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showNotification('Email client åbnet! Udfyld din besked og send.', 'success');
            contactForm.reset();
        } else {
            showNotification('Venligst ret fejlene i formularen.', 'error');
        }
    });
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Dette felt er påkrævet.';
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Indtast en gyldig email adresse.';
        }
    }
    
    // Name validation
    if (fieldName === 'name' && value && value.length < 2) {
        isValid = false;
        errorMessage = 'Navn skal være mindst 2 tegn.';
    }
    
    // Message validation
    if (fieldName === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Besked skal være mindst 10 tegn.';
    }
    
    // Show/hide error
    const errorElement = document.getElementById(fieldName + '-error');
    if (errorElement) {
        if (isValid) {
            errorElement.textContent = '';
            field.style.borderColor = '';
        } else {
            errorElement.textContent = errorMessage;
            field.style.borderColor = 'var(--error-color)';
        }
    }
    
    return isValid;
}

// Clear field error
function clearFieldError(field) {
    const errorElement = document.getElementById(field.name + '-error');
    if (errorElement) {
        errorElement.textContent = '';
        field.style.borderColor = '';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Luk notifikation">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

// Close notification
function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Navbar scroll effect
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Accessibility Features
function initAccessibilityFeatures() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }
    
    // Keyboard navigation for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('.project-link');
                if (link) {
                    link.click();
                }
            }
        });
    });
    
    // Focus management for mobile menu
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                // Focus first menu item when opening
                const firstLink = navMenu.querySelector('.nav-link');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        });
    }
    
    // Announce page changes to screen readers
    const main = document.querySelector('main');
    if (main) {
        main.setAttribute('role', 'main');
        main.setAttribute('aria-label', 'Hovedindhold');
    }
}

// Performance Optimizations
function initPerformanceOptimizations() {
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Scroll-based functionality here
        }, 10);
    });
    
    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add fade-in effect to all sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You could send this to an error tracking service
});

// Console welcome message
console.log(`
💼 Velkommen til min professionelle portfolio!
🚀 Bygget med fokus på performance, accessibility og SEO
📱 Fuldt responsivt design med moderne best practices
♿ Accessibility compliant (WCAG 2.1)
⚡ Optimized for performance og brugeroplevelse

Kontakt mig gerne hvis du vil diskutere muligheder!
`);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = Math.round(perfData.loadEventEnd - perfData.loadEventStart);
            console.log(`⚡ Side indlæst på ${loadTime}ms`);
            
            // Log Core Web Vitals if available
            if ('web-vitals' in window) {
                // This would require the web-vitals library
                console.log('📊 Core Web Vitals tracking enabled');
            }
        }, 0);
    });
}

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    // Replace with your analytics implementation
    console.log(`Analytics: ${category} - ${action} - ${label}`);
}

// Track form submissions
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('contact-form')) {
        trackEvent('Form', 'Submit', 'Contact Form');
    }
});

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        const buttonText = e.target.textContent.trim();
        trackEvent('Button', 'Click', buttonText);
    }
});

// Track external links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.hostname !== window.location.hostname) {
        trackEvent('Link', 'Click', e.target.href);
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        animateCounter,
        showNotification
    };
}

