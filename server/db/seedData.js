// server/db/seedData.js
import bcrypt from 'bcryptjs';

const passwordHash = bcrypt.hashSync('password123', 10);

export const seedUsers = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'diner@halalfinder.com',
    password_hash: passwordHash,
    full_name: 'Tariq Al-Mansoor',
    role: 'diner'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'merchant@halalfinder.com',
    password_hash: passwordHash,
    full_name: 'Chef Bilal Qureshi',
    role: 'merchant'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'admin@halalfinder.com',
    password_hash: passwordHash,
    full_name: 'Dr. Amina Farooq (Lead Auditor)',
    role: 'admin'
  }
];

export const seedCertifyingBodies = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Islamic Food and Nutrition Council of America',
    short_code: 'IFANCA',
    country: 'United States',
    website_url: 'https://www.ifanca.org',
    is_globally_recognized: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    name: 'Halal Monitoring Committee',
    short_code: 'HMC',
    country: 'United Kingdom',
    website_url: 'https://halalhmc.org',
    is_globally_recognized: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    name: 'Jabatan Kemajuan Islam Malaysia',
    short_code: 'JAKIM',
    country: 'Malaysia',
    website_url: 'https://www.halal.gov.my',
    is_globally_recognized: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    name: 'South African National Halaal Authority',
    short_code: 'SANHA',
    country: 'South Africa',
    website_url: 'https://www.sanha.org.za',
    is_globally_recognized: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    name: 'Majlis Ugama Islam Singapura',
    short_code: 'MUIS',
    country: 'Singapore',
    website_url: 'https://www.muis.gov.sg',
    is_globally_recognized: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000006',
    name: 'Halal Food Council of North America',
    short_code: 'HFCAA',
    country: 'United States & Canada',
    website_url: 'https://www.halalcouncil.org',
    is_globally_recognized: true
  }
];

export const seedVenues = [
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    owner_id: '22222222-2222-2222-2222-222222222222',
    name: 'Al-Madina Artisan Prime Steakhouse',
    slug: 'al-madina-artisan-prime-steakhouse',
    venue_type: 'RESTAURANT',
    halal_classification: 'FULL_HALAL_MONITORED',
    description: 'Premier dry-aged A5 Halal Wagyu cuts, certified hand-slaughtered beef, strictly alcohol-free culinary cellar, and full dedicated kitchen prep facilities.',
    address: '450 Lexington Avenue, Midtown',
    city: 'New York',
    state: 'NY',
    postal_code: '10017',
    country: 'United States',
    latitude: 40.7527,
    longitude: -73.9772,
    phone_number: '+1 (212) 555-0199',
    website_url: 'https://almadinasteak.example.com',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80',
    is_alcohol_free: true,
    has_prayer_space: true,
    has_separate_prep_area: true,
    is_hand_slaughtered_only: true,
    verification_status: 'AI_VERIFIED',
    average_rating: 4.95,
    review_count: 84
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    owner_id: '22222222-2222-2222-2222-222222222222',
    name: 'Saffron & Cardamom Botanical Cafe',
    slug: 'saffron-cardamom-botanical-cafe',
    venue_type: 'CAFE',
    halal_classification: 'FULL_HALAL_MONITORED',
    description: 'Artisanal specialty coffee roastery, Persian spiced pastries, organic brioche French toasts, and dedicated female and male prayer spaces.',
    address: '28 Marylebone High Street',
    city: 'London',
    state: 'Greater London',
    postal_code: 'W1U 4PX',
    country: 'United Kingdom',
    latitude: 51.5204,
    longitude: -0.1517,
    phone_number: '+44 20 7946 0912',
    website_url: 'https://saffroncardamom.example.com',
    image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&auto=format&fit=crop&q=80',
    is_alcohol_free: true,
    has_prayer_space: true,
    has_separate_prep_area: true,
    is_hand_slaughtered_only: true,
    verification_status: 'AI_VERIFIED',
    average_rating: 4.88,
    review_count: 112
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    owner_id: '22222222-2222-2222-2222-222222222222',
    name: 'Istanbul Grand Bazaar Artisan Bakery',
    slug: 'istanbul-grand-bazaar-bakery',
    venue_type: 'BAKERY',
    halal_classification: 'FULL_HALAL_MONITORED',
    description: 'Freshly baked Antep pistachio baklava, warm simit, authentic kunefe with zero animal rennet or gelatin adulterants, certified 100% Halal dairy.',
    address: '1088 Queen Street West',
    city: 'Toronto',
    state: 'ON',
    postal_code: 'M6J 1H8',
    country: 'Canada',
    latitude: 43.6441,
    longitude: -79.4186,
    phone_number: '+1 (416) 555-8371',
    website_url: 'https://istanbulgrandbakery.example.com',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
    is_alcohol_free: true,
    has_prayer_space: false,
    has_separate_prep_area: true,
    is_hand_slaughtered_only: true,
    verification_status: 'AI_VERIFIED',
    average_rating: 4.92,
    review_count: 67
  },
  {
    id: 'b0000000-0000-0000-0000-000000000004',
    owner_id: '22222222-2222-2222-2222-222222222222',
    name: 'Sultans Pitmaster Smokehouse & Halal BBQ',
    slug: 'sultans-pitmaster-halal-bbq',
    venue_type: 'RESTAURANT',
    halal_classification: 'FULL_HALAL_MONITORED',
    description: '16-hour hickory wood oak smoked USDA Prime beef briskets, lamb ribs, burnt ends, and house-made barbecue glazes crafted without cooking wines or spirits.',
    address: '835 North Michigan Avenue',
    city: 'Chicago',
    state: 'IL',
    postal_code: '60611',
    country: 'United States',
    latitude: 41.8986,
    longitude: -87.6241,
    phone_number: '+1 (312) 555-4421',
    website_url: 'https://sultansbbq.example.com',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&auto=format&fit=crop&q=80',
    is_alcohol_free: true,
    has_prayer_space: true,
    has_separate_prep_area: true,
    is_hand_slaughtered_only: true,
    verification_status: 'AI_VERIFIED',
    average_rating: 4.86,
    review_count: 145
  },
  {
    id: 'b0000000-0000-0000-0000-000000000005',
    owner_id: '22222222-2222-2222-2222-222222222222',
    name: 'Nusantara Heritage Kitchen & Cafe',
    slug: 'nusantara-heritage-kitchen',
    venue_type: 'CAFE',
    halal_classification: 'FULL_HALAL_MONITORED',
    description: 'Authentic Malay and Peranakan gastronomy, Beef Rendang Tok, Nasi Lemak Royal, JAKIM certified kitchen pipeline with dedicated prayer amenities.',
    address: 'Jalan Bukit Bintang, Golden Triangle',
    city: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan',
    postal_code: '55100',
    country: 'Malaysia',
    latitude: 3.1479,
    longitude: 101.7101,
    phone_number: '+60 3-2148 8899',
    website_url: 'https://nusantaraheritage.example.com',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
    is_alcohol_free: true,
    has_prayer_space: true,
    has_separate_prep_area: true,
    is_hand_slaughtered_only: true,
    verification_status: 'AI_VERIFIED',
    average_rating: 4.97,
    review_count: 230
  },
  {
    id: 'b0000000-0000-0000-0000-000000000006',
    owner_id: '22222222-2222-2222-2222-222222222222',
    name: 'Medina Gourmet Wagyu & Halal Butcher',
    slug: 'medina-gourmet-halal-butcher',
    venue_type: 'BUTCHER_SHOP',
    halal_classification: 'FULL_HALAL_MONITORED',
    description: 'Specialty artisanal butchery offering HMC monitored hand-slaughtered British grass-fed beef, Australian Wagyu cuts, free-range poultry, and vacuum marinades.',
    address: '144 Edgware Road',
    city: 'London',
    state: 'Greater London',
    postal_code: 'W2 2DZ',
    country: 'United Kingdom',
    latitude: 51.5168,
    longitude: -0.1633,
    phone_number: '+44 20 7262 0188',
    website_url: 'https://medinabutcher.example.com',
    image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1000&auto=format&fit=crop&q=80',
    is_alcohol_free: true,
    has_prayer_space: false,
    has_separate_prep_area: true,
    is_hand_slaughtered_only: true,
    verification_status: 'AI_VERIFIED',
    average_rating: 4.91,
    review_count: 98
  },
  {
    id: 'b0000000-0000-0000-0000-000000000007',
    owner_id: '22222222-2222-2222-2222-222222222222',
    name: 'Damascus Nights Mezze & Charcoal Grill',
    slug: 'damascus-nights-mezze-grill',
    venue_type: 'RESTAURANT',
    halal_classification: 'FULL_HALAL_OWNER_VERIFIED',
    description: 'Levantine grilled kebabs, smoked mutabal, and wood-fired flatbreads. New certificate uploaded currently undergoing automated AI audit verification.',
    address: '185 Atlantic Avenue, Brooklyn',
    city: 'New York',
    state: 'NY',
    postal_code: '11201',
    country: 'United States',
    latitude: 40.6908,
    longitude: -73.9961,
    phone_number: '+1 (718) 555-0344',
    website_url: 'https://damascusnights.example.com',
    image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1000&auto=format&fit=crop&q=80',
    is_alcohol_free: true,
    has_prayer_space: true,
    has_separate_prep_area: true,
    is_hand_slaughtered_only: false,
    verification_status: 'PENDING_HUMAN_REVIEW',
    average_rating: 4.62,
    review_count: 32
  },
  {
    id: 'b0000000-0000-0000-0000-000000000008',
    owner_id: '22222222-2222-2222-2222-222222222222',
    name: 'Golden Crescent Artisan Gelato & Crepes',
    slug: 'golden-crescent-artisan-gelato',
    venue_type: 'DESSERT_PARLOR',
    halal_classification: 'FULL_HALAL_MONITORED',
    description: 'Authentic Italian style micro-batch gelato, Madagascar vanilla crepes, strictly zero non-halal emulsifiers, zero liqueur bases, 100% MUIS certified supply chain.',
    address: '254 Spadina Ave',
    city: 'Toronto',
    state: 'ON',
    postal_code: 'M5T 2C2',
    country: 'Canada',
    latitude: 43.6521,
    longitude: -79.3983,
    phone_number: '+1 (416) 555-9011',
    website_url: 'https://goldencrescentgelato.example.com',
    image_url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1000&auto=format&fit=crop&q=80',
    is_alcohol_free: true,
    has_prayer_space: false,
    has_separate_prep_area: true,
    is_hand_slaughtered_only: false,
    verification_status: 'AI_VERIFIED',
    average_rating: 4.85,
    review_count: 73
  },
  {
    id: 'b0000000-0000-0000-0000-000000000009',
    owner_id: '22222222-2222-2222-2222-222222222222',
    name: 'Old Cordoba Shawarma & Andalusian Kitchen',
    slug: 'old-cordoba-shawarma',
    venue_type: 'FOOD_TRUCK',
    halal_classification: 'PARTIAL_HALAL_OPTIONS',
    description: 'Spanish-Moorish roasted lamb shawarma pita rolls. Note: Previous accreditation expired last quarter, renewal currently in progress.',
    address: 'Broadway & 116th St',
    city: 'New York',
    state: 'NY',
    postal_code: '10027',
    country: 'United States',
    latitude: 40.8075,
    longitude: -73.9626,
    phone_number: '+1 (212) 555-8819',
    website_url: '',
    image_url: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=1000&auto=format&fit=crop&q=80',
    is_alcohol_free: true,
    has_prayer_space: false,
    has_separate_prep_area: true,
    is_hand_slaughtered_only: false,
    verification_status: 'EXPIRED',
    average_rating: 4.35,
    review_count: 51
  }
];

export const seedCertificates = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    venue_id: 'b0000000-0000-0000-0000-000000000001',
    certifying_body_id: 'a0000000-0000-0000-0000-000000000001', // IFANCA
    certificate_number: 'IFANCA-USA-2026-9812A',
    issued_date: '2026-01-15',
    expiration_date: '2027-01-14',
    document_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1000&auto=format&fit=crop&q=80',
    ai_raw_extraction: {
      is_valid_halal_certificate: true,
      confidence_score: 98.4,
      extracted_venue_name: 'Al-Madina Artisan Prime Steakhouse',
      venue_name_matches: true,
      certifying_body_name: 'Islamic Food and Nutrition Council of America (IFANCA)',
      certificate_id: 'IFANCA-USA-2026-9812A',
      issue_date: '2026-01-15',
      expiration_date: '2027-01-14',
      is_expired: false,
      detected_flags: [],
      summary_explanation: 'Official holographic IFANCA accreditation seal confirmed. Full scope covers hand-slaughtered beef and poultry operations. Zero cross-contamination issues identified.'
    },
    ai_confidence_score: 98.4,
    is_active: true,
    verified_by_admin_id: '33333333-3333-3333-3333-333333333333',
    verified_at: '2026-01-16T10:00:00Z'
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    venue_id: 'b0000000-0000-0000-0000-000000000002',
    certifying_body_id: 'a0000000-0000-0000-0000-000000000002', // HMC
    certificate_number: 'HMC-UK-CERT-8841-B',
    issued_date: '2026-02-01',
    expiration_date: '2027-01-31',
    document_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
    ai_raw_extraction: {
      is_valid_halal_certificate: true,
      confidence_score: 97.2,
      extracted_venue_name: 'Saffron & Cardamom Botanical Cafe',
      venue_name_matches: true,
      certifying_body_name: 'Halal Monitoring Committee UK (HMC)',
      certificate_id: 'HMC-UK-CERT-8841-B',
      issue_date: '2026-02-01',
      expiration_date: '2027-01-31',
      is_expired: false,
      detected_flags: [],
      summary_explanation: 'HMC full-time inspector stamp confirmed. Valid registration code verified against active UK registry.'
    },
    ai_confidence_score: 97.2,
    is_active: true,
    verified_by_admin_id: '33333333-3333-3333-3333-333333333333',
    verified_at: '2026-02-02T11:30:00Z'
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    venue_id: 'b0000000-0000-0000-0000-000000000005',
    certifying_body_id: 'a0000000-0000-0000-0000-000000000003', // JAKIM
    certificate_number: 'JAKIM-MAL-2026-55919',
    issued_date: '2026-03-10',
    expiration_date: '2028-03-09',
    document_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1000&auto=format&fit=crop&q=80',
    ai_raw_extraction: {
      is_valid_halal_certificate: true,
      confidence_score: 99.1,
      extracted_venue_name: 'Nusantara Heritage Kitchen & Cafe',
      venue_name_matches: true,
      certifying_body_name: 'Jabatan Kemajuan Islam Malaysia (JAKIM)',
      certificate_id: 'JAKIM-MAL-2026-55919',
      issue_date: '2026-03-10',
      expiration_date: '2028-03-09',
      is_expired: false,
      detected_flags: [],
      summary_explanation: 'JAKIM sovereign seal verified. QR checksum matches official Halal Malaysia Directory. 100% compliance certified.'
    },
    ai_confidence_score: 99.1,
    is_active: true,
    verified_by_admin_id: '33333333-3333-3333-3333-333333333333',
    verified_at: '2026-03-12T09:15:00Z'
  },
  {
    id: 'c0000000-0000-0000-0000-000000000007',
    venue_id: 'b0000000-0000-0000-0000-000000000007',
    certifying_body_id: 'a0000000-0000-0000-0000-000000000006', // HFCAA
    certificate_number: 'HFCAA-PENDING-7718',
    issued_date: '2026-08-01',
    expiration_date: '2027-08-01',
    document_url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=1000&auto=format&fit=crop&q=80',
    ai_raw_extraction: {
      is_valid_halal_certificate: true,
      confidence_score: 64.5,
      extracted_venue_name: 'Damascus Nights Grill LLC',
      venue_name_matches: false,
      certifying_body_name: 'Halal Food Council of North America (HFCAA)',
      certificate_id: 'HFCAA-PENDING-7718',
      issue_date: '2026-08-01',
      expiration_date: '2027-08-01',
      is_expired: false,
      detected_flags: [
        'Minor name divergence between registered trade name and DBA name',
        'Official embossed seal scan has slight glare distortion'
      ],
      summary_explanation: 'Document structure matches legitimate HFCAA templates, but trade name has slight corporate mismatch. Flagged for secondary human auditor verification.'
    },
    ai_confidence_score: 64.5,
    is_active: false,
    verified_by_admin_id: null,
    verified_at: null
  },
  {
    id: 'c0000000-0000-0000-0000-000000000009',
    venue_id: 'b0000000-0000-0000-0000-000000000009',
    certifying_body_id: 'a0000000-0000-0000-0000-000000000001', // IFANCA
    certificate_number: 'IFANCA-EXP-2025-1029',
    issued_date: '2025-01-01',
    expiration_date: '2026-01-01',
    document_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1000&auto=format&fit=crop&q=80',
    ai_raw_extraction: {
      is_valid_halal_certificate: false,
      confidence_score: 32.0,
      extracted_venue_name: 'Old Cordoba Shawarma',
      venue_name_matches: true,
      certifying_body_name: 'IFANCA',
      certificate_id: 'IFANCA-EXP-2025-1029',
      issue_date: '2025-01-01',
      expiration_date: '2026-01-01',
      is_expired: true,
      detected_flags: [
        'Certificate expiration date (2026-01-01) is in the past',
        'Status automatically downgraded to EXPIRED'
      ],
      summary_explanation: 'Certificate was previously authentic but has lapsed past the 1-year validation window without recertification filing.'
    },
    ai_confidence_score: 32.0,
    is_active: false,
    verified_by_admin_id: null,
    verified_at: null
  }
];

export const seedMenuItems = [
  // Al-Madina Steakhouse
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    venue_id: 'b0000000-0000-0000-0000-000000000001',
    name: 'A5 Miyazaki Wagyu Ribeye (12oz)',
    description: 'Certified 100% Halal Japanese Wagyu, BMS 11, seared over Japanese white binchotan charcoal with smoked Maldon salt.',
    price: 135.00,
    category: 'Steaks & Mains',
    is_halal_certified: true,
    contains_alcohol: false,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    venue_id: 'b0000000-0000-0000-0000-000000000001',
    name: 'Dry-Aged Tomahawk Steak (38oz)',
    description: '45-day Himalayan salt cave dry-aged black Angus ribeye, hand-slaughtered, basted with rosemary brown butter.',
    price: 165.00,
    category: 'Steaks & Mains',
    is_halal_certified: true,
    contains_alcohol: false,
    image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'd0000000-0000-0000-0000-000000000003',
    venue_id: 'b0000000-0000-0000-0000-000000000001',
    name: 'Smoked Bone Marrow & Truffle Toast',
    description: 'Canoe-cut beef marrow roasted with garlic thyme, caramelized shallots, shaved black summer truffles.',
    price: 28.00,
    category: 'Starters',
    is_halal_certified: true,
    contains_alcohol: false,
    image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'd0000000-0000-0000-0000-000000000004',
    venue_id: 'b0000000-0000-0000-0000-000000000001',
    name: 'Zero-Proof Pomegranate Cardamom Elixir',
    description: 'Cold-pressed Persian pomegranate juice, smoked cedar bitters (alcohol-free botanical extraction), and bubbly soda.',
    price: 14.00,
    category: 'Artisan Mocktails',
    is_halal_certified: true,
    contains_alcohol: false,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80'
  },
  // Saffron & Cardamom Cafe
  {
    id: 'd0000000-0000-0000-0000-000000000005',
    venue_id: 'b0000000-0000-0000-0000-000000000002',
    name: 'Saffron Pistachio Brioche French Toast',
    description: 'Thick cut artisanal brioche soaked in saffron custard, topped with organic clotted cream and crushed Iranian pistachios.',
    price: 18.50,
    category: 'Brunch',
    is_halal_certified: true,
    contains_alcohol: false,
    image_url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'd0000000-0000-0000-0000-000000000006',
    venue_id: 'b0000000-0000-0000-0000-000000000002',
    name: 'Cardamom Rose Cold Foam Latte',
    description: 'Single-origin Ethiopian espresso layered over oat milk, organic Damascus rosewater, and velvety cardamom foam.',
    price: 7.20,
    category: 'Specialty Coffee',
    is_halal_certified: true,
    contains_alcohol: false,
    image_url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80'
  },
  // Sultans BBQ
  {
    id: 'd0000000-0000-0000-0000-000000000007',
    venue_id: 'b0000000-0000-0000-0000-000000000004',
    name: 'Pitmaster Smoked Beef Brisket Platter',
    description: 'Half-pound of 16-hour Texas style oak-smoked beef brisket, house-pickled cucumbers, sweet cornbread.',
    price: 29.50,
    category: 'Pitmaster Smoked Meats',
    is_halal_certified: true,
    contains_alcohol: false,
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80'
  },
  // Nusantara Kitchen
  {
    id: 'd0000000-0000-0000-0000-000000000008',
    venue_id: 'b0000000-0000-0000-0000-000000000005',
    name: 'Royal Beef Rendang Tok with Lemang',
    description: 'Slow-braised beef shank in caramelized coconut milk, lemongrass, galangal, served with bamboo-roasted glutinous rice.',
    price: 24.00,
    category: 'Heritage Specialties',
    is_halal_certified: true,
    contains_alcohol: false,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80'
  }
];

export const seedReviews = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    venue_id: 'b0000000-0000-0000-0000-000000000001',
    user_id: '11111111-1111-1111-1111-111111111111',
    rating: 5,
    comment: 'Exceptional dining experience! The IFANCA certificate is framed right in the entrance, and the server explained their separate prep kitchen and meat provenance with complete clarity. The A5 Wagyu is otherworldly.',
    halal_authenticity_rating: 5,
    photo_urls: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    venue_id: 'b0000000-0000-0000-0000-000000000002',
    user_id: '11111111-1111-1111-1111-111111111111',
    rating: 5,
    comment: 'One of the best halal cafes in London! Beautiful peaceful prayer room upstairs with wudu facilities. Zero alcohol on premises and HMC certified meats.',
    halal_authenticity_rating: 5,
    photo_urls: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'e0000000-0000-0000-0000-000000000003',
    venue_id: 'b0000000-0000-0000-0000-000000000004',
    user_id: '11111111-1111-1111-1111-111111111111',
    rating: 5,
    comment: 'Real authentic wood-smoked Texas BBQ that is 100% hand-slaughtered Halal. Finding halal burnt ends in Chicago like this is a dream come true.',
    halal_authenticity_rating: 5,
    photo_urls: []
  }
];
