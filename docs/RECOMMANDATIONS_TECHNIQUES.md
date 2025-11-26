# Recommandations Techniques - MONTOIT-STABLE

## 🎯 Objectif

Ce document fournit les recommandations techniques spécifiques pour implémenter les **4 pages manquantes** dans le repository MONTOIT-STABLE, en respectant l'architecture existante et les bonnes pratiques établies.

## 🔍 Analyse Technique du Code Existant

### Composants Shared Disponibles

#### 1. PageLayout (`src/shared/components/PageLayout.tsx`)
**Usage :** Composant de base pour toutes les nouvelles pages
- Structure standard avec header/footer
- Responsive design intégré
- SEO et accessibilité

```typescript
// Exemple d'utilisation
<PageLayout>
  <div>Contenu de la page</div>
</PageLayout>
```

#### 2. Breadcrumb (`src/shared/components/Breadcrumb.tsx`)
**Usage :** Navigation contextuelle
- Support multi-niveaux
- Personnalisable avec icônes

```typescript
// Exemple d'utilisation
<Breadcrumb items={[
  { label: 'Accueil', href: '/' },
  { label: 'Aide', href: '/help' },
  { label: 'FAQ', href: '/faq' }
]} />
```

#### 3. LoadingStates (`src/shared/components/LoadingStates.tsx`)
**Usage :** Gestion des états de chargement
- Spinner intégré
- Gestion disabled state

```typescript
<LoadingStates isLoading={isLoading}>
  <button>Action</button>
</LoadingStates>
```

#### 4. FeatureCard (`src/shared/components/FeatureCard.tsx`)
**Usage :** Cartes d'information réutilisables
- Support icônes Lucide
- Styles cohérents

```typescript
<FeatureCard 
  title="Contact Email"
  description="contact@montoit.ci"
  icon="mail"
/>
```

#### 5. CityCard (`src/shared/components/CityCard.tsx`)
**Usage :** Sélection de localisation
- Images et données de ville
- Interaction hover

## 🏗️ Architecture et Patterns

### Feature-Based Architecture
Le projet utilise une architecture basée sur les fonctionnalités :
- **Séparation par domaine** : auth/, property/, owner/, etc.
- **Cohésion logique** : composants, hooks, services ensemble
- **Réutilisabilité** : composants shared centralisés

### État Management
- **Client State :** Zustand dans `src/stores/`
- **Server State :** React Query dans `src/features/*/hooks/`
- **Local State :** useState dans les composants

### Routing Strategy
- **Lazy Loading :** `lazy(() => import(...))`
- **Code Splitting :** Par fonctionnalité
- **Protected Routes :** Authentification requise

## 📝 Implémentation Détaillée

### 1. Page Contact

#### Structure des Fichiers
```
src/features/shared/
├── pages/ContactPage.tsx
├── components/ContactForm.tsx
├── hooks/useContact.ts
└── services/contactService.ts
```

#### Hook Custom `useContact`
```typescript
// src/features/shared/hooks/useContact.ts
import { useMutation } from '@tanstack/react-query';
import { contactService } from '../services/contactService';

export const useContact = () => {
  const mutation = useMutation({
    mutationFn: contactService.sendMessage,
    onSuccess: () => {
      // Success handling
    },
    onError: (error) => {
      // Error handling
    }
  });

  return {
    submitContact: mutation.mutate,
    isLoading: mutation.isLoading,
    error: mutation.error
  };
};
```

#### Service Contact
```typescript
// src/features/shared/services/contactService.ts
import { supabase } from '../../api/supabaseClient';

export const contactService = {
  async sendMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const { data: result, error } = await supabase
      .from('contact_messages')
      .insert([data]);
    
    if (error) throw error;
    return result;
  }
};
```

### 2. Page Aide

#### Structure des Fichiers
```
src/features/shared/
├── pages/HelpPage.tsx
├── components/HelpSection.tsx
├── hooks/useHelp.ts
└── data/helpData.ts
```

#### Data Structure
```typescript
// src/features/shared/data/helpData.ts
export const helpSections = [
  {
    id: 'getting-started',
    title: 'Commencer',
    description: 'Guide de démarrage rapide',
    icon: 'play-circle',
    articles: [
      {
        id: 'create-account',
        title: 'Créer un compte',
        content: 'Pour créer votre compte...'
      }
    ]
  }
];
```

### 3. Page FAQ

#### Structure des Fichiers
```
src/features/shared/
├── pages/FAQPage.tsx
├── components/FAQAccordion.tsx
├── hooks/useFAQ.ts
└── data/faqData.ts
```

#### Data Structure FAQ
```typescript
// src/features/shared/data/faqData.ts
export const faqData = [
  {
    id: 'account',
    title: 'Compte et Authentification',
    questions: [
      {
        id: 'create-account',
        question: 'Comment créer un compte ?',
        answer: 'Pour créer un compte, cliquez sur "S\'inscrire"...',
        category: 'account'
      }
    ]
  }
];
```

#### Component FAQAccordion
```typescript
// src/features/shared/components/FAQAccordion.tsx
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  questions: Question[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ questions }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="space-y-2">
      {questions.map((item) => (
        <div key={item.id} className="border rounded-lg">
          <button
            className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            onClick={() => toggleItem(item.id)}
            aria-expanded={openItems.has(item.id)}
          >
            <span className="font-medium text-gray-900">{item.question}</span>
            {openItems.has(item.id) ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {openItems.has(item.id) && (
            <div className="px-4 pb-3 text-gray-600 border-t">
              <div className="pt-3" dangerouslySetInnerHTML={{ __html: item.answer }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

### 4. Page Ajout Propriété

#### Structure des Fichiers
```
src/features/property/
├── pages/AddPropertyPage.tsx
├── components/PropertyForm.tsx
├── components/PropertyImages.tsx
├── hooks/usePropertyForm.ts
└── services/propertyService.ts
```

#### Hook usePropertyForm
```typescript
// src/features/property/hooks/usePropertyForm.ts
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';

interface PropertyFormData {
  title: string;
  description: string;
  propertyType: string;
  city: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: File[];
}

export const usePropertyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    propertyType: '',
    city: '',
    address: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    images: []
  });

  const mutation = useMutation({
    mutationFn: propertyService.createProperty,
    onSuccess: () => {
      // Success handling
    }
  });

  const updateFormData = (updates: Partial<PropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  
  const submitForm = async () => {
    await mutation.mutateAsync(formData);
  };

  return {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    submitForm,
    isLoading: mutation.isLoading,
    error: mutation.error
  };
};
```

## 🔧 Configuration des Routes

### Modification de `src/app/routes.tsx`

```typescript
// Ajout des imports lazy
const ContactPage = lazy(() => import('../features/shared/pages/ContactPage'));
const HelpPage = lazy(() => import('../features/shared/pages/HelpPage'));
const FAQPage = lazy(() => import('../features/shared/pages/FAQPage'));
const AddPropertyPage = lazy(() => import('../features/property/pages/AddPropertyPage'));

// Ajout des routes dans la configuration
export const routes = [
  // ... routes existantes
  
  // Nouvelles routes
  {
    path: '/contact',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ContactPage />
      </Suspense>
    ),
    meta: {
      title: 'Contact - Mon Toit',
      description: 'Contactez notre équipe pour toute question'
    }
  },
  {
    path: '/help',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <HelpPage />
      </Suspense>
    ),
    meta: {
      title: 'Centre d\'aide - Mon Toit',
      description: 'Trouvez rapidement les réponses à vos questions'
    }
  },
  {
    path: '/faq',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <FAQPage />
      </Suspense>
    ),
    meta: {
      title: 'FAQ - Mon Toit',
      description: 'Questions fréquemment posées'
    }
  },
  {
    path: '/add-property',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <AddPropertyPage />
        </Suspense>
      </ProtectedRoute>
    ),
    meta: {
      title: 'Ajouter une propriété - Mon Toit',
      description: 'Publiez votre propriété en quelques étapes'
    }
  }
];
```

## 🎨 Guidelines Styling

### Utilisation de Tailwind CSS
Le projet utilise Tailwind CSS 3.4 avec une configuration personnalisée.

#### Classes Communes
```typescript
// Layout
'container mx-auto px-4 py-8'

// Typography
'text-3xl font-bold mb-8'
'text-xl font-semibold mb-4'
'text-gray-600'

// Forms
'space-y-4'
'border rounded-lg px-4 py-2'
'focus:ring-2 focus:ring-blue-500'

// Cards
'bg-white shadow-md rounded-lg p-6'
'hover:shadow-lg transition-shadow'

// Grid
'grid md:grid-cols-2 gap-6'
'grid md:grid-cols-3 gap-4'
```

### Variables CSS Personnalisées
Vérifier `tailwind.config.js` pour les couleurs et espacements personnalisés.

## 🧪 Tests

### Tests Unitaires Recommandés
```typescript
// ContactPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactPage from '../ContactPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ContactPage', () => {
  it('renders contact form', () => {
    renderWithProviders(<ContactPage />);
    expect(screen.getByText('Contactez-nous')).toBeInTheDocument();
  });
  
  it('submits form successfully', async () => {
    // Test submission
  });
});
```

### Tests d'Intégration
```typescript
// FAQ.integration.test.tsx
describe('FAQ Flow', () => {
  it('allows users to browse and search FAQ', () => {
    // Test navigation, search, accordion interaction
  });
});
```

## 🚀 Optimisations Performance

### 1. Code Splitting
- Chaque page en lazy loading
- Composants heavy only when needed

### 2. Image Optimization
- Utiliser Next.js Image ou equivalent
- WebP format support
- Lazy loading images

### 3. API Optimization
- React Query caching
- Debounced search inputs
- Pagination for large datasets

### 4. Bundle Analysis
```bash
# Analyser la taille du bundle
npm run build
npm run analyze
```

## 🔒 Sécurité

### Validation Côté Client
- Utiliser des schemas Zod ou Yup
- Sanitisation des inputs
- Protection CSRF

### Validation Côté Serveur (Supabase)
- Row Level Security (RLS)
- Validation des permissions
- Sanitisation des données

### Exemple de Validation
```typescript
// useContact.ts avec validation
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  subject: z.string().min(1, 'Sujet requis'),
  message: z.string().min(10, 'Message trop court')
});
```

## 📱 Responsive Design

### Breakpoints Utilisés
- **sm:** 640px
- **md:** 768px  
- **lg:** 1024px
- **xl:** 1280px

### Mobile-First Approach
```typescript
// Classes responsive
'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

// Typography responsive
'text-lg md:text-xl lg:text-2xl'

// Spacing responsive
'px-4 md:px-6 lg:px-8'
```

## 🔍 SEO et Accessibilité

### Meta Tags
```typescript
// Dans chaque page
useEffect(() => {
  document.title = 'Contact - Mon Toit';
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', 'Contactez notre équipe...');
  }
}, []);
```

### Accessibilité
```typescript
// Aria labels
<button aria-label="Ouvrir le menu" />

// Semantic HTML
<main role="main">
  <section aria-labelledby="faq-heading">
    <h2 id="faq-heading">Questions fréquentes</h2>
  </section>
</main>

// Keyboard navigation
<button onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
}}>
```

## 🚀 Déploiement

### Variables d'Environnement
```bash
# .env.production
VITE_CONTACT_EMAIL=contact@montoit.ci
VITE_HELP_DOCS_URL=https://docs.montoit.ci
VITE_FAQ_API_URL=https://api.montoit.ci/faq
```

### Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'contact': ['src/features/shared/pages/ContactPage'],
          'help': ['src/features/shared/pages/HelpPage'],
          'faq': ['src/features/shared/pages/FAQPage'],
          'add-property': ['src/features/property/pages/AddPropertyPage']
        }
      }
    }
  }
});
```

---

**Document technique créé le :** 26 novembre 2025  
**MiniMax Agent - Conseil Technique**