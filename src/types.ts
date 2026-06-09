export type PropertyStatus = 'en attente' | 'approuvé' | 'rejeté' | 'vendu';
export type FeaturedOption = 'aucune' | '1 semaine' | '2 semaines' | '3 semaines';
export type PropertyType = 'immeuble' | 'terrain' | 'villa' | 'maison' | 'appartement' | 'bureau';

export interface Property {
  id: string;
  title: string;
  pricePerM2: number;
  surface: number;
  totalPrice: number;
  commission: number;
  commissionAmount: number;
  region: string;
  city: string;
  quarter?: string;
  type: PropertyType;
  characteristics: string[];
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  description: string;
  featuredOption: FeaturedOption;
  status: PropertyStatus;
  images: string[];
  createdat: string;
  soldAt?: string;
  referenceNumber?: string;
}

export interface PropertyRequest {
  id?: string;
  type: PropertyType;
  budgetMax: number;
  cities: string;
  surfaceMin: number;
  description: string;
  name: string;
  phone: string;
  email: string;
  createdat: string;
}

export const PROPERTY_TYPES: PropertyType[] = [
  'immeuble',
  'terrain',
  'villa',
  'maison',
  'appartement',
  'bureau'
];

export const CAMEROON_REGIONS = [
  "Adamaoua",
  "Centre",
  "Est",
  "Extrême-Nord",
  "Littoral",
  "Nord",
  "Nord-Ouest",
  "Sud",
  "Sud-Ouest",
  "Ouest"
];

export const FEATURED_PRICES = {
  "aucune": 0,
  "1 semaine": 5000,
  "2 semaines": 10000,
  "3 semaines": 15000
};
