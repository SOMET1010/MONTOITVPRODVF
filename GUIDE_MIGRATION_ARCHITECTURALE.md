# Guide de Migration Architecturale - MonToit

## 🎯 Objectif

Ce guide fournit des exemples concrets pour migrer l'architecture MonToit vers un pattern cohérent par features.

## 📚 Exemples de Migration

### 1. Migration des Hooks

#### AVANT (Structure Obsolète)
```typescript
// src/hooks/useProperties.ts
import { useQuery } from '@tanstack/react-query';
import { propertyRepository } from '@/api/repositories';

export function useProperties(filters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyRepository.getAll(filters),
  });
}
```

#### APRÈS (Structure Optimisée)
```typescript
// src/features/property/hooks/useProperties.ts
import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../services/property.service';

export function useProperties(filters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyApi.getAll(filters),
  });
}
```

#### Index File Associé
```typescript
// src/features/property/hooks/index.ts
export { useProperties } from './useProperties';
export { useProperty } from './useProperty';
export { useOwnerProperties } from './useOwnerProperties';
```

### 2. Migration des Services

#### AVANT (Structure Hybride)
```typescript
// src/services/paymentService.ts
export class PaymentService {
  static detectProvider(phoneNumber: string) {
    // logique métier
  }
}

// src/api/repositories/propertyRepository.ts
export const propertyRepository = {
  async getAll(filters) {
    // logique API
  }
}
```

#### APRÈS (Structure Cohérente)
```typescript
// src/features/payment/services/payment.service.ts
export class PaymentService {
  static detectProvider(phoneNumber: string) {
    // logique métier pure
  }
  
  static calculatePayment(amount: number, provider: string) {
    // calcul métier
  }
}

// src/features/property/services/property.service.ts  
import { supabase } from '@/services/supabase/client';
import { cacheService } from '@/shared/services/cacheService';

export const propertyApi = {
  async getAll(filters) {
    // logique API + cache
    const cached = cacheService.get('properties_all');
    if (cached) return cached;
    
    const { data } = await supabase.from('properties').select('*');
    cacheService.set('properties_all', data);
    return data;
  }
}
```

#### Index File pour Feature Payment
```typescript
// src/features/payment/index.ts
export * from './services/payment.service';
export * from './types/payment.types';
```

### 3. Migration des Types

#### AVANT (Types Dispersés)
```typescript
// src/types/index.ts
export interface PropertyFilters {
  city?: string;
  type?: string;
  minPrice?: number;
}

// src/types/payment.types.ts
export interface PaymentCalculation {
  baseAmount: number;
  providerFee: number;
}
```

#### APRÈS (Types par Feature)
```typescript
// src/features/property/types/property.types.ts
export interface PropertyFilters {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}

export type PropertyStatus = 'available' | 'rented' | 'maintenance';

// src/features/payment/types/payment.types.ts
export interface PaymentCalculation {
  baseAmount: number;
  providerFee: number;
  totalAmount: number;
}

export type PaymentProvider = 'orange_money' | 'mtn_money' | 'wave';

// src/types/index.ts (garder seulement les vraiment globaux)
export type UserType = 'tenant' | 'owner' | 'agency';
export interface ApiError {
  message: string;
  code?: string;
}
```

### 4. Migration des Composants

#### AVANT (Composants Méliers dans Shared)
```typescript
// src/shared/components/PropertyCard.tsx (PROBLÈME)
import { useProperties } from '@/hooks/useProperties';

export function PropertyCard({ property }) {
  const { data } = useProperties(); // Logique dans le composant!
  
  return (
    <div> {/* Composant métier dans shared */}
      <h3>{property.title}</h3>
    </div>
  );
}
```

#### APRÈT (Séparation Claire)
```typescript
// src/shared/ui/PropertyCard.tsx (UI seulement)
interface PropertyCardProps {
  title: string;
  price: number;
  image?: string;
}

export function PropertyCard({ title, price, image }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      {image && <img src={image} alt={title} />}
      <CardContent>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-blue-600 font-bold">{price} FCFA</p>
      </CardContent>
    </Card>
  );
}

// src/features/property/components/PropertyList.tsx (Logique métier)
import { PropertyCard } from '@/shared/ui/PropertyCard';
import { useProperties } from '../hooks/useProperties';

export function PropertyList() {
  const { data: properties, isLoading } = useProperties();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties?.map(property => (
        <PropertyCard
          key={property.id}
          title={property.title}
          price={property.price}
          image={property.images?.[0]}
        />
      ))}
    </div>
  );
}
```

## 🔧 Script de Migration Automatique

### Migration des Imports
```bash
#!/bin/bash
# scripts/migrate-imports.sh

echo "🔄 Migration des imports..."

# Migration des hooks
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  -e 's|from "@/hooks/useProperties"|from "@/features/property/hooks/useProperties"|g' \
  -e 's|from "@/hooks/useAuth"|from "@/features/auth/hooks/useAuth"|g' \
  -e 's|from "@/hooks/useContract"|from "@/features/contract/hooks/useContract"|g'

# Migration des services
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  -e 's|from "@/services/paymentService"|from "@/features/payment/services/payment.service"|g' \
  -e 's|from "@/api/repositories"|from "@/features/*/services"|g'

echo "✅ Migration des imports terminée"
```

### Création Automatique des Index Files
```javascript
// scripts/create-index-files.js
const fs = require('fs');
const path = require('path');

function createIndexFile(dir) {
  const files = fs.readdirSync(dir)
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => {
      const name = path.basename(file, '.ts');
      return `export * from './${name}';`;
    });

  const indexContent = files.join('\n') + '\n';
  fs.writeFileSync(path.join(dir, 'index.ts'), indexContent);
}

// Créer les index files pour chaque feature
const featuresDir = 'src/features';
fs.readdirSync(featuresDir).forEach(feature => {
  const featurePath = path.join(featuresDir, feature);
  if (fs.statSync(featurePath).isDirectory()) {
    createIndexFile(featurePath);
    console.log(`✅ Index créé pour: ${feature}`);
  }
});
```

## 📦 Structure Finale Cible

### Vue d'Ensemble
```
src/
├── features/                    # Architecture par features
│   ├── auth/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   └── AuthForm.tsx
│   │   ├── pages/
│   │   │   └── LoginPage.tsx
│   │   └── index.ts
│   │
│   ├── property/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── components/
│   │   └── pages/
│   │
│   ├── payment/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── components/
│   │   └── pages/
│   │
│   └── index.ts                 # Export de toutes les features
│
├── shared/                      # Partagé entre features
│   ├── ui/                      # Composants UI génériques
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   ├── lib/                     # Utilitaires purs
│   │   ├── utils.ts
│   │   └── index.ts
│   ├── config/                  # Configuration
│   │   ├── api-keys.config.ts
│   │   └── index.ts
│   └── styles/                  # Styles globaux
│
├── hooks/                       # SEULEMENT les hooks globaux
│   ├── useLocalStorage.ts
│   └── index.ts
│
├── stores/                      # État global
│   ├── authStore.ts
│   └── index.ts
│
└── types/                       # SEULEMENT les types globaux
    ├── global.types.ts
    └── index.ts
```

### Exemple Complet : Feature Auth

#### Structure Complète
```typescript
// src/features/auth/index.ts
export * from './hooks';
export * from './services';  
export * from './types';
export * from './components';

// src/features/auth/hooks/index.ts
export { useAuth } from './useAuth';
export { useLogin } from './useLogin';

// src/features/auth/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/shared/contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// src/features/auth/services/auth.service.ts
import { supabase } from '@/services/supabase/client';

export class AuthService {
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }
  
  static async signUp(userData: SignUpData) {
    const { data, error } = await supabase.auth.signUp(userData);
    if (error) throw error;
    return data;
  }
}

// src/features/auth/types/auth.types.ts
export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  userType: 'tenant' | 'owner' | 'agency';
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  userType: string;
}

// src/features/auth/components/AuthForm.tsx
import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/auth.service';

export function AuthForm() {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthService.signIn(formData.email, formData.password);
    } catch (error) {
      console.error('Auth error:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <Input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Mot de passe"
      />
      <Button type="submit">Se connecter</Button>
    </form>
  );
}

// src/features/auth/pages/LoginPage.tsx
import { AuthForm } from '../components/AuthForm';

export function LoginPage() {
  return (
    <div className="container mx-auto py-8">
      <AuthForm />
    </div>
  );
}
```

## 🚨 Points de Vigilance

### 1. Mise à Jour des Imports
```bash
# Vérifier tous les imports après migration
grep -r "from '@/hooks/" src/ || echo "Aucun import de hooks globaux trouvé ✅"
grep -r "from '@/types/" src/ || echo "Aucun import de types globaux trouvé ✅"
```

### 2. Tests de Régression
```bash
# Tests obligatoires après chaque migration
npm run type-check
npm run build
npm run lint
npm test
```

### 3. Performance
```bash
# Mesurer l'impact du build
npm run build -- --analyze

# Comparer avant/après
echo "Build size avant migration: $(du -sh dist/ | cut -f1)"
echo "Build size après migration: À mesurer après migration"
```

## ✅ Checklist de Validation

### Migration Terminée
- [ ] Aucun fichier dans `src/hooks/` obsolète
- [ ] Aucun fichier dans `src/types/` obsolète (sauf index.ts global)
- [ ] Tous les imports utilisent les alias
- [ ] Index files créés pour chaque feature
- [ ] Structure cohérente dans toutes les features
- [ ] Tests passent à 100%
- [ ] Build fonctionne sans erreur
- [ ] Linting passe sans erreur

### Validation Automatique
```bash
# Script de validation finale
node scripts/validate-architecture.js
```

---

*Guide de migration créé le : 2025-12-01*  
*Usage : Suivre étape par étape pour migrer l'architecture*