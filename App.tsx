import React, { useEffect, useState } from 'react';
import { supabase } from './services/supabase';
import { Homepage } from './views/Homepage';
import { Auth } from './views/Auth';
import { Dashboard } from './views/Dashboard';
import { PrivacyPolicy } from './views/PrivacyPolicy';
import { TermsOfService } from './views/TermsOfService';
import { CookieConsent } from './components/CookieConsent';
import { UserProfile, ViewState } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [viewState, setViewState] = useState<ViewState>('homepage');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check URL hash for direct navigation
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove '#'
      if (hash === 'privacy') {
        setViewState('privacy');
      } else if (hash === 'terms') {
        setViewState('terms');
      }
    };

    // Check hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // Don't override if we're on a legal page
      const hash = window.location.hash.slice(1);
      if (!hash || (hash !== 'privacy' && hash !== 'terms')) {
        if (session) {
          setViewState('dashboard');
          fetchUserProfile(session.user);
        } else {
          setViewState('homepage'); // Mostrar homepage para visitantes
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const hash = window.location.hash.slice(1);
      // Don't override if we're on a legal page
      if (!hash || (hash !== 'privacy' && hash !== 'terms')) {
        if (session) {
          setViewState('dashboard');
          fetchUserProfile(session.user);
        } else {
          setViewState('homepage'); // Mostrar homepage quando fizer logout
          setUserProfile(null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const fetchUserProfile = async (authUser: any) => {
    // Usar apenas dados de auth.users (não precisa de tabela public.users)
    const profile: UserProfile = {
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || '',
      avatar_url: authUser.user_metadata?.avatar_url
    };

    setUserProfile(profile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-justice-500 animate-spin" />
      </div>
    );
  }

  // Helper function to navigate with URL update
  const navigateTo = (view: ViewState) => {
    if (view === 'privacy') {
      window.location.hash = '#privacy';
    } else if (view === 'terms') {
      window.location.hash = '#terms';
    } else {
      window.location.hash = '';
      setViewState(view);
    }
  };

  const handleBackFromLegal = () => {
    window.location.hash = '';
    setViewState(session ? 'dashboard' : 'homepage');
  };

  const renderView = () => {
    // Legal pages - accessible by anyone
    if (viewState === 'privacy') {
      return <PrivacyPolicy onBack={handleBackFromLegal} />;
    }

    if (viewState === 'terms') {
      return <TermsOfService onBack={handleBackFromLegal} />;
    }

    // Authenticated user - show dashboard
    if (session && userProfile) {
      return <Dashboard user={userProfile} onNavigate={navigateTo} />;
    }

    // Auth pages (login/register)
    if (viewState === 'login' || viewState === 'register') {
      return <Auth currentView={viewState} onViewChange={navigateTo} />;
    }

    // Default: Homepage (public)
    return <Homepage onNavigate={navigateTo} />;
  };

  return (
    <>
      {renderView()}
      <CookieConsent onNavigate={navigateTo} />
    </>
  );
};

export default App;