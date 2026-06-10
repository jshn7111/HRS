import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setToken, setLoading } from '../redux/slices/authSlice';
import { onAuthStateChange, getProfile } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    dispatch(setLoading(true));

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
      dispatch(setLoading(false));
      setInitialized(true);
    });

    return () => subscription.unsubscribe();
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
