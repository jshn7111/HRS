import { useMemo } from 'react';
import { STAYEASE_CONTACT } from '../../constants/contactInfo';

const DEFAULT_NUMBER = STAYEASE_CONTACT.phone;

function toE164ForWhatsApp(phone) {
  // Keep digits only; assume country code already included.
  const digits = String(phone).replace(/\D/g, '');
  return digits;
}

export default function WhatsAppEmergencyButton({ phone = DEFAULT_NUMBER }) {
  const whatsappNumber = useMemo(() => toE164ForWhatsApp(phone), [phone]);

  const href = useMemo(() => {
    // Use wa.me (no message defaults). You can later add text via &text=
    return `https://wa.me/${whatsappNumber}`;
  }, [whatsappNumber]);

  return (
    <a
      className="wa-emergency-btn"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Emergency WhatsApp support"
      title="Emergency WhatsApp support"
    >
      <span className="wa-emergency-icon" aria-hidden="true">
        WhatsApp
      </span>
      <span className="wa-emergency-text">Emergency</span>
    </a>
  );
}

