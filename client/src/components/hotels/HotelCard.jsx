import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/currencyFormatter';

function HotelCard({ hotel }) {
  const image = hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073770499-9b0e3b0b0b0b?w=600';

  return (
    <article className="hotel-card">
      <Link to={`/hotels/${hotel.slug}`} className="hotel-card-image-wrap">
        <img src={image} alt={hotel.name} className="hotel-card-image" loading="lazy" />
        {hotel.is_featured && <span className="hotel-badge">Featured</span>}
        <span className="hotel-rating">★ {hotel.rating}</span>
      </Link>
      <div className="hotel-card-body">
        <div className="hotel-card-location">{hotel.city}, {hotel.country || 'India'}</div>
        <h3 className="hotel-card-title">
          <Link to={`/hotels/${hotel.slug}`}>{hotel.name}</Link>
        </h3>
        <p className="hotel-card-desc">{hotel.description}</p>
        <div className="hotel-card-amenities">
          {hotel.amenities?.slice(0, 3).map((a) => (
            <span key={a} className="amenity-tag">
              {a}
            </span>
          ))}
        </div>
        <div className="hotel-card-footer">
          <div className="hotel-card-price">
            <span className="price-label">From</span>
            <strong>{formatCurrency(hotel.price_from)}</strong>
            <span className="price-unit">/night</span>
          </div>
          <Link to={`/hotels/${hotel.slug}`} className="button button-primary button-sm">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default HotelCard;
