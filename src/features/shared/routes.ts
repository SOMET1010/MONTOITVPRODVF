// Configuration des routes pour MONTOIT-STABLE
// Ce fichier documente les routes à ajouter dans le système de routing

import { lazy } from 'react';

// Lazy loading des pages pour optimiser les performances
const ContactPage = lazy(() => import('../features/shared/pages/ContactPage'));
// const HelpPage = lazy(() => import('../features/shared/pages/HelpPage'));
// const FAQPage = lazy(() => import('../features/shared/pages/FAQPage'));
// const AddPropertyPage = lazy(() => import('../features/property/pages/AddPropertyPage'));

export const contactRoutes = [
  {
    path: '/contact',
    element: ContactPage,
    // Configuration supplémentaire pour le SEO
    meta: {
      title: 'Contactez-nous - MonToit',
      description: 'Contactez l\'équipe MonToit pour toute question concernant nos services immobiliers en Côte d\'Ivoire. Support réactif et équipe dédiée.',
      keywords: 'contact, support, immobilier, Côte d\'Ivoire, MonToit',
      canonical: '/contact'
    },
    // Breadcrumbs pour la navigation
    breadcrumb: [
      { label: 'Accueil', href: '/' },
      { label: 'Contact', href: '/contact' }
    ]
  }
  //,
  // {
  //   path: '/help',
  //   element: HelpPage,
  //   meta: {
  //     title: 'Centre d\'Aide - MonToit',
  //     description: 'Centre d\'aide MonToit : guides, tutoriels et assistance pour utiliser notre plateforme immobilière.',
  //     canonical: '/help'
  //   }
  // },
  // {
  //   path: '/faq',
  //   element: FAQPage,
  //   meta: {
  //     title: 'FAQ - Questions Fréquentes - MonToit',
  //     description: 'Trouvez rapidement les réponses à vos questions sur MonToit, la plateforme immobilière de référence en Côte d\'Ivoire.',
  //     canonical: '/faq'
  //   }
  // },
  // {
  //   path: '/add-property',
  //   element: AddPropertyPage,
  //   meta: {
  //     title: 'Ajouter une Propriété - MonToit',
  //     description: 'Ajoutez votre propriété sur MonToit et touchez des milliers de potentiels acheteurs ou locataires en Côte d\'Ivoire.',
  //     canonical: '/add-property'
  //   },
  //   // Protection - nécessite une authentification
  //   protected: true,
  //   requiredRole: 'owner'
  // }
];

// Instructions d'intégration dans l'application React Router
export const integrationInstructions = `
Instructions pour intégrer ces routes dans l'application :

1. Dans votre fichier de routes principal (ex: src/App.tsx ou src/routes.tsx) :

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { contactRoutes } from './features/shared/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes existantes... */}
        
        {/* Nouvelles routes */}
        {contactRoutes.map((route) => (
          <Route 
            key={route.path}
            path={route.path} 
            element={
              <Suspense fallback={<div>Chargement...</div>}>
                <route.element />
              </Suspense>
            } 
          />
        ))}
        
        {/* Fallback route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

2. Pour React Router v6 avec lazy loading :

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  // Routes existantes...
  ...contactRoutes.map(route => ({
    path: route.path,
    element: route.element,
    // ...autres configurations
  }))
]);

function App() {
  return <RouterProvider router={router} />;
}

3. Pour Next.js avec le App Router :

Créer les fichiers :
- app/contact/page.tsx
- app/help/page.tsx  
- app/faq/page.tsx

Chaque fichier doit exporter un composant par défaut correspondant à la page.

4. Pour Gatsby :

Ajouter dans gatsby-config.js :
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-create-client-paths',
      options: { prefixes: ['/contact/*', '/help/*', '/faq/*'] }
    }
  ]
};

5. Configuration SEO/Analytics :

Chaque route peut inclure des métadonnées pour :
- Title et meta description
- Open Graph tags
- Schema.org structured data
- Analytics tracking
- Sitemap.xml

6. Protection des routes :

Les routes sensibles (comme /add-property) peuvent inclure :
- Vérification d'authentification
- Vérification des rôles/permissions
- Guards pour les utilisateurs non autorisés

7. Performance :

- Utiliser React.lazy() pour le lazy loading
- Préchargement des pages critiques
- Code splitting par route
- Mise en cache des composants

8. Accessibilité :

- Navigation au clavier fonctionnelle
- ARIA labels appropriés
- Focus management
- Skip links
`;

// Export des instructions pour référence
export { integrationInstructions };

export default contactRoutes;