# 🚀 COMMANDES DE DÉMARRAGE FINALES - MONTOIT

## ⚡ Démarrage Rapide (Recommandé pour Bolt)

### Option 1 : Démarrage avec npm (Dans Bolt)
```bash
# Dans votre terminal Bolt
npm install
npm run dev
```

**⚠️ Note :** Si vous rencontrez des erreurs npm, utilisez l'Option 2.

### Option 2 : Démarrage avec pnpm (Plus fiable)
```bash
# Dans votre terminal Bolt
npm install -g pnpm
pnpm install
pnpm dev
```

### Option 3 : Démarrage direct avec Vite
```bash
# Si npm échoue, utilisez directement npx
npx vite
```

## 🌐 URLs de Test après Démarrage

Une fois le serveur démarré (`http://localhost:5173`), testez ces URLs :

### Phase 1 - Dashboards
- `http://localhost:5173/dashboard/owner` → Dashboard propriétaire
- `http://localhost:5173/dashboard/agency` → Dashboard agence
- `http://localhost:5173/dashboard/tenant` → Dashboard locataire
- `http://localhost:5173/dashboard/admin` → Dashboard admin

### Phase 2 - Services IA
- `http://localhost:5173/dashboard/ai` → Services Azure AI
- `http://localhost:5173/dashboard/analytics` → Analytics

### Phase 3 - Contrats
- `http://localhost:5173/contracts` → Gestion contrats
- `http://localhost:5173/payments` → Paiements

### Phase 4 - Candidatures
- `http://localhost:5173/applications` → Système candidatures
- `http://localhost:5173/applications/new` → Nouveau dossier

## 🧪 Tests de Validation Rapides

### 1. Vérification TypeScript
```bash
npm run typecheck
```
**Résultat attendu :** Aucune erreur TypeScript

### 2. Linting
```bash
npm run lint
```
**Résultat attendu :** 0 erreurs ESLint

### 3. Build Test
```bash
npm run build:standard
```
**Résultat attendu :** Build réussi sans erreurs

## 🚨 Signaux d'Alerte à Surveiller

### Dans le Terminal
- **Erreurs rouges** : Problèmes critiques à corriger
- **Warnings npm** : Compatibilité version Node.js (non bloquant)
- **Build failed** : Code à corriger avant production

### Dans le Navigateur (F12 Console)
- **Erreurs JavaScript** : Bugs runtime détectés
- **Network errors** : Problèmes API
- **Performance warnings** : Optimisations nécessaires

## 📋 Checklist de Validation

### ✅ Test de Base
- [ ] Serveur démarre sans erreur
- [ ] Page d'accueil se charge
- [ ] Navigation fonctionne
- [ ] Aucune erreur console

### ✅ Test des 4 Phases
- [ ] Phase 1 : Dashboards accessibles
- [ ] Phase 2 : Services IA fonctionnels
- [ ] Phase 3 : Contrats et paiements
- [ ] Phase 4 : Candidatures opérationnelles

### ✅ Test Technique
- [ ] TypeScript clean
- [ ] Linting passed
- [ ] Build réussi
- [ ] Performance acceptable (< 3s)

## 🔧 Résolution de Problèmes

### Erreur npm install
```bash
# Solution 1 : Ignorer les scripts
npm install --ignore-scripts

# Solution 2 : Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Solution 3 : Utiliser pnpm
npm install -g pnpm
pnpm install
```

### Erreur Node.js version
```bash
# Si Node.js version < 20, utiliser :
npm install --legacy-peer-deps
```

### Erreur permission denied
```bash
# Utiliser npx directement
npx vite --host 0.0.0.0
```

## 📞 Commandes de Debug

### Debug Mode
```bash
DEBUG=vite:* npm run dev
```

### Analyse des dépendances
```bash
npm run build:analyze
```

### Tests avec coverage
```bash
npm run test:coverage
```

## 🎯 Prochaines Étapes après Test

1. **Si tout fonctionne** → Appliquer les corrections critiques de l'audit
2. **Si erreurs** → Consulter `CORRECTIONS_CRITIQUES_A_APPLIQUER.md`
3. **Performance lente** → Lire `GUIDE_OPTIMISATIONS_PERFORMANCE.md`
4. **Architecture** → Suivre `PLAN_RESTRUCTURATION_ARCHITECTURALE.md`

---

**Ces commandes sont optimisées pour Bolt et l'environnement de développement MonToit.**

**Créé le :** 2025-12-01 05:38:00  
**Status :** Prêt pour test en production