// Script pour tester les aspects responsive du site
// Simulation des breakpoints mobiles

function simulateMobileView(width, height) {
    // Modifier le viewport
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=' + width + ', initial-scale=1.0';
        document.head.appendChild(meta);
    }
    
    // Modifier le body pour simuler un mobile
    document.body.style.width = width + 'px';
    document.body.style.margin = '0 auto';
    document.body.style.overflow = 'auto';
    
    // Ajouter une classe pour le debugging responsive
    document.body.classList.add('mobile-viewport');
    document.body.classList.add('width-' + width);
    
    console.log('Viewport simulé à ' + width + 'x' + height);
}

function resetViewport() {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
        metaViewport.content = 'width=device-width, initial-scale=1.0';
    }
    
    document.body.style.width = 'auto';
    document.body.style.margin = 'auto';
    
    // Supprimer les classes de debugging
    document.body.classList.remove('mobile-viewport');
    const widthClasses = Array.from(document.body.classList).filter(c => c.startsWith('width-'));
    widthClasses.forEach(c => document.body.classList.remove(c));
}

// Fonction pour détecter les changements responsive
function monitorResponsiveChanges() {
    const navElements = document.querySelectorAll('nav, .nav, .navigation, [class*="nav"], [id*="nav"]');
    const menuButtons = document.querySelectorAll('.menu-btn, .hamburger, [class*="hamburger"], [class*="menu-toggle"]');
    const containers = document.querySelectorAll('.container, .main-container, .content-container');
    
    console.log('Éléments de navigation détectés:', navElements.length);
    console.log('Boutons de menu détectés:', menuButtons.length);
    console.log('Conteneurs détectés:', containers.length);
    
    return { nav: navElements, menus: menuButtons, containers: containers };
}

// Exposer les fonctions globalement pour pouvoir les appeler
window.simulateMobileView = simulateMobileView;
window.resetViewport = resetViewport;
window.monitorResponsiveChanges = monitorResponsiveChanges;

console.log('Script responsive chargé. Utilisation:');
console.log('- simulateMobileView(320, 568) pour mobile');
console.log('- simulateMobileView(768, 1024) pour tablette');
console.log('- simulateMobileView(1024, 768) pour desktop');
console.log('- resetViewport() pour revenir au normal');
console.log('- monitorResponsiveChanges() pour analyser les éléments');
