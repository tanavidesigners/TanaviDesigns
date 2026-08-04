import { createAdminClient } from '../supabase/admin';

export interface AdminDashboardMetrics {
  grossRevenuePaise: number;
  paidOrdersCount: number;
  pendingOrdersCount: number;
  processingOrdersCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalProductsCount: number;
  totalCustomersCount: number;
}

export interface InventoryAlertItem {
  variant_id: string;
  sku: string;
  product_name: string;
  size: string;
  colour_name: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  low_stock_threshold: number;
  alert_status: 'healthy' | 'low_stock' | 'out_of_stock';
}

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const supabase = createAdminClient();

  // 1. Paid Orders & Revenue
  const { data: paidOrders } = await supabase
    .from('orders')
    .select('grand_total')
    .in('status', ['paid', 'processing', 'packed', 'shipped', 'delivered']);

  const grossRevenuePaise = paidOrders?.reduce((sum, o) => sum + (o.grand_total || 0), 0) || 0;
  const paidOrdersCount = paidOrders?.length || 0;

  // 2. Pending Orders
  const { count: pendingOrdersCount } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending_payment');

  // 3. Processing Orders
  const { count: processingOrdersCount } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .in('status', ['paid', 'processing', 'packed']);

  // 4. Inventory Alerts
  const { data: inventoryData } = await supabase
    .from('inventory')
    .select('quantity_on_hand, quantity_reserved, low_stock_threshold');

  let lowStockCount = 0;
  let outOfStockCount = 0;

  inventoryData?.forEach((inv) => {
    const available = inv.quantity_on_hand - inv.quantity_reserved;
    if (available <= 0) {
      outOfStockCount++;
    } else if (available <= inv.low_stock_threshold) {
      lowStockCount++;
    }
  });

  // 5. Total Products Count
  const { count: totalProductsCount } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  // 6. Total Customers Count
  const { count: totalCustomersCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'customer');

  return {
    grossRevenuePaise,
    paidOrdersCount,
    pendingOrdersCount: pendingOrdersCount || 0,
    processingOrdersCount: processingOrdersCount || 0,
    lowStockCount,
    outOfStockCount,
    totalProductsCount: totalProductsCount || 0,
    totalCustomersCount: totalCustomersCount || 0,
  };
}

export async function getInventoryAlerts(): Promise<InventoryAlertItem[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('admin_inventory_alerts')
    .select('*');

  if (error || !data) return [];
  return data as InventoryAlertItem[];
}
