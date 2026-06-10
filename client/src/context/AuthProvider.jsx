import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setToken, setLoading } from '../redux/slices/authSlice';
import { onAuthStateChange, getProfile } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    dispatch(setLoading(true));

    if (!isSupabaseConfigured) {
      dispatch(setLoading(false));
      setInitialized(true);
      return undefined;
    }

    let active = true;

    const finishInit = () => {
      if (!active) return;
      dispatch(setLoading(false));
      setInitialized(true);
    };

    const timeout = setTimeout(finishInit, 4000);

    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        dispatch(setToken(session.access_token));
        try {
          const profile = await getProfile(session.user.id);
          dispatch(setUser({ ...profile, email: session.user.email }));
        } catch {
          dispatch(
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email,
              email: session.user.email,
              role: 'user',
            })
          );
        }
      } else {
        dispatch(setUser(null));
        dispatch(setToken(null));
      }
      clearTimeout(timeout);
      finishInit();
    });

    return () => {
      active = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [dispatch]);

  if (!initialized) {
    return (
      <div className="app-loader" role="status" aria-label="Loading">
        <div className="spinner" />
        <p>Loading StayEase...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={{ initialized }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
