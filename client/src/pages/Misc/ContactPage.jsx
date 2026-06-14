import SEO from '../../components/seo/SEO';
import ContactForm from '../../components/contact/ContactForm';
import { STAYEASE_CONTACT } from '../../constants/contactInfo';

const CONTACT_INFO = [
  { icon: 'EM', label: 'Email', value: STAYEASE_CONTACT.email },
  { icon: 'PH', label: 'Phone', value: STAYEASE_CONTACT.phone },
  { icon: 'HQ', label: 'Head Office', value: STAYEASE_CONTACT.headOffice },
  { icon: 'HR', label: 'Hours', value: STAYEASE_CONTACT.hours },
];

function ContactPage() {
  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with StayEase support at our Chandigarh head office. We're here to help with bookings, account issues, and partnership inquiries."
        path="/contact"
      />
      <section className="contact-page">
        <div className="page-hero">
          <span className="eyebrow">Get in touch</span>
          <h1>Contact StayEase</h1>
          <p>Have a question or need help? Our team is ready to assist you.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h2>Reach us directly</h2>
            <ul className="contact-info-list">
              {CONTACT_INFO.map((item) => (
                <li key={item.label}>
                  <span className="contact-icon">{item.icon}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="contact-form-wrap">
            <h2>Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
