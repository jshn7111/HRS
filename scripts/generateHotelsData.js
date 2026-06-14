const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const JSON_OUTPUT = path.join(DATA_DIR, 'hotels.json');
const SQL_OUTPUT = path.join(DATA_DIR, 'hotels.sql');
const CITY_CENTER_CACHE = path.join(DATA_DIR, 'city-centers.json');

const TOTAL_HOTELS = 5000;
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const NOMINATIM_DELAY_MS = 1200;
const USER_AGENT = 'StayEaseHotelDataGenerator/1.0';
const SEED = 20260614;

const HOTEL_IMPORT_BASE_COLUMNS = [
  'id',
  'hotel_name',
  'city',
  'state',
  'address',
  'latitude',
  'longitude',
  'star_rating',
  'review_score',
  'review_count',
  'price_per_night',
  'category',
  'amenities',
  'description',
  'image_url',
  'phone',
  'email',
  'created_at',
];

const HOTEL_IMPORT_APP_COLUMNS = [
  'name',
  'slug',
  'location',
  'country',
  'images',
  'rating',
  'price_from',
  'is_verified',
  'is_featured',
];

const HOTEL_IMPORT_COLUMNS = [...HOTEL_IMPORT_BASE_COLUMNS, ...HOTEL_IMPORT_APP_COLUMNS];
const HOTEL_IMPORT_UPDATE_COLUMNS = HOTEL_IMPORT_COLUMNS.filter(
  (column) => !['id', 'hotel_name', 'created_at'].includes(column)
);

const AMENITIES = [
  'Free WiFi',
  'Swimming Pool',
  'Spa',
  'Gym',
  'Restaurant',
  'Airport Shuttle',
  'Parking',
  'Conference Hall',
  'Bar',
  'Pet Friendly',
  'Room Service',
  'Laundry',
  'EV Charging',
  'Breakfast Included',
];

const PRIMARY_CITY_COUNTS = {
  Jaipur: 350,
  Delhi: 700,
  Mumbai: 700,
  Chandigarh: 250,
  Bangalore: 600,
  Hyderabad: 400,
  Pune: 350,
  Chennai: 300,
  Kolkata: 300,
};

const OTHER_CITIES = [
  'Ahmedabad',
  'Udaipur',
  'Jodhpur',
  'Goa',
  'Shimla',
  'Manali',
  'Amritsar',
  'Lucknow',
  'Surat',
  'Indore',
  'Bhopal',
  'Dehradun',
  'Agra',
  'Varanasi',
  'Kochi',
  'Mysore',
];

const CITY_COUNTS = {
  ...PRIMARY_CITY_COUNTS,
  ...Object.fromEntries(OTHER_CITIES.map((city, index) => [city, index < 10 ? 66 : 65])),
};

const CITY_CONFIG = {
  Jaipur: {
    state: 'Rajasthan',
    phoneCode: '141',
    pincode: 302000,
    maxRadiusKm: 15,
    localities: ['C Scheme', 'MI Road', 'Bani Park', 'Malviya Nagar', 'Vaishali Nagar', 'Civil Lines', 'Amer Road', 'Mansarovar', 'Tonk Road', 'Raja Park'],
  },
  Delhi: {
    state: 'Delhi',
    phoneCode: '11',
    pincode: 110000,
    maxRadiusKm: 15,
    localities: ['Connaught Place', 'Karol Bagh', 'Aerocity', 'Saket', 'Dwarka', 'Rohini', 'Chanakyapuri', 'Lajpat Nagar', 'Paharganj', 'Hauz Khas'],
  },
  Mumbai: {
    state: 'Maharashtra',
    phoneCode: '22',
    pincode: 400000,
    maxRadiusKm: 15,
    localities: ['Bandra West', 'Colaba', 'Andheri East', 'Juhu', 'Powai', 'Marine Drive', 'Lower Parel', 'Dadar', 'Worli', 'Vile Parle'],
  },
  Chandigarh: {
    state: 'Chandigarh',
    phoneCode: '172',
    pincode: 160000,
    maxRadiusKm: 9,
    localities: ['Sector 17', 'Sector 22', 'Sector 35', 'Sector 43', 'Industrial Area', 'Zirakpur Road', 'Sector 8', 'Manimajra'],
  },
  Bangalore: {
    state: 'Karnataka',
    phoneCode: '80',
    pincode: 560000,
    maxRadiusKm: 15,
    localities: ['MG Road', 'Indiranagar', 'Koramangala', 'Whitefield', 'Electronic City', 'Hebbal', 'Jayanagar', 'Marathahalli', 'Yeshwanthpur', 'HSR Layout'],
  },
  Hyderabad: {
    state: 'Telangana',
    phoneCode: '40',
    pincode: 500000,
    maxRadiusKm: 15,
    localities: ['Banjara Hills', 'HITEC City', 'Gachibowli', 'Secunderabad', 'Begumpet', 'Jubilee Hills', 'Madhapur', 'Kukatpally', 'Abids'],
  },
  Pune: {
    state: 'Maharashtra',
    phoneCode: '20',
    pincode: 411000,
    maxRadiusKm: 15,
    localities: ['Koregaon Park', 'Shivajinagar', 'Viman Nagar', 'Hinjewadi', 'Baner', 'Kalyani Nagar', 'Deccan Gymkhana', 'Wakad', 'Camp'],
  },
  Chennai: {
    state: 'Tamil Nadu',
    phoneCode: '44',
    pincode: 600000,
    maxRadiusKm: 15,
    localities: ['T Nagar', 'Nungambakkam', 'Guindy', 'Anna Nagar', 'Mylapore', 'OMR', 'Adyar', 'Egmore', 'Velachery'],
  },
  Kolkata: {
    state: 'West Bengal',
    phoneCode: '33',
    pincode: 700000,
    maxRadiusKm: 15,
    localities: ['Park Street', 'Salt Lake', 'New Town', 'Ballygunge', 'Howrah', 'Esplanade', 'Alipore', 'Rajarhat', 'Dum Dum'],
  },
  Ahmedabad: {
    state: 'Gujarat',
    phoneCode: '79',
    pincode: 380000,
    maxRadiusKm: 15,
    localities: ['Navrangpura', 'SG Highway', 'Ashram Road', 'Maninagar', 'Satellite', 'Ellisbridge', 'Vastrapur', 'Prahlad Nagar'],
  },
  Udaipur: {
    state: 'Rajasthan',
    phoneCode: '294',
    pincode: 313000,
    maxRadiusKm: 10,
    localities: ['Lake Pichola', 'Fateh Sagar Road', 'Hiran Magri', 'City Palace Road', 'Badi Road', 'Sukher', 'Surajpole'],
  },
  Jodhpur: {
    state: 'Rajasthan',
    phoneCode: '291',
    pincode: 342000,
    maxRadiusKm: 11,
    localities: ['Ratanada', 'Paota', 'Sardarpura', 'Clock Tower', 'Mandore Road', 'Shastri Nagar', 'Pal Road'],
  },
  Goa: {
    state: 'Goa',
    phoneCode: '832',
    pincode: 403000,
    maxRadiusKm: 15,
    localities: ['Panaji', 'Calangute', 'Baga', 'Candolim', 'Anjuna', 'Vagator', 'Margao', 'Colva', 'Morjim'],
  },
  Shimla: {
    state: 'Himachal Pradesh',
    phoneCode: '177',
    pincode: 171000,
    maxRadiusKm: 8,
    localities: ['Mall Road', 'Chotta Shimla', 'Kufri Road', 'Summer Hill', 'Lakkar Bazaar', 'Mashobra', 'Sanjauli'],
  },
  Manali: {
    state: 'Himachal Pradesh',
    phoneCode: '1902',
    pincode: 175000,
    maxRadiusKm: 8,
    localities: ['Old Manali', 'Mall Road', 'Hadimba Road', 'Aleo', 'Vashisht Road', 'Log Huts Area', 'Prini'],
  },
  Amritsar: {
    state: 'Punjab',
    phoneCode: '183',
    pincode: 143000,
    maxRadiusKm: 12,
    localities: ['Ranjit Avenue', 'Hall Bazaar', 'Golden Temple Road', 'Mall Road', 'Lawrence Road', 'Airport Road', 'Putlighar'],
  },
  Lucknow: {
    state: 'Uttar Pradesh',
    phoneCode: '522',
    pincode: 226000,
    maxRadiusKm: 15,
    localities: ['Hazratganj', 'Gomti Nagar', 'Alambagh', 'Charbagh', 'Indira Nagar', 'Aminabad', 'Vibhuti Khand'],
  },
  Surat: {
    state: 'Gujarat',
    phoneCode: '261',
    pincode: 395000,
    maxRadiusKm: 15,
    localities: ['Adajan', 'Ring Road', 'Piplod', 'Vesu', 'Athwa', 'Varachha', 'Dumas Road'],
  },
  Indore: {
    state: 'Madhya Pradesh',
    phoneCode: '731',
    pincode: 452000,
    maxRadiusKm: 13,
    localities: ['Vijay Nagar', 'MG Road', 'Palasia', 'Rau', 'Sarwate Bus Stand', 'AB Road', 'Rajwada'],
  },
  Bhopal: {
    state: 'Madhya Pradesh',
    phoneCode: '755',
    pincode: 462000,
    maxRadiusKm: 13,
    localities: ['MP Nagar', 'New Market', 'Arera Colony', 'Shamla Hills', 'Bairagarh', 'Hoshangabad Road', 'Kohefiza'],
  },
  Dehradun: {
    state: 'Uttarakhand',
    phoneCode: '135',
    pincode: 248000,
    maxRadiusKm: 11,
    localities: ['Rajpur Road', 'Clock Tower', 'ISBT Road', 'Sahastradhara Road', 'Prem Nagar', 'Race Course', 'Jakhan'],
  },
  Agra: {
    state: 'Uttar Pradesh',
    phoneCode: '562',
    pincode: 282000,
    maxRadiusKm: 13,
    localities: ['Tajganj', 'Fatehabad Road', 'Sanjay Place', 'Civil Lines', 'Rakabganj', 'Sikandra', 'Agra Cantt'],
  },
  Varanasi: {
    state: 'Uttar Pradesh',
    phoneCode: '542',
    pincode: 221000,
    maxRadiusKm: 11,
    localities: ['Dashashwamedh Ghat', 'Godowlia', 'Assi Ghat', 'Cantonment', 'Lanka', 'Sigra', 'Sarnath Road'],
  },
  Kochi: {
    state: 'Kerala',
    phoneCode: '484',
    pincode: 682000,
    maxRadiusKm: 13,
    localities: ['Fort Kochi', 'Marine Drive', 'Ernakulam', 'Kakkanad', 'Vyttila', 'Edappally', 'MG Road'],
  },
  Mysore: {
    state: 'Karnataka',
    phoneCode: '821',
    pincode: 570000,
    maxRadiusKm: 11,
    localities: ['Devaraja Mohalla', 'Gokulam', 'Vijayanagar', 'Jayalakshmipuram', 'Nazarbad', 'Chamundi Hill Road', 'Bannimantap'],
  },
};

const CATEGORY_COUNTS = {
  Budget: 2500,
  Standard: 1250,
  Premium: 750,
  Luxury: 500,
};

const CATEGORY_CONFIG = {
  Budget: {
    starRatings: [3, 3, 3, 4],
    reviewScore: [3.0, 4.2],
    reviewCount: [12, 850],
    price: [800, 3000],
    amenities: [3, 5],
    descriptors: ['Comfort', 'Metro', 'City', 'Shree', 'Sai', 'Classic', 'Prime', 'Central', 'Silver', 'Green'],
    suffixes: ['Inn', 'Lodge', 'Stay', 'Residency', 'Guest House', 'Rooms', 'Comforts'],
  },
  Standard: {
    starRatings: [3, 4, 4],
    reviewScore: [3.4, 4.5],
    reviewCount: [50, 1500],
    price: [3000, 7000],
    amenities: [4, 7],
    descriptors: ['Regal', 'Urban', 'Park', 'Crown', 'Royal', 'Orchid', 'Harbour', 'Grand', 'Elite', 'Maple'],
    suffixes: ['Hotel', 'Residency', 'Suites', 'Plaza', 'Retreat', 'Court', 'Heights'],
  },
  Premium: {
    starRatings: [4, 4, 5],
    reviewScore: [4.0, 4.8],
    reviewCount: [150, 2800],
    price: [7000, 14000],
    amenities: [6, 9],
    descriptors: ['Sapphire', 'Imperial', 'Majestic', 'Riviera', 'Aurum', 'Heritage', 'Luxe', 'Vista', 'Marigold', 'Sterling'],
    suffixes: ['Grand', 'Palace', 'Suites', 'Resort', 'Club', 'Collection', 'Hotel'],
  },
  Luxury: {
    starRatings: [5, 5, 5, 4],
    reviewScore: [4.3, 5.0],
    reviewCount: [250, 5000],
    price: [14000, 25000],
    amenities: [8, 12],
    descriptors: ['Oberon', 'Celestia', 'Empress', 'Aravali', 'Maharaja', 'Leela', 'Serene', 'Presidential', 'Opulence', 'Mirage'],
    suffixes: ['Palace', 'Grand Resort', 'Luxury Suites', 'Spa Resort', 'Estate', 'Retreat', 'Royal Collection'],
  },
};

const ROAD_NAMES = [
  'Station Road',
  'MG Road',
  'Civil Lines Road',
  'Ring Road',
  'Airport Road',
  'Market Road',
  'Lake View Road',
  'Residency Road',
  'Temple Road',
  'Park Avenue',
  'Heritage Road',
  'Central Avenue',
];

const IMAGE_IDS = [
  'photo-1566073771259-6a8506099945',
  'photo-1551882547-ff40c63fe5fa',
  'photo-1564501049412-61c2a3083791',
  'photo-1582719508461-905c673771fd',
  'photo-1520250497591-112f2f40a3f4',
  'photo-1542314831-068cd1dbfeeb',
  'photo-1578683010236-d716f9a3f461',
  'photo-1590490360182-c33d57733427',
  'photo-1571003123894-1f0594d2b5d9',
  'photo-1568084680786-a84f91d1153c',
];

function createPrng(seed) {
  let value = seed >>> 0;
  return function next() {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createPrng(SEED);

function randomInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
  return Number((random() * (max - min) + min).toFixed(decimals));
}

function pick(items) {
  return items[randomInt(0, items.length - 1)];
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJsonIfExists(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

async function fetchCityCenter(city) {
  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('q', `${city}, India`);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'in');
  url.searchParams.set('addressdetails', '1');

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim failed for ${city}: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const result = data[0];
  if (!result?.lat || !result?.lon) throw new Error(`No Nominatim result for ${city}`);

  return {
    city,
    latitude: Number.parseFloat(result.lat),
    longitude: Number.parseFloat(result.lon),
    display_name: result.display_name,
    osm_type: result.osm_type,
    osm_id: result.osm_id,
    fetched_at: new Date().toISOString(),
  };
}

async function getCityCenters() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const refresh = process.argv.includes('--refresh-coordinates');
  const cache = refresh ? {} : await readJsonIfExists(CITY_CENTER_CACHE, {});
  const centers = {};

  for (const city of Object.keys(CITY_COUNTS)) {
    if (cache[city]?.latitude && cache[city]?.longitude) {
      centers[city] = cache[city];
      continue;
    }

    console.log(`Fetching city center from Nominatim: ${city}`);
    centers[city] = await fetchCityCenter(city);
    await wait(NOMINATIM_DELAY_MS);
  }

  await fs.writeFile(CITY_CENTER_CACHE, `${JSON.stringify({ ...cache, ...centers }, null, 2)}\n`);
  return { ...cache, ...centers };
}

function createCategoryQueue() {
  const categories = Object.entries(CATEGORY_COUNTS).flatMap(([category, count]) => Array(count).fill(category));
  return shuffle(categories);
}

function randomPointAround(lat, lon, minKm, maxKm) {
  const earthRadiusKm = 6371;
  const distanceKm = randomFloat(minKm, maxKm, 3);
  const bearing = random() * 2 * Math.PI;
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  const angularDistance = distanceKm / earthRadiusKm;

  const newLat = Math.asin(
    Math.sin(latRad) * Math.cos(angularDistance) +
      Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearing)
  );

  const newLon =
    lonRad +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latRad),
      Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(newLat)
    );

  return {
    latitude: Number(((newLat * 180) / Math.PI).toFixed(6)),
    longitude: Number(((newLon * 180) / Math.PI).toFixed(6)),
    distanceKm,
  };
}

function makeAddress(city, config, locality) {
  const building = randomInt(1, 299);
  const road = pick(ROAD_NAMES);
  const pincode = config.pincode + randomInt(1, 899);
  return `${building}, ${road}, ${locality}, ${city}, ${config.state} ${pincode}`;
}

function makePhone(config) {
  const subscriber = String(randomInt(1000000, 9999999));
  return `+91-${config.phoneCode}-${subscriber}`;
}

function makeEmail(name, city) {
  const localPart = pick(['reservations', 'booking', 'stay', 'frontdesk', 'hello']);
  const domain = `${slugify(name)}-${slugify(city)}.${pick(['com', 'in', 'co.in'])}`;
  return `${localPart}@${domain}`;
}

function makeName(city, locality, category, usedNames, sequence) {
  const categoryConfig = CATEGORY_CONFIG[category];

  for (let attempts = 0; attempts < 100; attempts += 1) {
    const descriptor = pick(categoryConfig.descriptors);
    const suffix = pick(categoryConfig.suffixes);
    const pattern = randomInt(1, 8);
    let name;

    if (pattern === 1) name = `Hotel ${descriptor} ${locality}`;
    else if (pattern === 2) name = `The ${descriptor} ${suffix}`;
    else if (pattern === 3) name = `${descriptor} ${suffix} ${locality}`;
    else if (pattern === 4) name = `${city} ${descriptor} ${suffix}`;
    else if (pattern === 5) name = `${descriptor} ${locality} ${suffix}`;
    else if (pattern === 6) name = `Hotel ${descriptor} ${city}`;
    else if (pattern === 7) name = `The ${locality} ${suffix}`;
    else name = `${descriptor} ${city} ${suffix}`;

    if (!usedNames.has(name)) {
      usedNames.add(name);
      return name;
    }
  }

  const fallbackName = `${pick(categoryConfig.descriptors)} ${city} ${pick(categoryConfig.suffixes)} ${sequence}`;
  usedNames.add(fallbackName);
  return fallbackName;
}

function makeAmenities(category) {
  const [min, max] = CATEGORY_CONFIG[category].amenities;
  const count = randomInt(min, max);
  const shuffled = shuffle(AMENITIES);
  const required = category === 'Budget' ? ['Free WiFi'] : ['Free WiFi', 'Restaurant'];
  return [...new Set([...required, ...shuffled])].slice(0, count);
}

function makeDescription({ name, category, locality, city, amenities }) {
  const style = {
    Budget: 'comfortable, value-focused',
    Standard: 'well-appointed, convenient',
    Premium: 'upscale, service-led',
    Luxury: 'luxury, destination-worthy',
  }[category];
  const amenityText = amenities.slice(0, 3).join(', ');
  return `${name} is a ${style} hotel in ${locality}, ${city}. Guests can expect ${amenityText}, clean rooms, helpful service, and easy access to key business and leisure spots around the city.`;
}

function makeImageUrl(id, category) {
  const imageId = IMAGE_IDS[id % IMAGE_IDS.length];
  return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=1200&q=80&sig=${category.toLowerCase()}-${id}`;
}

function createHotel(id, city, category, cityCenter, usedNames) {
  const config = CITY_CONFIG[city];
  const locality = pick(config.localities);
  const name = makeName(city, locality, category, usedNames, id);
  const amenities = makeAmenities(category);
  const categoryConfig = CATEGORY_CONFIG[category];
  const point = randomPointAround(cityCenter.latitude, cityCenter.longitude, 2, config.maxRadiusKm);

  return {
    id,
    hotel_name: name,
    city,
    state: config.state,
    address: makeAddress(city, config, locality),
    latitude: point.latitude,
    longitude: point.longitude,
    star_rating: pick(categoryConfig.starRatings),
    review_score: randomFloat(categoryConfig.reviewScore[0], categoryConfig.reviewScore[1], 1),
    review_count: randomInt(categoryConfig.reviewCount[0], categoryConfig.reviewCount[1]),
    price_per_night: randomInt(categoryConfig.price[0], categoryConfig.price[1]),
    category,
    amenities,
    description: makeDescription({ name, category, locality, city, amenities }),
    image_url: makeImageUrl(id, category),
    phone: makePhone(config),
    email: makeEmail(name, city),
    created_at: randomCreatedAt(),
  };
}

function randomCreatedAt() {
  const start = new Date('2023-01-01T00:00:00.000Z').getTime();
  const end = new Date('2026-06-14T00:00:00.000Z').getTime();
  return new Date(randomInt(start, end)).toISOString();
}

function generateHotels(cityCenters) {
  const categoryQueue = createCategoryQueue();
  const usedNames = new Set();
  const hotels = [];
  let id = 1;

  for (const [city, count] of Object.entries(CITY_COUNTS)) {
    const center = cityCenters[city];
    if (!center) throw new Error(`Missing city center for ${city}`);

    for (let i = 0; i < count; i += 1) {
      hotels.push(createHotel(id, city, categoryQueue[id - 1], center, usedNames));
      id += 1;
    }
  }

  return hotels;
}

function sqlValue(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlArray(values) {
  return `ARRAY[${values.map(sqlValue).join(', ')}]::text[]`;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toImportHotel(hotel) {
  return {
    ...hotel,
    name: hotel.hotel_name,
    slug: `${slugify(hotel.hotel_name)}-${hotel.id}`,
    location: hotel.address,
    country: 'India',
    images: hotel.image_url ? [hotel.image_url] : [],
    rating: Number(hotel.review_score || 0),
    price_from: Number(hotel.price_per_night || 0),
    is_verified: true,
    is_featured:
      Number(hotel.review_score || 0) >= 4.7 &&
      ['Premium', 'Luxury'].includes(hotel.category),
  };
}

function buildSql(hotels) {
  const importHotels = hotels.map(toImportHotel);
  const rows = hotels
    .map((_, index) => {
      const hotel = importHotels[index];
      const values = HOTEL_IMPORT_COLUMNS.map((column) => hotel[column]);
      return `(${values
        .map((value) => (Array.isArray(value) ? sqlArray(value) : sqlValue(value)))
        .join(', ')})`;
    })
    .join(',\n');

  const updates = HOTEL_IMPORT_UPDATE_COLUMNS.map((column) => `${column} = EXCLUDED.${column}`).join(',\n  ');

  return `-- Generated by scripts/generateHotelsData.js
-- Total hotels: ${hotels.length}
-- Run supabase/complete_setup.sql before this import.
-- If Supabase SQL Editor rejects this large file, use supabase/hotel_import chunks instead.

INSERT INTO public.hotels (
  ${HOTEL_IMPORT_COLUMNS.join(',\n  ')}
) VALUES
${rows}
ON CONFLICT (hotel_name) DO UPDATE SET
  ${updates},
  updated_at = NOW();
`;
}

function countBy(hotels, key) {
  return hotels.reduce((acc, hotel) => {
    const value = hotel[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function validateHotels(hotels) {
  if (hotels.length !== TOTAL_HOTELS) throw new Error(`Expected ${TOTAL_HOTELS} hotels, found ${hotels.length}`);

  const names = new Set(hotels.map((hotel) => hotel.hotel_name));
  if (names.size !== hotels.length) throw new Error('Duplicate hotel names detected');

  const cityCounts = countBy(hotels, 'city');
  const categoryCounts = countBy(hotels, 'category');

  for (const [city, count] of Object.entries(CITY_COUNTS)) {
    if (cityCounts[city] !== count) throw new Error(`City count mismatch for ${city}: ${cityCounts[city]} != ${count}`);
  }

  for (const [category, count] of Object.entries(CATEGORY_COUNTS)) {
    if (categoryCounts[category] !== count) {
      throw new Error(`Category count mismatch for ${category}: ${categoryCounts[category]} != ${count}`);
    }
  }

  for (const hotel of hotels) {
    if (hotel.review_score < 3 || hotel.review_score > 5) throw new Error(`Invalid review score: ${hotel.hotel_name}`);
    if (hotel.price_per_night < 800 || hotel.price_per_night > 25000) {
      throw new Error(`Invalid price: ${hotel.hotel_name}`);
    }
    if (!Number.isFinite(hotel.latitude) || !Number.isFinite(hotel.longitude)) {
      throw new Error(`Invalid coordinates: ${hotel.hotel_name}`);
    }
  }

  return { cityCounts, categoryCounts };
}

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const cityCenters = await getCityCenters();
  const hotels = generateHotels(cityCenters);
  const summary = validateHotels(hotels);

  await fs.writeFile(JSON_OUTPUT, `${JSON.stringify(hotels, null, 2)}\n`);
  await fs.writeFile(SQL_OUTPUT, buildSql(hotels));

  console.log(`Generated ${hotels.length} hotels`);
  console.log(`JSON: ${path.relative(ROOT_DIR, JSON_OUTPUT)}`);
  console.log(`SQL: ${path.relative(ROOT_DIR, SQL_OUTPUT)}`);
  console.log('City counts:', summary.cityCounts);
  console.log('Category counts:', summary.categoryCounts);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
