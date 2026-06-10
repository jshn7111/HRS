import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SEO from '../../components/seo/SEO';
import { signIn } from '../../services/authService';
import { setUser, setToken, setError } from '../../redux/slices/authSlice';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');
    try {
      const { session, user } = await signIn(form);
      dispatch(setToken(session.access_token));
      dispatch(
        setUser({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email,
          role: user.user_metadata?.role || 'user',
        })
      );
      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || 'Invalid email or password';
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Sign In" description="Sign in to your StayEase account to manage bookings and favorites." path="/login" noindex />
      <section className="auth-page">
        <div className="auth-card">
          <div className="auth-copy">
            <span className="eyebrow">Welcome back</span>
            <h1>Sign in to StayEase</h1>
            <p>Manage bookings, favorites, and travel plans from one account.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <p className="form-alert form-alert-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-row form-row-between">
              <Link to="/forgot-password" className="form-link">
                Forgot password?
              </Link>
            </div>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <p className="form-note">
              Don't have an account? <Link to="/register">Register now</Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

export default LoginPage;
