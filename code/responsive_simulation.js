// Script pour tester la responsivité
console.log("=== TEST RESPONSIVITÉ ===");

// Fonction pour simuler différentes résolutions
function simulateResolution(width, height, deviceName) {
    console.log(`\n--- Simulation ${deviceName}: ${width}x${height} ---`);
    
    // Sauvegarder les styles originaux
    const htmlStyle = document.documentElement.getAttribute('style') || '';
    const bodyStyle = document.body.getAttribute('style') || '';
    
    // Appliquer la nouvelle résolution
    document.documentElement.style.width = width + 'px';
    document.body.style.width = width + 'px';
    
    // Calculer le ratio
    const aspectRatio = width / height;
    const currentWidth = document.documentElement.offsetWidth;
    
    console.log(`Largeur appliquée: ${currentWidth}px`);
    console.log(`Ratio d'aspect: ${aspectRatio.toFixed(2)}`);
    
    // Restaurer les styles originaux après test
    setTimeout(() => {
        document.documentElement.setAttribute('style', htmlStyle);
        document.body.setAttribute('style', bodyStyle);
    }, 2000);
    
    return {
        device: deviceName,
        resolution: `${width}x${height}`,
        appliedWidth: currentWidth,
        aspectRatio: aspectRatio.toFixed(2)
    };
}

// Tester différentes résolutions
const resolutions = [
    { width: 375, height: 667, name: "iPhone SE (Mobile)" },
    { width: 768, height: 1024, name: "iPad (Tablet)" },
    { width: 1024, height: 768, name: "iPad Landscape" },
    { width: 1920, height: 1080, name: "Desktop Full HD" },
    { width: 2560, height: 1440, name: "Desktop 2K" },
    { width: 414, height: 896, name: "iPhone 11 (Mobile Large)" },
    { width: 360, height: 800, name: "Android Mobile" }
];

let testResults = [];
resolutions.forEach((res, index) => {
    setTimeout(() => {
        const result = simulateResolution(res.width, res.height, res.name);
        testResults.push(result);
        console.log(`Test ${index + 1}/${resolutions.length} terminé`);
        
        if (index === resolutions.length - 1) {
            console.log("\n=== RÉSULTATS FINAUX ===");
            console.log(JSON.stringify(testResults, null, 2));
        }
    }, index * 3000); // Attendre 3 secondes entre chaque test
});

console.log("Démarrage des tests de responsivité...");
