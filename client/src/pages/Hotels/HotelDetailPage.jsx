import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO, { hotelJsonLd } from '../../components/seo/SEO';
import { fetchHotelBySlug } from '../../services/hotelService';
import { formatCurrency } from '../../utils/currencyFormatter';

function HotelDetailPage() {
  const { slug } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHotelBySlug(slug)
      .then(setHotel)
      .catch(() => setError('Hotel not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="empty-state">
        <h2>Hotel not found</h2>
        <p>The hotel you're looking for doesn't exist or has been removed.</p>
        <Link to="/hotels" className="button button-primary">
          Browse hotels
        </Link>
      </div>
    );
  }

  const image = hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073770499-9b0e3b0b0b0b?w=1200';

  return (
    <>
      <SEO
        title={hotel.name}
        description={hotel.description}
        path={`/hotels/${hotel.slug}`}
        image={image}
        type="article"
        jsonLd={hotelJsonLd(hotel)}
      />
      <article className="hotel-detail-page">
        <div className="hotel-detail-hero">
          <img src={image} alt={hotel.name} className="hotel-detail-image" />
          <div className="hotel-detail-hero-overlay">
            <span className="eyebrow">{hotel.city}, {hotel.country || 'India'}</span>
            <h1>{hotel.name}</h1>
            <p className="hotel-detail-location">{hotel.location}</p>
            <div className="hotel-detail-meta">
              <span className="hotel-rating-badge">Rating {hotel.rating}</span>
              <span>From {formatCurrency(hotel.price_from)}/night</span>
            </div>
          </div>
        </div>

        <div className="hotel-detail-content">
          <div className="hotel-detail-main">
            <section>
              <h2>About this hotel</h2>
              <p>{hotel.description}</p>
            </section>

            {hotel.amenities?.length > 0 && (
              <section>
                <h2>Amenities</h2>
                <div className="amenities-grid">
                  {hotel.amenities.map((a) => (
                    <span key={a} className="amenity-tag amenity-tag-lg">
                      Included: {a}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {hotel.rooms?.length > 0 && (
              <section>
                <h2>Available rooms</h2>
                <div className="rooms-list">
                  {hotel.rooms.map((room) => (
                    <div key={room.id} className="room-card">
                      <div>
                        <h3>{room.type}</h3>
                        <p>{room.description}</p>
                        <span className="room-capacity">Up to {room.capacity} guests</span>
                      </div>
                      <div className="room-price">
                        <strong>{formatCurrency(room.price)}</strong>
                        <span>/night</span>
                        <Link to="/login" className="button button-primary button-sm">
                          Book now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="hotel-detail-sidebar">
            <div className="booking-card">
              <h3>Book your stay</h3>
              <p className="booking-price">
                From <strong>{formatCurrency(hotel.price_from)}</strong> /night
              </p>
              <Link to="/register" className="button button-primary">
                Create account to book
              </Link>
              <p className="form-note">Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

export default HotelDetailPage;
