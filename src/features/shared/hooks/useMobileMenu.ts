import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour gérer l'état du menu hamburger mobile
 * Gère l'ouverture/fermeture du menu avec support d'accessibilité
 */
export const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fermer le menu
  const closeMenu = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 150); // Durée de l'animation
  }, []);

  // Ouvrir le menu
  const openMenu = useCallback(() => {
    setIsOpen(true);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 150);
  }, []);

  // Toggle le menu
  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [isOpen, openMenu, closeMenu]);

  // Fermer le menu avec Escape
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      closeMenu();
    }
  }, [isOpen, closeMenu]);

  // Empêcher le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Gestion des touches clavier
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Fermer le menu en cliquant à l'extérieur
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const menuElement = document.getElementById('mobile-menu');
      const toggleButton = document.getElementById('mobile-menu-toggle');

      if (
        menuElement && 
        !menuElement.contains(target) && 
        !toggleButton?.contains(target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeMenu]);

  return {
    isOpen,
    isAnimating,
    openMenu,
    closeMenu,
    toggleMenu
  };
};

export default useMobileMenu;