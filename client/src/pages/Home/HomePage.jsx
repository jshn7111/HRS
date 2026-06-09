import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <section className="home-page">
      <div className="hero">
        <div className="hero-content">
          <span className="eyebrow">Travel with confidence</span>
          <h1>Find your perfect hotel in minutes</h1>
          <p>
            Discover trusted stays, compare prices, and book with ease. StayEase helps you plan better
            trips with a clean interface for search, booking, and account access.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="button button-primary">
              Login
            </Link>
            <Link to="/register" className="button button-secondary">
              Register
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="info-block">
            <h2>Simple booking flow</h2>
            <p>Choose hotels, select rooms, and confirm your stay through a smooth experience.</p>
          </div>
          <div className="info-grid">
            <div className="feature-card">
              <h3>Fast search</h3>
              <p>Filter hotels by price, rating, and amenities in one place.</p>
            </div>
            <div className="feature-card">
              <h3>Flexible stays</h3>
              <p>View hotel details clearly and pick the best room for your travel.</p>
            </div>
            <div className="feature-card">
              <h3>Secure booking</h3>
              <p>Trust a stable booking flow and reliable confirmation summary.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
