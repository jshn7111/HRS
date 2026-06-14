import SEO from '../../components/seo/SEO';

const VALUES = [
  { icon: 'TR', title: 'Transparency', desc: 'Clear pricing with no hidden fees. What you see is what you pay.' },
  { icon: 'OK', title: 'Trust', desc: 'Verified hotels and useful details from city-level hotel records.' },
  { icon: 'GO', title: 'Speed', desc: 'Book in minutes with our streamlined, mobile-first experience.' },
  { icon: 'IN', title: 'Accessibility', desc: 'Hotels across India, from metros to hill stations and beaches.' },
];

function AboutPage() {
  return (
    <>
      <SEO
        title="About StayEase"
        description="Learn about StayEase, India's modern hotel booking platform built for travelers who value transparency, trust, and simplicity."
        path="/about"
      />
      <section className="about-page">
        <div className="page-hero">
          <span className="eyebrow">Our story</span>
          <h1>About StayEase</h1>
          <p>
            We're on a mission to make hotel booking in India simple, transparent, and delightful for every
            traveler.
          </p>
        </div>

        <div className="about-content">
          <div className="about-block">
            <h2>Who we are</h2>
            <p>
              StayEase is a modern hotel reservation platform that connects travelers with curated stays across
              India. From luxury resorts in Goa to heritage havelis in Jaipur, we help you find and book the perfect
              accommodation with confidence.
            </p>
            <p>
              Founded with the belief that booking a hotel shouldn't be complicated, we've built a platform that
              prioritizes clear information, honest reviews, and a seamless booking experience on any device.
            </p>
          </div>

          <div className="about-block">
            <h2>Our values</h2>
            <div className="values-grid">
              {VALUES.map((v) => (
                <article key={v.title} className="value-card">
                  <span className="value-icon">{v.icon}</span>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="about-stats">
            <div className="stat-card">
              <strong>5000</strong>
              <span>Hotels listed</span>
            </div>
            <div className="stat-card">
              <strong>50K+</strong>
              <span>Happy travelers</span>
            </div>
            <div className="stat-card">
              <strong>25</strong>
              <span>Cities covered</span>
            </div>
            <div className="stat-card">
              <strong>4.8/5</strong>
              <span>Average rating</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
