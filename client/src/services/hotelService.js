import { supabase } from '../lib/supabase';

const FALLBACK_HOTELS = [
  {
    id: '1',
    name: 'The Grand Horizon',
    slug: 'the-grand-horizon',
    description: 'Luxury waterfront hotel with panoramic views and world-class spa.',
    location: 'Marine Drive, Mumbai',
    city: 'Mumbai',
    country: 'India',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
    images: ['https://images.unsplash.com/photo-1566073770499-9b0e3b0b0b0b?w=800'],
    rating: 4.8,
    price_from: 8500,
    is_featured: true,
  },
  {
    id: '2',
    name: 'Royal Palms Resort',
    slug: 'royal-palms-resort',
    description: 'Serene escape with private villas and infinity pool.',
    location: 'Whitefield, Bangalore',
    city: 'Bangalore',
    country: 'India',
    amenities: ['WiFi', 'Pool', 'Garden', 'Restaurant'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    rating: 4.6,
    price_from: 6200,
    is_featured: true,
  },
  {
    id: '3',
    name: 'City Lights Boutique',
    slug: 'city-lights-boutique',
    description: 'Modern boutique hotel in the heart of the city.',
    location: 'Connaught Place, New Delhi',
    city: 'New Delhi',
    country: 'India',
    amenities: ['WiFi', 'Bar', 'Restaurant', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    rating: 4.5,
    price_from: 4800,
    is_featured: true,
  },
];

export async function fetchHotels({ city, search, featured } = {}) {
  let query = supabase.from('hotels').select('*').order('rating', { ascending: false });

  if (city) query = query.ilike('city', `%${city}%`);
  if (search) query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%,location.ilike.%${search}%`);
  if (featured) query = query.eq('is_featured', true);

  const { data, error } = await query;
  if (error) {
    console.warn('Using fallback hotel data:', error.message);
    return filterFallback(FALLBACK_HOTELS, { city, search, featured });
  }
  return data?.length ? data : filterFallback(FALLBACK_HOTELS, { city, search, featured });
}

export async function fetchHotelBySlug(slug) {
  const { data, error } = await supabase
    .from('hotels')
    .select('*, rooms(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    const fallback = FALLBACK_HOTELS.find((h) => h.slug === slug);
    if (fallback) return { ...fallback, rooms: [] };
    throw error;
  }
  return data;
}

export async function fetchFeaturedHotels(limit = 6) {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error || !data?.length) {
    return FALLBACK_HOTELS.slice(0, limit);
  }
  return data;
}

function filterFallback(hotels, { city, search, featured }) {
  let result = [...hotels];
  if (city) result = result.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q)
    );
  }
  if (featured) result = result.filter((h) => h.is_featured);
  return result;
}
