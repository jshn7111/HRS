import { useEffect, useMemo, useState } from 'react';
import './OffersInline.css';

const getDiscount = (base) => {

  // Deterministic pseudo-discount so offers feel consistent.
  const pct = 8 + (base % 12); // 8%..19%
  const newPrice = Math.max(1, Math.round(base * (1 - pct / 100)));
  return { pct, newPrice };
};

export default function OffersInline({ hotel, room }) {
  const price = useMemo(() => {
    const p = room?.price ?? hotel?.price_from;
    const n = Number(p);
    return Number.isFinite(n) ? n : 0;
  }, [hotel, room]);

  const offer = useMemo(() => {
    if (!price) return null;
    const d = getDiscount(Math.round(price));
    return {
      label: `${d.pct}% OFF limited time`,
      original: price,
      discounted: d.newPrice,
    };
  }, [price]);

  if (!offer) return null;

  return (
    <div className="hotel-offers">
      <div className="hotel-offers-badge">Offers</div>
      <div className="hotel-offers-row">
        <div>
          <div className="hotel-offers-title">{offer.label}</div>
          <div className="hotel-offers-sub">Book now to unlock the deal.</div>
        </div>
        <div className="hotel-offers-price">
          <span className="hotel-offers-original">₹{offer.original.toLocaleString('en-IN')}</span>
          <span className="hotel-offers-now">₹{offer.discounted.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}

