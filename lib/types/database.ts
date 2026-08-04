export type UserRole = 'customer' | 'staff' | 'admin' | 'super_admin';
export type ProductStatus = 'draft' | 'active' | 'archived';
export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'payment_failed'
  | 'paid'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded'
  | 'partially_refunded';

export type PaymentStatus =
  | 'created'
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type FulfilmentStatus =
  | 'unfulfilled'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type InventoryMovementType =
  | 'purchase'
  | 'manual_adjustment'
  | 'reservation'
  | 'reservation_release'
  | 'sale'
  | 'return'
  | 'cancellation'
  | 'damage';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  banner_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  short_description: string | null;
  description: string;
  sku: string;
  category_id: string | null;
  base_price: number; // in paise
  compare_at_price: number | null; // in paise
  cost_price: number | null; // in paise
  currency: string;
  fabric: string | null;
  craft: string | null;
  occasion: string | null;
  care_instructions: string | null;
  dispatch_information: string | null;
  tax_rate: number;
  status: ProductStatus;
  is_featured: boolean;
  is_new_arrival: boolean;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  colour_name: string;
  colour_hex: string | null;
  price_override: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  inventory?: Inventory;
  product?: Product;
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id: string | null;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Inventory {
  id: string;
  variant_id: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  low_stock_threshold: number;
  allow_backorder: boolean;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  variant_id: string;
  movement_type: InventoryMovementType;
  quantity: number;
  order_id: string | null;
  reference: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pin_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  fulfilment_status: FulfilmentStatus;
  currency: string;
  subtotal: number; // in paise
  discount_total: number; // in paise
  shipping_total: number; // in paise
  tax_total: number; // in paise
  grand_total: number; // in paise
  coupon_id: string | null;
  shipping_address: {
    full_name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pin_code: string;
  };
  billing_address?: Record<string, unknown> | null;
  customer_notes: string | null;
  internal_notes: string | null;
  razorpay_order_id: string | null;
  placed_at: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payments?: Payment[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_slug: string;
  sku: string;
  size: string | null;
  colour: string | null;
  unit_price: number; // in paise
  quantity: number;
  discount_total: number;
  tax_total: number;
  line_total: number; // in paise
  image_url: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  provider: string;
  provider_order_id: string;
  provider_payment_id: string | null;
  provider_signature: string | null;
  amount: number; // in paise
  currency: string;
  status: PaymentStatus;
  method: string | null;
  failure_code: string | null;
  failure_description: string | null;
  captured_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  message: string;
  link_url: string | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}
