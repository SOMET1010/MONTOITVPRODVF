# Documentation Technique - Plateforme Mon Toit

**Date d'analyse :** 29 novembre 2025  
**URL de base :** https://somet1010-montoit-st-jcvj.bolt.host

## 🏗️ Architecture des URLs

### Routes Publiques
```
GET /                              → Page d'accueil
GET /recherche                     → Résultats de recherche
GET /connexion                     → Page de connexion
GET /inscription                   → Page d'inscription
```

### Routes Protégées (Redirection)
```
GET /dashboard                     → Redirection vers /recherche
GET /dashboard/ajouter-propriete   → Spinner → Redirection vers /
GET /proprietes/{id}               → Redirection vers / (pour la plupart)
```

### Routes Additionnelles Identifiées
```
/a-propos                          → À propos
/comment-ca-marche                 → Comment ça marche
/contact                           → Contact
/conditions-utilisation            → CGU
/politique-confidentialite         → Politique de confidentialité
/mentions-legales                  → Mentions légales
/cgv                               → Conditions générales de vente
/aide                              → Aide
/faq                               → FAQ
/blog                              → Blog
```

## 🔐 Système d'Authentification

### Méthodes de Connexion
1. **Email + Mot de passe** (défaut)
2. **Téléphone + OTP** (authentification par SMS)

### Méthodes de Vérification d'Inscription
1. **Email** (défaut)
2. **SMS**
3. **WhatsApp**

### Validation des Mots de Passe
```
- Minimum 8 caractères ✓
- Au moins une majuscule ✓
- Au moins une minuscule ✓
- Au moins un chiffre ✓
- Au moins un caractère spécial ✓
```

## 🎯 Structure des Données Propriétés

### Format d'URL des Propriétés
```
/proprietes/{uuid}
Ex: /proprietes/b7cf8ce6-e102-456c-8bfb-2a3da9c31c05
```

### Informations Affichées (Public)
```
- Titre : Type + Localisation
- Prix : X FCFA/mois
- Statut : NOUVEAU (badge)
- Localisation précise : Ville, Quartier
- Caractéristiques : 🛏️ X ch, 🚿 X sdb, 📐 X m²
- Image principale de qualité
```

### Filtres Disponibles
```
Villes : Toutes les villes, Abidjan, Yamoussoukro, Bouaké, Daloa, San-Pédro, 
         Korhogo, Man, Gagnoa, Divo, Abengourou, Grand-Bassam

Types : Tous les types, Appartement, Maison, Villa, Studio, Duplex
```

## 📊 Statistiques de la Plateforme

### Données Publiques
```
- 31 propriétés au total
- Nouvelle plateforme (tag)
- 3 villes couvertes
- Certification ANSUT active
```

### Couverture Géographique
```
Principales villes identifiées :
- Abidjan (tous quartiers : Cocody, Plateau, Marcory, Yopougon, etc.)
- Yamoussoukro
- Bouaké
- Daloa
- San-Pédro
- Korhogo
- Man
- Gagnoa
- Divo
- Abengourou
- Grand-Bassam
```

## 🛡️ Mécanismes de Sécurité Observés

### Protection des Routes
1. **Redirection automatique** sans message d'erreur
2. **Spinner de chargement** avant redirection
3. **Navigation silencieuse** pour contenu protégé

### Authentification Contextuelle
```
Non connecté :
- Boutons "Connexion" et "Inscription" visibles
- Accès limité au contenu public

Connecté (inféré) :
- Bouton profil/utilisateur
- Accès aux fonctionnalités personnalisées
- Gestion des favoris et contacts
```

## 🎨 Éléments d'Interface Identifiés

### Composants Réutilisables
```
- Header avec navigation persistante
- Badges de statut ("NOUVEAU")
- Cartes de propriétés standardisées
- Filtres de recherche avancés
- Panneaux d'information (statistiques, fonctionnalités)
- Carrousel d'images promotionnelles
```

### Icônes Utilisées
```
🛏️ = Chambres
🚿 = Salles de bain  
📐 = Superficie
🏠 = Logo/Accueil
🔍 = Recherche
👤 = Profil/Connexion
📱 = Téléphone/Mobile
```

## 🔄 Comportements de Navigation

### Breadcrumbs
```
Exemple : Accueil > Recherche > Appartement Duplex Abobo Gare
```

### Boutons d'Action Standards
```
- Retour (navigation historique)
- Rechercher (exécution de recherche)
- Filtres (options avancées)
- Connexion (authentification)
- Inscription (création de compte)
```

## 📱 Fonctionnalités Mobile-First

### Indicateurs Observés
- Sélecteur de pays automatique (+225 pour Côte d'Ivoire)
- Interface responsive
- Boutons optimisés pour tactile
- Navigation mobile-friendly

## 🚦 Codes de Statut et Redirections

### Patterns de Redirection Identifiés
```
200 : Page accessible (accueil, recherche, connexion, inscription)
302 : Redirection silencieuse (/dashboard → /recherche)
302 : Redirection avec délai (/dashboard/ajouter-propriete → /)
302 : Redirection stricte (pages de détail → /)
```

## 🔍 Éléments de Confiance

### Certifications et Badges
```
- Plateforme certifiée ANSUT
- Badge "100% Sécurisé"
- Mentions de sécurité et protection des données
- Paiements mobiles sécurisés
- Identité vérifiée
```

### Informations Légales Disponibles
```
- Conditions d'utilisation
- Politique de confidentialité
- Mentions légales
- CGV
- Contact et support (Aide, FAQ)
```

---
*Documentation technique générée par MiniMax Agent - 29 novembre 2025*