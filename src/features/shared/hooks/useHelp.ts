/**
 * Hook pour la gestion de la logique métier de la page d'aide
 */

import { useState, useEffect } from 'react';
import { 
  helpService, 
  HelpSection, 
  TutorialItem, 
  HelpArticle 
} from '../services/helpService';

export interface UseHelpReturn {
  // Sections d'aide
  helpSections: HelpSection[];
  filteredSections: HelpSection[];
  selectedCategory: string;
  
  // Tutoriels
  tutorials: TutorialItem[];
  filteredTutorials: TutorialItem[];
  selectedTutorial: TutorialItem | null;
  
  // Articles
  articles: HelpArticle[];
  filteredArticles: HelpArticle[];
  selectedArticle: HelpArticle | null;
  
  // Recherche
  searchQuery: string;
  searchResults: HelpArticle[];
  
  // Actions
  setSelectedCategory: (category: string) => void;
  setSelectedTutorial: (tutorial: TutorialItem | null) => void;
  setSelectedArticle: (article: HelpArticle | null) => void;
  setSearchQuery: (query: string) => void;
  getHelpSectionsByCategory: (category: string) => HelpSection[];
  getTutorialsByCategory: (category: string) => TutorialItem[];
  getArticleById: (id: string) => HelpArticle | undefined;
  searchInArticles: (query: string) => HelpArticle[];
  getRecommendedArticles: (articleId: string) => HelpArticle[];
  
  // États de chargement
  loading: boolean;
  error: string | null;
}

export const useHelp = (): UseHelpReturn => {
  const [helpSections, setHelpSections] = useState<HelpSection[]>([]);
  const [tutorials, setTutorials] = useState<TutorialItem[]>([]);
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  
  // États de filtres et recherche
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // États de chargement et erreur
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simuler un délai de chargement pour l'UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const sections = helpService.getHelpSections();
        const tutorialData = helpService.getTutorials();
        const articleData = helpService.getArticles();
        
        setHelpSections(sections);
        setTutorials(tutorialData);
        setArticles(articleData);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données d\'aide');
        console.error('Erreur useHelp:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrer les sections selon la catégorie sélectionnée
  const filteredSections = selectedCategory === 'tous' 
    ? helpSections 
    : helpSections.filter(section => section.category === selectedCategory);

  // Filtrer les tutoriels selon la catégorie sélectionnée
  const filteredTutorials = selectedCategory === 'tous'
    ? tutorials
    : tutorials.filter(tutorial => tutorial.category === selectedCategory);

  // Filtrer les articles selon la catégorie sélectionnée
  const filteredArticles = selectedCategory === 'tous'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  // Résultats de recherche
  const searchResults = searchQuery.trim() 
    ? helpService.searchArticles(searchQuery)
    : [];

  // Fonctions utilitaires
  const getHelpSectionsByCategory = (category: string): HelpSection[] => {
    return helpService.getHelpSectionsByCategory(category);
  };

  const getTutorialsByCategory = (category: string): TutorialItem[] => {
    return helpService.getTutorialsByCategory(category);
  };

  const getArticleById = (id: string): HelpArticle | undefined => {
    return helpService.getArticleById(id);
  };

  const searchInArticles = (query: string): HelpArticle[] => {
    return helpService.searchArticles(query);
  };

  const getRecommendedArticles = (articleId: string): HelpArticle[] => {
    return helpService.getRecommendedArticles(articleId);
  };

  // Handlers d'événements
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Réinitialiser la recherche lors du changement de catégorie
    setSelectedArticle(null); // Réinitialiser l'article sélectionné
  };

  const handleTutorialSelect = (tutorial: TutorialItem | null) => {
    setSelectedTutorial(tutorial);
    setSelectedArticle(null);
  };

  const handleArticleSelect = (article: HelpArticle | null) => {
    setSelectedArticle(article);
    setSelectedTutorial(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('tous'); // Réinitialiser le filtre
    if (query.trim()) {
      setSelectedArticle(null);
      setSelectedTutorial(null);
    }
  };

  return {
    // États des données
    helpSections,
    filteredSections,
    selectedCategory,
    
    tutorials,
    filteredTutorials,
    selectedTutorial,
    
    articles,
    filteredArticles,
    selectedArticle,
    
    // Recherche
    searchQuery,
    searchResults,
    
    // Actions
    setSelectedCategory: handleCategoryChange,
    setSelectedTutorial: handleTutorialSelect,
    setSelectedArticle: handleArticleSelect,
    setSearchQuery: handleSearch,
    getHelpSectionsByCategory,
    getTutorialsByCategory,
    getArticleById,
    searchInArticles,
    getRecommendedArticles,
    
    // États
    loading,
    error
  };
};