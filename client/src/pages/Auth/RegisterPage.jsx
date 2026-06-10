import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/seo/SEO';
import { signUp } from '../../services/authService';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create Account" description="Create your free StayEase account to book hotels and manage trips." path="/register" noindex />
      <section className="auth-page">
        <div className="auth-card">
          <div className="auth-copy">
            <span className="eyebrow">Get started</span>
            <h1>Create your StayEase account</h1>
            <p>Sign up to manage bookings, save favorites, and book stays faster.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <p className="form-alert form-alert-error" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="form-alert form-alert-success" role="alert">
                Account created! Check your email to verify, then sign in.
              </p>
            )}
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
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
                minLength={6}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="button button-primary" disabled={loading || success}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <p className="form-note">
              Already registered? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

export default RegisterPage;
