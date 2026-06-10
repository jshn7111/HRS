import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/seo/SEO';
import HotelCard from '../../components/hotels/HotelCard';
import { fetchHotels } from '../../services/hotelService';

function HotelsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');

  useEffect(() => {
    setLoading(true);
    fetchHotels({ city: searchParams.get('city'), search: searchParams.get('search') })
      .then(setHotels)
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city) params.set('city', city);
    setSearchParams(params);
  };

  return (
    <>
      <SEO
        title="Browse Hotels"
        description="Search and compare hotels across India. Find the perfect stay in Mumbai, Bangalore, Goa, Jaipur, and more."
        path="/hotels"
        keywords="hotels India, book hotel, Mumbai hotels, Goa resorts, Bangalore hotels"
      />
      <section className="hotels-page">
        <div className="page-hero">
          <span className="eyebrow">Explore stays</span>
          <h1>Find your perfect hotel</h1>
          <p>Browse curated hotels across India's top destinations.</p>
        </div>

        <form className="filter-bar" onSubmit={handleFilter}>
          <div className="form-group">
            <label htmlFor="filter-search">Search</label>
            <input
              id="filter-search"
              type="search"
              placeholder="Hotel name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="filter-city">City</label>
            <select id="filter-city" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">All cities</option>
              {['Mumbai', 'Bangalore', 'New Delhi', 'Jaipur', 'Goa', 'Shimla'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="button button-primary">
            Apply filters
          </button>
        </form>

        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="empty-state">
            <h2>No hotels found</h2>
            <p>Try adjusting your search or city filter.</p>
          </div>
        ) : (
          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default HotelsPage;
