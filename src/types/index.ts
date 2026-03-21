// User roles
export type UserRole = 'buyer' | 'seller' | 'designer' | 'manufacturer' | 'admin';

// Listing types
export type ListingType = 'timber' | 'wood_product';

// Listing status
export type ListingStatus = 'active' | 'draft' | 'sold' | 'archived';

// Review target types
export type ReviewTargetType = 'listing' | 'supplier';

// User
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
}

// Listing (timber + wood products)
export interface Listing {
  id: string;
  seller_id: string;
  listing_type: ListingType;
  title: string;
  description: string;
  wood_type: string;
  category: string;
  price: number;
  currency: string;
  quantity: number;
  unit: string;
  country_origin: string;
  grade: string | null;
  status: ListingStatus;
  images: string[];
  view_count: number;
  created_at: string;
  // Joined data
  seller?: User;
  supplier?: Supplier;
}

// Supplier profile
export interface Supplier {
  id: string;
  user_id: string;
  company_name: string;
  logo_url: string | null;
  description: string;
  country: string;
  certifications: string[];
  website: string | null;
  // Computed
  rating?: number;
  review_count?: number;
}

// Review
export interface Review {
  id: string;
  reviewer_id: string;
  target_id: string;
  target_type: ReviewTargetType;
  rating: number;
  comment: string;
  created_at: string;
  // Joined data
  reviewer?: User;
}

// Inquiry (contact form submission)
export interface Inquiry {
  id: string;
  sender_id: string | null;
  seller_id: string;
  listing_id: string | null;
  message: string;
  sender_email: string;
  sender_name: string;
  is_read: boolean;
  created_at: string;
  // Joined data
  listing?: Listing;
  sender?: User;
}

// Form data types
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ListingFormData {
  listing_type: ListingType;
  title: string;
  description: string;
  wood_type: string;
  category: string;
  price: number;
  currency: string;
  quantity: number;
  unit: string;
  country_origin: string;
  grade?: string;
  images: string[];
}

export interface InquiryFormData {
  listing_id?: string;
  seller_id: string;
  message: string;
  sender_email: string;
  sender_name: string;
}

// Filter types
export interface ListingFilters {
  listing_type?: ListingType;
  wood_type?: string;
  category?: string;
  country_origin?: string;
  min_price?: number;
  max_price?: number;
  min_quantity?: number;
  grade?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'most_viewed';
  page?: number;
  limit?: number;
}

export interface SupplierFilters {
  country?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Categories for filters
export const WOOD_TYPES = [
  'Oak',
  'Pine',
  'Teak',
  'Mahogany',
  'Walnut',
  'Maple',
  'Cherry',
  'Ash',
  'Birch',
  'Cedar',
  'Spruce',
  'Fir',
  'Bamboo',
  'Other',
] as const;

export const TIMBER_CATEGORIES = [
  'Hardwood',
  'Softwood',
  'Plywood',
  'MDF',
  'Logs',
  'Veneer',
  'Lumber',
  'Boards',
] as const;

export const PRODUCT_CATEGORIES = [
  'Furniture',
  'Flooring',
  'Doors',
  'Windows',
  'Panels',
  'Decking',
  'Molding',
  'Other',
] as const;

export const UNITS = [
  'm³',
  'board-ft',
  'piece',
  'kg',
  'ton',
  'sqm',
  'linear-m',
] as const;

export const GRADES = [
  'A',
  'B',
  'C',
  'Select',
  'Premium',
  'Standard',
  'Utility',
] as const;

export const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo (Democratic Republic)',
  'Congo (Republic)',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
] as const;
