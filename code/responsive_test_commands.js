// Commandes JavaScript à exécuter dans la console pour tester le responsive

// 1. Simulation viewport mobile 320px
`simulateMobileView = function(width, height) {
    document.body.style.width = width + 'px';
    document.body.style.margin = '0 auto';
    document.body.style.overflow = 'auto';
    document.body.classList.add('mobile-viewport');
    document.body.classList.add('width-' + width);
    console.log('Viewport simulé à ' + width + 'x' + height);
    return {width: width, status: 'Simulated'};
}

// 2. Reset viewport
resetViewport = function() {
    document.body.style.width = 'auto';
    document.body.style.margin = 'auto';
    const classes = Array.from(document.body.classList);
    classes.filter(c => c.startsWith('width-') || c === 'mobile-viewport')
        .forEach(c => document.body.classList.remove(c));
    console.log('Viewport reset');
}

// 3. Analyser les éléments responsive
analyzeResponsiveElements = function() {
    const nav = document.querySelectorAll('nav, header, .nav, [class*="nav"]');
    const menus = document.querySelectorAll('button, .menu-btn, [class*="menu"]');
    console.log('Navigation elements:', nav.length);
    console.log('Menu buttons:', menus.length);
    console.log('Current width:', window.innerWidth);
    return {nav: nav.length, menus: menus.length};
}`

console.log('Commands loaded. Execute: simulateMobileView(320, 568)');
