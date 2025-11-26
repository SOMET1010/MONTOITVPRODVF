import React from 'react';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  HomeIcon,
  PlusCircleIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import MobileMenu from '../mobile/responsive/components/MobileMenu';
import { useMobileMenu } from '../features/shared/hooks/useMobileMenu';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { toggleMenu } = useMobileMenu();

  // Éléments de navigation desktop
  const navigationItems = [
    { label: 'Accueil', href: '/', icon: HomeIcon },
    { label: 'Rechercher', href: '/recherche', icon: MagnifyingGlassIcon },
    { label: 'Ajouter un bien', href: '/ajouter-bien', icon: PlusCircleIcon },
    { label: 'Contact', href: '/contact', icon: PhoneIcon },
    { label: 'Aide', href: '/aide', icon: QuestionMarkCircleIcon }
  ];

  return (
    <>
      <header className={`bg-white shadow-md border-b border-gray-200 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <a
                href="/"
                className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                aria-label="MonToit - Accueil"
              >
                <HomeIcon className="w-8 h-8" />
                <span className="hidden sm:block">MonToit</span>
              </a>
            </div>

            {/* Navigation desktop */}
            <nav className="hidden md:flex space-x-8" aria-label="Navigation principale">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Actions utilisateur desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="/mon-compte"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <UserIcon className="w-4 h-4" />
                <span>Mon Compte</span>
              </a>
              
              <a
                href="/ajouter-bien"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Publier un bien
              </a>
            </div>

            {/* Bouton menu mobile */}
            <div className="md:hidden">
              <button
                id="mobile-menu-toggle"
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                aria-label="Ouvrir le menu de navigation"
                aria-expanded="false"
                aria-controls="mobile-menu"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <MobileMenu />
    </>
  );
};

export default Header;