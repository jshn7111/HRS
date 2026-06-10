import SEO, { faqJsonLd } from '../../components/seo/SEO';
import FAQAccordion from '../../components/faq/FAQAccordion';

const FAQS = [
  {
    question: 'How do I book a hotel on StayEase?',
    answer:
      'Create a free account, search for hotels by city or name, select your dates and room type, then confirm your booking. You will receive an instant confirmation email.',
  },
  {
    question: 'Can I cancel or modify my booking?',
    answer:
      'Yes. Go to your Dashboard to view active bookings. Cancellation policies vary by hotel — check the hotel details page for specific terms before booking.',
  },
  {
    question: 'Is my payment information secure?',
    answer:
      'Absolutely. We use industry-standard encryption and secure payment processing. Your card details are never stored on our servers.',
  },
  {
    question: 'Do you offer hotels outside India?',
    answer:
      'Currently StayEase focuses on hotels across India. We are expanding to international destinations soon. Sign up to get notified.',
  },
  {
    question: 'How are hotel ratings calculated?',
    answer:
      'Ratings are based on verified guest reviews submitted after completed stays. We do not allow hotels to edit or remove genuine reviews.',
  },
  {
    question: 'How do I become a hotel partner?',
    answer:
      'Hotel owners can register with the "owner" role and list their property. Contact us at partners@stayease.com for onboarding assistance.',
  },
];

function FAQPage() {
  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about booking hotels, payments, cancellations, and account management on StayEase."
        path="/faq"
        jsonLd={faqJsonLd(FAQS)}
      />
      <section className="faq-page">
        <div className="page-hero">
          <span className="eyebrow">Help center</span>
          <h1>Frequently asked questions</h1>
          <p>Everything you need to know about booking with StayEase.</p>
        </div>
        <FAQAccordion faqs={FAQS} />
      </section>
    </>
  );
}

export default FAQPage;
