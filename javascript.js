// Mobile Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing navigation');
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Debug: Check if elements exist
    console.log('Nav Toggle:', navToggle);
    console.log('Nav Menu:', navMenu);
    console.log('Nav Links:', navLinks);

    // Toggle mobile menu when hamburger is clicked
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            console.log('Hamburger menu clicked!');
            
            // Toggle active class on menu and toggle
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Nav link clicked:', this.textContent);
            
            // Close mobile menu
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !navToggle.contains(event.target)) {
            console.log('Clicked outside - closing menu');
            
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu on escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            console.log('Escape key pressed - closing menu');
            
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu on window resize (if resized to larger screen)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active nav link
            updateActiveNavLink();
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Update active nav link on scroll
    updateActiveNavLink();
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Scroll animations for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .certificate-card, .project-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Initialize when page fully loads
window.addEventListener('load', function() {
    console.log('Page fully loaded');
    updateActiveNavLink();
    
    // Add loaded class for CSS animations
    document.body.classList.add('loaded');
});

// Skills animation
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((skill, index) => {
        setTimeout(() => {
            skill.style.opacity = '1';
            skill.style.transform = 'scale(1)';
        }, index * 100);
    });
}

// Trigger skills animation when about section is visible
const aboutSection = document.getElementById('about');
if (aboutSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    });
    
    skillsObserver.observe(aboutSection);
}

// // Simple mobile menu fix
// document.getElementById('nav-toggle').addEventListener('click', function() {
//     const navMenu = document.getElementById('nav-menu');
//     navMenu.classList.toggle('active');
// });

// // Close menu when clicking links
// document.querySelectorAll('.nav-link').forEach(link => {
//     link.addEventListener('click', function() {
//         document.getElementById('nav-menu').classList.remove('active');
//     });
// });