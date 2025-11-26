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

// Test 2: Responsive Design Testing
function testResponsiveDesign() {
    const viewports = [
        { name: "Mobile", width: 375, height: 667 },
        { name: "Tablet", width: 768, height: 1024 },
        { name: "Desktop", width: 1920, height: 1080 },
        { name: "Large Desktop", width: 2560, height: 1440 }
    ];
    
    const results = [];
    
    viewports.forEach(viewport => {
        const before = window.innerWidth + "x" + window.innerHeight;
        
        // Simuler changement de viewport (CSS media queries)
        document.documentElement.style.width = viewport.width + "px";
        document.body.style.width = viewport.width + "px";
        
        const layoutWidth = document.documentElement.offsetWidth;
        const bodyWidth = document.body.offsetWidth;
        
        results.push({
            viewport: viewport.name,
            expected: viewport.width + "x" + viewport.height,
            current: layoutWidth + "x" + window.innerHeight,
            responsive: layoutWidth === viewport.width
        });
        
        // Restaurer la taille
        document.documentElement.style.width = "";
        document.body.style.width = "";
    });
    
    return results;
}

// Test 3: JavaScript Compatibility
function testJavaScriptCompatibility() {
    const tests = [];
    
    // Test ES6+ features
    const es6Tests = {
        'Arrow Functions': () => { const fn = () => true; return fn(); },
        'Template Literals': () => { const str = `test`; return typeof str === 'string'; },
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

// Test 6: Error Detection
function detectErrors() {
    const errors = [];
    
    // Console errors
    const originalError = console.error;
    console.error = function(...args) {
        errors.push({
            type: 'console_error',
            message: args.join(' '),
            timestamp: Date.now()
        });
        originalError.apply(console, args);
    };
    
    // JavaScript errors
    window.onerror = function(message, source, lineno, colno, error) {
        errors.push({
            type: 'javascript_error',
            message: message,
            source: source,
            lineno: lineno,
            colno: colno,
            error: error,
            timestamp: Date.now()
        });
    };
    
    // Resource loading errors
    window.addEventListener('error', function(e) {
        if (e.target !== window) {
            errors.push({
                type: 'resource_error',
                resource: e.target.src || e.target.href,
                element: e.target.tagName,
                timestamp: Date.now()
            });
        }
    });
    
    return errors;
}

// Test 7: DOM Analysis
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

// Exécuter tous les tests
function runAllTests() {
    const results = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: getUserAgentInfo(),
        responsive: testResponsiveDesign(),
        javascript: testJavaScriptCompatibility(),
        css: testCSSFeatures(),
        performance: testPerformance(),
        dom: analyzeDOM()
    };
    
    return results;
}

// Détecter les erreurs en temps réel
detectErrors();

// Exposer les fonctions de test
window.browserTests = {
    runAllTests: runAllTests,
    getUserAgentInfo: getUserAgentInfo,
    testResponsiveDesign: testResponsiveDesign,
    testJavaScriptCompatibility: testJavaScriptCompatibility,
    testCSSFeatures: testCSSFeatures,
    testPerformance: testPerformance,
    analyzeDOM: analyzeDOM
};

console.log("Script de test multi-navigateurs chargé. Utilisez window.browserTests.runAllTests() pour exécuter tous les tests.");
