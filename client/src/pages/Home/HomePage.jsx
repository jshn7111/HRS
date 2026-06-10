import { Link } from 'react-router-dom';
import SEO from '../../components/seo/SEO';
import HeroSearch from '../../components/home/HeroSearch';
import FeaturedHotels from '../../components/home/FeaturedHotels';
import Testimonials from '../../components/home/Testimonials';

function HomePage() {
  return (
    <>
      <SEO
        title="Book Hotels Across India"
        description="Discover premium hotels, compare rooms, and book your next stay with StayEase. Trusted by thousands of travelers across India."
        path="/"
        keywords="hotel booking, India hotels, stay booking, Mumbai hotels, Goa resorts, travel"
      />
      <section className="home-page">
        <div className="hero">
          <div className="hero-content">
            <span className="eyebrow">Travel with confidence</span>
            <h1>Plan your stay easily with StayEase</h1>
            <p>
              Discover hotels, compare rooms, and book your next trip in a few clicks. StayEase makes hotel search
              effortless on desktop and mobile.
            </p>
            <HeroSearch />
            <div className="hero-actions">
              <Link to="/hotels" className="button button-primary">
                Browse all hotels
              </Link>
              <Link to="/register" className="button button-secondary">
                Create free account
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

        <FeaturedHotels />

        <div className="site-section">
          <div className="section-header">
            <span className="eyebrow">Why choose StayEase?</span>
            <h2>Modern booking made easy</h2>
          </div>
          <div className="feature-grid">
            <article className="feature-card feature-card-large">
              <div className="feature-icon">🔍</div>
              <h3>Search and compare</h3>
              <p>Quickly compare hotel options, prices, and amenities with one easy booking flow.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Clear pricing</h3>
              <p>See accurate room details and pricing before you confirm so you can book confidently.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Faster account setup</h3>
              <p>Create your account quickly, save favorites, and manage bookings without hassle.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile friendly</h3>
              <p>Responsive pages make it simple to browse hotels on any device.</p>
            </article>
          </div>
        </div>

        <Testimonials />

        <div className="site-section cta-section">
          <div className="cta-card">
            <h2>Ready to find your perfect stay?</h2>
            <p>Join thousands of travelers who book smarter with StayEase.</p>
            <div className="button-row">
              <Link to="/hotels" className="button button-primary">
                Start exploring
              </Link>
              <Link to="/register" className="button button-secondary">
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
