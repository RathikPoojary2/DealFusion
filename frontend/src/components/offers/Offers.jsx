import React from 'react';
import { Button } from '../ui/button';
import { Heart } from 'lucide-react';

export default function Offers({ offers, savedOffers, setSavedOffers }) {
  const toggleSaveOffer = (offerId) => {
    if (savedOffers.includes(offerId)) {
      setSavedOffers((prev) => prev.filter((id) => id !== offerId));
    } else {
      setSavedOffers((prev) => [...prev, offerId]);
    }
  };

  return (
    <div>
      <h2>Live Offers</h2>
      {offers.length === 0 ? (
        <p>No offers yet.</p>
      ) : (
        <ul>
          {offers.map((o) => {
            const offerId = typeof o.id === 'string' ? o.id : o.id.toString();
            const isSaved = savedOffers.includes(offerId);
            return (
              <li key={o.id || o.external_id}>
                <strong>{o.title}</strong> — ₹{o.price} ({o.category})
                <br />
                <img src={o.url} alt={o.title} width="100" />
                <p>{o.description}</p>
                <Button
                  variant="ghost"
                  onClick={() => toggleSaveOffer(offerId)}
                  className={isSaved ? 'text-red-500' : 'text-gray-400'}
                >
                  <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
