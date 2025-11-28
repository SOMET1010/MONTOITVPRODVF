# Guide d'Édition Directe sur GitHub Web

## 🎯 Objectif
Corriger les erreurs Supabase HTTP 400 en remplaçant `.in('status', ['disponible', 'available'])` par `.eq('status', 'disponible')` dans 5 fichiers.

## 📋 Fichiers à Modifier

### 1. src/api/repositories/propertyRepository.ts
**URL GitHub:** https://github.com/SOMET1010/MONTOITVPROD/edit/MONTOIT-STABLE/main/src/api/repositories/propertyRepository.ts

**Lignes à corriger (3 occurrences):**
```typescript
// À REMPLACER:
.filter('status', 'in', ['disponible', 'available'])

// PAR:
.filter('status', 'eq', 'disponible')
```

### 2. src/features/property/hooks/useInfiniteProperties.ts  
**URL GitHub:** https://github.com/SOMET1010/MONTOITVPROD/edit/MONTOIT-STABLE/main/src/features/property/hooks/useInfiniteProperties.ts

**Lignes à corriger (2 occurrences):**
```typescript
// À REMPLACER:
.eq('status', 'in', ['disponible', 'available'])

// PAR:
.eq('status', 'disponible')
```

### 3. src/features/property/pages/HomePage.tsx
**URL GitHub:** https://github.com/SOMET1010/MONTOITVPROD/edit/MONTOIT-STABLE/main/src/features/property/pages/HomePage.tsx

**Lignes à corriger (2 occurrences):**
```typescript
// À REMPLACER:
.eq('status', 'in', ['disponible', 'available'])

// PAR:
.eq('status', 'disponible')
```

### 4. src/features/tenant/pages/SearchPropertiesPage.tsx
**URL GitHub:** https://github.com/SOMET1010/MONTOITVPROD/edit/MONTOIT-STABLE/main/src/features/tenant/pages/SearchPropertiesPage.tsx

**Lignes à corriger (1 occurrence):**
```typescript
// À REMPLACER:
.eq('status', 'in', ['disponible', 'available'])

// PAR:
.eq('status', 'disponible')
```

### 5. src/services/ai/recommendationEngine.ts
**URL GitHub:** https://github.com/SOMET1010/MONTOITVPROD/edit/MONTOIT-STABLE/main/src/services/ai/recommendationEngine.ts

**Lignes à corriger (5 occurrences + 1 condition):**
```typescript
// À REMPLACER:
.eq('status', 'in', ['disponible', 'available'])

// PAR:
.eq('status', 'disponible')

// Et changer la condition:
if (status && ['disponible', 'available'].includes(status)) {
// PAR:
if (status === 'disponible') {
```

## 🚀 Étapes d'Exécution

1. **Ouvrir chaque fichier** dans un nouvel onglet via les URLs ci-dessus
2. **Utiliser Ctrl+F** pour rechercher `.in('status', ['disponible', 'available'])`
3. **Remplacer toutes les occurrences** par `.eq('status', 'disponible')`
4. **Faire défiler pour vérifier** qu'il n'y a pas d'autres occurrences
5. **Commit les changements** avec le message: "Fix Supabase HTTP 400 errors - change status query from .in() to .eq()"
6. **Répéter pour chaque fichier**

## ✅ Vérification Post-Déploiement

Après le commit, Bolt.redéploiera automatiquement et vous pourrez vérifier que :
- ❌ ~~Erreurs HTTP 400~~ → ✅ Plus d'erreurs Supabase
- ✅ Les propriétés s'affichent sur la page d'accueil
- ✅ La recherche de propriétés fonctionne
- ✅ Les recommandations sont générées

## 📞 Support

Si vous rencontrez des problèmes, vous pouvez me faire des captures d'écran des erreurs et je vous guiderai davantage.