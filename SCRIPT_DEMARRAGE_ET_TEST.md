# Script de Démarrage et Test - MonToit Platform

## 🚀 Commandes de Démarrage Rapides

### 1. Installation des Dépendances
```bash
npm install
# ou si vous utilisez pnpm
pnpm install
# ou avec yarn
yarn install
```

### 2. Démarrage du Serveur de Développement
```bash
npm run dev
# ou directement
npx vite
```

**URL de développement :** `http://localhost:5173`

### 3. Vérifications de Base
```bash
# Vérification TypeScript
npm run typecheck

# Linting du code
npm run lint

# Build de test
npm run build:standard
```

## 📋 Tests des 4 Phases

### Phase 1 - Dashboards (Propriétaire, Agence, Locataire, Admin, Trust)
- **URLs à tester :**
  - `/dashboard/owner` → Dashboard propriétaire
  - `/dashboard/agency` → Dashboard agence  
  - `/dashboard/tenant` → Dashboard locataire
  - `/dashboard/admin` → Dashboard administrateur
  - `/dashboard/trust` → Dashboard trust

**Points à vérifier :**
- [ ] Navigation entre dashboards
- [ ] Affichage des données
- [ ] Composants layout (Header, Footer)
- [ ] Réactivité mobile

### Phase 2 - Services IA et Analytics
- **Composants à tester :**
  - Services Azure AI
  - Détection de fraude
  - Analytics dashboard
  - Notifications
  - Chatbot

**Points à vérifier :**
- [ ] Intégration Azure AI
- [ ] Calculs analytics
- [ ] Système de notifications
- [ ] Performance des services

### Phase 3 - Contrats et Paiements
- **Fonctionnalités à tester :**
  - Génération PDF contrats
  - Templates contrats
  - Intégration Stripe
  - Validation données

**Points à vérifier :**
- [ ] Création de contrats
- [ ] Génération PDF
- [ ] Processus paiement
- [ ] Validation côté serveur

### Phase 4 - Système Candidatures
- **Interface à tester :**
  - `/applications` → Liste candidatures
  - Formulaire multi-étapes (3 étapes)
  - Upload documents
  - Notifications

**Points à vérifier :**
- [ ] Formulaire 3 étapes
- [ ] Upload fichiers
- [ ] Sauvegarde auto
- [ ] Validation complète

## 🔍 Tests Techniques Avancés

### Tests Automatisés
```bash
# Lancer tous les tests
npm test

# Tests avec interface
npm run test:ui

# Tests avec coverage
npm run test:coverage
```

### Vérification Performance
```bash
# Build avec analyse
npm run build:analyze

# Preview du build
npm run preview
```

## ✅ Checklist de Validation

### Interface Utilisateur
- [ ] Toutes les pages se chargent
- [ ] Navigation fluide
- [ ] Design responsive
- [ ] Pas d'erreurs console
- [ ] Performance acceptable

### Fonctionnalités Métier
- [ ] Dashboards fonctionnels
- [ ] Services IA opérationnels
- [ ] Gestion contrats
- [ ] Système candidatures

### Technique
- [ ] TypeScript sans erreurs
- [ ] Tests passés
- [ ] Build réussi
- [ ] Linting clean

## 🚨 Signaux d'Alerte

**À surveiller :**
- Erreurs dans la console navigateur
- Temps de chargement > 3s
- Erreurs TypeScript
- Tests qui échouent
- Build qui échoue

## 📞 Commandes de Debug

```bash
# Debug mode
VITE_DEBUG=true npm run dev

# Logs détaillés
DEBUG=vite:* npm run dev

# Analyse des dépendances
npx vite-bundle-analyzer
```

---

**Script créé le :** 2025-12-01 05:30:09
**Version :** MonToit Platform v3.2.2