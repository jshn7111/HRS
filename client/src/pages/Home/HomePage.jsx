import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <section className="home-page">
      <div className="hero">
        <div className="hero-content">
          <span className="eyebrow">Travel with confidence</span>
          <h1>Plan your stay easily with StayEase</h1>
          <p>
            Discover hotels, compare rooms, and book your next trip in a few clicks. StayEase makes hotel
            search effortless on desktop and mobile.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="button button-primary">
              Create account
            </Link>
            <Link to="/login" className="button button-secondary">
              Login
            </Link>
          </div>
        </div>
        <div className="hero-image-card">
          <div className="hero-image-block">
            <h2>Beautiful stays made simple</h2>
            <p>All the hotel details you need are clearly displayed so you can choose with confidence.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <strong>1,250+</strong>
              <span>Hotels curated</span>
            </div>
            <div className="stat-card">
              <strong>98%</strong>
              <span>Guest satisfaction</span>
            </div>
            <div className="stat-card">
              <strong>24/7</strong>
              <span>Support ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section">
        <div className="section-header">
          <span className="eyebrow">Why choose StayEase?</span>
          <h2>Modern booking made easy</h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card feature-card-large">
            <h3>Search and compare</h3>
            <p>Quickly compare hotel options, prices, and amenities with one easy booking flow.</p>
          </article>
          <article className="feature-card">
            <h3>Clear pricing</h3>
            <p>See accurate room details and pricing before you confirm so you can book confidently.</p>
          </article>
          <article className="feature-card">
            <h3>Faster account setup</h3>
            <p>Create your account quickly, save favorites, and manage bookings without hassle.</p>
          </article>
          <article className="feature-card">
            <h3>Mobile friendly</h3>
            <p>Responsive pages make it simple to browse hotels on any device.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
