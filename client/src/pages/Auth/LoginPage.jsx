import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Welcome back</span>
          <h1>Sign in to StayEase</h1>
          <p>Manage bookings, favorites, and travel plans from one account.</p>
        </div>
        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Enter your password" />
          </div>
          <button type="submit" className="button button-primary">
            Sign in
          </button>
          <p className="form-note">
            Don’t have an account? <Link to="/register">Register now</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
