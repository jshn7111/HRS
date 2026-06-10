import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/seo/SEO';
import { resetPassword } from '../../services/authService';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Forgot Password" path="/forgot-password" noindex />
      <section className="auth-page">
        <div className="auth-card auth-card-single">
          <div className="auth-copy">
            <span className="eyebrow">Account recovery</span>
            <h1>Reset your password</h1>
            <p>Enter your email and we'll send you a link to reset your password.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="form-alert form-alert-error">{error}</p>}
            {sent && (
              <p className="form-alert form-alert-success">
                Reset link sent! Check your email inbox.
              </p>
            )}
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="button button-primary" disabled={loading || sent}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
            <p className="form-note">
              <Link to="/login">Back to login</Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

export default ForgotPasswordPage;
