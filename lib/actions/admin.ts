"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { 
  HeroSlide, 
  Product, 
  Service, 
  GalleryItem, 
  SiteSettings, 
  Enquiry, 
  Order, 
  Testimonial,
  Category,
  PaymentSettings,
  ShippingSettings,
  Profile,
  MediaItem,
  Customer,
  PageSection
} from "@/types/database";

// ============================================================================
// DASHBOARD METRICS
// ============================================================================
export async function getDashboardStats() {
  const supabase = createAdminClient();

  const [
    productsRes,
    servicesRes,
    galleryRes,
    enquiriesRes,
    ordersRes,
    customersRes
  ] = await Promise.all([
    supabase.from('products').select('id, status, in_stock', { count: 'exact' }),
    supabase.from('services').select('id', { count: 'exact' }),
    supabase.from('gallery_items').select('id, media_type', { count: 'exact' }),
    supabase.from('enquiries').select('id, status', { count: 'exact' }),
    supabase.from('orders').select('id, total, order_status, payment_status', { count: 'exact' }),
    supabase.from('customers').select('id', { count: 'exact' })
  ]);

  const products = productsRes.data || [];
  const activeProducts = products.filter(p => p.status === 'published' && p.in_stock).length;
  
  const enquiries = enquiriesRes.data || [];
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;

  const orders = ordersRes.data || [];
  const pendingOrders = orders.filter(o => o.order_status === 'pending').length;
  const totalRevenue = orders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  // Recent enquiries
  const { data: recentEnquiries } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    totalProducts: productsRes.count || 0,
    activeProducts,
    totalServices: servicesRes.count || 0,
    galleryImages: galleryRes.count || 0,
    totalEnquiries: enquiriesRes.count || 0,
    newEnquiries,
    totalOrders: ordersRes.count || 0,
    pendingOrders,
    totalCustomers: customersRes.count || 0,
    totalRevenue,
    recentEnquiries: recentEnquiries || [],
    recentOrders: recentOrders || []
  };
}

// ============================================================================
// SITE SETTINGS
// ============================================================================
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
  if (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
  return data;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('site_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return data;
}

// ============================================================================
// HERO SLIDES
// ============================================================================
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function saveHeroSlide(slide: Partial<HeroSlide>) {
  const supabase = createAdminClient();
  if (slide.id) {
    const { data, error } = await supabase
      .from('hero_slides')
      .update({ ...slide, updated_at: new Date().toISOString() })
      .eq('id', slide.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    revalidatePath('/');
    return data;
  } else {
    const { data, error } = await supabase
      .from('hero_slides')
      .insert([slide])
      .select()
      .single();
    if (error) throw new Error(error.message);
    revalidatePath('/');
    return data;
  }
}

export async function deleteHeroSlide(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('hero_slides').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  return { success: true };
}

// ============================================================================
// PRODUCTS
// ============================================================================
export async function getProducts(options?: { category?: string; status?: string; search?: string }): Promise<Product[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      specs:product_specs(*),
      features:product_features(*),
      images:product_images(*)
    `)
    .order('display_order', { ascending: true });

  if (options?.category && options.category !== 'all') {
    query = query.eq('category_id', options.category);
  }
  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }
  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      specs:product_specs(*),
      features:product_features(*),
      images:product_images(*)
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function saveProduct(
  productData: Partial<Product>, 
  specs: { spec_name: string; spec_value: string }[] = [], 
  features: string[] = [],
  galleryImages: string[] = []
) {
  const supabase = createAdminClient();
  const id = productData.id || productData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;

  // Insert or Update product
  const productPayload = {
    ...productData,
    id,
    updated_at: new Date().toISOString()
  };

  const { error: prodError } = await supabase
    .from('products')
    .upsert(productPayload);

  if (prodError) throw new Error(prodError.message);

  // Update Specs
  await supabase.from('product_specs').delete().eq('product_id', id);
  if (specs.length > 0) {
    const specRows = specs.map((s, idx) => ({
      product_id: id,
      spec_name: s.spec_name,
      spec_value: s.spec_value,
      display_order: idx + 1
    }));
    await supabase.from('product_specs').insert(specRows);
  }

  // Update Features
  await supabase.from('product_features').delete().eq('product_id', id);
  if (features.length > 0) {
    const featureRows = features.map((f, idx) => ({
      product_id: id,
      feature_text: f,
      display_order: idx + 1
    }));
    await supabase.from('product_features').insert(featureRows);
  }

  // Save all images
  await supabase.from('product_images').delete().eq('product_id', id);
  const allImageUrls = Array.from(new Set([
    productData.main_image,
    ...galleryImages
  ])).filter(Boolean) as string[];

  if (allImageUrls.length > 0) {
    const imageRows = allImageUrls.map((url, idx) => ({
      product_id: id,
      image_url: url,
      alt_text: productData.name,
      display_order: idx + 1,
      is_primary: idx === 0
    }));
    await supabase.from('product_images').insert(imageRows);
  }

  revalidatePath('/shop');
  revalidatePath(`/product-details/${id}`);
  revalidatePath('/');
  return { success: true, id };
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/shop');
  revalidatePath('/');
  return { success: true };
}

export async function toggleProductStock(id: string, in_stock: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('products').update({ in_stock }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/shop');
  return { success: true };
}

// ============================================================================
// SERVICES
// ============================================================================
export async function getServices(): Promise<Service[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function saveService(service: Partial<Service>) {
  const supabase = createAdminClient();
  const id = service.id || service.slug || service.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `service-${Date.now()}`;
  const slug = service.slug || id;

  const payload = {
    ...service,
    id,
    slug,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('services')
    .upsert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/services');
  revalidatePath('/');
  return data;
}

export async function deleteService(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/services');
  return { success: true };
}

// ============================================================================
// GALLERY
// ============================================================================
export async function getGalleryItems(category?: string): Promise<GalleryItem[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from('gallery_items')
    .select('*')
    .order('display_order', { ascending: true });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function saveGalleryItem(item: Partial<GalleryItem>) {
  const supabase = createAdminClient();
  if (item.id) {
    const { data, error } = await supabase
      .from('gallery_items')
      .update(item)
      .eq('id', item.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    revalidatePath('/gallery');
    return data;
  } else {
    const { data, error } = await supabase
      .from('gallery_items')
      .insert([item])
      .select()
      .single();
    if (error) throw new Error(error.message);
    revalidatePath('/gallery');
    return data;
  }
}

export async function deleteGalleryItem(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/gallery');
  return { success: true };
}

// ============================================================================
// ENQUIRIES
// ============================================================================
export async function getEnquiries(): Promise<Enquiry[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function updateEnquiryStatus(id: string, status: string, notes?: string) {
  const supabase = createAdminClient();
  const payload: any = { status, updated_at: new Date().toISOString() };
  if (notes !== undefined) payload.notes = notes;

  const { error } = await supabase.from('enquiries').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/enquiries');
  return { success: true };
}

export async function deleteEnquiry(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('enquiries').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/enquiries');
  return { success: true };
}

export async function submitPublicEnquiry(formData: {
  name: string;
  phone: string;
  email?: string;
  message: string;
  product_service?: string;
  source_page?: string;
}) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('enquiries')
    .insert([formData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { success: true, id: data.id };
}

// ============================================================================
// ORDERS & COMMERCE
// ============================================================================
export async function getOrders(): Promise<Order[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function updateOrderStatus(id: string, order_status: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('orders')
    .update({ order_status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/orders');
  return { success: true };
}

// ============================================================================
// TESTIMONIALS
// ============================================================================
export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function saveTestimonial(testimonial: Partial<Testimonial>) {
  const supabase = createAdminClient();
  if (testimonial.id) {
    const { data, error } = await supabase
      .from('testimonials')
      .update(testimonial)
      .eq('id', testimonial.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    revalidatePath('/');
    return data;
  } else {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single();
    if (error) throw new Error(error.message);
    revalidatePath('/');
    return data;
  }
}

export async function deleteTestimonial(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  return { success: true };
}

// ============================================================================
// MEDIA LIBRARY
// ============================================================================
export async function getMediaLibrary(folder?: string) {
  const supabase = createAdminClient();
  let query = supabase.from('media').select('*').order('created_at', { ascending: false });
  if (folder && folder !== 'all') {
    query = query.eq('folder', folder);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function deleteMediaFile(id: string, storage_path: string) {
  const supabase = createAdminClient();
  await supabase.storage.from('website-media').remove([storage_path]);
  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/media');
  return { success: true };
}

export async function saveMediaRecord(media: Partial<MediaItem>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('media')
    .insert([media])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/media');
  return data;
}

// ============================================================================
// CATEGORIES
// ============================================================================
export async function getCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function saveCategory(category: Partial<Category>) {
  const supabase = createAdminClient();
  const id = category.id || category.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `cat-${Date.now()}`;
  const slug = category.slug || id;

  const payload = {
    ...category,
    id,
    slug,
  };

  const { data, error } = await supabase
    .from('categories')
    .upsert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/shop');
  revalidatePath('/admin/categories');
  return data;
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/shop');
  revalidatePath('/admin/categories');
  return { success: true };
}

// ============================================================================
// PAYMENT SETTINGS
// ============================================================================
export async function getPaymentSettings(): Promise<PaymentSettings | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('payment_settings').select('*').eq('id', 1).single();
  if (error) {
    // If not exists yet, insert default
    const defaultSettings = {
      id: 1,
      gateway: 'razorpay',
      razorpay_key_id: '',
      razorpay_key_secret: '',
      razorpay_webhook_secret: '',
      is_test_mode: true,
      is_enabled: true
    };
    const { data: created } = await supabase.from('payment_settings').insert([defaultSettings]).select().single();
    return created;
  }
  return data;
}

export async function updatePaymentSettings(settings: Partial<PaymentSettings>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('payment_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/settings/payments');
  return data;
}

export async function getShippingSettings(): Promise<ShippingSettings | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('shipping_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    console.warn('Error fetching shipping_settings:', error.message);
    return null;
  }
  return data;
}

export async function updateShippingSettings(settings: Partial<ShippingSettings>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('shipping_settings')
    .upsert({
      id: 1,
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/settings/shipping');
  return data;
}

// ============================================================================
// USER PROFILES & TEAM
// ============================================================================
export async function getProfiles(): Promise<Profile[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/settings/users');
  return data;
}

// ============================================================================
// CUSTOMERS
// ============================================================================
export async function getCustomers(): Promise<Customer[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

// ============================================================================
// PAGE SECTIONS CMS
// ============================================================================
export async function getPageSections(pageSlug: string): Promise<PageSection[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_slug', pageSlug)
    .order('display_order', { ascending: true });
  if (error) {
    console.error(`Error fetching sections for ${pageSlug}:`, error);
    return [];
  }
  return data || [];
}

export async function getPageSection(pageSlug: string, sectionKey: string): Promise<PageSection | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_slug', pageSlug)
    .eq('section_key', sectionKey)
    .single();
  if (error) return null;
  return data;
}

export async function savePageSection(section: Partial<PageSection>) {
  const supabase = createAdminClient();
  
  if (section.id) {
    const { data, error } = await supabase
      .from('page_sections')
      .update({
        ...section,
        updated_at: new Date().toISOString()
      })
      .eq('id', section.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    const pubPath = (!section.page_slug || section.page_slug === 'home') ? '/' : `/${section.page_slug}`;
    const admPath = section.page_slug === 'home' ? '/admin/content/homepage' : `/admin/content/${section.page_slug}`;
    revalidatePath(pubPath);
    revalidatePath(admPath);
    return data;
  } else {
    const { data: existing } = await supabase
      .from('page_sections')
      .select('id')
      .eq('page_slug', section.page_slug || 'home')
      .eq('section_key', section.section_key || '')
      .single();

    const pubPath = (!section.page_slug || section.page_slug === 'home') ? '/' : `/${section.page_slug}`;
    const admPath = section.page_slug === 'home' ? '/admin/content/homepage' : `/admin/content/${section.page_slug}`;

    if (existing) {
      const { data, error } = await supabase
        .from('page_sections')
        .update({
          ...section,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      revalidatePath(pubPath);
      revalidatePath(admPath);
      return data;
    } else {
      const { data, error } = await supabase
        .from('page_sections')
        .insert([{
          ...section,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      revalidatePath(pubPath);
      revalidatePath(admPath);
      return data;
    }
  }
}



