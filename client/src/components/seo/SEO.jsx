import { Helmet } from 'react-helmet-async';

const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'StayEase';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://stayease.vercel.app';

export default function SEO({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  jsonLd,
  keywords,
  noindex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Smart Hotel Booking Platform`;
  const fullDescription =
    description ||
    'Discover and book hotels across India with StayEase. Compare rooms, read reviews, and secure your stay with confidence.';
  const canonical = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/og-image.png`;

  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: fullDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/hotels?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const structuredData = jsonLd || defaultJsonLd;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* LLM / AI crawler hints */}
      <meta name="ai-content-declaration" content="human-authored" />
      <meta name="author" content={SITE_NAME} />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}

export function hotelJsonLd(hotel) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: hotel.city,
      addressCountry: hotel.country || 'India',
      streetAddress: hotel.location,
    },
    image: hotel.images?.[0],
    starRating: {
      '@type': 'Rating',
      ratingValue: hotel.rating,
      bestRating: 5,
    },
    priceRange: `₹${hotel.price_from}+`,
    amenityFeature: hotel.amenities?.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
  };
}

export function faqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
