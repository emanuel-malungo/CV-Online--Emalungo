// ========================================
// THEME MANAGEMENT
// ========================================

class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Carrega o tema salvo no localStorage ou usa 'light' como padrão
        const savedTheme = localStorage.getItem('data-theme') || 'light';
        this.setTheme(savedTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        const html = document.documentElement;
        const mobileIcon = document.getElementById('theme-icon-mobile');
        const desktopIcon = document.querySelector('#toggle-theme-desktop i');
        
        // Atualiza o atributo data-theme
        html.setAttribute('data-theme', theme);
        
        // Salva no localStorage
        localStorage.setItem('data-theme', theme);
        
        // Atualiza os ícones
        if (mobileIcon && desktopIcon) {
            if (theme === 'dark') {
                mobileIcon.className = 'ri-sun-line text-xl text-gray-600 dark:text-gray-400 group-hover:text-[#6f5cae] transition-colors';
                desktopIcon.className = 'ri-sun-line text-lg';
            } else {
                mobileIcon.className = 'ri-moon-line text-xl text-gray-600 dark:text-gray-400 group-hover:text-[#6f5cae] transition-colors';
                desktopIcon.className = 'ri-moon-line text-lg';
            }
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    bindEvents() {
        // Desktop theme toggle
        const desktopToggle = document.getElementById('toggle-theme-desktop');
        if (desktopToggle) {
            desktopToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile theme toggle
        const mobileToggle = document.getElementById('toggle-theme-mobile');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// ========================================
// NAVIGATION MANAGEMENT
// ========================================

class NavigationManager {
    constructor() {
        this.mobileMenu = document.getElementById('mobile-menu');
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link, .nav-item');
        this.lastScrollY = window.scrollY;
        this.isVisible = true;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateActiveLink();
    }

    bindEvents() {
        // Smooth scroll para links de navegação
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 100; // Offset para header fixo
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Atualiza link ativo durante scroll
        window.addEventListener('scroll', () => {
            this.updateActiveLink();
            this.handleMenuVisibility();
        });

        // Hide menu on scroll (mobile)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            this.hideMobileMenu();
            
            scrollTimeout = setTimeout(() => {
                this.showMobileMenu();
            }, 1000);
        });
    }

    updateActiveLink() {
        const scrollY = window.scrollY + 150;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Remove active class de todos os links
                this.navLinks.forEach(link => {
                    link.classList.remove('text-[#6f5cae]', 'active');
                });

                // Adiciona active class ao link correspondente
                const activeLinks = document.querySelectorAll(`[href="#${sectionId}"]`);
                activeLinks.forEach(link => {
                    link.classList.add('text-[#6f5cae]', 'active');
                });
            }
        });
    }

    handleMenuVisibility() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
            // Scrolling down & past header
            this.hideMobileMenu();
        } else {
            // Scrolling up
            this.showMobileMenu();
        }
        
        this.lastScrollY = currentScrollY;
    }

    hideMobileMenu() {
        if (this.mobileMenu && this.isVisible) {
            this.mobileMenu.style.transform = 'translateX(-50%) translateY(100px)';
            this.mobileMenu.style.opacity = '0';
            this.isVisible = false;
        }
    }

    showMobileMenu() {
        if (this.mobileMenu && !this.isVisible) {
            this.mobileMenu.style.transform = 'translateX(-50%) translateY(0)';
            this.mobileMenu.style.opacity = '1';
            this.isVisible = true;
        }
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Configura ScrollReveal se estiver disponível
        if (typeof ScrollReveal !== 'undefined') {
            const sr = ScrollReveal({
                distance: '60px',
                duration: 2500,
                delay: 400,
                reset: false
            });

            // Hero section animations
            sr.reveal('.animate-fade-in', { delay: 200, origin: 'top' });
            sr.reveal('h1', { delay: 400, origin: 'left' });
            sr.reveal('.bg-gradient-to-br', { delay: 600, origin: 'right' });

            // Cards and sections
            sr.reveal('.bg-white, .bg-gray-50, .bg-gray-100', { 
                delay: 300, 
                origin: 'bottom',
                interval: 200 
            });

            // Skills bars
            sr.reveal('.bg-gradient-to-r', { 
                delay: 600, 
                origin: 'left',
                interval: 100 
            });
        }

        // Animação personalizada para barras de progresso
        this.animateSkillBars();
    }

    animateSkillBars() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.bg-gradient-to-r');
                    if (progressBar) {
                        progressBar.style.transform = 'scaleX(1)';
                        progressBar.style.transformOrigin = 'left';
                    }
                }
            });
        }, observerOptions);

        // Observa todos os containers de skills
        document.querySelectorAll('.bg-white.dark\\:bg-\\[\\#1a1d35\\]').forEach(skillCard => {
            if (skillCard.querySelector('.bg-gradient-to-r')) {
                observer.observe(skillCard);
            }
        });
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Loading animation for buttons
    static addLoadingState(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Carregando...';
        button.disabled = true;
        
        return () => {
            button.innerHTML = originalText;
            button.disabled = false;
        };
    }
}

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy loading para imagens
        this.setupLazyLoading();
        
        // Preload de recursos críticos
        this.preloadCriticalResources();
        
        // Otimizações de scroll
        this.optimizeScrollPerformance();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
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
        }
    }

    preloadCriticalResources() {
        // Preload de fontes críticas
        const fontUrls = [
            'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap'
        ];

        fontUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = url;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    optimizeScrollPerformance() {
        // Usa requestAnimationFrame para suavizar animações de scroll
        let ticking = false;

        const updateScrollEffects = () => {
            // Aqui você pode adicionar efeitos de scroll otimizados
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
}

// ========================================
// INTERACTIVE ELEMENTS
// ========================================

class InteractiveElements {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactButtons();
        this.setupSkillHovers();
        this.setupCardAnimations();
    }

    setupContactButtons() {
        const contactButtons = document.querySelectorAll('[href^="mailto:"], [href^="tel:"]');
        
        contactButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Adiciona feedback visual
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 150);

                // Tracking (se necessário)
                console.log('Contact action:', button.href);
            });
        });
    }

    setupSkillHovers() {
        const skillBars = document.querySelectorAll('.bg-gradient-to-r');
        
        skillBars.forEach(bar => {
            const container = bar.closest('.bg-white, .dark\\:bg-\\[\\#1a1d35\\]');
            
            if (container) {
                container.addEventListener('mouseenter', () => {
                    bar.style.filter = 'brightness(1.1)';
                });
                
                container.addEventListener('mouseleave', () => {
                    bar.style.filter = 'brightness(1)';
                });
            }
        });
    }

    setupCardAnimations() {
        const cards = document.querySelectorAll('.hover\\:shadow-xl');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
}

// ========================================
// ACCESSIBILITY IMPROVEMENTS
// ========================================

class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
    }

    setupKeyboardNavigation() {
        // Navegação por teclado para menu mobile
        const mobileMenuItems = document.querySelectorAll('#mobile-menu .nav-item, #mobile-menu button');
        
        mobileMenuItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const nextIndex = e.key === 'ArrowRight' 
                        ? (index + 1) % mobileMenuItems.length
                        : (index - 1 + mobileMenuItems.length) % mobileMenuItems.length;
                    mobileMenuItems[nextIndex].focus();
                }
            });
        });
    }

    setupFocusManagement() {
        // Melhora o contraste de foco
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid #6f5cae';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }

    setupScreenReaderSupport() {
        // Adiciona labels e descrições para screen readers
        const themeButtons = document.querySelectorAll('[id*="toggle-theme"]');
        
        themeButtons.forEach(button => {
            button.setAttribute('aria-label', 'Alternar modo escuro/claro');
            button.setAttribute('role', 'button');
        });

        // Adiciona landmark roles
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        const footer = document.querySelector('footer');
        const nav = document.querySelector('nav');

        if (header) header.setAttribute('role', 'banner');
        if (main) main.setAttribute('role', 'main');
        if (footer) footer.setAttribute('role', 'contentinfo');
        if (nav) nav.setAttribute('role', 'navigation');
    }
}

// ========================================
// APP INITIALIZATION
// ========================================

class App {
    constructor() {
        this.init();
    }

    init() {
        // Aguarda o DOM estar completamente carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Inicializa todos os componentes
            this.themeManager = new ThemeManager();
            this.navigationManager = new NavigationManager();
            this.scrollAnimations = new ScrollAnimations();
            this.performanceOptimizer = new PerformanceOptimizer();
            this.interactiveElements = new InteractiveElements();
            this.accessibilityManager = new AccessibilityManager();

            console.log('✅ App initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
        }
    }
}

// ========================================
// START APPLICATION
// ========================================

// Inicia a aplicação
const app = new App();

// Exporta para uso global se necessário
window.CVApp = {
    app,
    Utils,
    ThemeManager,
    NavigationManager
};

// Service Worker registration (se disponível)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
