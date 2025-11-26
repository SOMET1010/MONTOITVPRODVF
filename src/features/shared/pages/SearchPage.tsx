/**
 * PAGE DE RECHERCHE FONCTIONNELLE - MONTOIT
 * ===========================================
 * 
 * Page de recherche complète pour remplacer la redirection incorrecte vers /inscription
 * avec filtres avancés, recherche en temps réel et résultats paginés
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// Types de propriétés disponibles
const PROPERTY_TYPES = [
  { id: 'appartement', name: 'Appartement', icon: '🏢' },
  { id: 'maison', name: 'Maison', icon: '🏠' },
  { id: 'villa', name: 'Villa', icon: '🏡' },
  { id: 'terrain', name: 'Terrain', icon: '🌍' },
  { id: 'bureau', name: 'Bureau', icon: '🏢' },
  { id: 'local-commercial', name: 'Local Commercial', icon: '🏪' }
];

// Villes populaires en Côte d'Ivoire
const POPULAR_CITIES = [
  'Abidjan',
  'Bouaké',
  'Daloa',
  'Gagnoa',
  'Korhogo',
  'Man',
  'San-Pédro',
  'Yamoussoukro',
  'Agboville',
  'Grand-Bassam',
  'Sassandra',
  'Odienné'
];

// Gammes de prix
const PRICE_RANGES = {
  location: [
    { min: 0, max: 50000, label: 'Moins de 50 000 FCFA' },
    { min: 50000, max: 100000, label: '50 000 - 100 000 FCFA' },
    { min: 100000, max: 200000, label: '100 000 - 200 000 FCFA' },
    { min: 200000, max: 300000, label: '200 000 - 300 000 FCFA' },
    { min: 300000, max: 500000, label: '300 000 - 500 000 FCFA' },
    { min: 500000, max: Infinity, label: 'Plus de 500 000 FCFA' }
  ],
  purchase: [
    { min: 0, max: 25000000, label: 'Moins de 25M FCFA' },
    { min: 25000000, max: 50000000, label: '25M - 50M FCFA' },
    { min: 50000000, max: 100000000, label: '50M - 100M FCFA' },
    { min: 100000000, max: 200000000, label: '100M - 200M FCFA' },
    { min: 200000000, max: 500000000, label: '200M - 500M FCFA' },
    { min: 500000000, max: Infinity, label: 'Plus de 500M FCFA' }
  ]
};

// Interface pour les filtres de recherche
interface SearchFilters {
  query: string;
  city: string;
  propertyType: string;
  priceType: 'location' | 'purchase';
  priceRange: [number, number];
  bedrooms: number | null;
  bathrooms: number | null;
  furnished: boolean | null;
  parking: boolean | null;
  garden: boolean | null;
  terrace: boolean | null;
}

// Données de démonstration (à remplacer par un appel API)
const SAMPLE_PROPERTIES = [
  {
    id: 1,
    title: 'Magnifique Appartement 3 Pièces',
    description: 'Appartement moderne au Plateau avec vue sur la lagune',
    type: 'appartement',
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    city: 'Abidjan',
    district: 'Plateau',
    price: 150000,
    priceType: 'location' as const,
    furnished: true,
    parking: true,
    mainImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    amenities: ['Climatisation', 'Sécurité', 'Ascenseur'],
    dateAdded: '2024-01-15'
  },
  {
    id: 2,
    title: 'Villa Luxueuse avec Piscine',
    description: 'Villa moderne dans un quartier résidentiel calme',
    type: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    area: 250,
    city: 'Abidjan',
    district: 'Cocody',
    price: 35000000,
    priceType: 'purchase' as const,
    furnished: false,
    parking: true,
    garden: true,
    terrace: true,
    mainImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
    amenities: ['Piscine', 'Jardin', 'Sécurité 24h', 'Groupe électrogène'],
    dateAdded: '2024-01-10'
  },
  {
    id: 3,
    title: 'Terrain Viabilisé 500m²',
    description: 'Terrain constructible dans zone en développement',
    type: 'terrain',
    bedrooms: 0,
    bathrooms: 0,
    area: 500,
    city: 'Bouaké',
    district: 'Centre-ville',
    price: 15000000,
    priceType: 'purchase' as const,
    furnished: false,
    parking: false,
    mainImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
    amenities: ['Électricité', 'Eau', 'Accès routier'],
    dateAdded: '2024-01-08'
  }
];

// Composant de carte de propriété
const PropertyCard: React.FC<{ property: typeof SAMPLE_PROPERTIES[0] }> = ({ property }) => {
  const formatPrice = (price: number, type: string) => {
    if (type === 'purchase') {
      return `${(price / 1000000).toFixed(1)}M FCFA`;
    }
    return `${price.toLocaleString()} FCFA/mois`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={property.mainImage}
          alt={property.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(property.title)}&background=3b82f6&color=fff&size=400`;
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            property.priceType === 'location' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {property.priceType === 'location' ? 'À Louer' : 'À Vendre'}
          </span>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {property.area}m²
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span>{property.district}, {property.city}</span>
        </div>
        
        {property.bedrooms > 0 && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <HomeIcon className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} pièces • {property.bathrooms}SDB</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-blue-600">
            {formatPrice(property.price, property.priceType)}
          </div>
          <div className="text-sm text-gray-500">
            Ajouté le {new Date(property.dateAdded).toLocaleDateString('fr-FR')}
          </div>
        </div>
        
        {property.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{property.amenities.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Voir les détails
        </button>
      </div>
    </div>
  );
};

// Composant de filtre avancé
const AdvancedFilters: React.FC<{ 
  filters: SearchFilters; 
  onFiltersChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ filters, onFiltersChange, isOpen, onToggle }) => {
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <FunnelIcon className="w-4 h-4 mr-2" />
        Filtres avancés
        <ChevronDownIcon className="w-4 h-4 ml-2" />
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filtres avancés</h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Type de bien */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de bien
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => updateFilter('propertyType', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Ville */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville
          </label>
          <select
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes les villes</option>
            {POPULAR_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        
        {/* Chambres */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de chambres
          </label>
          <select
            value={filters.bedrooms || ''}
            onChange={(e) => updateFilter('bedrooms', e.target.value ? parseInt(e.target.value) : null)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes</option>
            <option value="1">1 chambre</option>
            <option value="2">2 chambres</option>
            <option value="3">3 chambres</option>
            <option value="4">4 chambres</option>
            <option value="5">5+ chambres</option>
          </select>
        </div>
        
        {/* Salles de bain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salles de bain
          </label>
          <select
            value={filters.bathrooms || ''}
            onChange={(e) => updateFilter('bathrooms', e.target.value ? parseInt(e.target.value) : null)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes</option>
            <option value="1">1 SDB</option>
            <option value="2">2 SDB</option>
            <option value="3">3 SDB</option>
            <option value="4">4+ SDB</option>
          </select>
        </div>
        
        {/* Type de transaction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de transaction
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="priceType"
                value="location"
                checked={filters.priceType === 'location'}
                onChange={(e) => updateFilter('priceType', e.target.value)}
                className="mr-2"
              />
              Location
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="priceType"
                value="purchase"
                checked={filters.priceType === 'purchase'}
                onChange={(e) => updateFilter('priceType', e.target.value)}
                className="mr-2"
              />
              Achat
            </label>
          </div>
        </div>
      </div>
      
      {/* Équipements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Équipements
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'furnished', label: 'Meublé' },
            { key: 'parking', label: 'Parking' },
            { key: 'garden', label: 'Jardin' },
            { key: 'terrace', label: 'Terrasse' }
          ].map((amenity) => (
            <label key={amenity.key} className="flex items-center">
              <input
                type="checkbox"
                checked={filters[amenity.key as keyof SearchFilters] === true}
                onChange={(e) => updateFilter(amenity.key as keyof SearchFilters, e.target.checked || null)}
                className="mr-2"
              />
              {amenity.label}
            </label>
          ))}
        </div>
      </div>
      
      {/* Boutons d'action */}
      <div className="flex space-x-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => onFiltersChange({
            query: '',
            city: '',
            propertyType: '',
            priceType: 'location',
            priceRange: [0, Infinity],
            bedrooms: null,
            bathrooms: null,
            furnished: null,
            parking: null,
            garden: null,
            terrace: null
          })}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Réinitialiser
        </button>
        <button
          onClick={onToggle}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
};

// Composant principal de la page de recherche
const SearchPage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    city: '',
    propertyType: '',
    priceType: 'location',
    priceRange: [0, Infinity],
    bedrooms: null,
    bathrooms: null,
    furnished: null,
    parking: null,
    garden: null,
    terrace: null
  });
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // Filtrer les propriétés
  const filteredProperties = useMemo(() => {
    return SAMPLE_PROPERTIES.filter((property) => {
      // Recherche textuelle
      if (filters.query && !property.title.toLowerCase().includes(filters.query.toLowerCase()) &&
          !property.description.toLowerCase().includes(filters.query.toLowerCase())) {
        return false;
      }
      
      // Ville
      if (filters.city && property.city !== filters.city) {
        return false;
      }
      
      // Type de bien
      if (filters.propertyType && property.type !== filters.propertyType) {
        return false;
      }
      
      // Type de transaction
      if (property.priceType !== filters.priceType) {
        return false;
      }
      
      // Chambres
      if (filters.bedrooms && property.bedrooms !== filters.bedrooms) {
        return false;
      }
      
      // Salles de bain
      if (filters.bathrooms && property.bathrooms !== filters.bathrooms) {
        return false;
      }
      
      // Équipements
      if (filters.furnished && !property.furnished) {
        return false;
      }
      if (filters.parking && !property.parking) {
        return false;
      }
      if (filters.garden && !property.garden) {
        return false;
      }
      if (filters.terrace && !property.terrace) {
        return false;
      }
      
      return true;
    });
  }, [filters]);
  
  // Pagination
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Rechercher un bien immobilier
          </h1>
          <p className="text-gray-600">
            Trouvez votre logement idéal parmi {SAMPLE_PROPERTIES.length} propriétés disponibles
          </p>
        </div>
        
        {/* Barre de recherche principale */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, description..."
                  value={filters.query}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les villes</option>
                {POPULAR_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les types</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <button
                  onClick={() => setFilters({ ...filters, priceType: 'location' })}
                  className={`px-4 py-3 font-medium transition-colors duration-200 ${
                    filters.priceType === 'location'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Location
                </button>
                <button
                  onClick={() => setFilters({ ...filters, priceType: 'purchase' })}
                  className={`px-4 py-3 font-medium transition-colors duration-200 ${
                    filters.priceType === 'purchase'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Achat
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filtres avancés */}
        <div className="mb-6">
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={isFiltersOpen}
            onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
          />
        </div>
        
        {/* Résultats */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredProperties.length} résultat{filteredProperties.length > 1 ? 's' : ''} trouvé{filteredProperties.length > 1 ? 's' : ''}
            </h2>
            
            {/* Tri */}
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Trier par pertinence</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
              <option>Plus récent</option>
              <option>Plus ancien</option>
            </select>
          </div>
        </div>
        
        {/* Liste des propriétés */}
        {paginatedProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Précédent
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 border rounded-lg ${
                        page === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Suivant
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou d'élargir votre zone géographique.
            </p>
            <button
              onClick={() => setFilters({
                query: '',
                city: '',
                propertyType: '',
                priceType: 'location',
                priceRange: [0, Infinity],
                bedrooms: null,
                bathrooms: null,
                furnished: null,
                parking: null,
                garden: null,
                terrace: null
              })}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;