# Guide de Correction Technique - Accessibilité Clavier Mon Toit

## Solutions Pratiques pour les Problèmes Identifiés

### 1. Correction Critique : Focus sur les Cartes de Propriétés

**Problème :** Aucun indicateur de focus visible sur les cartes de propriétés des résultats de recherche.

**Solution CSS :**
```css
/* Fichier: styles/accessibility.css */

/* Focus visible pour les cartes de propriétés */
.property-card {
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.property-card:focus {
    outline: 3px solid #FF6B35;
    outline-offset: -3px; /* Compense la bordure pour maintenir les dimensions */
    box-shadow: 
        0 0 0 6px rgba(255, 107, 53, 0.2),
        0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}

/* Alternative pour les liens dans les cartes */
.property-card a:focus {
    outline: 3px solid #FF6B35;
    outline-offset: 2px;
    border-radius: 4px;
}

/* Focus visible pour les images dans les cartes */
.property-card img:focus {
    outline: 3px solid #FF6B35;
    outline-offset: 2px;
}
```

**HTML Recommendations :**
```html
<!-- Assurer que les cartes sont focusables -->
<div class="property-card" tabindex="0" role="article" aria-labelledby="property-1-title">
    <img src="property.jpg" alt="Villa moderne à Cocody" tabindex="-1">
    <div class="property-content">
        <h3 id="property-1-title">Villa Moderne 4 Chambres</h3>
        <p>Abidjan, Cocody</p>
        <p class="price">450,000 FCFA/mois</p>
    </div>
    <a href="/proprietes/xxx" class="property-link" tabindex="-1">
        Voir les détails
    </a>
</div>
```

### 2. Standardisation des Indicateurs de Focus

**Problème :** Indicateurs de focus inconsistants entre les éléments.

**Solution CSS Globale :**
```css
/* Fichier: styles/focus-indicators.css */

/* Style de focus global - doit être en dernier pour priorité */
*:focus {
    outline: 2px solid #FF6B35;
    outline-offset: 2px;
}

/* Exceptions pour des éléments spécifiques */
button:focus,
input[type="submit"]:focus,
.button:focus {
    outline: 2px solid #FF6B35;
    outline-offset: 2px;
    background-color: #E55A2B; /* Légèrement plus foncé */
}

input:focus,
select:focus,
textarea:focus {
    outline: 2px solid #FF6B35;
    outline-offset: 2px;
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

/* Focus pour les liens */
a:focus {
    outline: 2px solid #FF6B35;
    outline-offset: 2px;
    text-decoration: underline;
    text-decoration-thickness: 2px;
}

/* Focus pour les éléments d'interface personnalisés */
.custom-toggle:focus {
    outline: 2px solid #FF6B35;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
}
```

### 3. Amélioration des Dropdowns

**Problème :** États de dropdown peu visibles lors de la navigation au clavier.

**Solution CSS pour Dropdowns :**
```css
/* Fichier: styles/dropdown-accessibility.css */

select {
    appearance: none;
    background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23666" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 12px;
    padding-right: 40px;
}

select:focus {
    background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23FF6B35" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
}

/* Amélioration des options */
select option {
    padding: 8px;
    background-color: white;
    color: #333;
}

select option:checked {
    background-color: #FF6B35;
    color: white;
    font-weight: bold;
}

/* Style pour dropdown ouvert */
select:focus:not([multiple]) {
    background-color: #FFF5F2;
    border-color: #FF6B35;
}
```

**JavaScript pour améliorer l'expérience :**
```javascript
// Fichier: js/dropdown-enhancement.js

document.addEventListener('DOMContentLoaded', function() {
    const selects = document.querySelectorAll('select');
    
    selects.forEach(select => {
        // Gestion de l'ouverture/fermeture au clavier
        select.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.focus();
                this.size = this.options.length; // Ouvrir le dropdown
            }
            
            if (e.key === 'Escape') {
                this.size = 0; // Fermer le dropdown
                this.blur();
            }
        });
        
        // Gestion de la fermeture lors de la sélection
        select.addEventListener('change', function() {
            this.size = 0; // Fermer après sélection
        });
    });
});
```

### 4. Navigation par Skip Links

**Ajout de liens d'évitement pour navigation rapide :**

```html
<!-- Fichier: index.html (header) -->

<!-- Skip links au début du body -->
<div class="skip-links">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    <a href="#search-form" class="skip-link">Aller au formulaire de recherche</a>
    <a href="#footer" class="skip-link">Aller au pied de page</a>
</div>

<!-- Header existant -->
<header role="banner">
    <!-- ... contenu du header ... -->
</header>

<!-- Main content avec ID pour skip link -->
<main id="main-content" role="main">
    <!-- ... contenu principal ... -->
</main>
```

```css
/* Fichier: styles/skip-links.css */

.skip-links {
    position: absolute;
    top: -40px;
    left: 6px;
    z-index: 1000;
}

.skip-link {
    background-color: #FF6B35;
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 0 0 4px 4px;
    font-weight: bold;
    transition: top 0.3s;
}

.skip-link:focus {
    top: 0;
    outline: 2px solid #fff;
    outline-offset: 2px;
}
```

### 5. Landmarks ARIA pour Navigation

```html
<!-- Fichier: structure.html -->

<header role="banner">
    <nav role="navigation" aria-label="Navigation principale">
        <!-- Liens de navigation -->
    </nav>
</header>

<main role="main" id="main-content">
    <section aria-labelledby="search-heading">
        <h2 id="search-heading">Rechercher une propriété</h2>
        <form role="search" aria-label="Formulaire de recherche">
            <!-- Formulaire -->
        </form>
    </section>
    
    <section aria-labelledby="results-heading">
        <h2 id="results-heading">Résultats de recherche</h2>
        <div role="region" aria-labelledby="results-heading">
            <!-- Cartes de propriétés -->
        </div>
    </section>
</main>

<footer role="contentinfo" id="footer">
    <section aria-label="Newsletter">
        <!-- Formulaire newsletter -->
    </section>
    
    <nav role="navigation" aria-label="Liens du pied de page">
        <!-- Liens footer -->
    </nav>
</footer>
```

### 6. Test et Validation

**Script de test automatique :**
```javascript
// Fichier: js/accessibility-test.js

function testKeyboardAccessibility() {
    const issues = [];
    
    // Vérifier tous les éléments interactifs
    const interactiveElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]'
    );
    
    interactiveElements.forEach((element, index) => {
        // Vérifier si l'élément est focusable
        if (!element.hasAttribute('tabindex') && 
            !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
            issues.push(`Élément ${index + 1}: Non focusable`);
        }
        
        // Vérifier les labels ARIA
        if (!element.getAttribute('aria-label') && 
            !element.getAttribute('aria-labelledby') &&
            !element.getAttribute('title') &&
            !element.textContent.trim()) {
            issues.push(`Élément ${index + 1}: Pas de label accessible`);
        }
    });
    
    return issues;
}

// Test des couleurs de contraste
function testColorContrast() {
    const elements = document.querySelectorAll('*');
    const contrastIssues = [];
    
    elements.forEach(element => {
        const style = getComputedStyle(element);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        // Ici, vous pourriez intégrer une library comme tinycolor2
        // pour vérifier les ratios de contraste WCAG
    });
    
    return contrastIssues;
}

// Utilisation
const results = testKeyboardAccessibility();
console.log('Problèmes d\'accessibilité:', results);
```

### 7. Tests Manuels Recommandés

**Checklist de tests manuels :**

```markdown
# Checklist Accessibilité Clavier

## Navigation de Base
- [ ] Navigation Tab séquentielle fonctionne
- [ ] Navigation Shift+Tab fonctionne
- [ ] Tous les éléments interactifs sont accessibles
- [ ] Ordre de navigation est logique

## Formulaires
- [ ] Tous les champs sont accessibles
- [ ] Navigation avec Tab dans les formulaires
- [ ] Dropdowns navigables avec flèches
- [ ] Validation et messages d'erreur accessibles

## Indicateurs de Focus
- [ ] Tous les éléments ont un focus visible
- [ ] Focus suffisamment contrasté
- [ ] Style de focus cohérent
- [ ] Focus ne sort pas de la page

## Tests Spécifiques
- [ ] Navigation dans les résultats de recherche
- [ ] Accessibilité des boutons d'action
- [ ] Formulaires de newsletter et contact
- [ ] Navigation dans les menus

## Compatibilité Lecteurs d'Écran
- [ ] Test avec NVDA (Windows)
- [ ] Test avec JAWS (Windows)
- [ ] Test avec VoiceOver (macOS/iOS)
- [ ] Test avec TalkBack (Android)
```

### 8. Monitoring Continu

**Configuration d'un serveur de test :**
```bash
#!/bin/bash
# Fichier: test-accessibility.sh

echo "Lancement des tests d'accessibilité..."

# Test avec axe-core (CLI)
npx @axe-core/cli https://somet1010-montoit-st-dzj4.bolt.host/ \
    --output-file accessibility-report.json

# Test avec Pa11y
npx pa11y https://somet1010-montoit-st-dzj4.bolt.host/ \
    --reporter json \
    --output-file pa11y-report.json

echo "Tests terminés. Voir les rapports générés."
```

## Ordre de Priorité des Corrections

1. **URGENT** - Focus visible sur les cartes de propriétés
2. **HAUTE** - Standardisation des indicateurs de focus
3. **MOYENNE** - Amélioration des dropdowns
4. **FAIBLE** - Ajout de skip links et landmarks ARIA

## Validation Finale

Après implémentation des corrections, valider avec :
- Tests manuels au clavier
- Tests automatiques (axe-core, WAVE)
- Tests avec lecteurs d'écran
- Validation WCAG 2.1 Level AA

---
*Guide technique généré le 26 novembre 2025*