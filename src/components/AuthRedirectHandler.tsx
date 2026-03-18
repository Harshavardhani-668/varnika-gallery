import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  locationRef.current = location;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const currentLocation = locationRef.current;
        const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];
        const isOnPublicPage = publicPaths.includes(currentLocation.pathname);
        const hasToken = window.location.hash.includes('access_token');

        if (hasToken || isOnPublicPage) {
          // Clear the hash fragment if present
          if (hasToken) {
            window.history.replaceState(null, '', currentLocation.pathname + currentLocation.search);
          }

          // Respect the redirect query param from ProtectedRoute
          const params = new URLSearchParams(currentLocation.search);
          const redirectTo = params.get('redirect') || '/dashboard';
          navigate(redirectTo, { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
};

export default AuthRedirectHandler;
