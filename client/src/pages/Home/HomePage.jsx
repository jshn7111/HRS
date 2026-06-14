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
        description="Search 5000 hotel records across 25 Indian cities with city coordinates, prices, ratings, and Supabase authentication."
        path="/"
        keywords="hotel booking, India hotels, stay booking, Mumbai hotels, Goa resorts, travel"
      />
      <section className="home-page">
        <div className="hero">
          <div className="hero-content">
            <span className="eyebrow">5000 hotels across India</span>
            <h1>Search city hotels with real map-ready coordinates</h1>
            <p>
              Find stays in Jaipur, Delhi, Mumbai, Bangalore, Goa, and more. Every generated hotel includes realistic
              pricing, ratings, amenities, and coordinates ready for OpenStreetMap and Leaflet.
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
              <h2>Live Supabase inventory</h2>
              <p>Authentication, public hotel browsing, RLS policies, and city search are wired into one flow.</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <strong>5000</strong>
                <span>Hotels seeded</span>
              </div>
              <div className="stat-card">
                <strong>25</strong>
                <span>Cities covered</span>
              </div>
              <div className="stat-card">
                <strong>100%</strong>
                <span>Geo-ready rows</span>
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
              <div className="feature-icon" aria-hidden="true">S</div>
              <h3>Search and compare</h3>
              <p>Quickly compare hotel options, prices, and amenities with one easy booking flow.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">Rs</div>
              <h3>Clear pricing</h3>
              <p>See accurate room details and pricing before you confirm so you can book confidently.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">AI</div>
              <h3>Faster account setup</h3>
              <p>Create your account quickly, save favorites, and manage bookings without hassle.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">M</div>
              <h3>Mobile friendly</h3>
              <p>Responsive pages make it simple to browse hotels on any device.</p>
            </article>
          </div>
        </div>

        <Testimonials />

        <div className="site-section cta-section">
          <div className="cta-card">
            <h2>Ready to find your perfect stay?</h2>
            <p>Start with a city search and browse live Supabase hotel data in seconds.</p>
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
