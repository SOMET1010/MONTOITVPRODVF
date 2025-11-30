# Plan d'Action - Restructuration Architecturale MonToit

## 🎯 Objectif

Restructurer l'application MonToit pour éliminer les incohérences architecturales et adopter un pattern unique et cohérent.

## 📋 Actions Prioritaires

### 🔥 CRITIQUE - À faire immédiatement

#### 1. Élimination des Duplications
```bash
# Actions immédiates
1. Supprimer src/hooks/ (conserver ceux dans features)
2. Supprimer src/types/ (conserver ceux dans features) 
3. Identifier les services vraiment globaux
4. Migrer src/services/ vers features appropriées
```

#### 2. Standardisation des Imports
```typescript
// AVANT (à corriger)
import { supabase } from '../client';
import { Button } from '../../../shared/ui';

// APRÈS (standard)
import { supabase } from '@/services/supabase/client';
import { Button } from '@/shared/ui';
```

### 🟡 IMPORTANT - À planifier

#### 3. Restructuration des Services
```typescript
// Nouvelle structure recommandée
src/features/
├── auth/
│   ├── services/auth.service.ts (migré de src/services/authService.ts)
│   ├── hooks/useAuth.ts (migré de src/hooks/useAuth.ts)
│   └── types/auth.types.ts (migré de src/types/auth.ts)
├── property/
│   ├── services/property.service.ts (migré de src/api/repositories/propertyRepository.ts)
│   └── hooks/useProperties.ts (migré de src/hooks/useProperties.ts)
└── shared/
    ├── ui/ (conserver)
    ├── lib/ (conserver)
    └── config/ (conserver)
```

#### 4. Création d'Index Files
```typescript
// src/features/index.ts
export * from './auth';
export * from './property';
export * from './payment';
export * from './verification';

// src/features/auth/index.ts
export * from './hooks/useAuth';
export * from './services/authService';
export * from './types/auth.types';
```

### 🟢 AMÉLIORATION - À optimiser

#### 5. Séparation Claire des Responsabilités
```typescript
// Pattern recommandé
features/
├── components/     # Composants métier spécifiques
├── hooks/         # Logique React uniquement
├── services/      # Logique métier uniquement
├── types/         # Types TypeScript
└── pages/         # Pages/vues

shared/
├── ui/            # Composants UI génériques
├── lib/           # Utilitaires purs
└── config/        # Configuration
```

## 🚀 Plan de Migration Détaillé

### Phase 1 : Préparation (Jour 1)

#### 1.1 Audit Complet
```bash
# Script d'audit automatique
find src -name "*.ts" -o -name "*.tsx" | \
grep -E "(service|hook|type)" | \
sort | uniq
```

#### 1.2 Identification des Vraies Doublons
```bash
# Identifier les fichiers dupliqués
diff -r src/hooks/ src/features/*/hooks/
diff -r src/types/ src/features/*/types/
```

#### 1.3 Liste des Services Globaux
```typescript
// Services réellement globaux à conserver
src/services/
├── cacheService.ts (global)
├── notificationService.ts (global)
└── analytics.ts (global)

// Services métier à migrer vers features
src/services/
├── paymentService.ts → features/payment/
├── authService.ts → features/auth/
└── contractService.ts → features/contract/
```

### Phase 2 : Migration des Hooks (Jour 2)

#### 2.1 Hooks Globaux → Features
```bash
# src/hooks/useProperties.ts → src/features/property/hooks/
# src/hooks/useContract.ts → src/features/contract/hooks/
# src/hooks/useVerification.ts → src/features/verification/hooks/
```

#### 2.2 Mise à Jour des Imports
```typescript
// Dans tous les composants
// AVANT
import { useProperties } from '@/hooks/useProperties';

// APRÈS  
import { useProperties } from '@/features/property/hooks/useProperties';
```

### Phase 3 : Migration des Services (Jour 3-4)

#### 3.1 Services Métier
```bash
# Déplacer les services par feature
src/services/authService.ts → src/features/auth/services/auth.service.ts
src/services/paymentService.ts → src/features/payment/services/payment.service.ts
src/services/contractService.ts → src/features/contract/services/contract.service.ts
```

#### 3.2 Services API
```bash
# Unifier repositories et services API
src/api/repositories/ → src/features/*/services/
```

### Phase 4 : Migration des Types (Jour 5)

#### 4.1 Types par Feature
```bash
# Réorganiser les types
src/types/auth.ts → src/features/auth/types/auth.types.ts
src/types/payment.ts → src/features/payment/types/payment.types.ts
```

#### 4.2 Types Globaux
```bash
# Conserver les types truly global
src/types/index.ts (conserver)
src/shared/lib/database.types.ts (conserver)
```

### Phase 5 : Nettoyage (Jour 6-7)

#### 5.1 Suppression des Doublons
```bash
# Supprimer les anciens dossiers
rm -rf src/hooks/
rm -rf src/types/ (sauf index.ts)
rm -rf src/api/repositories/
```

#### 5.2 Mise à Jour des Configurations
```typescript
// vite.config.ts - supprimer les alias non utilisés
alias: {
  '@hooks': false, // supprimer
  '@types': false, // supprimer
  '@repositories': false, // supprimer
}
```

## 🛠️ Scripts de Migration Automatique

### Script 1 : Détection des Doublons
```bash
#!/bin/bash
# scripts/detect-duplicates.sh

echo "=== Détection des doublons dans l'architecture ==="

echo "Hooks dupliqués :"
find src -name "use*.ts" -o -name "use*.tsx" | sort

echo -e "\nServices dupliqués :"
find src -name "*service*.ts" | sort

echo -e "\nTypes dupliqués :"
find src -name "*.types.ts" | sort
```

### Script 2 : Migration des Imports
```bash
#!/bin/bash
# scripts/fix-imports.sh

# Remplacer les imports de hooks
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i \
  's|from "@/hooks/useProperties"|from "@/features/property/hooks/useProperties"|g'

find src -name "*.ts" -o -name "*.tsx" | xargs sed -i \
  's|from "@/hooks/useAuth"|from "@/features/auth/hooks/useAuth"|g'
```

### Script 3 : Validation de la Structure
```bash
#!/bin/bash
# scripts/validate-structure.sh

echo "=== Validation de la nouvelle structure ==="

# Vérifier qu'il n'y a plus de doublons
if [ -d "src/hooks/" ]; then
  echo "❌ ERREUR: src/hooks/ existe encore"
  exit 1
fi

if [ -d "src/api/repositories/" ]; then
  echo "❌ ERREUR: src/api/repositories/ existe encore"  
  exit 1
fi

echo "✅ Structure validée"
```

## 📊 Métriques de Suivi

### KPI de Migration
- [ ] 0 doublons détectés
- [ ] 100% des imports utilisent les alias
- [ ] 100% des features ont une structure cohérente
- [ ] 0 chemins relatifs dans les imports

### KPI de Qualité
- [ ] Temps de build < 30s
- [ ] Bundle size réduit de 15%
- [ ] 0 erreur TypeScript
- [ ] Couverture de tests maintenue

## 🚨 Points d'Attention

### 1. Tests de Régression
```bash
# Tests obligatoires après chaque migration
npm run test
npm run build
npm run lint
```

### 2. Migration des Dépendances
```bash
# Vérifier les imports indirects
npm ls --depth=0
```

### 3. Performance
```bash
# Mesurer l'impact sur les performances
npm run build -- --analyze
```

## 🎯 Critères de Succès

### Structure Finale Cible
```typescript
src/
├── features/          # Architecture par features
│   ├── auth/
│   ├── property/
│   ├── payment/
│   └── verification/
├── shared/            # Partagé entre features
│   ├── ui/           # Composants UI génériques
│   ├── lib/          # Utilitaires
│   └── config/       # Configuration
├── hooks/            # SEULEMENT les hooks globaux
├── stores/           # État global
└── styles/           # Styles globaux
```

### Résultat Attendu
- ✅ Architecture 100% cohérente
- ✅ 0 duplication de code
- ✅ Imports uniquement avec alias
- ✅ Structure maintenable et évolutive

---

*Plan d'action créé le : 2025-12-01*  
*Estimation : 1 semaine de travail*  
*Priorité : CRITIQUE*