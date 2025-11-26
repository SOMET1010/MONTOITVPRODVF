/**
 * Service pour gérer les données d'aide
 * Contient la logique de récupération et de gestion des contenus d'aide
 */

export interface HelpSection {
  title: string;
  description: string;
  icon: string;
  href: string;
  category: string;
  order: number;
}

export interface TutorialItem {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: string;
  steps: string[];
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  relatedTopics: string[];
  lastUpdated: string;
  readTime: number;
}

class HelpService {
  private sections: HelpSection[] = [
    {
      title: "Commencer",
      description: "Guide de démarrage rapide pour découvrir MonToit",
      icon: "play-circle",
      href: "/help/getting-started",
      category: "premier-pas",
      order: 1
    },
    {
      title: "Gérer mon compte",
      description: "Configuration et paramètres de votre profil",
      icon: "user-cog",
      href: "/help/account",
      category: "compte",
      order: 2
    },
    {
      title: "Rechercher des propriétés",
      description: "Trouvez votre bien immobilier idéal",
      icon: "search",
      href: "/help/search",
      category: "recherche",
      order: 3
    },
    {
      title: "Propriétaires",
      description: "Publiez et gérez vos annonces",
      icon: "home",
      href: "/help/owners",
      category: "proprietaires",
      order: 4
    },
    {
      title: "Messagerie",
      description: "Communicate avec propriétaires et locataires",
      icon: "message-circle",
      href: "/help/messaging",
      category: "communication",
      order: 5
    },
    {
      title: "Paiements et facturation",
      description: "Gérez vos transactions financières",
      icon: "credit-card",
      href: "/help/payments",
      category: "paiements",
      order: 6
    },
    {
      title: "Sécurité et confidentialité",
      description: "Protégez vos données et votre compte",
      icon: "shield",
      href: "/help/security",
      category: "securite",
      order: 7
    },
    {
      title: "Support technique",
      description: "Résoudre les problèmes techniques",
      icon: "wrench",
      href: "/help/technical",
      category: "support",
      order: 8
    }
  ];

  private tutorials: TutorialItem[] = [
    {
      id: "tutorial-1",
      title: "Première connexion",
      description: "Apprenez à vous connecter et naviguer sur MonToit",
      image: "/tutorials/first-login.jpg",
      duration: "5 min",
      difficulty: "Débutant",
      category: "premier-pas",
      steps: [
        "Accéder à la page de connexion",
        "Saisir vos identifiants",
        "Confirmer votre email",
        "Compléter votre profil"
      ]
    },
    {
      id: "tutorial-2",
      title: "Rechercher une propriété",
      description: "Maîtrisez les outils de recherche avancés",
      image: "/tutorials/search-property.jpg",
      duration: "8 min",
      difficulty: "Débutant",
      category: "recherche",
      steps: [
        "Utiliser la barre de recherche",
        "Filtrer par critères",
        "Consulter les résultats",
        "Sauvegarder vos recherches"
      ]
    },
    {
      id: "tutorial-3",
      title: "Ajouter une propriété",
      description: "Publiez votre annonce immobilière étape par étape",
      image: "/tutorials/add-property.jpg",
      duration: "15 min",
      difficulty: "Intermédiaire",
      category: "proprietaires",
      steps: [
        "Préparer les informations",
        "Ajouter des photos",
        "Définir le tarif",
        "Publier l'annonce"
      ]
    },
    {
      id: "tutorial-4",
      title: "Contacter un propriétaire",
      description: "Initiez une conversation efficacement",
      image: "/tutorials/contact-owner.jpg",
      duration: "6 min",
      difficulty: "Débutant",
      category: "communication",
      steps: [
        "Consulter l'annonce",
        "Utiliser le formulaire de contact",
        "Personnaliser votre message",
        "Suivre votre demande"
      ]
    },
    {
      id: "tutorial-5",
      title: "Gérer vos favoris",
      description: "Organisez vos propriétés préférées",
      image: "/tutorials/manage-favorites.jpg",
      duration: "4 min",
      difficulty: "Débutant",
      category: "recherche",
      steps: [
        "Ajouter aux favoris",
        "Consulter votre liste",
        "Organiser par catégories",
        "Partager vos favoris"
      ]
    }
  ];

  private articles: HelpArticle[] = [
    {
      id: "article-1",
      title: "Comment créer mon compte MonToit ?",
      content: "Pour créer votre compte MonToit, suivez ces étapes simples :\n\n1. Cliquez sur \"S'inscrire\" en haut à droite\n2. Remplissez le formulaire avec vos informations personnelles\n3. Validez votre adresse email\n4. Complétez votre profil avec une photo et une description\n\n**Important :** Votre compte doit être vérifié avant de pouvoir publier des annonces.",
      category: "compte",
      tags: ["inscription", "compte", "premier-pas"],
      relatedTopics: ["Vérification du compte", "Changer mon mot de passe"],
      lastUpdated: "2025-11-20",
      readTime: 3
    },
    {
      id: "article-2",
      title: "Comment rechercher efficacement une propriété ?",
      content: "MonToit offre plusieurs outils pour optimiser votre recherche :\n\n## Critères de base\n- Type de bien (appartement, maison, terrain...)\n- Budget minimum et maximum\n- Localisation (ville, quartier)\n- Nombre de pièces\n\n## Filtres avancés\n- Surface minimum/maximum\n- Étage\n- Exposition\n- Annexes (parking, balcon, jardin...)\n\n## Sauvegarder vos recherches\nCréez des alertes pour être notifié des nouveaux biens correspondant à vos critères.",
      category: "recherche",
      tags: ["recherche", "filtres", "propriétés"],
      relatedTopics: ["Créer une alerte", "Types de propriétés"],
      lastUpdated: "2025-11-22",
      readTime: 5
    },
    {
      id: "article-3",
      title: "Comment publier une annonce de qualité ?",
      content: "Une annonce bien rédigée attire plus de candidats :\n\n## Photos de qualité\n- Utilisez des photos nettes et bien éclaircies\n- Montrez chaque pièce importante\n- Ajoutez des photos des extérieurs (balcon, jardin)\n- Maximum 10 photos par annonce\n\n## Description détaillée\n- Décrivez précisément le bien\n- Mentionnez les atouts (exposition, calme...)\n- Listez les équipements inclus\n\n## Tarification transparente\n- Indiquez le loyer charges comprises/sèches\n- Mentionnez les charges locatives\n- Soyez honnête sur l'état du bien",
      category: "proprietaires",
      tags: ["annonce", "photos", "description"],
      relatedTopics: ["Améliorer la visibilité", "Gérer les demandes"],
      lastUpdated: "2025-11-21",
      readTime: 6
    }
  ];

  /**
   * Récupère toutes les sections d'aide
   */
  getHelpSections(): HelpSection[] {
    return this.sections.sort((a, b) => a.order - b.order);
  }

  /**
   * Récupère les sections par catégorie
   */
  getHelpSectionsByCategory(category: string): HelpSection[] {
    return this.sections
      .filter(section => section.category === category)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Récupère tous les tutoriels
   */
  getTutorials(): TutorialItem[] {
    return this.tutorials;
  }

  /**
   * Récupère les tutoriels par catégorie
   */
  getTutorialsByCategory(category: string): TutorialItem[] {
    return this.tutorials.filter(tutorial => tutorial.category === category);
  }

  /**
   * Récupère un tutoriel par ID
   */
  getTutorialById(id: string): TutorialItem | undefined {
    return this.tutorials.find(tutorial => tutorial.id === id);
  }

  /**
   * Récupère tous les articles
   */
  getArticles(): HelpArticle[] {
    return this.articles;
  }

  /**
   * Récupère les articles par catégorie
   */
  getArticlesByCategory(category: string): HelpArticle[] {
    return this.articles.filter(article => article.category === category);
  }

  /**
   * Récupère un article par ID
   */
  getArticleById(id: string): HelpArticle | undefined {
    return this.articles.find(article => article.id === id);
  }

  /**
   * Recherche dans les articles
   */
  searchArticles(query: string): HelpArticle[] {
    const lowercaseQuery = query.toLowerCase();
    return this.articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Récupère les articles recommandés basés sur un article
   */
  getRecommendedArticles(articleId: string): HelpArticle[] {
    const article = this.getArticleById(articleId);
    if (!article) return [];

    return this.articles
      .filter(a => 
        a.id !== articleId && 
        (a.category === article.category || 
         a.tags.some(tag => article.tags.includes(tag)))
      )
      .slice(0, 3);
  }
}

export const helpService = new HelpService();