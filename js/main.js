/* ============================================
   NAKAYAMA LABORATORY - JavaScript
   Swiss Minimal Design
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initTypingEffect();
    initCounterAnimation();
    initPublicationFilter();
    initSmoothScroll();
    initTextShuffleEffect();
});

/* === Text Shuffle Effect === */
function initTextShuffleEffect() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    
    // Apply only to "続きを読む" (news-link) and "詳細を見る" (card-link)
    const shuffleTargets = document.querySelectorAll('.news-link, .card-link');
    
    shuffleTargets.forEach(element => {
        // Find the span inside, or use the element itself
        const textElement = element.querySelector('span') || element;
        const originalText = textElement.textContent;
        let isAnimating = false;
        
        element.addEventListener('mouseenter', () => {
            if (isAnimating) return;
            isAnimating = true;
            
            let iterations = 0;
            const maxIterations = originalText.length;
            
            const interval = setInterval(() => {
                textElement.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        // Keep spaces and already revealed characters
                        if (char === ' ') return ' ';
                        if (index < iterations) return originalText[index];
                        // Random character
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                iterations += 1/3;
                
                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    textElement.textContent = originalText;
                    isAnimating = false;
                }
            }, 30);
        });
        
        // Ensure original text is restored on mouse leave
        element.addEventListener('mouseleave', () => {
            textElement.textContent = originalText;
        });
    });
}

/* === Navigation === */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect for navbar
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
}

/* === Scroll Effects === */
function initScrollEffects() {
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.section-header, .about-content, .about-image, .research-card, .member-card, .news-card, .publication-item, .professor-card, .award-item');
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => observer.observe(el));
}

/* === Typing Effect === */
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const phrases = [
        'Urban Analytics',
        'Human Flow',
        'AI & Machine Learning',
        'Data Science',
        'Smart Cities'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            currentText = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        typingText.textContent = currentText;
        
        let typeSpeed = isDeleting ? 30 : 80;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before next phrase
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start typing after a delay
    setTimeout(type, 1500);
}

/* === Counter Animation === */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    function update() {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target + '+';
        }
    }
    
    update();
}

/* === Publication Filter === */
function initPublicationFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const publications = document.querySelectorAll('.publication-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter publications
            publications.forEach(pub => {
                const type = pub.getAttribute('data-type');
                
                if (filter === 'all' || type === filter) {
                    pub.style.display = 'grid';
                    pub.style.opacity = '1';
                } else {
                    pub.style.opacity = '0';
                    setTimeout(() => {
                        pub.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* === Smooth Scroll === */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* === Console Easter Egg === */
console.log(`
%c┌─────────────────────────────────────┐
%c│                                     │
%c│   NAKAYAMA LABORATORY              │
%c│   Urban Analytics × Human Flow × AI │
%c│                                     │
%c└─────────────────────────────────────┘
`, 
'color: #bc002d; font-weight: bold;',
'color: #bc002d;',
'color: #000; font-weight: bold;',
'color: #bc002d;',
'color: #bc002d;',
'color: #bc002d; font-weight: bold;'
);
