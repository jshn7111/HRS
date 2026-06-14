import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/seo/SEO';
import useAuth from '../../hooks/useAuth';
import { fetchUserBookings } from '../../services/bookingService';
import { formatCurrency } from '../../utils/currencyFormatter';

function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserBookings(user.id)
        .then(setBookings)
        .catch(() => setBookings([]))
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  return (
    <>
      <SEO title="My Dashboard" description="Manage your StayEase bookings and account." path="/dashboard" noindex />
      <section className="dashboard-page">
        <div className="page-hero">
          <span className="eyebrow">Your account</span>
          <h1>Welcome, {user?.name?.split(' ')[0] || 'Traveler'}</h1>
          <p>Manage your bookings and explore new destinations.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Profile</h2>
            <dl className="profile-dl">
              <dt>Name</dt>
              <dd>{user?.name || '-'}</dd>
              <dt>Email</dt>
              <dd>{user?.email || '-'}</dd>
              <dt>Role</dt>
              <dd className="role-badge">{user?.role || 'user'}</dd>
            </dl>
          </div>

          <div className="dashboard-card dashboard-card-wide">
            <div className="dashboard-card-header">
              <h2>My bookings</h2>
              <Link to="/hotels" className="button button-secondary button-sm">
                Book a hotel
              </Link>
            </div>
            {loading ? (
              <p className="text-muted">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <div className="empty-state-inline">
                <p>No bookings yet. Start exploring hotels!</p>
                <Link to="/hotels" className="button button-primary button-sm">
                  Browse hotels
                </Link>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((b) => (
                  <div key={b.id} className="booking-item">
                    <div>
                      <strong>{b.hotels?.name}</strong>
                      <span>{b.hotels?.city}</span>
                      <span className="booking-dates">
                        {b.check_in} to {b.check_out}
                      </span>
                    </div>
                    <div className="booking-item-right">
                      <span className={`status-badge status-${b.status}`}>{b.status}</span>
                      <strong>{formatCurrency(b.amount)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default DashboardPage;
