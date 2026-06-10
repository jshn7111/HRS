import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CITIES = ['Mumbai', 'Bangalore', 'New Delhi', 'Jaipur', 'Goa', 'Shimla'];

function HeroSearch() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/hotels?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form className="hero-search" onSubmit={handleSearch} aria-label="Search hotels">
      <div className="hero-search-grid">
        <div className="form-group">
          <label htmlFor="search-city">Destination</label>
          <select id="search-city" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="search-checkin">Check-in</label>
          <input
            id="search-checkin"
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="search-checkout">Check-out</label>
          <input
            id="search-checkout"
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="search-guests">Guests</label>
          <select id="search-guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="button button-primary hero-search-btn">
          Search hotels
        </button>
      </div>
    </form>
  );
}

export default HeroSearch;
