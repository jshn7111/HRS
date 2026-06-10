import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/seo/SEO';
import { updatePassword } from '../../services/authService';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await updatePassword(password);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Reset Password" path="/reset-password" noindex />
      <section className="auth-page">
        <div className="auth-card auth-card-single">
          <div className="auth-copy">
            <span className="eyebrow">New password</span>
            <h1>Set a new password</h1>
            <p>Choose a strong password for your StayEase account.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="form-alert form-alert-error">{error}</p>}
            <div className="form-group">
              <label htmlFor="password">New password</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm">Confirm password</label>
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update password'}
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

export default ResetPasswordPage;
