// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar: string | null;
  is_staff: boolean;
}

// ─── Vehicle ─────────────────────────────────────────────────────────────────

export type TransmissionType = 'manual' | 'automatic' | 'cvt';
export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric';
export type ConditionType = 'excellent' | 'good' | 'fair';

export interface VehicleImage {
  id: number;
  image: string;
  is_primary: boolean;
  order: number;
}

export interface VehicleList {
  id: number;
  sku: string | null;
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: number;
  is_negotiable: boolean;
  is_available: boolean;
  is_reserved: boolean;
  fuel_type: FuelType | '';
  transmission: TransmissionType | '';
  color: string;
  condition: ConditionType | '';
  primary_image: string | null;
  created_at: string;
}

export interface Vehicle extends VehicleList {
  description: string;
  engine: string;
  doors: number | null;
  reserved_by: number | null;
  reserved_by_name: string | null;
  reserved_at: string | null;
  images: VehicleImage[];
  updated_at: string;
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  mileage_max?: number;
  fuel_type?: string;
  transmission?: string;
  condition?: string;
  is_available?: boolean;
  page?: number;
  search?: string;
  ordering?: string;
}

// ─── Comment ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: number;
  vehicle: number;
  author: number;
  author_name: string;
  author_avatar: string | null;
  body: string;
  created_at: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Order {
  id: number;
  buyer: number;
  buyer_email: string;
  vehicle: number;
  vehicle_detail: VehicleList;
  status: OrderStatus;
  notes: string;
  created_at: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
