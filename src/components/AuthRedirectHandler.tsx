import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Only redirect if we're on a public/auth page (not already in-app)
        const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];
        const isOnPublicPage = publicPaths.includes(location.pathname);
        const hasToken = window.location.hash.includes('access_token');

        if (hasToken || isOnPublicPage) {
          // Clear the hash fragment
          window.history.replaceState(null, '', window.location.pathname);
          navigate('/dashboard', { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return null;
};

export default AuthRedirectHandler;
