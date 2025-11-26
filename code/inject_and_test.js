// Injection du script de test et exécution des analyses
const script = document.createElement('script');
script.textContent = `
// Script de test multi-navigateurs pour Mon Toit
console.log("=== TEST MULTI-NAVIGATEURS MON TOIT ===");

// Test 1: User Agent Analysis
function getUserAgentInfo() {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isChrome = /Chrome/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isEdge = /Edg/.test(userAgent);
    
    return {
        userAgent: userAgent,
        isMobile: isMobile,
        isChrome: isChrome,
        isFirefox: isFirefox,
        isSafari: isSafari,
        isEdge: isEdge
    };
}

// Test 2: DOM Analysis
function analyzeDOM() {
    return {
        totalElements: document.querySelectorAll('*').length,
        imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
        links: document.querySelectorAll('a').length,
        forms: document.querySelectorAll('form').length,
        scripts: document.querySelectorAll('script').length,
        stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
        duplicateNavigation: document.querySelectorAll('a[href="/"], a[href*="recherche"]').length,
        brokenImages: Array.from(document.querySelectorAll('img')).filter(img => !img.src || img.src === '').length
    };
}

// Test 3: JavaScript Compatibility
function testJavaScriptCompatibility() {
    const tests = [];
    
    const es6Tests = {
        'Arrow Functions': () => { const fn = () => true; return fn(); },
        'Template Literals': () => { const str = \`test\`; return typeof str === 'string'; },
        'Destructuring': () => { const {a} = {a: 1}; return a === 1; },
        'Spread Operator': () => { const arr = [1,2]; return [...arr].length === 2; },
        'Let/Const': () => { let x = 1; const y = 2; return x === 1 && y === 2; },
        'Promises': () => { return typeof Promise !== 'undefined'; },
        'Fetch API': () => { return typeof fetch !== 'undefined'; },
        'Local Storage': () => { try { localStorage.setItem('test', 'test'); return true; } catch(e) { return false; } },
        'Session Storage': () => { try { sessionStorage.setItem('test', 'test'); return true; } catch(e) { return false; } }
    };
    
    Object.keys(es6Tests).forEach(testName => {
        try {
            const result = es6Tests[testName]();
            tests.push({ test: testName, supported: result });
        } catch (e) {
            tests.push({ test: testName, supported: false, error: e.message });
        }
    });
    
    return tests;
}

// Test 4: CSS Features Support
function testCSSFeatures() {
    const tests = [];
    
    const cssTests = {
        'Flexbox': () => {
            const div = document.createElement('div');
            return div.style.display === 'flex' || 
                   'flex' in document.documentElement.style;
        },
        'CSS Grid': () => {
            const div = document.createElement('div');
            return div.style.display === 'grid' || 
                   'grid' in document.documentElement.style;
        },
        'CSS Variables': () => {
            return CSS.supports('--test', '0');
        },
        'Transform 3D': () => {
            const div = document.createElement('div');
            return 'transform' in div.style || 'webkitTransform' in div.style;
        },
        'Transition': () => {
            const div = document.createElement('div');
            return 'transition' in div.style;
        },
        'Animation': () => {
            const div = document.createElement('div');
            return 'animation' in div.style;
        }
    };
    
    Object.keys(cssTests).forEach(testName => {
        try {
            const result = cssTests[testName]();
            tests.push({ test: testName, supported: result });
        } catch (e) {
            tests.push({ test: testName, supported: false, error: e.message });
        }
    });
    
    return tests;
}

// Test 5: Performance Analysis
function testPerformance() {
    const performanceData = {};
    
    // Navigation Timing
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        performanceData.loadTime = timing.loadEventEnd - timing.navigationStart;
        performanceData.domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        performanceData.firstPaint = timing.responseStart - timing.navigationStart;
    }
    
    // Memory usage (if available)
    if (window.performance && window.performance.memory) {
        performanceData.memoryUsed = window.performance.memory.usedJSHeapSize;
        performanceData.memoryTotal = window.performance.memory.totalJSHeapSize;
        performanceData.memoryLimit = window.performance.memory.jsHeapSizeLimit;
    }
    
    return performanceData;
}

// Exécuter tous les tests
function runAllTests() {
    const results = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: getUserAgentInfo(),
        dom: analyzeDOM(),
        javascript: testJavaScriptCompatibility(),
        css: testCSSFeatures(),
        performance: testPerformance()
    };
    
    return results;
}

window.browserTestResults = runAllTests();
console.log("Résultats des tests:", JSON.stringify(window.browserTestResults, null, 2));
`;

document.head.appendChild(script);

// Attendre que le script soit évalué
setTimeout(() => {
    console.log("Test terminé - résultats disponibles dans window.browserTestResults");
}, 1000);
