import { useState } from 'react';

function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-accordion">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question} className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
            <button
              type="button"
              className="faq-question"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              {faq.question}
              <span className="faq-icon" aria-hidden="true">
                {isOpen ? '-' : '+'}
              </span>
            </button>
            {isOpen && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FAQAccordion;
