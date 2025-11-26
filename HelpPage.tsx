import React from 'react';
import PageLayout from '../../../shared/components/PageLayout';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FeatureCard from '../../../shared/components/FeatureCard';

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
    {
      title: "Rechercher des propriétés",
      description: "Comment trouver votre bien idéal",
      icon: "search",
      href: "/help/search"
    },
    {
      title: "Ajouter une propriété",
      description: "Guide pour les propriétaires",
      icon: "home-plus",
      href: "/help/add-property"
    },
    {
      title: "Sécurité et vérifications",
      description: "Protéger votre compte",
      icon: "shield-check",
      href: "/help/security"
    },
    {
      title: "Assistance technique",
      description: "Résoudre les problèmes",
      icon: "wrench",
      href: "/help/technical"
    }
  ];

  return (
    <PageLayout>
      <Breadcrumb items={[
        { label: 'Accueil', href: '/' },
        { label: 'Aide', href: '/help' }
      ]} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Centre d'Aide</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {helpSections.map((section, index) => (
            <FeatureCard key={index} {...section} />
          ))}
        </div>
        
        <section>
          <h2 className="text-2xl font-semibold mb-6">Questions Fréquentes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Comment créer un compte ?</h3>
              <p className="text-gray-600">Rendez-vous sur notre page d'inscription et suivez les étapes simples.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Comment ajouter une propriété ?</h3>
              <p className="text-gray-600">Connectez-vous et cliquez sur "Je loue mon bien" dans le menu.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Comment contacter un propriétaire ?</h3>
              <p className="text-gray-600">Utilisez le formulaire de contact depuis la page de la propriété.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Combien ça coûte ?</h3>
              <p className="text-gray-600">L'inscription est gratuite. Nos services sont sans commission.</p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default HelpPage;