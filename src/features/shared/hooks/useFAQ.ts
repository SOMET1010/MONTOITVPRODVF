/**
 * Hook pour la gestion de la logique métier de la page FAQ
 */

import { useState, useEffect } from 'react';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
  lastUpdated: string;
  viewCount: number;
}

export interface FAQCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  questionCount: number;
  color: string;
}

export interface FAQSearchResult {
  item: FAQItem;
  relevanceScore: number;
  matchedTerms: string[];
}

export interface UseFAQReturn {
  // Données
  categories: FAQCategory[];
  faqItems: FAQItem[];
  filteredItems: FAQItem[];
  
  // Accordéon
  openItems: Set<string>;
  hasOpenItems: boolean;
  
  // Filtres et recherche
  selectedCategory: string;
  searchQuery: string;
  searchResults: FAQSearchResult[];
  
  // États visuels
  loading: boolean;
  error: string | null;
  
  // Actions
  toggleItem: (id: string) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  markHelpful: (id: string, isHelpful: boolean) => void;
  incrementViewCount: (id: string) => void;
  getFAQByCategory: (categoryId: string) => FAQItem[];
  searchInFAQ: (query: string) => FAQSearchResult[];
  getPopularQuestions: (limit?: number) => FAQItem[];
  getRecentQuestions: (limit?: number) => FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    id: 'compte',
    title: 'Compte et Authentification',
    description: 'Gestion de votre compte et de vos identifiants',
    icon: 'user',
    questionCount: 8,
    color: 'blue'
  },
  {
    id: 'proprietes',
    title: 'Propriétés',
    description: 'Recherche, publication et gestion des biens',
    icon: 'home',
    questionCount: 12,
    color: 'green'
  },
  {
    id: 'communication',
    title: 'Communication',
    description: 'Messagerie et contacts',
    icon: 'message-circle',
    questionCount: 6,
    color: 'purple'
  },
  {
    id: 'paiements',
    title: 'Paiements et Facturation',
    description: 'Transactions financières et abonnements',
    icon: 'credit-card',
    questionCount: 9,
    color: 'orange'
  },
  {
    id: 'securite',
    title: 'Sécurité et Confidentialité',
    description: 'Protection des données et sécurité du compte',
    icon: 'shield',
    questionCount: 7,
    color: 'red'
  },
  {
    id: 'technique',
    title: 'Support Technique',
    description: 'Résolution des problèmes techniques',
    icon: 'wrench',
    questionCount: 11,
    color: 'gray'
  }
];

const FAQ_ITEMS: FAQItem[] = [
  // Compte et Authentification
  {
    id: 'faq-1',
    question: 'Comment créer un compte MonToit ?',
    answer: 'Pour créer votre compte MonToit :\n\n1. Cliquez sur "S\'inscrire" en haut à droite de la page\n2. Remplissez le formulaire avec vos informations personnelles (nom, email, mot de passe)\n3. Confirmez votre email en cliquant sur le lien envoyé dans votre boîte mail\n4. Complétez votre profil en ajoutant une photo et une brève présentation\n\n**Important :** Vous devez avoir au moins 18 ans pour créer un compte.',
    category: 'compte',
    tags: ['inscription', 'compte', 'création'],
    helpful: 245,
    notHelpful: 12,
    lastUpdated: '2025-11-20',
    viewCount: 1250
  },
  {
    id: 'faq-2',
    question: 'J\'ai oublié mon mot de passe, comment faire ?',
    answer: 'Si vous avez oublié votre mot de passe :\n\n1. Cliquez sur "Se connecter" sur la page d\'accueil\n2. Cliquez sur "Mot de passe oublié ?" sous le formulaire\n3. Saisissez votre adresse email\n4. Vérifiez votre boîte mail et cliquez sur le lien de réinitialisation\n5. Créez un nouveau mot de passe sécurisé\n\nLe lien de réinitialisation est valable 24 heures. Si vous ne recevez pas l\'email, vérifiez votre dossier spam.',
    category: 'compte',
    tags: ['mot de passe', 'oubli', 'récupération'],
    helpful: 189,
    notHelpful: 8,
    lastUpdated: '2025-11-19',
    viewCount: 890
  },
  {
    id: 'faq-3',
    question: 'Comment modifier mes informations personnelles ?',
    answer: 'Pour modifier vos informations personnelles :\n\n1. Connectez-vous à votre compte\n2. Cliquez sur votre photo de profil en haut à droite\n3. Sélectionnez "Mon Profil" dans le menu déroulant\n4. Cliquez sur "Modifier les informations"\n5. Mettez à jour vos données (nom, téléphone, bio...)\n6. Cliquez sur "Enregistrer les modifications"\n\nCertaines informations comme l\'email nécessitent une nouvelle vérification.',
    category: 'compte',
    tags: ['profil', 'modification', 'informations'],
    helpful: 156,
    notHelpful: 5,
    lastUpdated: '2025-11-18',
    viewCount: 567
  },

  // Propriétés
  {
    id: 'faq-4',
    question: 'Comment rechercher une propriété sur MonToit ?',
    answer: 'Pour rechercher efficacement une propriété :\n\n**Recherche simple :**\n- Utilisez la barre de recherche en haut de la page\n- Saisissez la ville ou le quartier souhaité\n- Cliquez sur "Rechercher"\n\n**Recherche avancée :**\n- Cliquez sur "Filtres avancés"\n- Définissez vos critères : type de bien, budget, nombre de pièces\n- Ajoutez des filtres optionnels (surface, étage, équipements...)\n- Sauvegardez votre recherche pour être alerté des nouveaux biens\n\nLes résultats sont classés par pertinence et date de publication.',
    category: 'proprietes',
    tags: ['recherche', 'propriété', 'filtres'],
    helpful: 312,
    notHelpful: 15,
    lastUpdated: '2025-11-21',
    viewCount: 1876
  },
  {
    id: 'faq-5',
    question: 'Comment ajouter une propriété ?',
    answer: 'Pour publier votre annonce de propriété :\n\n**Étape 1 : Informations générales**\n- Type de bien (appartement, maison, bureau...)\n- Nombre de pièces et surface\n- Adresse précise\n\n**Étape 2 : Description et équipements**\n- Description détaillée du bien\n- Liste des équipements et annexes\n- État du bien et année de construction\n\n**Étape 3 : Photos et visite virtuelle**\n- Ajoutez jusqu\'à 10 photos de qualité\n- Organisez les photos par ordre d\'importance\n- Ajoutez une visite virtuelle si disponible\n\n**Étape 4 : Tarification**\n- Définissez le loyer (charges comprises/sèches)\n- Indiquez les charges locatives\n- Conditions particulières (garantie, séjour minimum...)\n\n**Étape 5 : Publication**\n- Relisez votre annonce\n- Vérifiez toutes les informations\n- Cliquez sur "Publier l\'annonce"\n\nVotre annonce sera visible dans les 2h suivant sa modération.',
    category: 'proprietes',
    tags: ['ajouter', 'publication', 'annonce'],
    helpful: 287,
    notHelpful: 9,
    lastUpdated: '2025-11-22',
    viewCount: 1534
  },
  {
    id: 'faq-6',
    question: 'Combien de temps mon annonce reste-t-elle en ligne ?',
    answer: 'La durée de visibilité de votre annonce dépend de votre abonnement :\n\n**Annonce gratuite :**\n- Validité : 30 jours\n- Renouvellement possible 1 fois\n- 1 annonce simultanée maximum\n\n**Abonnement Premium :**\n- Validité : 90 jours\n- Renouvellement automatique\n- 5 annonces simultanées\n- Mise en avant dans les résultats\n\n**Abonnement Professionnel :**\n- Validité : 365 jours\n- Illimité d\'annonces\n- Visibilité prioritaire\n- Statistiques avancées\n\nVous recevrez des alertes 7 jours avant l\'expiration pour renouvelez si nécessaire.',
    category: 'proprietes',
    tags: ['durée', 'abonnement', 'expiration'],
    helpful: 198,
    notHelpful: 7,
    lastUpdated: '2025-11-20',
    viewCount: 756
  },

  // Communication
  {
    id: 'faq-7',
    question: 'Comment contacter un propriétaire ?',
    answer: 'Pour entrer en contact avec un propriétaire :\n\n**Via le formulaire de contact :**\n1. Consultez la fiche de la propriété\n2. Cliquez sur "Contacter le propriétaire"\n3. Remplissez le formulaire avec votre message\n4. Indiquez vos disponibilités pour une visite\n\n**Via la messagerie intégrée :**\n1. Créez un compte ou connectez-vous\n2. Cliquez sur l\'icône de messagerie sur l\'annonce\n3. Envoyez un message personnalisé\n4. Suivez la conversation dans "Mes messages"\n\n**Conseils pour une réponse rapide :**\n- Soyez précis sur votre projet (durée, budget, profil)\n- Proposez plusieurs créneaux de visite\n- Restez courtois et professionnel\n- Répondez rapidement aux retours du propriétaire',
    category: 'communication',
    tags: ['contact', 'propriétaire', 'message'],
    helpful: 223,
    notHelpful: 11,
    lastUpdated: '2025-11-21',
    viewCount: 998
  },

  // Paiements
  {
    id: 'faq-8',
    question: 'Quels sont les moyens de paiement acceptés ?',
    answer: 'MonToit accepte plusieurs moyens de paiement sécurisés :\n\n**Cartes bancaires :**\n- Visa, Mastercard, American Express\n- Paiement immédiat ou en plusieurs fois (selon votre banque)\n\n**Paiements mobiles :**\n- MTN Mobile Money\n- Orange Money\n- Moov Money\n\n**Virements bancaires :**\n- Virement SEPA pour l\'international\n- Virement local pour les paiements en FCFA\n\n**Sécurité :**\n- Tous les paiements sont chiffrés SSL\n- Aucune donnée bancaire n\'est stockée sur nos serveurs\n- Transactions sécurisées via notre partenaire de paiement\n\nPour toute question sur un paiement, contactez notre support avec votre numéro de transaction.',
    category: 'paiements',
    tags: ['paiement', 'carte', 'mobile money'],
    helpful: 267,
    notHelpful: 14,
    lastUpdated: '2025-11-19',
    viewCount: 1123
  },

  // Sécurité
  {
    id: 'faq-9',
    question: 'Mes données personnelles sont-elles protégées ?',
    answer: 'Oui, la protection de vos données est notre priorité absolue :\n\n**Mesures de sécurité :**\n- Chiffrement SSL/TLS pour toutes les communications\n- Hébergement sécurisé sur des serveurs certifiés ISO 27001\n- Sauvegardes automatiques chiffrées\n- Audit de sécurité régulier par des experts externes\n\n**RGPD Conformité :**\n- Collecte minimaliste des données nécessaires\n- Consentement explicite pour chaque utilisation\n- Droit d\'accès, de modification et de suppression\n- Portabilité des données\n\n**Vie privée :**\n- Profil masqué par défaut\n- Contrôle total sur la visibilité de vos informations\n- Possibilité de supprimer définitivement votre compte\n\nNous ne vendons jamais vos données personnelles à des tiers.',
    category: 'securite',
    tags: ['sécurité', 'données', 'RGPD', 'protection'],
    helpful: 334,
    notHelpful: 8,
    lastUpdated: '2025-11-17',
    viewCount: 1456
  },

  // Support Technique
  {
    id: 'faq-10',
    question: 'L\'application ne se charge pas, que faire ?',
    answer: 'Si l\'application ne se charge pas :\n\n**Vérifications de base :**\n1. Vérifiez votre connexion internet (Wi-Fi ou données mobiles)\n2. Rechargez la page (F5 ou Ctrl+R)\n3. Videz le cache du navigateur\n4. Testez sur un autre navigateur\n\n**Problèmes de compatibilité :**\n- Navigateurs supportés : Chrome 80+, Firefox 75+, Safari 13+, Edge 80+\n- JavaScript doit être activé\n- Cookies autorisés pour le fonctionnement optimal\n\n**Problèmes persistants :**\n1. Désactivez temporairement les bloqueurs de publicité\n2. Redémarrez votre navigateur\n3. Essayez en mode navigation privée\n4. Contactez le support avec :\n   - Votre navigateur et version\n   - Message d\'erreur exact (capture d\'écran)\n   - Étapes pour reproduire le problème\n\nNotre équipe vous répond sous 2h en semaine.',
    category: 'technique',
    tags: ['chargement', 'problème', 'navigateur', 'support'],
    helpful: 189,
    notHelpful: 23,
    lastUpdated: '2025-11-22',
    viewCount: 745
  }
];

export const useFAQ = (): UseFAQReturn => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setFaqItems(FAQ_ITEMS);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des FAQ');
        console.error('Erreur useFAQ:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrer les items selon la catégorie sélectionnée
  const filteredItems = selectedCategory === 'tous' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  // Vérifier s'il y a des items ouverts
  const hasOpenItems = openItems.size > 0;

  // Résultats de recherche
  const searchResults = searchQuery.trim() 
    ? faqItems
        .map(item => ({
          item,
          relevanceScore: calculateRelevanceScore(item, searchQuery),
          matchedTerms: findMatchedTerms(item, searchQuery)
        }))
        .filter(result => result.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
    : [];

  // Gestion de l'accordéon
  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const markHelpful = (id: string, isHelpful: boolean) => {
    setFaqItems(prev => prev.map(item => 
      item.id === id 
        ? {
            ...item,
            helpful: isHelpful ? item.helpful + 1 : item.helpful,
            notHelpful: !isHelpful ? item.notHelpful + 1 : item.notHelpful
          }
        : item
    ));
  };

  const incrementViewCount = (id: string) => {
    setFaqItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, viewCount: item.viewCount + 1 }
        : item
    ));
  };

  // Fonctions utilitaires
  const getFAQByCategory = (categoryId: string): FAQItem[] => {
    return faqItems.filter(item => item.category === categoryId);
  };

  const searchInFAQ = (query: string): FAQSearchResult[] => {
    if (!query.trim()) return [];
    
    return faqItems
      .map(item => ({
        item,
        relevanceScore: calculateRelevanceScore(item, query),
        matchedTerms: findMatchedTerms(item, query)
      }))
      .filter(result => result.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  const getPopularQuestions = (limit = 5): FAQItem[] => {
    return [...faqItems]
      .sort((a, b) => b.helpful - a.helpful)
      .slice(0, limit);
  };

  const getRecentQuestions = (limit = 5): FAQItem[] => {
    return [...faqItems]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, limit);
  };

  return {
    // Données
    categories: FAQ_DATA,
    faqItems,
    filteredItems,
    
    // Accordéon
    openItems,
    hasOpenItems,
    
    // Filtres et recherche
    selectedCategory,
    searchQuery,
    searchResults,
    
    // États
    loading,
    error,
    
    // Actions
    toggleItem,
    setSelectedCategory,
    setSearchQuery,
    markHelpful,
    incrementViewCount,
    getFAQByCategory,
    searchInFAQ,
    getPopularQuestions,
    getRecentQuestions
  };
};

// Fonctions utilitaires pour la recherche
function calculateRelevanceScore(item: FAQItem, query: string): number {
  const lowercaseQuery = query.toLowerCase().trim();
  const searchTerms = lowercaseQuery.split(' ').filter(term => term.length > 2);
  
  if (searchTerms.length === 0) return 0;
  
  let score = 0;
  
  searchTerms.forEach(term => {
    // Score plus élevé si le terme est dans la question
    if (item.question.toLowerCase().includes(term)) score += 10;
    
    // Score moyen si le terme est dans la réponse
    if (item.answer.toLowerCase().includes(term)) score += 5;
    
    // Score faible si le terme est dans les tags
    if (item.tags.some(tag => tag.toLowerCase().includes(term))) score += 3;
  });
  
  return score;
}

function findMatchedTerms(item: FAQItem, query: string): string[] {
  const lowercaseQuery = query.toLowerCase().trim();
  const searchTerms = lowercaseQuery.split(' ').filter(term => term.length > 2);
  const matchedTerms: string[] = [];
  
  searchTerms.forEach(term => {
    if (
      item.question.toLowerCase().includes(term) ||
      item.answer.toLowerCase().includes(term) ||
      item.tags.some(tag => tag.toLowerCase().includes(term))
    ) {
      matchedTerms.push(term);
    }
  });
  
  return [...new Set(matchedTerms)]; // Éliminer les doublons
}