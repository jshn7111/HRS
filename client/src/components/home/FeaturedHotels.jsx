import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HotelCard from '../hotels/HotelCard';
import { fetchFeaturedHotels } from '../../services/hotelService';

function FeaturedHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedHotels(3)
      .then(setHotels)
      .catch(() => setHotels([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="site-section featured-hotels" aria-labelledby="featured-heading">
      <div className="section-header section-header-row">
        <div>
          <span className="eyebrow">Top picks</span>
          <h2 id="featured-heading">Featured hotels</h2>
        </div>
        <Link to="/hotels" className="button button-secondary button-sm">
          View all hotels
        </Link>
      </div>
      {loading ? (
        <div className="loading-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : (
        <div className="hotel-grid">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedHotels;
