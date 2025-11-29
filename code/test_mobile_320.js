// Test breakpoint mobile 320px
console.log('🔍 Test breakpoint mobile 320px');

// Créer les styles pour simuler mobile 320px
const style = document.createElement('style');
style.textContent = `
    /* Force mobile 320px view */
    * {
        box-sizing: border-box !important;
    }
    
    body {
        width: 320px !important;
        margin: 0 auto !important;
        overflow-x: hidden !important;
        min-width: 320px !important;
        max-width: 320px !important;
    }
    
    /* Analyser les éléments de navigation */
    .nav-analysis {
        background: rgba(255,0,0,0.2) !important;
        border: 2px solid red !important;
    }
    
    /* Analyser les containers */
    .container-analysis {
        border: 2px solid blue !important;
    }
`;

// Nettoyer les anciens styles
const oldStyle = document.getElementById('mobile-test-style');
if (oldStyle) oldStyle.remove();

// Ajouter le nouveau style
style.id = 'mobile-test-style';
document.head.appendChild(style);

// Marquer la page pour le test
document.body.classList.add('mobile-320-test');

console.log('✅ Style mobile 320px appliqué');

// Analyser les éléments de navigation
const navElements = [
    ...document.querySelectorAll('header, nav, [class*="nav"], .navigation'),
    ...document.querySelectorAll('a[href*="Accueil"], a[href*="Rechercher"], a[href*="Connexion"], a[href*="Inscription"]')
];

navElements.forEach(el => el.classList.add('nav-analysis'));

console.log(`📱 Éléments de navigation détectés: ${navElements.length}`);
navElements.forEach((el, i) => {
    console.log(`  [${i}] ${el.tagName}: ${el.className} - ${el.textContent?.trim()}`);
});

// Vérifier si un menu hamburger existe
const hamburger = document.querySelectorAll('.hamburger, .menu-btn, [class*="hamburger"], [class*="menu-toggle"]');
console.log(`🍔 Menu hamburger détecté: ${hamburger.length}`);

// Retourner l'analyse
return {
    width: 320,
    navElements: navElements.length,
    hamburgerFound: hamburger.length > 0,
    navItems: navElements.map(el => ({
        tag: el.tagName,
        text: el.textContent?.trim(),
        href: el.href || 'N/A'
    }))
};
