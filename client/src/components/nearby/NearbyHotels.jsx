import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { fetchHotels } from '../../services/hotelService';
import { getCoordinates, getHotelCoordinates } from '../../services/openStreetMapService';

const DEFAULT_CENTER_FALLBACK = { lat: 19.076, lng: 72.8777 }; // Mumbai

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

export default function NearbyHotels() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('city') || '');
  const [distanceKm, setDistanceKm] = useState(10);
  const [hotels, setHotels] = useState([]);

  const resolveCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (e) => reject(e),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const resolveSearchCenter = async () => {
    const place = locationQuery.trim();
    if (place) {
      const coords = await getCoordinates(place);
      if (!coords) throw new Error(`No coordinates found for "${place}". Try another city or area.`);
      return { lat: coords.lat, lng: coords.lng };
    }

    try {
      return await resolveCurrentLocation();
    } catch {
      return DEFAULT_CENTER_FALLBACK;
    }
  };

  const attachLatLngToHotels = async (list) => {
    const enriched = [];

    for (const hotel of list) {
      try {
        const coords = await getHotelCoordinates(hotel);
        if (coords) {
          enriched.push({ ...hotel, lat: coords.lat, lng: coords.lng });
        } else {
          enriched.push(hotel);
        }
      } catch {
        enriched.push(hotel);
      }
    }

    return enriched;
  };

  const handleFindNearby = async (event) => {
    event?.preventDefault();
    setLoading(true);
    setError('');

    try {
      const nextCenter = await resolveSearchCenter();

      const list = await fetchHotels({});
      const enriched = await attachLatLngToHotels(list);

      const within = enriched
        .filter((h) => typeof h.lat === 'number' && typeof h.lng === 'number')
        .map((h) => ({ ...h, distanceKm: haversineKm(nextCenter, { lat: h.lat, lng: h.lng }) }))
        .filter((h) => h.distanceKm <= distanceKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      setHotels(within);

      if (!within.length) {
        setError('No hotels found within the selected distance. Try increasing the radius.');
      }
    } catch (e) {
      setError(e?.message || 'Failed to load nearby hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFindNearby();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="nearby-page">
      <div className="page-hero">
        <span className="eyebrow">Find hotels near you</span>
        <h1>Nearby stays</h1>
        <p>Use your current location or search by city with OpenStreetMap.</p>
      </div>

      <form
        className="filter-bar"
        style={{ gridTemplateColumns: 'minmax(180px, 1fr) minmax(140px, auto) auto auto' }}
        onSubmit={handleFindNearby}
      >
        <div className="form-group">
          <label htmlFor="nearby-location">City or area</label>
          <input
            id="nearby-location"
            type="search"
            placeholder="Jaipur, Mumbai..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="radius">Distance (km)</label>
          <select id="radius" value={distanceKm} onChange={(e) => setDistanceKm(Number(e.target.value))}>
            {[5, 10, 15, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} km
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="button button-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search nearby'}
        </button>

        <button
          type="button"
          className="button button-secondary"
          onClick={() => navigate('/hotels')}
          disabled={loading}
        >
          View all hotels
        </button>
      </form>

      {error && (
        <div className="empty-state-inline">
          <h2 style={{ margin: 0 }}>Heads up</h2>
          <p style={{ marginTop: 0 }}>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : hotels.length ? (
        <div className="hotel-grid">
          {hotels.map((hotel) => (
            <article key={hotel.id} className="hotel-card" style={{ cursor: 'pointer' }}>
              <div
                className="hotel-card-image-wrap"
                onClick={() => navigate(`/hotels/${hotel.slug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate(`/hotels/${hotel.slug}`);
                }}
              >
                <img
                  src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073770499-9b0e3b0b0b0b?w=600'}
                  alt={hotel.name}
                  className="hotel-card-image"
                  loading="lazy"
                />
                <span className="hotel-badge">Nearby</span>
                <span className="hotel-rating">{hotel.distanceKm.toFixed(1)} km</span>
              </div>
              <div className="hotel-card-body">
                <div className="hotel-card-location">
                  {hotel.city}, {hotel.country || 'India'}
                </div>
                <h3 className="hotel-card-title">{hotel.name}</h3>
                <p className="hotel-card-desc">{hotel.description}</p>
                <div className="hotel-card-footer">
                  <div className="hotel-card-price">
                    <span className="price-label">From</span>
                    <strong>{hotel.price_from ? `Rs. ${hotel.price_from}` : ''}</strong>
                    <span className="price-unit">/night</span>
                  </div>
                  <button
                    type="button"
                    className="button button-primary button-sm"
                    onClick={() => navigate(`/hotels/${hotel.slug}`)}
                  >
                    View details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No nearby hotels</h2>
          <p>Try increasing the radius or check location permission.</p>
        </div>
      )}

      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '1.25rem' }}>
        Tip: If hotels do not have lat/lng in your database, OpenStreetMap geocodes their location/address.
      </p>
    </section>
  );
}
