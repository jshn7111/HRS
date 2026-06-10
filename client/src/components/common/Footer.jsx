import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-columns">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              🏨 StayEase
            </Link>
            <p>
              Smart hotel booking for every traveler. Compare stays, read reviews, and book with confidence across
              India.
            </p>
            <div className="footer-social">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                𝕏
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                📷
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                in
              </a>
            </div>
          </div>
          <div>
            <h3>Explore</h3>
            <ul>
              <li><Link to="/hotels">Browse hotels</Link></li>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3>Account</h3>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/dashboard">My bookings</Link></li>
            </ul>
          </div>
          <div>
            <h3>Popular cities</h3>
            <ul>
              <li><Link to="/hotels?city=Mumbai">Mumbai</Link></li>
              <li><Link to="/hotels?city=Bangalore">Bangalore</Link></li>
              <li><Link to="/hotels?city=Goa">Goa</Link></li>
              <li><Link to="/hotels?city=Jaipur">Jaipur</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} StayEase. All rights reserved.</p>
          <p className="footer-tagline">Making hotel booking simple, fast, and secure.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
