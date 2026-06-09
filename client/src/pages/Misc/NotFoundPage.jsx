import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="notfound-page">
      <div className="notfound-card">
        <h1>404</h1>
        <p>Looks like this page has moved or does not exist.</p>
        <Link to="/" className="button button-secondary">
          Go back home
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
