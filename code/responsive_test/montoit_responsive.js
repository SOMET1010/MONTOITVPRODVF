/**
 * ========================================
 * MONTOIT RESPONSIVE JAVASCRIPT
 * ========================================
 * 
 * Script JavaScript pour optimiser l'expérience utilisateur
 * mobile et tablette de l'application MONTOIT
 */

class MonToitResponsive {
    constructor() {
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.isMenuOpen = false;
        this.isScrolled = false;
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initialisation MonToitResponsive');
        
        this.setupEventListeners();
        this.initMobileMenu();
        this.initResponsiveImages();
        this.initTouchGestures();
        this.initFormOptimizations();
        this.initPerformanceOptimizations();
        
        // Démarrer les tests
        this.runResponsiveTests();
    }
    
    /**
     * Détecte le breakpoint actuel
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width <= 768) {
            return 'mobile';
        } else if (width <= 1024) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }
    
    /**
     * Configure les Event Listeners
     */
    setupEventListeners() {
        // Détection de redimensionnement
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // Détection de scroll
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Détection d'orientation
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 500);
        });
        
        // Détection réseau
        if ('connection' in navigator) {
            this.handleNetworkChange();
        }
        
        // Visibilité de page
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }
    
    /**
     * Gestion du redimensionnement
     */
    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            console.log(`📱 Changement de breakpoint: ${this.currentBreakpoint} → ${newBreakpoint}`);
            this.currentBreakpoint = newBreakpoint;
            this.onBreakpointChange();
        }
        
        this.adjustLayout();
    }
    
    /**
     * Changement de breakpoint
     */
    onBreakpointChange() {
        const event = new CustomEvent('breakpointChange', {
            detail: {
                breakpoint: this.currentBreakpoint,
                width: window.innerWidth
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Ajustement du layout
     */
    adjustLayout() {
        // Fermer le menu mobile si on passe en desktop
        if (this.currentBreakpoint === 'desktop' && this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Réinitialiser les grid si nécessaire
        this.resetGrids();
        
        // Ajuster les hauteurs des sections
        this.adjustSectionHeights();
    }
    
    /**
     * Menu Mobile
     */
    initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
            
            // Fermer le menu en cliquant à l'extérieur
            document.addEventListener('click', (e) => {
                if (this.isMenuOpen && 
                    !navMenu.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
            
            // Fermer avec Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.mobile-nav-toggle');
        
        if (navMenu && menuToggle) {
            navMenu.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            this.isMenuOpen = true;
            
            // Animer les barres du hamburger
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = index === 1 ? 'rotate(90deg)' : 
                                    index === 2 ? 'rotate(45deg) translate(5px, 5px)' : '';
            });
            
            // Empêcher le scroll du body
            document.body.style.overflow = 'hidden';
            
            console.log('📱 Menu mobile ouvert');
        }
    }
    
    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.mobile-nav-toggle');
        
        if (navMenu && menuToggle) {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            this.isMenuOpen = false;
            
            // Réinitialiser les barres du hamburger
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
            });
            
            // Restaurer le scroll du body
            document.body.style.overflow = '';
            
            console.log('📱 Menu mobile fermé');
        }
    }
    
    /**
     * Images Responsive avec Lazy Loading
     */
    initResponsiveImages() {
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        } else {
            // Fallback pour anciens navigateurs
            this.loadAllImages();
        }
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
        
        console.log(`🖼️ ${images.length} images configurées pour lazy loading`);
    }
    
    loadImage(img) {
        return new Promise((resolve, reject) => {
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                
                // Supprimer les classes lazy pour éviter les reflows
                img.removeAttribute('data-src');
                
                console.log(`✅ Image chargée: ${img.src}`);
                resolve();
            };
            
            imageLoader.onerror = reject;
            imageLoader.src = img.dataset.src;
        });
    }
    
    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
    
    /**
     * Gestures Tactiles
     */
    initTouchGestures() {
        if (!this.isTouchDevice()) return;
        
        this.initSwipeGestures();
        this.initPullToRefresh();
    }
    
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    initSwipeGestures() {
        const propertyCards = document.querySelectorAll('.property-card');
        
        propertyCards.forEach(card => {
            let startX, startY, startTime;
            
            card.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startTime = Date.now();
            });
            
            card.addEventListener('touchend', (e) => {
                if (!startX || !startY) return;
                
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                const deltaTime = Date.now() - startTime;
                
                // Détecter un swipe horizontal rapide
                if (Math.abs(deltaX) > Math.abs(deltaY) && 
                    Math.abs(deltaX) > 50 && 
                    deltaTime < 500) {
                    
                    this.handleSwipe(card, deltaX > 0 ? 'right' : 'left');
                }
            });
        });
    }
    
    handleSwipe(card, direction) {
        const event = new CustomEvent('swipe', {
            detail: { direction, element: card }
        });
        card.dispatchEvent(event);
        
        console.log(`👆 Swipe ${direction} détecté sur ${card}`);
    }
    
    initPullToRefresh() {
        let startY, currentY, pullDistance, isPulling = false;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isPulling || window.scrollY > 0) return;
            
            currentY = e.touches[0].clientY;
            pullDistance = currentY - startY;
            
            if (pullDistance > 0 && pullDistance < 100) {
                this.showPullToRefreshIndicator(pullDistance);
            }
        });
        
        document.addEventListener('touchend', () => {
            if (pullDistance > 50) {
                this.performRefresh();
            }
            
            this.hidePullToRefreshIndicator();
            startY = currentY = pullDistance = 0;
            isPulling = false;
        });
    }
    
    showPullToRefreshIndicator(distance) {
        // Implémenter l'indicateur visuel
        console.log(`🔄 Pull to refresh: ${distance}px`);
    }
    
    hidePullToRefreshIndicator() {
        console.log('🔄 Pull to refresh caché');
    }
    
    performRefresh() {
        const event = new CustomEvent('pullToRefresh');
        document.dispatchEvent(event);
        
        console.log('🔄 Actualisation déclenchée');
        
        // Simuler un rechargement
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    
    /**
     * Optimisations des Formulaires
     */
    initFormOptimizations() {
        this.setupInputFocus();
        this.setupInputValidation();
        this.setupAutocompleteOptimization();
    }
    
    setupInputFocus() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.adjustViewportForKeyboard(input);
            });
            
            input.addEventListener('blur', () => {
                this.resetViewport();
            });
        });
    }
    
    adjustViewportForKeyboard(input) {
        if (this.currentBreakpoint !== 'mobile') return;
        
        // Scroll to ensure input is visible
        setTimeout(() => {
            input.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
        
        // Add class for styling
        input.classList.add('keyboard-active');
    }
    
    resetViewport() {
        const activeInput = document.querySelector('.keyboard-active');
        if (activeInput) {
            activeInput.classList.remove('keyboard-active');
        }
    }
    
    setupInputValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.validateInput(input);
                });
            });
        });
    }
    
    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const isRequired = input.hasAttribute('required');
        
        let isValid = true;
        let message = '';
        
        if (isRequired && !value) {
            isValid = false;
            message = 'Ce champ est requis';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Format d\'email invalide';
        }
        
        this.showValidationFeedback(input, isValid, message);
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showValidationFeedback(input, isValid, message) {
        input.classList.toggle('is-invalid', !isValid);
        input.classList.toggle('is-valid', isValid);
        
        // Créer ou mettre à jour le message d'erreur
        let errorDiv = input.parentNode.querySelector('.error-message');
        if (!isValid) {
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                input.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
        } else if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    setupAutocompleteOptimization() {
        const inputs = document.querySelectorAll('input[type="email"], input[type="text"]');
        
        inputs.forEach(input => {
            // Optimiser le clavier mobile
            if (input.type === 'email') {
                input.setAttribute('inputmode', 'email');
            } else {
                input.setAttribute('inputmode', 'text');
            }
        });
    }
    
    /**
     * Optimisations de Performance
     */
    initPerformanceOptimizations() {
        this.setupServiceWorker();
        this.preloadCriticalResources();
        this.optimizeAnimationPerformance();
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker enregistré');
                })
                .catch(error => {
                    console.log('❌ Erreur Service Worker:', error);
                });
        }
    }
    
    preloadCriticalResources() {
        // Précharger les ressources critiques
        const criticalImages = [
            '/images/logo-mon-toit.png',
            '/images/hero-property.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    optimizeAnimationPerformance() {
        // Utiliser requestAnimationFrame pour les animations
        if ('requestAnimationFrame' in window) {
            this.animateElements = this.throttle(this.animateElements, 16);
        }
    }
    
    animateElements() {
        // Animation des éléments au scroll
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        animatedElements.forEach(element => {
            if (this.isElementVisible(element)) {
                element.classList.add('animated');
            }
        });
    }
    
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    
    /**
     * Tests de Responsivité
     */
    runResponsiveTests() {
        console.log('🧪 Démarrage des tests de responsivité');
        
        this.testNavigation();
        this.testForms();
        this.testImages();
        this.testPerformance();
    }
    
    testNavigation() {
        const navTests = {
            menuMobile: document.querySelector('.mobile-nav-toggle'),
            navMenu: document.querySelector('.nav-menu'),
            desktopNav: document.querySelector('.header-nav')
        };
        
        // Vérifier le menu mobile
        if (this.currentBreakpoint === 'mobile') {
            if (navTests.menuMobile && navTests.navMenu) {
                console.log('✅ Navigation mobile détectée');
            } else {
                console.warn('⚠️ Navigation mobile manquante');
            }
        }
        
        // Vérifier la navigation desktop
        if (this.currentBreakpoint === 'desktop') {
            if (navTests.desktopNav) {
                console.log('✅ Navigation desktop détectée');
            }
        }
    }
    
    testForms() {
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('input, select, textarea');
        
        let mobileFriendlyCount = 0;
        
        inputs.forEach(input => {
            if (this.isMobileFriendlyInput(input)) {
                mobileFriendlyCount++;
            }
        });
        
        const score = (mobileFriendlyCount / inputs.length) * 100;
        
        if (score >= 80) {
            console.log('✅ Formulaires mobile-friendly (80%+)');
        } else {
            console.warn(`⚠️ Formulaires à améliorer (${score.toFixed(1)}%)`);
        }
    }
    
    isMobileFriendlyInput(input) {
        const styles = window.getComputedStyle(input);
        const minHeight = parseInt(styles.minHeight) || 0;
        const fontSize = parseInt(styles.fontSize) || 16;
        
        return minHeight >= 44 && fontSize >= 14;
    }
    
    testImages() {
        const images = document.querySelectorAll('img');
        let responsiveCount = 0;
        
        images.forEach(img => {
            const styles = window.getComputedStyle(img);
            if (styles.maxWidth === '100%' || styles.width === '100%') {
                responsiveCount++;
            }
        });
        
        const score = (responsiveCount / images.length) * 100;
        
        if (score >= 90) {
            console.log('✅ Images responsive (90%+)');
        } else {
            console.warn(`⚠️ Images à optimiser (${score.toFixed(1)}%)`);
        }
    }
    
    testPerformance() {
        // Test basique de performance
        const startTime = performance.now();
        
        setTimeout(() => {
            const loadTime = performance.now() - startTime;
            
            if (loadTime < 100) {
                console.log('✅ Performance excellente');
            } else if (loadTime < 500) {
                console.log('⚠️ Performance acceptable');
            } else {
                console.warn('❌ Performance lente');
            }
        }, 50);
    }
    
    /**
     * Utilitaires
     */
    throttle(func, limit) {
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
    
    handleScroll() {
        this.isScrolled = window.scrollY > 100;
        
        // Ajouter classe pour header collant si nécessaire
        const header = document.querySelector('.header-nav');
        if (header) {
            header.classList.toggle('scrolled', this.isScrolled);
        }
    }
    
    handleOrientationChange() {
        console.log('🔄 Changement d\'orientation détecté');
        
        // Ajuster le layout après rotation
        setTimeout(() => {
            this.adjustLayout();
        }, 300);
    }
    
    handleNetworkChange() {
        const connection = navigator.connection;
        
        if (connection) {
            connection.addEventListener('change', () => {
                console.log(`🌐 Réseau: ${connection.effectiveType}`);
                
                // Adapter les ressources selon la connexion
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    this.enableLowBandwidthMode();
                } else {
                    this.disableLowBandwidthMode();
                }
            });
        }
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            console.log('👁️ Page cachée - suspension des animations');
            this.pauseAnimations();
        } else {
            console.log('👁️ Page visible - reprise des animations');
            this.resumeAnimations();
        }
    }
    
    enableLowBandwidthMode() {
        document.body.classList.add('low-bandwidth');
        console.log('📵 Mode bande passante réduite activé');
    }
    
    disableLowBandwidthMode() {
        document.body.classList.remove('low-bandwidth');
        console.log('📶 Mode bande passante normale');
    }
    
    pauseAnimations() {
        document.body.classList.add('animations-paused');
    }
    
    resumeAnimations() {
        document.body.classList.remove('animations-paused');
    }
    
    resetGrids() {
        // Réinitialiser les grilles si nécessaire
        const grids = document.querySelectorAll('.properties-grid');
        grids.forEach(grid => {
            grid.style.gridTemplateColumns = '';
        });
    }
    
    adjustSectionHeights() {
        // Ajuster les hauteurs de sections si nécessaire
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.minHeight = '';
        });
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.montoitResponsive = new MonToitResponsive();
});

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonToitResponsive;
}