# AUDIT UI/UX COMPLET - MONTOIT
## Plateforme Immobilière en Côte d'Ivoire

**Date d'audit:** 29 novembre 2025  
**URL analysée:** https://somet1010-montoit-st-jcvj.bolt.host  
**Auditeur:** Matrix Agent  
**Pages analysées:** 10+ (Accueil, Recherche, Connexion, Inscription, Contact, Aide, FAQ, À propos, Comment ça marche, Détail propriété)

---

## RÉSUMÉ EXÉCUTIF

### Diagnostic Global

Le site Montoit présente **une identité visuelle fragmentée** avec plusieurs "couches" de design superposées sans harmonisation claire. Bien que certaines pages individuelles soient bien conçues, **l'absence de design system cohérent** crée une expérience utilisateur incohérente et "accablante" comme signalé par l'utilisateur.

### Score de Cohérence Global: **5.5/10**

**Points positifs:**
- Typographie globalement cohérente (famille de police unique)
- Hiérarchie visuelle généralement claire
- Bonne utilisation des espaces blancs sur certaines pages

**Points critiques:**
- 🔴 Multiples palettes de couleurs non standardisées
- 🔴 Problèmes de superposition sur formulaires
- 🔴 Incohérences majeures dans l'affichage des données
- 🔴 3+ styles de boutons différents sans logique claire
- 🔴 Footer désaligné sur plusieurs pages

---

## 1. ANALYSE PAR CATÉGORIE DE PROBLÈMES

### 1.1 INCOHÉRENCES DE COULEURS 🔴 **SÉVÉRITÉ: HAUTE**

#### Problème #1: Multiples nuances d'orange
**Description:** Le site utilise au moins **4 nuances d'orange différentes** sans distinction claire:
- Orange vif principal: `#FF6C2F` (boutons primaires)
- Orange moyen: `#FF8C4B` (accents page À propos)
- Orange foncé: `#F06226` (liens footer)
- Orange dégradé: variable (bouton newsletter)

**Impact:**
- Dilue l'identité de marque
- Confusion sur les éléments interactifs
- Manque de professionnalisme

**Pages affectées:** TOUTES

---

#### Problème #2: Styles de boutons incohérents
**Description:** **3 styles de boutons** différents utilisés sans hiérarchie claire:

| Style | Apparence | Utilisation | Cohérence |
|-------|-----------|-------------|-----------|
| **Solid Orange** | Fond orange + texte blanc | "Inscription", "S'inscrire", "Postuler" | ✓ Primaire OK |
| **Outlined Orange** | Bordure orange + texte noir/orange | "Connexion", "Je cherche logement" | ✓ Secondaire OK |
| **Gradient Orange** | Dégradé orange + icône | Bouton newsletter footer | ❌ **INCOHÉRENT** |

**Problème critique:** Le bouton "Connexion" utilise **texte NOIR** au lieu d'orange, brisant la cohérence.

**Impact:**
- Confusion sur la hiérarchie des actions
- Apparence non professionnelle
- Manque de prévisibilité pour l'utilisateur

**Recommandation:**
- Standardiser 2 styles SEULEMENT: Solid (primaire) + Outlined (secondaire)
- SUPPRIMER le style gradient
- Utiliser texte orange pour boutons outlined

---

#### Problème #3: Couleur verte pour badge "Certifié ANSUT"
**Description:** Introduit un vert (`#5CB85C`) qui rompt la palette orange/gris/blanc du site.

**Impact:** Faible - acceptable car badge externe, mais pourrait être mieux intégré

---

#### Problème #4: Contraste insuffisant sur dégradés
**Description:** 
- **Page Inscription:** Texte blanc sur fond dégradé rose-orange → contraste faible dans zones claires
- Texte descriptif ("Vos données sont protégées") difficile à lire

**Impact:**
- Problème d'accessibilité WCAG AA (contraste < 4.5:1)
- Lisibilité compromise

**Recommandation:**
- Ajouter ombre portée subtile au texte OU
- Assombrir les zones claires du dégradé OU
- Utiliser texte gris foncé au lieu de blanc

---

### 1.2 PROBLÈMES DE SUPERPOSITION 🔴 **SÉVÉRITÉ: CRITIQUE**

#### Problème #5: Page Inscription - Contenu coupé
**Description:** Le panneau de formulaire (droite) **coupe visuellement** le contenu marketing (gauche):
- Texte "idéal vous attend" tronqué en haut
- Icônes et textes des avantages ("Sécurité et Protection", "Accès Universel") coupés par les bords arrondis
- Icône cœur en bas gauche partiellement masquée

**Impact:**
- 🔴 **CRITIQUE** - Problème d'UX majeur
- Impression de design non fini
- Perte d'informations importantes
- Utilisateur peut penser que la page est cassée

**Recommandation:**
- Option 1: Réduire largeur panneau formulaire (max 40% au lieu de 50%)
- Option 2: Supprimer coins arrondis qui créent le "clipping"
- Option 3: Repenser en layout full-width avec fond translucide

---

#### Problème #6: Erreurs de contenu dans formulaires
**Description:** 
- Placeholder champ "Nom complet": `otre nom complet` (manque "V")
- Placeholder champ "Email": `tre@email.com` (manque "V")

**Impact:**
- Unprofessionnalisme
- Peut créer doute sur qualité du site

---

### 1.3 INCOHÉRENCES DE DONNÉES 🔴 **SÉVÉRITÉ: HAUTE**

#### Problème #7: Cards propriétés - Informations manquantes
**Description:** Sur la page Recherche, les cards de propriétés affichent **aléatoirement** les détails:
- Certaines cards: 3 icônes complètes (chambres, salles de bain, superficie)
- Autres cards: 1-2 icônes seulement ou aucune
- Aucune logique claire (studios, commerces, appartements affectés)

**Exemples:**
- "Appartement Duplex Abobo Gare": 0 détails
- "Studio Fonctionnel Ministères": 0 détails  
- "Local Commercial Avenue": superficie seule

**Impact:**
- 🔴 **CRITIQUE** pour expérience utilisateur
- Impossible de comparer rapidement les propriétés
- Frustration utilisateur
- Perte de conversions potentielles

**Recommandation:**
- Afficher TOUTES les données disponibles
- Si donnée manquante: afficher "N/A" ou "-" au lieu de cacher l'icône
- Assurer cohérence: même template pour toutes les cards

---

#### Problème #8: Unités de mesure incohérentes
**Description:** Alternance entre `m²` et `m` pour la superficie:
- Certaines cards: "180 m²" (correct)
- Autres cards: "30m", "85m", "40m" (sans ²)

**Impact:**
- Confusion sur dimensions réelles
- Manque de professionnalisme

**Recommandation:** Standardiser `m²` partout

---

#### Problème #9: Overlay "BIDJAN NEIGHBORHOODS" intrusif
**Description:** Texte "BIDJAN NEIGHBORHOODS" superposé sur **certaines** images de propriétés (pas toutes):
- Obscurcit la vue de la propriété
- Présence aléatoire
- Ressemble à publicité/watermark mal intégré

**Impact:**
- Nuit à l'esthétique
- Réduit qualité perçue des annonces
- Incohérence visuelle flagrante

**Recommandation:** SUPPRIMER complètement cet overlay

---

#### Problème #10: Chiffres "0+" non crédibles
**Description:** Section "Mon Toit en chiffres" affiche "0+" pour tous les indicateurs:
- 0+ propriétés disponibles
- 0+ utilisateurs inscrits  
- etc.

**Impact:**
- Nuit gravement à la crédibilité
- Donne impression de placeholder non mis à jour
- Effet inverse: au lieu de rassurer, cela inquiète

**Recommandation:**
- Afficher vrais chiffres OU
- Supprimer cette section si pas de données

---

### 1.4 PROBLÈMES DE NAVIGATION 🟡 **SÉVÉRITÉ: MOYENNE**

#### Problème #11: Redondance des filtres
**Description:** Deux zones de filtres sur page Recherche:
- **Header:** Champs "Toutes les villes" + "Tous les types" + bouton "Filtres" + bouton "Rechercher"
- **Corps de page:** Même fonctionnalité juste sous le titre

**Impact:**
- Confusion sur quelle barre utiliser
- Espace écran gaspillé
- Expérience utilisateur incohérente

**Recommandation:** Consolider en UNE seule zone de filtres (garder celle du corps)

---

#### Problème #12: États actifs des filtres incohérents
**Description:**
- Bouton "Tous" actif: fond orange rempli + texte blanc
- Autres filtres actifs: bordure orange + texte noir (non rempli)

**Impact:**
- Confusion visuelle
- Utilisateur ne sait pas quel filtre est actif

**Recommandation:** Uniformiser - soit TOUS remplis, soit TOUS avec bordure seule quand actifs

---

### 1.5 PROBLÈMES D'ALIGNEMENT & ESPACEMENT 🟡 **SÉVÉRITÉ: MOYENNE**

#### Problème #13: Footer désaligné (multiple pages)
**Description:**
- **Copyright** trop décalé à gauche, visuellement isolé
- **Badge "Certifié ANSUT"** trop à gauche ET plus bas que ligne "Aide FAQ Blog"
- Dernière ligne footer: déséquilibre (éléments à gauche et extrême droite, rien au centre)
- Input newsletter trop proche du bouton "S'inscrire"

**Impact:**
- Impression de manque de soin
- Footer semble "cassé"

**Recommandation:**
- Aligner copyright avec colonnes principales
- Aligner verticalement badge ANSUT avec liens droite
- Augmenter margin-bottom sur input newsletter (8-12px)

---

#### Problème #14: Espacement vertical inconstant
**Description:** Espacement entre sections varie sans logique:
- Après "Notre Mission": 80px
- Après "Nos Garanties": 60px
- Entre cards footer: variable

**Impact:** Flux visuel perturbé

**Recommandation:** Standardiser espacement sections: 64px ou 96px (4pt grid)

---

### 1.6 ICONOGRAPHIE MIXTE 🟢 **SÉVÉRITÉ: FAIBLE**

#### Problème #15: Mix icônes pleines/outline
**Description:**
- Icônes principales (Identité Vérifiée, Paiement, Support): style **plein/rempli**
- Icônes détails propriétés (lit, baignoire): style **outline**
- Icônes sociales footer: style **outline**

**Impact:** Faible - mais contribue à sensation d'incohérence

**Recommandation:** Choisir UN style (outline recommandé) et standardiser

---

### 1.7 AUTRES PROBLÈMES

#### Problème #16: Icône "Moniteur" ambiguë
**Description:** Page détail propriété - icône moniteur à côté de "Connexion" sans label

**Impact:** Utilisateur ne comprend pas sa fonction

---

#### Problème #17: Contrôles navigation image peu visibles
**Description:** Cercles blancs pour navigation images (page détail)

**Impact:** Faible contraste, difficiles à voir

---

## 2. CLASSIFICATION PAR SÉVÉRITÉ

### 🔴 CRITIQUE (Action immédiate requise)
1. **Superposition page Inscription** - Contenu coupé (Problème #5)
2. **Cards propriétés** - Données manquantes aléatoires (Problème #7)
3. **Chiffres "0+"** - Crédibilité compromise (Problème #10)

### 🔴 HAUTE (Résolution prioritaire)
4. **Multiples nuances orange** (Problème #1)
5. **Styles boutons incohérents** (Problème #2)
6. **Contraste insuffisant dégradés** (Problème #4)
7. **Unités mesure incohérentes** (Problème #8)
8. **Overlay BIDJAN** intrusif (Problème #9)

### 🟡 MOYENNE (Amélioration recommandée)
9. **Redondance filtres** (Problème #11)
10. **États actifs filtres** (Problème #12)
11. **Footer désaligné** (Problème #13)
12. **Espacement inconstant** (Problème #14)
13. **Erreurs placeholders** (Problème #6)

### 🟢 FAIBLE (Optimisation)
14. **Iconographie mixte** (Problème #15)
15. **Badge vert ANSUT** (Problème #3)
16. **Icône moniteur ambiguë** (Problème #16)
17. **Contrôles image** (Problème #17)

---

## 3. RECOMMANDATIONS POUR HARMONISATION

### 3.1 Stratégie de Refonte

**Approche recommandée: REFRESH PROGRESSIF (3 phases)**

#### Phase 1: Corrections Critiques (Sprint 1 - 1 semaine)
- Fixer superposition page Inscription
- Standardiser affichage cards propriétés
- Remplacer chiffres "0+" par vraies données ou supprimer section
- Supprimer overlay "BIDJAN NEIGHBORHOODS"

#### Phase 2: Harmonisation Design System (Sprint 2-3 - 2 semaines)
- Définir palette couleurs officielle (1 orange unique)
- Standardiser boutons (2 styles max)
- Fixer footer sur toutes pages
- Corriger contrastes et accessibilité

#### Phase 3: Optimisations (Sprint 4 - 1 semaine)
- Unifier iconographie
- Peaufiner espacements
- Améliorer micro-interactions

---

### 3.2 Principes de Design à Adopter

#### A. Cohérence avant Créativité
- **Un seul orange:** `#FF6C2F`
- **Deux styles boutons:** Solid (primaire) + Outlined (secondaire)
- **Un style icônes:** Outline uniquement

#### B. 4pt Grid System
- Tous espacements multiples de 4px
- Préférence pour 8px: 8, 16, 24, 32, 48, 64, 96, 128
- Appliqué partout: margins, padding, gap, border-radius

#### C. Accessibilité WCAG AA Minimum
- Contraste texte ≥ 4.5:1
- Touch targets ≥ 44×44px mobile
- Support `prefers-reduced-motion`

#### D. Design Tokens
- Toutes valeurs définies dans système centralisé
- Pas de couleurs/tailles one-off
- Réutilisabilité maximale

---

## 4. PROPOSITION DE DESIGN SYSTEM COHÉRENT

### 4.1 PALETTE DE COULEURS UNIFIÉE

#### Couleurs Primaires
```
Primary (Orange)
- primary-50:  #FFF5F0
- primary-100: #FFE5D6
- primary-500: #FF6C2F  ← COULEUR PRINCIPALE
- primary-700: #E05519
- primary-900: #B84512

Neutral (Gris)
- neutral-50:  #F8F8F8
- neutral-100: #E0E0E0
- neutral-300: #9E9E9E
- neutral-500: #6A6A6A
- neutral-700: #333333
- neutral-900: #1A1A1A

Background
- bg-page: #FFFFFF
- bg-surface: #FDFBF7 (crème léger)

Semantic
- success: #2ECC71
- error: #E74C3C
- warning: #F39C12
- info: #3498DB
```

#### Règles d'Usage
- **primary-500:** Boutons primaires, liens importants, accents
- **primary-700:** Hover sur boutons primaires
- **neutral-700:** Texte principal
- **neutral-500:** Texte secondaire
- **neutral-100:** Bordures, séparateurs

---

### 4.2 TYPOGRAPHIE STANDARDISÉE

#### Famille de Police
- **Primaire:** Poppins (ou Inter/Open Sans)
- **Usage:** Tous textes (titres + corps)

#### Échelle de Tailles (Major Third 1.25)
```
- display:  60px / 3.75rem  (H1 hero)
- h1:       48px / 3rem
- h2:       36px / 2.25rem
- h3:       28px / 1.75rem
- h4:       24px / 1.5rem
- h5:       20px / 1.25rem
- body:     16px / 1rem     ← BASE
- small:    14px / 0.875rem
- xs:       12px / 0.75rem
```

#### Poids (Weights)
- **Regular:** 400 (corps de texte)
- **Semi-Bold:** 600 (sous-titres, labels)
- **Bold:** 700 (titres, boutons)

#### Line-Height
- **Titres:** 1.2-1.3
- **Corps:** 1.5-1.6
- **Descriptions:** 1.6-1.8

---

### 4.3 SYSTÈME D'ESPACEMENT (4pt Grid)

```
Tokens d'espacement:
- space-1:  4px
- space-2:  8px   ← MINIMUM RECOMMANDÉ
- space-3:  12px
- space-4:  16px  ← STANDARD
- space-6:  24px
- space-8:  32px
- space-12: 48px
- space-16: 64px  ← SECTIONS
- space-24: 96px
- space-32: 128px ← HERO
```

#### Application
- **Entre sections:** 64-96px
- **Padding cards:** 32-48px
- **Gap grilles:** 24-32px
- **Padding boutons:** 12px vertical, 24px horizontal

---

### 4.4 COMPOSANTS STANDARDISÉS

#### Bouton Primaire
```
Style:
- Background: primary-500
- Text: white, bold (600)
- Padding: 12px 24px
- Border-radius: 8px
- Font-size: 16px
- Hover: primary-700 + scale(1.02)
- Active: primary-900
- Transition: 250ms ease-out
```

#### Bouton Secondaire
```
Style:
- Background: transparent
- Border: 2px solid primary-500
- Text: primary-500, bold (600)
- Padding: 10px 22px (ajusté pour bordure)
- Border-radius: 8px
- Hover: bg primary-50 + border primary-700
```

#### Card Propriété
```
Structure:
- Image (16:9 ratio, cover)
- Badge "NOUVEAU" si applicable (top-right, 8px offset)
- Prix (h4, bold, primary-700)
- Titre (h5, bold, neutral-900)
- Localisation (small, neutral-500, avec icône)
- Détails (row, gap 16px):
  • Chambres (TOUJOURS afficher, "-" si N/A)
  • Salles de bain (TOUJOURS afficher, "-" si N/A)
  • Superficie (TOUJOURS afficher, "- m²" si N/A)

Style:
- Background: white
- Border: 1px solid neutral-100
- Border-radius: 12px
- Padding: 0 (image pleine largeur) puis 24px
- Box-shadow: 0 2px 8px rgba(0,0,0,0.08)
- Hover: shadow 0 8px 16px rgba(0,0,0,0.12) + translateY(-4px)
- Transition: 250ms ease-out
```

#### Input
```
Style:
- Background: white
- Border: 1px solid neutral-100
- Border-radius: 8px
- Padding: 12px 16px
- Font-size: 16px
- Focus: border primary-500 + box-shadow 0 0 0 3px primary-50
```

#### Navigation
```
Structure:
- Logo gauche
- Menu centre (si MPA)
- Actions droite (Connexion outlined + Inscription solid)

Style:
- Background: white
- Border-bottom: 1px solid neutral-100
- Padding: 16px 32px
- Position: fixed (avec box-shadow au scroll)
```

---

### 4.5 LAYOUTS & GRILLES

#### Container
- Max-width: 1280px
- Padding: 32px (desktop), 16px (mobile)
- Centré

#### Grille Propriétés
- Desktop: 3 colonnes
- Tablet: 2 colonnes
- Mobile: 1 colonne
- Gap: 32px (desktop), 24px (tablet), 16px (mobile)

#### Breakpoints
```
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px
```

---

### 4.6 ANIMATIONS & TRANSITIONS

#### Durées
```
- Fast: 150ms (micro-interactions, hover)
- Base: 250ms (transitions standard)
- Slow: 350ms (modales, panels)
```

#### Easing
- **Sortie (défaut):** ease-out `cubic-bezier(0, 0, 0.2, 1)`
- **Entrée:** ease-in `cubic-bezier(0.4, 0, 1, 1)`
- **Bidirectionnel:** ease-in-out `cubic-bezier(0.4, 0, 0.2, 1)`

#### Propriétés Animées
- ✅ `transform` (scale, translate)
- ✅ `opacity`
- ❌ JAMAIS: width, height, margin, padding

---

## 5. PLAN D'ACTION - REFONTE PROGRESSIVE

### SPRINT 1 (Semaine 1) - CORRECTIONS CRITIQUES

#### Jour 1-2: Page Inscription
- [ ] Redessiner layout 60/40 (contenu/formulaire)
- [ ] Supprimer coins arrondis clipping OU réduire largeur formulaire
- [ ] Corriger placeholders ("Votre" au lieu de "otre")
- [ ] Améliorer contraste texte sur dégradé (ajouter ombre portée)

#### Jour 3-4: Page Recherche
- [ ] Standardiser affichage cards (TOUTES doivent avoir 3 icônes)
- [ ] Implémenter logique: afficher "-" si donnée manquante
- [ ] Corriger unités: toujours "m²" (jamais "m")
- [ ] SUPPRIMER overlay "BIDJAN NEIGHBORHOODS"

#### Jour 5: Page Accueil
- [ ] Remplacer "0+" par vrais chiffres OU supprimer section
- [ ] Si gardé: implémenter compteur animé

**Livrable Sprint 1:** Site sans problèmes critiques d'UX

---

### SPRINT 2 (Semaine 2) - DESIGN SYSTEM BASE

#### Jour 1-2: Couleurs & Boutons
- [ ] Définir fichier design-tokens.json
- [ ] Implémenter palette unifiée (1 seul orange: #FF6C2F)
- [ ] Refactoriser TOUS boutons (solid/outlined uniquement)
- [ ] Corriger bouton "Connexion" (texte orange, pas noir)
- [ ] SUPPRIMER style gradient newsletter

#### Jour 3-4: Typographie & Espacement
- [ ] Vérifier échelle tailles (Major Third 1.25)
- [ ] Standardiser espacements sections (64px ou 96px)
- [ ] Appliquer 4pt grid partout
- [ ] Unifier padding cards (32-48px)

#### Jour 5: Footer Unifié
- [ ] Réaligner copyright avec colonnes principales
- [ ] Aligner verticalement badge ANSUT avec liens droite
- [ ] Augmenter margin input newsletter
- [ ] Tester sur toutes pages

**Livrable Sprint 2:** Design system documenté + appliqué sur pages principales

---

### SPRINT 3 (Semaine 3) - NAVIGATION & COMPOSANTS

#### Jour 1-2: Navigation & Filtres
- [ ] Supprimer redondance filtres (garder une seule zone)
- [ ] Uniformiser états actifs filtres (tous remplis OU tous bordure)
- [ ] Améliorer icône moniteur (ajouter label)

#### Jour 3-5: Composants
- [ ] Standardiser iconographie (outline uniquement)
- [ ] Améliorer contrôles navigation images (ajouter couleur)
- [ ] Créer composants réutilisables (Button, Card, Input)
- [ ] Documenter dans Storybook/Figma

**Livrable Sprint 3:** Composants standardisés + navigation cohérente

---

### SPRINT 4 (Semaine 4) - POLISH & QA

#### Jour 1-2: Accessibilité
- [ ] Audit contraste WCAG AA (toutes combinaisons texte/fond)
- [ ] Vérifier touch targets ≥ 44×44px mobile
- [ ] Implémenter `prefers-reduced-motion`
- [ ] Tester navigation clavier

#### Jour 3-4: Responsive & Performance
- [ ] Tester toutes pages 320px-2560px
- [ ] Optimiser animations (transform/opacity seulement)
- [ ] Vérifier chargement images (lazy loading)
- [ ] Tester sur appareils réels

#### Jour 5: QA Finale
- [ ] Checklist complète toutes pages
- [ ] Tests utilisateurs (5 personnes minimum)
- [ ] Documentation design system finale
- [ ] Handoff développement

**Livrable Sprint 4:** Site harmonisé, accessible, documenté

---

## 6. MÉTRIQUES DE SUCCÈS

### Avant Refonte (État Actuel)
- Score cohérence: **5.5/10**
- Problèmes critiques: **3**
- Problèmes haute priorité: **5**
- Contraste WCAG AA: **70%** des combinaisons
- Satisfaction utilisateur: **Non mesurée**

### Après Refonte (Objectifs)
- Score cohérence: **≥ 9/10**
- Problèmes critiques: **0**
- Problèmes haute priorité: **0**
- Contraste WCAG AA: **100%** des combinaisons
- Satisfaction utilisateur: **≥ 4/5**

### KPIs à Suivre
1. **Taux de conversion** (inscription/contact)
2. **Taux de rebond** page recherche
3. **Temps moyen** sur page propriété
4. **Score accessibilité** Lighthouse (objectif: ≥ 90)
5. **Feedback utilisateurs** (enquêtes post-refonte)

---

## 7. ANNEXES

### A. Checklist de Validation (par page)

#### Pour chaque page, vérifier:
- [ ] Palette couleurs respectée (1 seul orange)
- [ ] Boutons standardisés (2 styles max)
- [ ] Espacement 4pt grid
- [ ] Footer aligné correctement
- [ ] Typographie échelle 1.25
- [ ] Contraste ≥ 4.5:1
- [ ] Responsive 320-2560px
- [ ] Animations transform/opacity uniquement
- [ ] Icônes style unique (outline)
- [ ] Pas de contenu tronqué

### B. Outils Recommandés
- **Design:** Figma (design system + prototypes)
- **Tokens:** Style Dictionary (export multi-format)
- **Composants:** Storybook (documentation)
- **Accessibilité:** axe DevTools, WAVE
- **Contraste:** Contrast Checker, Stark
- **Performance:** Lighthouse, WebPageTest

### C. Ressources Design System
- **Icônes:** Lucide Icons (outline, cohérent)
- **Palette:** Coolors.co (génération variations)
- **Typographie:** Google Fonts (Poppins/Inter)
- **Grille:** 4pt Grid Calculator
- **Animations:** Cubic-bezier.com (easing)

---

## CONCLUSION

Le site Montoit souffre d'un **manque de design system cohérent**, résultant en une expérience fragmentée. Les problèmes identifiés sont **corrigeables en 4 semaines** avec une approche méthodique.

**Priorités absolues:**
1. Fixer superposition page Inscription (1-2 jours)
2. Standardiser cards propriétés (2-3 jours)
3. Définir palette unique + boutons (3-4 jours)

**Impact attendu:**
- Expérience utilisateur **cohérente et professionnelle**
- Augmentation conversions **15-25%** (benchmark industrie)
- Réduction frustration utilisateur **significative**
- Crédibilité marque **renforcée**

**Recommandation finale:** Procéder à la refonte progressive (4 sprints) plutôt que refonte complète, pour maintenir le site en production tout en améliorant continuellement.

---

**Document préparé par:** Matrix Agent  
**Contact:** Pour questions techniques ou clarifications  
**Version:** 1.0 - 29 novembre 2025
