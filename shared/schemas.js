// shared/schemas.js
import { z } from 'zod';

export const UserRoleEnum = z.enum(['diner', 'merchant', 'admin']);
export const VenueTypeEnum = z.enum([
  'RESTAURANT',
  'CAFE',
  'BAKERY',
  'FOOD_TRUCK',
  'BUTCHER_SHOP',
  'GHOST_KITCHEN',
  'DESSERT_PARLOR'
]);
export const HalalClassificationEnum = z.enum([
  'FULL_HALAL_MONITORED',
  'FULL_HALAL_OWNER_VERIFIED',
  'PARTIAL_HALAL_OPTIONS',
  'MUSLIM_OWNED_NO_CERT'
]);
export const VerificationStatusEnum = z.enum([
  'UNVERIFIED',
  'PENDING_AI',
  'AI_VERIFIED',
  'PENDING_HUMAN_REVIEW',
  'REJECTED',
  'EXPIRED'
]);

export const RegisterUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  full_name: z.string().min(2, { message: 'Full name is required' }),
  role: z.enum(['diner', 'merchant']).default('diner')
});

export const LoginUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
});

export const CreateVenueSchema = z.object({
  name: z.string().min(2, 'Venue name is required'),
  venue_type: VenueTypeEnum,
  halal_classification: HalalClassificationEnum,
  description: z.string().optional().default(''),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional().default(''),
  postal_code: z.string().optional().default(''),
  country: z.string().min(2, 'Country is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone_number: z.string().optional().default(''),
  website_url: z.string().url().optional().or(z.literal('')),
  is_alcohol_free: z.boolean().default(true),
  has_prayer_space: z.boolean().default(false),
  has_separate_prep_area: z.boolean().default(true),
  is_hand_slaughtered_only: z.boolean().default(false)
});

export const UpdateVenueSchema = CreateVenueSchema.partial();

export const QueryVenueSchema = z.object({
  city: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().default(25), // in km
  venue_type: z.string().optional(),
  halal_classification: z.string().optional(),
  is_alcohol_free: z.coerce.boolean().optional(),
  has_prayer_space: z.coerce.boolean().optional(),
  is_hand_slaughtered_only: z.coerce.boolean().optional(),
  certifying_body_id: z.string().optional(),
  verification_status: z.string().optional(),
  search: z.string().optional()
});

export const CreateReviewSchema = z.object({
  venue_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, 'Review must be at least 5 characters'),
  halal_authenticity_rating: z.number().int().min(1).max(5),
  photo_urls: z.array(z.string().url()).optional().default([])
});

export const MenuItemSchema = z.object({
  venue_id: z.string().uuid(),
  name: z.string().min(2, 'Item name is required'),
  description: z.string().optional().default(''),
  price: z.number().positive('Price must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  is_halal_certified: z.boolean().default(true),
  contains_alcohol: z.boolean().default(false),
  image_url: z.string().url().optional().or(z.literal(''))
});

export const AICertificateAnalysisSchema = z.object({
  is_valid_halal_certificate: z.boolean(),
  confidence_score: z.number().min(0).max(100),
  extracted_venue_name: z.string().optional().default(''),
  venue_name_matches: z.boolean().default(true),
  certifying_body_name: z.string(),
  certificate_id: z.string().optional().default(''),
  issue_date: z.string().optional(),
  expiration_date: z.string(),
  is_expired: z.boolean(),
  detected_flags: z.array(z.string()),
  summary_explanation: z.string()
});

export const AIAdvisorChatSchema = z.object({
  message: z.string().min(1, 'Query message is required'),
  user_lat: z.number().optional(),
  user_lng: z.number().optional(),
  selected_venue_id: z.string().optional(),
  chat_history: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).optional().default([])
});
