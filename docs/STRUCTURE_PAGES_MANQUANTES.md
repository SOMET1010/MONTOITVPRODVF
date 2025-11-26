# Structure Recommandée pour les Pages Manquantes - MONTOIT-STABLE

## 🎯 Vue d'Ensemble

Ce document définit la structure exacte pour implémenter les **4 pages manquantes** identifiées dans le repository MONTOIT-STABLE :
1. **Contact**
2. **Aide (Help)** 
3. **FAQ**
4. **Ajout Propriété**

## 📁 Structure Suggérée

### Option 1 : Module Shared Global (Recommandé)
```
src/features/shared/
├── pages/
│   ├── ContactPage.tsx          # Nouvelle page Contact
│   ├── HelpPage.tsx             # Nouvelle page Aide
│   ├── FAQPage.tsx              # Nouvelle page FAQ
│   └── index.ts                 # Export des pages
├── components/
│   ├── ContactForm.tsx          # Formulaire de contact
│   ├── HelpSection.tsx          # Sections d'aide
│   ├── FAQAccordion.tsx         # Accordéon FAQ
│   └── PropertyForm.tsx         # Formulaire ajout propriété
├── hooks/
│   ├── useContact.ts            # Logique formulaire contact
│   ├── useHelp.ts               # Logique aide
│   ├── useFAQ.ts                # Logique FAQ
│   └── usePropertyForm.ts       # Logique ajout propriété
├── services/
│   ├── contactService.ts        # API contact
│   ├── helpService.ts           # API aide
│   └── propertyService.ts       # API propriétés
└── styles/
    ├── contact.css              # Styles page contact
    ├── help.css                 # Styles page aide
    ├── faq.css                  # Styles page FAQ
    └── add-property.css         # Styles ajout propriété
```

### Option 2 : Intégration dans Property Module
```
src/features/property/
├── pages/
│   ├── HomePage.tsx
│   ├── NotFoundPage.tsx
│   ├── PropertyStatsPage.tsx
│   ├── SearchPropertiesPageSimplified.tsx
│   ├── AddPropertyPage.tsx      # ← Nouvelle page ici
│   └── index.ts
└── components/
    ├── PropertyForm.tsx         # ← Nouveau composant ici
    ├── PropertyCard.tsx
    └── ...
```

## 🔧 Implémentation Détaillée

### 1. Page Contact (`ContactPage.tsx`)

**Localisation :** `src/features/shared/pages/ContactPage.tsx`

```typescript
// Structure suggérée
import React from 'react';
import PageLayout from '../../../shared/components/PageLayout';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import ContactForm from '../components/ContactForm';
import FeatureCard from '../../../shared/components/FeatureCard';

const ContactPage: React.FC = () => {
  return (
    <PageLayout>
      <Breadcrumb items={[
        { label: 'Accueil', href: '/' },
        { label: 'Contact', href: '/contact' }
      ]} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Contactez-nous</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <ContactForm />
          
          <div className="space-y-6">
            <FeatureCard 
              title="Email"
              description="contact@montoit.ci"
              icon="mail"
            />
            <FeatureCard 
              title="Téléphone"
              description="+225 XX XX XX XX"
              icon="phone"
            />
            <FeatureCard 
              title="Adresse"
              description="Abidjan, Côte d'Ivoire"
              icon="map-pin"
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactPage;
```

### 2. Page Aide (`HelpPage.tsx`)

**Localisation :** `src/features/shared/pages/HelpPage.tsx`

```typescript
import React from 'react';
import PageLayout from '../../../shared/components/PageLayout';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FeatureCard from '../../../shared/components/FeatureCard';
import Carousel from '../../../shared/components/Carousel';

const HelpPage: React.FC = () => {
  const helpSections = [
    {
      title: "Commencer",
      description: "Guide de démarrage rapide",
      icon: "play-circle",
      href: "/help/getting-started"
    },
    {
      title: "Gérer mon compte",
      description: "Configuration et paramètres",
      icon: "user-cog",
      href: "/help/account"
    },
    // ... autres sections
  ];

  return (
    <PageLayout>
      <Breadcrumb items={[
        { label: 'Accueil', href: '/' },
        { label: 'Aide', href: '/help' }
      ]} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Centre d'Aide</h1>
        
        {/* Sections principales */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {helpSections.map((section, index) => (
            <FeatureCard key={index} {...section} />
          ))}
        </div>
        
        {/* Tutoriel en carrousel */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Tutoriels</h2>
          <Carousel items={[
            { title: "Première connexion", image: "/tutorial1.jpg" },
            { title: "Ajouter une propriété", image: "/tutorial2.jpg" },
            // ... autres tutoriels
          ]} />
        </section>
      </div>
    </PageLayout>
  );
};

export default HelpPage;
```

### 3. Page FAQ (`FAQPage.tsx`)

**Localisation :** `src/features/shared/pages/FAQPage.tsx`

```typescript
import React from 'react';
import PageLayout from '../../../shared/components/PageLayout';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FAQAccordion from '../components/FAQAccordion';

const FAQPage: React.FC = () => {
  const faqCategories = [
    {
      title: "Compte et Authentification",
      questions: [
        {
          question: "Comment créer un compte ?",
          answer: "Pour créer un compte, cliquez sur 'S'inscrire' et suivez les étapes..."
        },
        // ... autres questions
      ]
    },
    {
      title: "Propriétés",
      questions: [
        {
          question: "Comment ajouter une propriété ?",
          answer: "Allez dans votre tableau de bord et cliquez sur 'Ajouter une propriété'..."
        },
        // ... autres questions
      ]
    },
    // ... autres catégories
  ];

  return (
    <PageLayout>
      <Breadcrumb items={[
        { label: 'Accueil', href: '/' },
        { label: 'Aide', href: '/help' },
        { label: 'FAQ', href: '/faq' }
      ]} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Questions Fréquemment Posées</h1>
        
        {faqCategories.map((category, index) => (
          <section key={index} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <FAQAccordion questions={category.questions} />
          </section>
        ))}
      </div>
    </PageLayout>
  );
};

export default FAQPage;
```

### 4. Page Ajout Propriété (`AddPropertyPage.tsx`)

**Localisation :** `src/features/property/pages/AddPropertyPage.tsx`

```typescript
import React from 'react';
import PageLayout from '../../../shared/components/PageLayout';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import PropertyForm from '../components/PropertyForm';
import CityCard from '../../../shared/components/CityCard';

const AddPropertyPage: React.FC = () => {
  const steps = [
    { label: 'Informations générales', number: 1 },
    { label: 'Localisation', number: 2 },
    { label: 'Photos', number: 3 },
    { label: 'Tarif', number: 4 },
    { label: 'Validation', number: 5 }
  ];

  const popularCities = [
    { name: 'Abidjan', properties: 1200, image: '/cities/abidjan.jpg' },
    { name: 'Yamoussoukro', properties: 150, image: '/cities/yamoussoukro.jpg' },
    // ... autres villes
  ];

  return (
    <PageLayout>
      <Breadcrumb items={[
        { label: 'Accueil', href: '/' },
        { label: 'Mes Propriétés', href: '/my-properties' },
        { label: 'Ajouter une Propriété', href: '/add-property' }
      ]} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Ajouter une Propriété</h1>
        
        {/* Étapes */}
        <div className="mb-8">
          <Breadcrumb items={steps} />
        </div>
        
        {/* Sélection de ville */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Choisissez votre ville</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {popularCities.map((city, index) => (
              <CityCard key={index} {...city} />
            ))}
          </div>
        </section>
        
        {/* Formulaire */}
        <PropertyForm />
      </div>
    </PageLayout>
  );
};

export default AddPropertyPage;
```

## 🛠️ Composants à Créer

### 1. ContactForm (`src/features/shared/components/ContactForm.tsx`)

```typescript
import React, { useState } from 'react';
import { useContact } from '../hooks/useContact';
import LoadingStates from '../../../shared/components/LoadingStates';

const ContactForm: React.FC = () => {
  const { submitContact, isLoading } = useContact();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitContact(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Nom complet</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label htmlFor="subject">Sujet</label>
        <select
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({...formData, subject: e.target.value})}
          required
        >
          <option value="">Sélectionnez un sujet</option>
          <option value="support">Support</option>
          <option value="partnership">Partenariat</option>
          <option value="other">Autre</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows={5}
          required
        />
      </div>
      
      <LoadingStates isLoading={isLoading}>
        <button type="submit" className="btn-primary">
          Envoyer le message
        </button>
      </LoadingStates>
    </form>
  );
};

export default ContactForm;
```

### 2. FAQAccordion (`src/features/shared/components/FAQAccordion.tsx`)

```typescript
import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface Question {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  questions: Question[];
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ questions }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {questions.map((item, index) => (
        <div key={index} className="border rounded-lg">
          <button
            className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
            onClick={() => toggleQuestion(index)}
          >
            <span className="font-medium">{item.question}</span>
            <ChevronDownIcon 
              className={`w-5 h-5 transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {openIndex === index && (
            <div className="px-4 pb-3 text-gray-600">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
```

## 📝 Routes à Ajouter

Dans `src/app/routes.tsx`, ajouter :

```typescript
// Import des nouvelles pages
const ContactPage = lazy(() => import('../features/shared/pages/ContactPage'));
const HelpPage = lazy(() => import('../features/shared/pages/HelpPage'));
const FAQPage = lazy(() => import('../features/shared/pages/FAQPage'));
const AddPropertyPage = lazy(() => import('../features/property/pages/AddPropertyPage'));

// Routes à ajouter dans la configuration
{
  path: '/contact',
  element: <ContactPage />
},
{
  path: '/help',
  element: <HelpPage />
},
{
  path: '/faq',
  element: <FAQPage />
},
{
  path: '/add-property',
  element: <AddPropertyPage />
}
```

## 🎨 Styles et Thème

Les pages utiliseront le thème existant de Tailwind CSS avec :
- **Couleurs principales :** Variables définies dans `tailwind.config.js`
- **Typography :** Classes utilitaires existantes
- **Components :** Styles réutilisables des composants shared

## 🚀 Étapes d'Implémentation

1. **Créer la structure** des dossiers
2. **Implémenter les composants** de base
3. **Ajouter les pages** principales
4. **Configurer les routes** dans `routes.tsx`
5. **Tester l'intégration** avec les composants existants
6. **Optimiser les performances** (lazy loading)
7. **Ajouter les tests** unitaires

## 🔍 Bonnes Pratiques

- **Respecter l'architecture** feature-based existante
- **Utiliser les composants** réutilisables disponibles
- **Suivre les patterns** établis dans le projet
- **Maintenir la cohérence** visuelle et fonctionnelle
- **Implémenter le lazy loading** pour les performances
- **Ajouter la gestion d'erreur** appropriée

---

**Document créé le :** 26 novembre 2025  
**MiniMax Agent - Architecture et Développement**