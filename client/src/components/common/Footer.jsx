import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-columns">
          <div>
            <h3>StayEase</h3>
            <p>Smart booking for every traveler with clear pricing and trusted stays.</p>
          </div>
          <div>
            <h3>Quick links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 StayEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
