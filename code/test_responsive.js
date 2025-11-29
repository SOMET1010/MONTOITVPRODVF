// Script pour tester le responsive design
// Créer un style pour simuler différentes tailles d'écran

function createResponsiveTestStyles() {
    const style = document.createElement('style');
    style.id = 'responsive-test-styles';
    style.textContent = `
        /* Simulation mobile 320px */
        body.mobile-320 {
            width: 320px !important;
            margin: 0 auto !important;
            overflow-x: hidden !important;
        }
        
        /* Simulation tablette 768px */
        body.tablet-768 {
            width: 768px !important;
            margin: 0 auto !important;
            overflow-x: hidden !important;
        }
        
        /* Simulation desktop 1024px */
        body.desktop-1024 {
            width: 1024px !important;
            margin: 0 auto !important;
            overflow-x: hidden !important;
        }
        
        /* Pour tester les éléments de navigation */
        .nav-test {
            background: red !important;
        }
        
        /* Pour visualiser les containers */
        .container-test {
            border: 2px solid blue !important;
        }
    `;
    document.head.appendChild(style);
}

function applyViewport(width) {
    // Supprimer toutes les classes précédentes
    document.body.classList.remove('mobile-320', 'tablet-768', 'desktop-1024');
    
    // Appliquer la nouvelle classe
    switch(width) {
        case 320:
            document.body.classList.add('mobile-320');
            break;
        case 768:
            document.body.classList.add('tablet-768');
            break;
        case 1024:
            document.body.classList.add('desktop-1024');
            break;
    }
    
    console.log(`Viewport appliqué: ${width}px`);
    return {width: width, applied: true};
}

function resetViewport() {
    document.body.classList.remove('mobile-320', 'tablet-768', 'desktop-1024');
    console.log('Viewport reset');
}

function analyzeNavigation() {
    const navElements = document.querySelectorAll('nav, header, [class*="nav"], [class*="header"]');
    const menuButtons = document.querySelectorAll('button, [class*="menu"], [class*="hamburger"]');
    
    return {
        navElements: navElements.length,
        menuButtons: menuButtons.length,
        currentWidth: document.body.clientWidth,
        windowWidth: window.innerWidth
    };
}

// Exposer les fonctions globalement
window.createResponsiveTestStyles = createResponsiveTestStyles;
window.applyViewport = applyViewport;
window.resetViewport = resetViewport;
window.analyzeNavigation = analyzeNavigation;

console.log('Script de test responsive chargé');
