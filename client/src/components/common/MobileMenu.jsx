import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function MobileMenu({ isOpen, onClose, links, user, onSignOut }) {
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mobile-menu-overlay" onClick={onClose} role="presentation">
      <nav className="mobile-menu" onClick={(e) => e.stopPropagation()} aria-label="Mobile navigation">
        <button type="button" className="mobile-menu-close" onClick={onClose} aria-label="Close menu">
          X
        </button>
        <div className="mobile-menu-links">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="mobile-menu-link">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mobile-menu-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="button button-secondary">
                Dashboard
              </Link>
              <button type="button" className="button button-primary" onClick={onSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="button button-secondary">
                Login
              </Link>
              <Link to="/register" className="button button-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default MobileMenu;
