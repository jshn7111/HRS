const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    text: 'StayEase made booking our family vacation effortless. Clear pricing, beautiful hotels, and instant confirmation.',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    location: 'Bangalore',
    text: 'I use StayEase for all my business trips. The search is fast, filters are smart, and support is always helpful.',
    rating: 5,
  },
  {
    name: 'Ananya Patel',
    location: 'Ahmedabad',
    text: 'Found a hidden gem in Jaipur through StayEase. The reviews were accurate and the booking process was seamless.',
    rating: 4,
  },
];

function Testimonials() {
  return (
    <section className="site-section testimonials-section" aria-labelledby="testimonials-heading">
      <div className="section-header">
        <span className="eyebrow">Guest stories</span>
        <h2 id="testimonials-heading">What travelers say</h2>
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t) => (
          <blockquote key={t.name} className="testimonial-card">
            <div className="testimonial-stars" aria-label={`${t.rating} out of 5 stars`}>
              {'★'.repeat(t.rating)}
            </div>
            <p>"{t.text}"</p>
            <footer>
              <strong>{t.name}</strong>
              <span>{t.location}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
