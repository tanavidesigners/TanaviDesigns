import { createAdminClient } from '../supabase/admin';
import type { Product, Category, Collection, Announcement } from '../types/database';

export function formatMoney(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(paise / 100);
}

export async function getActiveProducts(params?: {
  categorySlug?: string;
  collectionSlug?: string;
  searchQuery?: string;
  sort?: string;
  limit?: number;
}): Promise<Product[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*, inventory(*)),
      images:product_images(*)
    `)
    .eq('status', 'active');

  if (params?.searchQuery) {
    query = query.or(`name.ilike.%${params.searchQuery}%,description.ilike.%${params.searchQuery}%,fabric.ilike.%${params.searchQuery}%`);
  }

  if (params?.sort === 'low') {
    query = query.order('base_price', { ascending: true });
  } else if (params?.sort === 'high') {
    query = query.order('base_price', { ascending: false });
  } else if (params?.sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  let results = data as Product[];

  if (params?.categorySlug) {
    results = results.filter((p) => p.category?.slug === params.categorySlug);
  }

  return results;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*, inventory(*)),
      images:product_images(*)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as Product;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data) return [];
  return data as Category[];
}

export async function getCollections(): Promise<Collection[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as Collection[];
}

export async function getActiveAnnouncement(): Promise<Announcement | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('active', true)
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as Announcement;
}
