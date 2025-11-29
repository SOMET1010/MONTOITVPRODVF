# Analyse des Services Externes - Mon Toit

## Vue d'ensemble
Site analysé : https://somet1010-montoit-st-jcvj.bolt.host  
Plateforme de location immobilière en Côte d'Ivoire  
Date d'analyse : 29 novembre 2025

## Services Externes Identifiés

### 1. **Supabase** - Base de données et backend
**Utilisation** : Base de données principale, authentification, stockage
- **URL** : `https://muiidvzmpcmcmrxuwtqt.supabase.co`
- **Clé API** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aWlkdnptcGNtY21yeHV3dHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNDQzMDgsImV4cCI6MjA3OTYyMDMwOH0.WURqe9zpb_hSZyJrHOXswxEkByungk_U1fYGeqfLJag`
- **Fonctionnalités** :
  - Authentification utilisateur
  - Base de données des profils
  - Gestion des sessions
  - API REST
- **Endpoints identifiés** :
  - Base principale : `muiidvzmpcmcmrxuwtqt.supabase.co`
  - Fonction Edge : `/functions/v1/ai-chatbot`

### 2. **Mapbox** - Services de cartographie
**Utilisation** : Géolocalisation et cartes
- **URL de préconnexion** : `https://api.mapbox.com`
- **Fonctionnalités** :
  - DNS prefetch configuré
  - Préconnexion pour optimiser le chargement
  - Probablement utilisé pour l'autocomplétion d'adresses dans les champs de recherche

### 3. **Bolt Host** - Hébergement
**Utilisation** : Hébergement de l'application
- **Badge de service** : `https://bolt.new/badge.js?s=edcd5dc9-a2fa-4e9f-905b-4b5700827f14`
- **Fonctionnalités** :
  - Hébergement de l'application React
  - CDN pour les assets statiques
  - Service Worker enregistré

### 4. **Réseaux Sociaux** - Intégrations de partage
**Références identifiées** dans le code :
- **Facebook** : Meta tags Open Graph configurés
- **Twitter** : Cards Twitter configurées
- **LinkedIn/Linkedin** : Métadonnées pour le partage

### 5. **Analytics et Monitoring**
**Références identifiées** :
- **Analytics** : Système d'analyse de trafic intégré
- **Azure** : Références à des services Azure (configuration probable)

### 6. **Services de Communication**
**Références identifiées** :
- **Resend** : Service d'envoi d'emails (référencé dans le code)

## Services Non Détectés

### Services Potentiellement Absents ou Non Configurés
- **Stripe** : Aucun code de paiement Stripe détecté
- **PayPal** : Aucun appel PayPal détecté
- **Google Analytics** : Aucun gtag ou Google Analytics détecté
- **Google APIs** : Pas de références Google API dans le code principal
- **Brevo** : Pas de références Brevo détectées
- **NeoFace** : Pas de références aux services de reconnaissance faciale
- **InTouch** : Pas de références aux services de communication client
- **AWS Services** : Aucun service AWS détecté
- **Socket.io** : Pas de WebSocket en temps réel détecté

## Architecture Technique Identifiée

### Frontend
- **Framework** : React (avec Vite)
- **Styling** : Tailwind CSS
- **Build Tool** : Vite avec modules ES
- **Routing** : React Router

### Backend as a Service
- **Supabase** : Remplace un backend traditionnel
- **Database** : PostgreSQL via Supabase
- **Auth** : Authentification Supabase
- **Storage** : Stockage fichiers via Supabase

### Fonctionnalités de l'Application
1. **Authentification** : Système complet de connexion/inscription
2. **Recherche de propriétés** : avec géolocalisation probable
3. **Profils utilisateurs** : gestion des rôles (locataire, propriétaire, agence, admin)
4. **Système de candidatures** : pour les demandes de location
5. **Visites et planification** : gestion des visites
6. **Messages** : système de messagerie
7. **Contrats et paiements** : gestion des baux
8. **Vérification d'identité** : système ANSUT intégré
9. **Maintenance** : gestion des demandes de maintenance
10. **Analytics** : tableau de bord d'analyse

## Sécurité et Conformité

### Points Positifs
- Service Worker registrado pour le cache
- HTTPS sur toutes les communications
- Clé API Supabase configurée (niveau anon)

### Recommandations
- Rotation des clés API recommandée
- Monitoring des endpoints Supabase
- Validation des intégrations cartographiques

## Résumé Exécutif

La plateforme Mon Toit utilise principalement **Supabase** comme backend-as-a-service, avec des intégrations **Mapbox** pour la géolocalisation et des configurations pour les réseaux sociaux. L'architecture est moderne et basée sur React/Supabase, ce qui offre une scalabilité et une maintenabilité bonnes. Les services de paiement ne sont pas directement visibles, suggérant une intégration future ou une utilisation de services locaux pour les paiements mobiles en Côte d'Ivoire.