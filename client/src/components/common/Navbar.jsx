import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { setUser, setToken } from '../../redux/slices/authSlice';
import { signOut } from '../../services/authService';
import MobileMenu from './MobileMenu';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/hotels', label: 'Hotels' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

function Navbar() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    dispatch(setUser(null));
    dispatch(setToken(null));
  };

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link to="/" className="nav-brand">
          <span className="nav-brand-icon">🏨</span>
          StayEase
        </Link>

        <div className="nav-links nav-links-desktop">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions nav-actions-desktop">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                {user.name?.split(' ')[0] || 'Dashboard'}
              </Link>
              <button type="button" className="button button-secondary button-sm" onClick={handleSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="button button-primary button-sm nav-cta">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="nav-hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
        user={user}
        onSignOut={handleSignOut}
      />
    </header>
  );
}

export default Navbar;
