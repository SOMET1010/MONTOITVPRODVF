# Analyse des API Calls et Services Tiers

## 🔌 API Calls Identifiés

### Supabase (Backend Principal)
**URL Base**: `https://muiidvzmpcmcmrxuwtqt.supabase.co`

#### Services Supabase Détectés:
1. **Auth API** (`/auth/v1/`)
   - Endpoints probables : `/token`, `/signup`, `/signin`, `/session`
   - Gestion de l'authentification utilisateur

2. **Database API** (`/rest/v1/`)
   - Tables identifiées : `profiles`, `properties`
   - Requêtes CRUD pour les données immobilières

3. **Storage API** (`/storage/v1/`)
   - Gestion des fichiers (images de propriétés, documents)

4. **Realtime API** (`/realtime/v1/`)
   - Mises à jour en temps réel des listings

### Mapbox (Géolocalisation)
**URL Base**: `https://api.mapbox.com`

#### Fonctionnalités Mapbox:
- Géocodage des adresses
- Affichage des cartes interactives
- Calcul d'itinéraires
- Géolocalisation des propriétés

### Configuration Technique

#### Headers Identifiés:
```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Configuration Supabase:
- **URL**: `https://muiidvzmpcmcmrxuwtqt.supabase.co`
- **Clé Anon**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aWlkdnptcGNtY21yeHV3dHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNDQzMDgsImV4cCI6MjA3OTYyMDMwOH0.WURqe9zpb_hSZyJrHOXswxEkByungk_U1fYGeqfLJag`

## 📡 Types de Requêtes Attendues

### 1. Authentification
- POST `/auth/v1/signup` - Inscription utilisateur
- POST `/auth/v1/token?grant_type=password` - Connexion
- POST `/auth/v1/token?grant_type=refresh_token` - Renouvellement token
- GET `/auth/v1/user` - Récupération profil utilisateur

### 2. Propriétés
- GET `/rest/v1/properties` - Liste des propriétés
- GET `/rest/v1/properties?select=*&limit=6` - Propriétés en vedette
- GET `/rest/v1/properties?id=eq.{property_id}` - Détail propriété

### 3. Profils Utilisateur
- GET `/rest/v1/profiles` - Profils utilisateurs
- POST `/rest/v1/profiles` - Création profil
- PUT `/rest/v1/profiles?id=eq.{user_id}` - Mise à jour profil

### 4. Recherche
- GET avec filtres de géolocalisation (Mapbox)
- Requêtes combinées Supabase + Mapbox

## 🛡️ Sécurité

### Authentification
- Tokens JWT pour l'authentification
- Session persistante configurée
- Auto-refresh des tokens activé

### Base de Données
- Row Level Security (RLS) recommandé sur Supabase
- Migrations nécessaires pour la structure

### API Keys
- Clé Supabase exposée côté client (normal pour Supabase)
- Pas de clés Mapbox visibles (chargement dynamique probable)

## 📊 État des Connexions

### Status Supabase
- ✅ URL accessible
- ✅ Clé API valide
- ⚠️ Migrations de base de données nécessaires
- ⚠️ Vérification des permissions requise

### Status Mapbox
- ✅ Préconnexions configurées
- ✅ DNS prefetch en place
- ⚠️ Configuration des clés API à vérifier

### Status Général
- ✅ Service Worker fonctionnel
- ✅ Analytics actif
- ✅ Performance monitoring en place
- ⚠️ Erreur JavaScript à résoudre