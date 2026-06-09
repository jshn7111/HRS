import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header>
      <nav className="site-nav">
        <Link to="/" className="nav-brand">
          StayEase
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
