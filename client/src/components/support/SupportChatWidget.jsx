import { useEffect, useMemo, useRef, useState } from 'react';
import { STAYEASE_CONTACT } from '../../constants/contactInfo';

const SUPPORT_NUMBER = STAYEASE_CONTACT.phone;

const cannedReplies = [
  { key: 'booking', label: 'Booking issue', text: 'I need help with my booking. Please check my reservation.' },
  { key: 'refund', label: 'Refund status', text: 'Can you help me with refund status for my booking?' },
  { key: 'cancel', label: 'Cancel booking', text: 'I want to cancel my booking. Please guide me.' },
  { key: 'payment', label: 'Payment problem', text: 'I have a payment issue. Please assist.' },
  { key: 'general', label: 'General support', text: 'I have a question about hotels and bookings. Please help.' },
];

function formatTime(d) {
  try {
    return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(d);
  } catch {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

function waLink(phone, text) {
  const digits = String(phone).replace(/\D/g, '');
  const encoded = encodeURIComponent(text || '');
  // wa.me supports message via &text=
  return `https://wa.me/${digits}?text=${encoded}`;
}

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => [
    {
      id: crypto?.randomUUID?.() || String(Date.now()),
      from: 'bot',
      text: "Hi! I'm StayEase Support. Choose a quick option below or type your message.",
      time: new Date(),
    },
  ]);
  const scrollerRef = useRef(null);

  const quickOptions = useMemo(() => cannedReplies, []);

  useEffect(() => {
    if (!open) return;
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
  }, [open, messages.length]);

  const send = (text) => {
    const cleaned = String(text || '').trim();
    if (!cleaned) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto?.randomUUID?.() || String(Date.now() + Math.random()), from: 'user', text: cleaned, time: new Date() },
    ]);

    // Simulated response
    const replyMap = {
      booking: 'Please share your booking ID (or the hotel name + check-in date). I will help you resolve it.',
      refund: 'For refund status, share your booking ID and payment reference (if available).',
      cancel: 'I can help with cancellation. Tell me your booking ID and confirm the cancellation date.',
      payment: "Payment issues: please share the payment transaction id or screenshot details, and we'll assist.",
      general: "Sure - tell me what you need. I'll guide you to the right option.",
    };

    const normalized = cleaned.toLowerCase();
    let botText = 'Thanks! A support agent will assist you shortly.';

    for (const opt of quickOptions) {
      if (normalized.includes(opt.key)) {
        botText = replyMap[opt.key] || botText;
        break;
      }
    }

    if (botText === 'Thanks! A support agent will assist you shortly.') {
      if (normalized.includes('refund')) botText = replyMap.refund;
      else if (normalized.includes('cancel')) botText = replyMap.cancel;
      else if (normalized.includes('payment')) botText = replyMap.payment;
      else if (normalized.includes('booking')) botText = replyMap.booking;
      else botText = replyMap.general;
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: crypto?.randomUUID?.() || String(Date.now() + Math.random()), from: 'bot', text: botText, time: new Date() },
      ]);
    }, 550);

    setInput('');
  };

  const botQuickText = (text) => {
    setOpen(true);
    send(text);
  };

  const openWhatsAppWithDraft = () => {
    const draft = messages
      .slice()
      .reverse()
      .find((m) => m.from === 'user')?.text;
    const msg = draft || 'Hi, I need support on StayEase.';
    window.open(waLink(SUPPORT_NUMBER, msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button type="button" className="support-chat-fab" onClick={() => setOpen(true)} aria-label="Open support chat">
        Support
      </button>

      {open && (
        <div className="support-chat-shell" role="dialog" aria-modal="true" aria-label="Support chat">
          <div className="support-chat-header">
            <div className="support-chat-title">
              <span className="support-chat-dot" aria-hidden="true" />
              StayEase Support
            </div>
            <div className="support-chat-actions">
              <button type="button" className="support-chat-icon-btn" onClick={openWhatsAppWithDraft} aria-label="Send via WhatsApp">
                WhatsApp
              </button>
              <button type="button" className="support-chat-icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">
                X
              </button>
            </div>
          </div>

          <div className="support-chat-body" ref={scrollerRef}>
            {messages.map((m) => (
              <div key={m.id} className={m.from === 'user' ? 'support-chat-msg support-chat-msg-user' : 'support-chat-msg'}>
                <div className="support-chat-bubble">
                  <div className="support-chat-text">{m.text}</div>
                  <div className="support-chat-time">{formatTime(m.time)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="support-chat-quick">
            {quickOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className="support-chat-quick-btn"
                onClick={() => botQuickText(opt.text)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <form
            className="support-chat-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              aria-label="Chat message"
            />
            <button type="submit" className="support-chat-send-btn">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

