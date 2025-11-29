/**
 * Dashboard Utilisateur Personnel - MONTOIT
 * Page principale du tableau de bord utilisateur
 */

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import {
  getUserProfile,
  getDashboardStats,
  type UserProfile,
  type DashboardStats,
} from '@/services/userDashboardService';
import { ProfileSection } from '../components/ProfileSection';
import { FavoritesSection } from '../components/FavoritesSection';
import { SearchHistorySection } from '../components/SearchHistorySection';
import { NotificationsSection } from '../components/NotificationsSection';
import { DashboardStats as StatsComponent } from '../components/DashboardStats';

type TabType = 'profile' | 'favorites' | 'history' | 'notifications';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileResult, statsResult] = await Promise.all([
        getUserProfile(),
        getDashboardStats(),
      ]);

      if (profileResult.error) {
        throw profileResult.error;
      }

      if (statsResult.error) {
        console.error('Erreur stats:', statsResult.error);
      }

      setProfile(profileResult.data);
      setStats(statsResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Mon Profil', icon: 'User' },
    { id: 'favorites' as TabType, label: 'Mes Favoris', icon: 'Heart' },
    { id: 'history' as TabType, label: 'Historique', icon: 'Clock' },
    { id: 'notifications' as TabType, label: 'Notifications', icon: 'Bell' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-500">Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-center mb-4">
            <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-h4 font-semibold text-neutral-900 mb-2">Erreur</h3>
            <p className="text-neutral-600">{error}</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="btn-primary w-full mt-4"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h2 font-bold text-neutral-900 mb-2">
                Mon Dashboard
              </h1>
              <p className="text-neutral-500">
                Gérez vos activités immobilières en un seul endroit
              </p>
            </div>
            
            {profile && (
              <div className="flex items-center gap-4">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Avatar'}
                    className="h-12 w-12 rounded-full object-cover border-2 border-primary-500"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-500" />
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="font-semibold text-neutral-900">
                    {profile.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-small text-neutral-500">{profile.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && <StatsComponent stats={stats} />}

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <nav className="flex gap-2 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-4 border-b-2 font-semibold text-small whitespace-nowrap
                  transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'profile' && profile && (
          <ProfileSection profile={profile} onUpdate={loadDashboardData} />
        )}
        
        {activeTab === 'favorites' && (
          <FavoritesSection />
        )}
        
        {activeTab === 'history' && (
          <SearchHistorySection />
        )}
        
        {activeTab === 'notifications' && (
          <NotificationsSection />
        )}
      </div>
    </div>
  );
}
