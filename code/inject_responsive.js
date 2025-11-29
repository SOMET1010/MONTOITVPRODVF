// Injecter le script responsive dans la page
const scriptContent = `
(function() {
    function simulateMobileView(width, height) {
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (!metaViewport) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=' + width + ', initial-scale=1.0';
            document.head.appendChild(meta);
        }
        
        document.body.style.width = width + 'px';
        document.body.style.margin = '0 auto';
        document.body.style.overflow = 'auto';
        
        document.body.classList.add('mobile-viewport');
        document.body.classList.add('width-' + width);
        
        return {
            width: width,
            height: height,
            status: 'Viewport simulé avec succès'
        };
    }

    function resetViewport() {
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
            metaViewport.content = 'width=device-width, initial-scale=1.0';
        }
        
        document.body.style.width = 'auto';
        document.body.style.margin = 'auto';
        
        const widthClasses = Array.from(document.body.classList).filter(c => c.startsWith('width-'));
        widthClasses.forEach(c => document.body.classList.remove(c));
        document.body.classList.remove('mobile-viewport');
        
        return { status: 'Viewport réinitialisé' };
    }

    function monitorResponsiveElements() {
        const navElements = document.querySelectorAll('nav, .nav, .navigation, [class*="nav"], [id*="nav"], header');
        const menuButtons = document.querySelectorAll('.menu-btn, .hamburger, [class*="hamburger"], [class*="menu-toggle"], button');
        const containers = document.querySelectorAll('.container, .main-container, .content-container, .wrapper');
        
        const responsiveInfo = {
            navigationElements: navElements.length,
            menuButtons: menuButtons.length,
            containers: containers.length,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            navElements: Array.from(navElements).map(el => ({
                tagName: el.tagName,
                className: el.className,
                id: el.id
            }))
        };
        
        return responsiveInfo;
    }

    window.simulateMobileView = simulateMobileView;
    window.resetViewport = resetViewport;
    window.monitorResponsiveElements = monitorResponsiveElements;
})();
`;

const script = document.createElement('script');
script.textContent = scriptContent;
document.head.appendChild(script);

console.log('Script responsive injecté avec succès');
