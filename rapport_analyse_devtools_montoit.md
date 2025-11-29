# Analyse des Outils Développeur - Mon Toit

**URL analysée :** https://somet1010-montoit-st-jcvj.bolt.host  
**Date d'analyse :** 29 novembre 2025  
**Type d'application :** Plateforme de location immobilière en Côte d'Ivoire

## 🎯 Résumé Exécutif

Cette analyse révèle une application web complexe basée sur React avec une architecture moderne utilisant Supabase comme backend principal. L'application présente plusieurs vulnérabilités de sécurité importantes liées à l'exposition de clés API et la gestion des tokens.

## 🔍 1. Analyse de l'onglet Network (XHR/Fetch)

### Endpoints Supabase Identifiés

**URL Principal Supabase :**
```
https://muiidvzmpcmcmrxuwtqt.supabase.co
```

**Edge Functions Supabase :**
```
https://muiidvzmpcmcmrxuwtqt.supabase.co/functions/v1/ai-chatbot
```

### Configuration API
- **Instance Supabase :** muiidvzmpcmcmrxuwtqt
- **Service Principal :** Base de données PostgreSQL avec Realtime
- **Edge Functions :** Fonction AI chatbot pour assistance utilisateur
- **Storage :** Supabase Storage pour fichiers médias

### Types d'appels API détectés
1. **Requêtes de base de données** - Opérations CRUD sur les profils utilisateurs
2. **Authentification** - Sessions et tokens JWT
3. **Realtime** - Mises à jour en temps réel des messages
4. **Storage** - Gestion des fichiers (logos, images de propriétés)
5. **Edge Functions** - Fonctionnalités IA intégrées

## 🔐 2. Analyse de l'onglet Application/Storage

### Tokens Supabase Stockés

**Clé API Supabase Anon (exposée) :**
```javascript
VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aWlkdnptcGNtY21yeHV3dHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNDQzMDgsImV4cCI6MjA3OTYyMDMwOH0.WURqe9zpb_hSZyJrHOXswxEkByungk_U1fYGeqfLJag"
```

**Décodage du JWT :**
```json
{
  "exp": 2079620308,
  "iat": 1764044308,
  "iss": "supabase",
  "ref": "muiidvzmpcmcmrxuwtqt",
  "role": "anon"
}
```

⚠️ **VULNÉRABILITÉ CRITIQUE :** La clé anon est exposée côté client

### Stockage Local/Session Storage

L'application utilise Zustand pour la gestion d'état avec persistance :
- Sessions utilisateur avec tokens JWT
- Profils utilisateurs avec données personnelles
- Préférences utilisateur (thème, langue)
- Cache de données pour optimisation performance

## 🔧 3. Analyse de l'onglet Sources (Fichiers JS)

### Structure des Fichiers JavaScript

**Fichier Principal :**
```
/assets/index-ccHG1TjW.js (475,935 bytes)
```

**Patterns de sécurité identifiés :**

1. **Clés API hardcodées :**
   ```javascript
   VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   VITE_SUPABASE_URL: "https://muiidvzmpcmcmrxuwtqt.supabase.co"
   ```

2. **Intégrations de services externes :**
   - **Mobile Money :** Orange Money, MTN Money, Wave, Moov
   - **IA/Azure :** Système d'assistance SUTA
   - **Notifications :** Service Worker pour notifications push

3. **Fonctionnalités de sécurité :**
   - Détection automatique d'arnaques immobilières
   - Système d'alertes sur les tentatives de fraude
   - Protection des données utilisateur

### Endpoints et APIs Externes

**Supabase Edge Function - AI Chatbot :**
- Endpoint : `/functions/v1/ai-chatbot`
- Authentification : Bearer token
- Utilisation : Assistant IA SUTA pour support utilisateur

## 📱 4. Analyse PWA (Progressive Web App)

### Manifest Configuration
```json
{
  "name": "Mon Toit - Plateforme Immobilière",
  "short_name": "Mon Toit",
  "theme_color": "#ea580c",
  "background_color": "#ffffff"
}
```

**Fonctionnalités PWA :**
- Installation comme app native
- Notifications push
- Mode hors-ligne basique
- Icônes adaptatives

## 🚨 Vulnérabilités de Sécurité Détectées

### Critique
1. **Exposition de clés API :** La clé Supabase anon est directement accessible dans le code client
2. **Tokens JWT :** Potentielle exposition de tokens d'authentification
3. **Configuration Supabase :** URL et configuration visibles publiquement

### Moyenne
1. **Service Worker :** Badge externe injecté par bolt.new
2. **Logs de console :** Messages de debug potentiellement informatifs pour attackers

### Faible
1. **Headers de sécurité :** Algunos headers de sécurité pourraient être renforcés
2. **CSP :** Content Security Policy pourrait être plus strict

## 🔧 Recommandations de Sécurisation

### Actions Immédiates
1. **Rotation des clés Supabase**
   ```bash
   # Régénérer les clés API
   # Mettre à jour la configuration
   ```

2. **Restriction RLS (Row Level Security)**
   - Implémenter des politiques Supabase strictes
   - Limiter les accès selon les rôles utilisateur

3. **Variables d'environnement**
   - Déplacer les clés dans des variables d'environnement
   - Utiliser un service de gestion des secrets

### Actions à Moyen Terme
1. **Implémentation CSP stricte**
2. **Audit des Edge Functions**
3. **Chiffrement des données sensibles**
4. **Monitoring des accès API**

## 📊 Métriques Techniques

- **Taille du bundle principal :** 475KB (minifié)
- **Framework :** React + TypeScript
- **State Management :** Zustand
- **Backend :** Supabase (PostgreSQL + Edge Functions)
- **Build Tool :** Vite
- **Déploiement :** Bolt.host

## 🎯 Conclusion

L'application Mon Toit présente une architecture moderne et fonctionnelle mais souffre de problèmes de sécurité critiques liés à l'exposition de clés API. La plateforme montre un engagement fort pour la sécurité utilisateur (détection d'arnaques, assistance IA) mais doit renforcer ses pratiques de développement sécurisé.

**Score de sécurité global : 6/10**
- Points positifs : Architecture moderne, fonctionnalités de sécurité utilisateur
- Points critiques : Exposition de clés API, configuration visible

---
*Analyse réalisée par MiniMax Agent - 29 novembre 2025*