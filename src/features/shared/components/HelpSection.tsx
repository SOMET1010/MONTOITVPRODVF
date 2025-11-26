import React from 'react';
import { PlayCircleIcon, UserCogIcon, HomeIcon, CreditCardIcon, ShieldIcon, HelpCircleIcon } from 'lucide-react';

interface HelpTopic {
  title: string;
  description: string;
  icon: string;
  href: string;
  articles: string[];
}

const HelpSection: React.FC = () => {
  const topics: HelpTopic[] = [
    {
      title: "Commencer avec MONTOIT",
      description: "Guide complet pour débuter sur notre plateforme",
      icon: "play-circle",
      href: "/help/getting-started",
      articles: [
        "Créer votre premier compte",
        "Configuration de votre profil",
        "Premier pas sur la plateforme",
        "Paramètres essentiels"
      ]
    },
    {
      title: "Gérer votre compte",
      description: "Configuration et personnalisation de votre espace",
      icon: "user-cog",
      href: "/help/account",
      articles: [
        "Modifier vos informations personnelles",
        "Changer votre mot de passe",
        "Paramètres de notification",
        "Confidentialité et sécurité"
      ]
    },
    {
      title: "Gestion des propriétés",
      description: "Tout sur la publication et la gestion de vos annonces",
      icon: "home",
      href: "/help/properties",
      articles: [
        "Ajouter une nouvelle propriété",
        "Optimiser vos photos",
        "Gérer vos réservations",
        "Tarification dynamique"
      ]
    },
    {
      title: "Facturation et paiements",
      description: "Abonnements, paiements et gestion financière",
      icon: "credit-card",
      href: "/help/billing",
      articles: [
        "Choisir le bon abonnement",
        "Moyens de paiement acceptés",
        "Factures et reçus",
        "Résoudre un problème de paiement"
      ]
    },
    {
      title: "Sécurité et confiance",
      description: "Protégez-vous et protégez vos données",
      icon: "shield",
      href: "/help/security",
      articles: [
        "Sécuriser votre compte",
        "Reconnaître les tentatives de fraude",
        "Gestion de la confidentialité",
        "Signaler un problème"
      ]
    },
    {
      title: "Support technique",
      description: "Aide pour résoudre les problèmes techniques",
      icon: "help-circle",
      href: "/help/technical",
      articles: [
        "Problèmes de connexion",
        "Application mobile",
        "Navigateurs compatibles",
        "Dépannage général"
      ]
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'play-circle':
        return <PlayCircleIcon className="w-6 h-6" />;
      case 'user-cog':
        return <UserCogIcon className="w-6 h-6" />;
      case 'home':
        return <HomeIcon className="w-6 h-6" />;
      case 'credit-card':
        return <CreditCardIcon className="w-6 h-6" />;
      case 'shield':
        return <ShieldIcon className="w-6 h-6" />;
      case 'help-circle':
        return <HelpCircleIcon className="w-6 h-6" />;
      default:
        return <HelpCircleIcon className="w-6 h-6" />;
    }
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-8">Guides et Tutoriels</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                  {getIcon(topic.icon)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm">{topic.description}</p>
              
              <ul className="space-y-2 mb-6">
                {topic.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <a 
                      href={`${topic.href}#${articleIndex}`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      • {article}
                    </a>
                  </li>
                ))}
              </ul>
              
              <a 
                href={topic.href}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Voir tous les guides
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HelpSection;