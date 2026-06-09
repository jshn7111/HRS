import { Link } from 'react-router-dom';

function RegisterPage() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Get started</span>
          <h1>Create your StayEase account</h1>
          <p>Sign up to manage bookings, save favorites, and book stays faster.</p>
        </div>
        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input id="name" type="text" placeholder="Your full name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Create a password" />
          </div>
          <button type="submit" className="button button-primary">
            Create account
          </button>
          <p className="form-note">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;
