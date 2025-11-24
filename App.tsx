import React, { useEffect, useState } from 'react';
import { supabase } from './services/supabase';
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
  const [viewState, setViewState] = useState<ViewState>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setViewState('dashboard');
        fetchUserProfile(session.user);
      } else {
        setViewState('login');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setViewState('dashboard');
        fetchUserProfile(session.user);
      } else {
        setViewState('login');
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: any) => {
    // 1. Try to get from 'users' table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (data) {
      setUserProfile(data);
    } else {
      // 2. If not in DB yet (e.g. first Google Login), fallback to auth metadata
      const profile: UserProfile = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || '',
        avatar_url: authUser.user_metadata?.avatar_url
      };
      
      setUserProfile(profile);

      // Attempt to sync to DB silently if it was missing
      if (error && (error.code === 'PGRST116' || error.message.includes('JSON'))) {
         await supabase.from('users').upsert({
             id: profile.id,
             email: profile.email,
             name: profile.name
         });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-justice-500 animate-spin" />
      </div>
    );
  }

  const renderView = () => {
    if (viewState === 'privacy') {
      return <PrivacyPolicy onBack={() => setViewState(session ? 'dashboard' : 'login')} />;
    }

    if (viewState === 'terms') {
      return <TermsOfService onBack={() => setViewState(session ? 'dashboard' : 'login')} />;
    }

    if (session && userProfile) {
      return <Dashboard user={userProfile} onNavigate={setViewState} />;
    }

    return <Auth currentView={viewState} onViewChange={setViewState} />;
  };

  return (
    <>
      {renderView()}
      <CookieConsent />
    </>
  );
};

export default App;