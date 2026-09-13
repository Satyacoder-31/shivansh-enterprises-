export type Role = 'SUPER_ADMIN' | 'CONTENT_MANAGER' | 'PRODUCT_MANAGER' | 'ORDER_MANAGER';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  business_name: string;
  tagline: string | null;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  google_maps_url: string | null;
  business_hours: string | null;
  currency: string;
  currency_symbol: string;
  gst_number: string | null;
  logo_dark_url: string | null;
  logo_light_url: string | null;
  favicon_url: string | null;
  announcement_text: string | null;
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
  };
  header_scripts?: string;
  footer_scripts?: string;
  updated_at: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  highlighted_text: string | null;
  description: string;
  primary_btn_text: string;
  primary_btn_url: string;
  secondary_btn_text: string | null;
  secondary_btn_url: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ProductSpec {
  id?: string;
  product_id?: string;
  spec_name: string;
  spec_value: string;
  display_order: number;
}

export interface ProductFeature {
  id?: string;
  product_id?: string;
  feature_text: string;
  display_order: number;
}

export interface ProductImage {
  id?: string;
  product_id?: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  model: string | null;
  brand: string | null;
  category_id: string;
  sub_category: string | null;
  badge: string | null;
  purchase_mode: 'contact_for_price' | 'buy_online';
  price_display: string | null;
  price_value: number | null;
  sale_price: number | null;
  mrp: number | null;
  rating: number;
  in_stock: boolean;
  stock_quantity?: number;
  sku: string | null;
  main_image: string;
  short_desc: string | null;
  tagline: string | null;
  full_desc: string | null;
  application: string | null;
  status: 'published' | 'draft' | 'archived';
  is_featured: boolean;
  display_order: number;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at?: string;
  updated_at?: string;
  category?: Category;
  specs?: ProductSpec[];
  features?: ProductFeature[];
  images?: ProductImage[];
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  short_desc: string;
  full_desc: string | null;
  main_image: string | null;
  icon: string | null;
  features: string[];
  benefits: string[];
  cta_text?: string;
  cta_url?: string;
  display_order: number;
  status: 'published' | 'draft';
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string | null;
  category: 'cctv' | 'led' | 'solar' | 'installations' | 'commercial';
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url: string | null;
  display_order: number;
  is_featured: boolean;
  status: 'published' | 'draft';
  created_at?: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  company: string | null;
  position: string | null;
  content: string;
  photo_url: string | null;
  rating: number;
  video_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  product_service: string | null;
  source_page: string | null;
  status: 'new' | 'contacted' | 'follow_up' | 'converted' | 'closed';
  notes: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  company: string | null;
  address?: any;
  total_spent: number;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  sku: string | null;
  unit_price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  shipping_address: any;
  billing_address?: any;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  order_status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  payment_id: string | null;
  notes: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

export interface Payment {
  id: string;
  order_id: string | null;
  provider: string;
  provider_order_id: string;
  provider_payment_id: string | null;
  amount: number;
  currency: string;
  status: 'created' | 'captured' | 'failed' | 'refunded';
  signature_verified: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string | null;
  file_size: number | null;
  folder: string | null;
  alt_text: string | null;
  caption: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_email: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  details: any;
  created_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  target_blank: boolean;
  display_order: number;
  is_active: boolean;
  parent_id?: string | null;
}

export interface PageSection {
  id: string;
  page_slug: string;
  section_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  content: any;
  display_order: number;
  is_active: boolean;
  updated_at: string;
}

export interface PaymentSettings {
  id: number;
  gateway: string;
  razorpay_key_id: string;
  razorpay_key_secret: string;
  razorpay_webhook_secret: string;
  is_test_mode: boolean;
  is_enabled: boolean;
  updated_at: string;
}


