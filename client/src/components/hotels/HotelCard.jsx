import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/currencyFormatter';

function HotelCard({ hotel }) {
  const image = hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073770499-9b0e3b0b0b0b?w=600';
  const isExternal = Boolean(hotel.external_url);
  const detailLabel = isExternal ? 'View on map' : 'View details';

  const renderDetailsLink = (children, className) => {
    if (isExternal) {
      return (
        <a href={hotel.external_url} className={className} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }

    return (
      <Link to={`/hotels/${hotel.slug}`} className={className}>
        {children}
      </Link>
    );
  };

  return (
    <article className="hotel-card">
      {renderDetailsLink(
        <>
          <img src={image} alt={hotel.name} className="hotel-card-image" loading="lazy" />
          {hotel.is_featured && <span className="hotel-badge">Featured</span>}
          {hotel.rating ? (
            <span className="hotel-rating">Rating {hotel.rating}</span>
          ) : (
            <span className="hotel-rating">{hotel.source_label || 'Listed'}</span>
          )}
        </>,
        'hotel-card-image-wrap'
      )}
      <div className="hotel-card-body">
        <div className="hotel-card-location">
          {hotel.city}, {hotel.country || 'India'}
        </div>
        <h3 className="hotel-card-title">{renderDetailsLink(hotel.name)}</h3>
        <p className="hotel-card-desc">{hotel.description}</p>
        <div className="hotel-card-amenities">
          {hotel.amenities?.slice(0, 3).map((amenity) => (
            <span key={amenity} className="amenity-tag">
              {amenity}
            </span>
          ))}
        </div>
        <div className="hotel-card-footer">
          {hotel.price_from ? (
            <div className="hotel-card-price">
              <span className="price-label">From</span>
              <strong>{formatCurrency(hotel.price_from)}</strong>
              <span className="price-unit">/night</span>
            </div>
          ) : (
            <div className="hotel-card-price">
              <span className="price-label">Source</span>
              <strong>{hotel.source_label || 'Hotel listing'}</strong>
            </div>
          )}
          {renderDetailsLink(detailLabel, 'button button-primary button-sm')}
        </div>
      </div>
    </article>
  );
}

export default HotelCard;
