// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== SCROLL-AWAY NAVIGATION (HIDE ON SCROLL DOWN, SHOW ON SCROLL UP) ==========
    const nav = document.getElementById('main-nav');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    // Initial state: nav is visible
    if (nav) {
        nav.classList.add('nav-visible');
        
        function handleScroll() {
            const currentScrollY = window.scrollY;
            
            // Determine scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                // Scrolling DOWN - hide nav
                nav.classList.remove('nav-visible');
                nav.classList.add('nav-hidden');
            } else if (currentScrollY < lastScrollY) {
                // Scrolling UP - show nav
                nav.classList.remove('nav-hidden');
                nav.classList.add('nav-visible');
            }
            
            // If at the very top, ensure nav is visible
            if (currentScrollY <= 10) {
                nav.classList.remove('nav-hidden');
                nav.classList.add('nav-visible');
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        }
        
        // Use requestAnimationFrame for smooth performance
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });
    }
    
    // ========== ACTIVE NAVIGATION HIGHLIGHT ==========
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    function updateActiveNavLink() {
        let current = '';
        const scrollPosition = window.scrollY + 120; // Offset for better trigger
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1); // Remove #
            if (href === current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Call once on load
    
    // ========== SMOOTH SCROLLING FOR NAVIGATION ==========
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ========== VIDEO HANDLING ==========
    const videos = document.querySelectorAll('video');
    
    // Pause all videos when one starts playing
    videos.forEach(video => {
        video.addEventListener('play', function() {
            videos.forEach(otherVideo => {
                if (otherVideo !== this) {
                    otherVideo.pause();
                }
            });
        });
        
        // Add loading error handling
        video.addEventListener('error', function() {
            console.log('Video failed to load, showing fallback');
        });
    });
    
    // ========== IMAGE ERROR HANDLING ==========
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
        });
    });
    
    // ========== STATS COUNTER ANIMATION ==========
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function animateStats() {
        if (animated) return;
        
        const statsSection = document.querySelector('.about-stats');
        if (!statsSection) return;
        
        const sectionPosition = statsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (sectionPosition < screenPosition) {
            stats.forEach(stat => {
                const targetValue = stat.textContent;
                const numericValue = parseInt(targetValue.replace(/[^0-9]/g, ''));
                const suffix = targetValue.replace(/[0-9]/g, '');
                
                if (!isNaN(numericValue)) {
                    let currentValue = 0;
                    const increment = numericValue > 100 ? Math.ceil(numericValue / 50) : 1;
                    
                    const timer = setInterval(() => {
                        currentValue += increment;
                        
                        if (currentValue >= numericValue) {
                            stat.textContent = targetValue;
                            clearInterval(timer);
                        } else {
                            stat.textContent = currentValue + suffix;
                        }
                    }, 20);
                }
            });
            
            animated = true;
        }
    }
    
    window.addEventListener('scroll', animateStats);
    animateStats(); // Check on load
    
    // ========== MOBILE MENU TOGGLE ==========
    function createMobileMenu() {
        const navElement = document.querySelector('nav');
        const navMenu = document.querySelector('.nav-menu');
        
        if (window.innerWidth <= 768) {
            // Check if mobile menu button doesn't exist
            if (!document.querySelector('.mobile-menu-btn')) {
                const menuBtn = document.createElement('button');
                menuBtn.className = 'mobile-menu-btn';
                menuBtn.innerHTML = '<i class="fas fa-bars"></i> Menu';
                menuBtn.style.cssText = `
                    background: var(--royal-deep);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    font-size: 1.2rem;
                    cursor: pointer;
                    width: 100%;
                    display: block;
                    font-weight: 600;
                    text-align: center;
                `;
                
                // Insert before nav menu
                navElement.insertBefore(menuBtn, navMenu);
                navMenu.style.display = 'none';
                
                menuBtn.addEventListener('click', function() {
                    if (navMenu.style.display === 'none') {
                        navMenu.style.display = 'flex';
                        navMenu.style.flexDirection = 'column';
                        menuBtn.innerHTML = '<i class="fas fa-times"></i> Close';
                    } else {
                        navMenu.style.display = 'none';
                        menuBtn.innerHTML = '<i class="fas fa-bars"></i> Menu';
                    }
                });
                
                // Handle window resize
                window.addEventListener('resize', function() {
                    if (window.innerWidth > 768) {
                        navMenu.style.display = 'flex';
                        navMenu.style.flexDirection = 'row';
                        if (document.querySelector('.mobile-menu-btn')) {
                            document.querySelector('.mobile-menu-btn').remove();
                        }
                    }
                });
            }
        } else {
            // Remove mobile menu if it exists and screen is larger
            if (document.querySelector('.mobile-menu-btn')) {
                document.querySelector('.mobile-menu-btn').remove();
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu) {
                    navMenu.style.display = 'flex';
                    navMenu.style.flexDirection = 'row';
                }
            }
        }
    }
    
    // Check on load and resize
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);
    
    // ========== LOGO FALLBACK HANDLING ==========
    const logoFallback = document.querySelector('.logo-fallback');
    if (logoFallback && logoFallback.style.display === 'flex') {
        // Logo fallback is visible, all good
    }
    
    // ========== ADD TOUCH SUPPORT FOR MOBILE ==========
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // ========== HERO IMAGE PARALLAX EFFECT ==========
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrollPosition * 0.3}px)`;
            }
        });
    }
    
    // ========== FIX FOR NAVIGATION AFTER SCROLL-AWAY ==========
    // Ensure when clicking a nav link while nav is hidden, it doesn't cause issues
    const allNavLinks = document.querySelectorAll('.nav-menu a');
    allNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Small delay to ensure smooth scroll completes
            setTimeout(() => {
                if (nav && nav.classList.contains('nav-hidden')) {
                    // If nav was hidden, show it briefly after click
                    nav.classList.remove('nav-hidden');
                    nav.classList.add('nav-visible');
                    
                    // Auto-hide again after 2 seconds of no scroll
                    let timeout;
                    const resetTimer = () => {
                        clearTimeout(timeout);
                        timeout = setTimeout(() => {
                            if (window.scrollY > 80) {
                                nav.classList.remove('nav-visible');
                                nav.classList.add('nav-hidden');
                            }
                        }, 2000);
                    };
                    
                    window.addEventListener('scroll', resetTimer);
                    resetTimer();
                }
            }, 100);
        });
    });
    
    console.log('Candies Cleans website loaded successfully! Navigation scrolls away on scroll down!');
});
