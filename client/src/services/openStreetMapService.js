const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const MIN_REQUEST_GAP_MS = 1100;
const DEFAULT_OSM_HOTEL_LIMIT = 100;

const coordinatesCache = new Map();
const placeCache = new Map();
const hotelSearchCache = new Map();
let lastRequestAt = 0;
let requestQueue = Promise.resolve();

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runQueuedRequest(task) {
  const run = requestQueue.then(async () => {
    const elapsed = Date.now() - lastRequestAt;
    if (elapsed < MIN_REQUEST_GAP_MS) {
      await wait(MIN_REQUEST_GAP_MS - elapsed);
    }
    lastRequestAt = Date.now();
    return task();
  });

  requestQueue = run.catch(() => {});
  return run;
}

function getNominatimHeaders() {
  const headers = { Accept: 'application/json' };

  if (typeof window === 'undefined') {
    headers['User-Agent'] = 'StayEaseLocalDev/1.0';
  }

  return headers;
}

function getOverpassHeaders() {
  const headers = { Accept: 'application/json' };

  if (typeof window === 'undefined') {
    headers['User-Agent'] = 'StayEaseLocalDev/1.0';
  }

  return headers;
}

export async function getCoordinates(query, { countryCodes = 'in' } = {}) {
  const place = query?.trim();
  if (!place) return null;

  const cacheKey = `${place.toLowerCase()}|${countryCodes}`;
  if (coordinatesCache.has(cacheKey)) return coordinatesCache.get(cacheKey);

  const firstResult = await searchPlace(place, { countryCodes });

  if (!firstResult?.lat || !firstResult?.lon) {
    coordinatesCache.set(cacheKey, null);
    return null;
  }

  const lat = Number.parseFloat(firstResult.lat);
  const lon = Number.parseFloat(firstResult.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    coordinatesCache.set(cacheKey, null);
    return null;
  }

  const result = {
    lat,
    lon,
    lng: lon,
    displayName: firstResult.display_name,
  };

  coordinatesCache.set(cacheKey, result);
  return result;
}

async function searchPlace(query, { countryCodes = 'in' } = {}) {
  const place = query?.trim();
  if (!place) return null;

  const cacheKey = `${place.toLowerCase()}|${countryCodes}`;
  if (placeCache.has(cacheKey)) return placeCache.get(cacheKey);

  const params = new URLSearchParams({
    q: place,
    format: 'json',
    limit: '1',
    addressdetails: '1',
  });

  if (countryCodes) params.set('countrycodes', countryCodes);

  const result = await runQueuedRequest(async () => {
    const response = await fetch(`${NOMINATIM_SEARCH_URL}?${params.toString()}`, {
      headers: getNominatimHeaders(),
    });

    if (!response.ok) {
      throw new Error('Unable to search OpenStreetMap right now. Please try again.');
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0] || null : null;
  });

  placeCache.set(cacheKey, result);
  return result;
}

export async function getHotelCoordinates(hotel) {
  const lat = Number(hotel.lat ?? hotel.latitude);
  const lng = Number(hotel.lng ?? hotel.lon ?? hotel.longitude);

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng, lon: lng };
  }

  const address = [hotel.location, hotel.city, hotel.country || 'India'].filter(Boolean).join(', ');
  return getCoordinates(address);
}

export async function fetchOpenStreetMapHotelsByCity(city, { limit = DEFAULT_OSM_HOTEL_LIMIT } = {}) {
  const place = city?.trim();
  if (!place) return [];

  const cacheKey = `${place.toLowerCase()}|${limit}`;
  if (hotelSearchCache.has(cacheKey)) return hotelSearchCache.get(cacheKey);

  const placeResult = await searchPlace(place);
  if (!placeResult) return [];

  const bbox = getBoundingBox(placeResult);
  const query = buildHotelQuery(bbox, limit);
  const data = await fetchOverpass(query);
  const hotels = normalizeOverpassHotels(data?.elements || [], {
    city: place,
    country: 'India',
  });

  hotelSearchCache.set(cacheKey, hotels);
  return hotels;
}

function getBoundingBox(placeResult) {
  const rawBox = placeResult.boundingbox;
  if (Array.isArray(rawBox) && rawBox.length === 4) {
    const [south, north, west, east] = rawBox.map(Number.parseFloat);
    if ([south, north, west, east].every(Number.isFinite)) {
      return { south, west, north, east };
    }
  }

  const lat = Number.parseFloat(placeResult.lat);
  const lon = Number.parseFloat(placeResult.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  return createBoundingBoxFromCenter(lat, lon);
}

function createBoundingBoxFromCenter(lat, lon, radiusKm = 18) {
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.max(Math.cos((lat * Math.PI) / 180), 0.2));

  return {
    south: lat - latDelta,
    west: lon - lngDelta,
    north: lat + latDelta,
    east: lon + lngDelta,
  };
}

function buildHotelQuery(bbox, limit) {
  if (!bbox) throw new Error('Unable to resolve city boundary for hotel search.');

  const box = `${bbox.south},${bbox.west},${bbox.north},${bbox.east}`;
  const selectors = ['hotel', 'motel', 'guest_house', 'hostel', 'apartment', 'resort']
    .map((type) => `  nwr["tourism"="${type}"](${box});`)
    .join('\n');

  return `[out:json][timeout:25];
(
${selectors}
);
out center qt ${limit};`;
}

async function fetchOverpass(query) {
  let lastError;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, {
        headers: getOverpassHeaders(),
      });

      if (!response.ok) {
        throw new Error(`OpenStreetMap hotel search failed (${response.status})`);
      }

      return response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('OpenStreetMap hotel search failed.');
}

function normalizeOverpassHotels(elements, { city, country }) {
  const seen = new Set();

  return elements
    .map((element) => normalizeOverpassHotel(element, { city, country }))
    .filter(Boolean)
    .filter((hotel) => {
      const key = hotel.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalizeOverpassHotel(element, { city, country }) {
  const tags = element.tags || {};
  const name = tags.name || tags['name:en'] || tags.brand;
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;

  if (!name || !Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return null;

  const category = formatOsmCategory(tags.tourism || 'hotel');
  const location = formatOsmAddress(tags, city);

  return {
    id: `osm-${element.type}-${element.id}`,
    name,
    slug: `osm-${element.type}-${element.id}`,
    description: `${category} listed on OpenStreetMap${location ? ` near ${location}` : ` in ${city}`}.`,
    location: location || city,
    city,
    country,
    amenities: ['OpenStreetMap', category],
    images: [],
    rating: null,
    price_from: null,
    is_featured: false,
    lat: Number(lat),
    lng: Number(lng),
    source: 'openstreetmap',
    source_label: 'OpenStreetMap',
    website: tags.website || tags['contact:website'] || '',
    phone: tags.phone || tags['contact:phone'] || '',
    external_url: `https://www.openstreetmap.org/${element.type}/${element.id}`,
  };
}

function formatOsmAddress(tags, city) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'] || tags['addr:neighbourhood'],
    tags['addr:city'] || city,
  ].filter(Boolean);

  return [...new Set(parts)].join(', ');
}

function formatOsmCategory(value) {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
