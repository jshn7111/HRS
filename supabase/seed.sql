-- StayEase Sample Data
-- Run AFTER schema.sql in Supabase SQL Editor

INSERT INTO public.hotels (name, slug, description, location, city, country, amenities, images, rating, price_from, is_verified, is_featured)
VALUES
  (
    'The Grand Horizon',
    'the-grand-horizon',
    'Luxury waterfront hotel with panoramic views, fine dining, and a world-class spa. Perfect for business and leisure travelers seeking premium comfort.',
    'Marine Drive, Mumbai',
    'Mumbai',
    'India',
    ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking'],
    ARRAY['https://images.unsplash.com/photo-1566073770499-9b0e3b0b0b0b?w=800'],
    4.8,
    8500,
    true,
    true
  ),
  (
    'Royal Palms Resort',
    'royal-palms-resort',
    'A serene escape nestled in lush greenery. Features private villas, infinity pool, and authentic local cuisine in a tranquil setting.',
    'Whitefield, Bangalore',
    'Bangalore',
    'India',
    ARRAY['WiFi', 'Pool', 'Garden', 'Restaurant', 'Room Service'],
    ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    4.6,
    6200,
    true,
    true
  ),
  (
    'City Lights Boutique',
    'city-lights-boutique',
    'Modern boutique hotel in the heart of the city. Stylish rooms, rooftop bar, and walking distance to major attractions.',
    'Connaught Place, New Delhi',
    'New Delhi',
    'India',
    ARRAY['WiFi', 'Bar', 'Restaurant', 'Concierge', 'Laundry'],
    ARRAY['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    4.5,
    4800,
    true,
    true
  ),
  (
    'Heritage Haveli',
    'heritage-haveli',
    'Experience royal Rajasthani hospitality in a restored 18th-century haveli with courtyard dining and cultural performances.',
    'Old City, Jaipur',
    'Jaipur',
    'India',
    ARRAY['WiFi', 'Restaurant', 'Cultural Tours', 'Garden', 'Parking'],
    ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    4.7,
    5500,
    true,
    false
  ),
  (
    'Coastal Breeze Inn',
    'coastal-breeze-inn',
    'Beachfront property with direct sea access, water sports, and sunset dining. Ideal for family vacations.',
    'Baga Beach, Goa',
    'Goa',
    'India',
    ARRAY['WiFi', 'Beach Access', 'Pool', 'Restaurant', 'Water Sports'],
    ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    4.4,
    3900,
    true,
    false
  ),
  (
    'Summit View Lodge',
    'summit-view-lodge',
    'Mountain retreat with breathtaking Himalayan views, fireplace lounges, and guided trekking packages.',
    'Mall Road, Shimla',
    'Shimla',
    'India',
    ARRAY['WiFi', 'Fireplace', 'Restaurant', 'Trekking', 'Parking'],
    ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    4.3,
    3200,
    true,
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample rooms for each hotel
INSERT INTO public.rooms (hotel_id, type, description, price, capacity, available)
SELECT h.id, r.type, r.description, r.price, r.capacity, true
FROM public.hotels h
CROSS JOIN (
  VALUES
    ('Standard Room', 'Comfortable room with essential amenities', 3200, 2),
    ('Deluxe Room', 'Spacious room with city view and premium bedding', 4800, 2),
    ('Suite', 'Luxury suite with living area and exclusive amenities', 8500, 4)
) AS r(type, description, price, capacity)
WHERE h.slug IN ('the-grand-horizon', 'royal-palms-resort', 'city-lights-boutique', 'heritage-haveli', 'coastal-breeze-inn', 'summit-view-lodge');
