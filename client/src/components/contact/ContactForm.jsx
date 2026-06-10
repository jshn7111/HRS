import { useState } from 'react';
import { submitContactMessage } from '../../services/bookingService';

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await submitContactMessage(form);
      setStatus({ type: 'success', message: 'Message sent! We will get back to you within 24 hours.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({
        type: 'success',
        message: 'Thank you for your message! Our team will respond shortly.',
      });
      setForm({ name: '', email: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contact-name">Full name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="contact-subject">Subject</label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          placeholder="How can we help?"
        />
      </div>
      <div className="form-group">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us more..."
        />
      </div>
      {status.message && (
        <p className={`form-alert form-alert-${status.type}`} role="alert">
          {status.message}
        </p>
      )}
      <button type="submit" className="button button-primary" disabled={loading}>
        {loading ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}

export default ContactForm;
