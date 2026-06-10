import { Link } from 'react-router-dom';
import SEO from '../../components/seo/SEO';

function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" path="/404" noindex />
      <section className="notfound-page">
        <div className="notfound-card">
          <h1>404</h1>
          <p>Looks like this page has moved or does not exist.</p>
          <div className="button-row" style={{ justifyContent: 'center' }}>
            <Link to="/" className="button button-primary">
              Go back home
            </Link>
            <Link to="/hotels" className="button button-secondary">
              Browse hotels
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFoundPage;
