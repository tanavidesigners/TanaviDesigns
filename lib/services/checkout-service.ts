import { createAdminClient } from '../supabase/admin';
import { createRazorpayOrder } from './payment-service';

export interface CheckoutItemInput {
  variantId: string;
  quantity: number;
}

export interface CheckoutCustomerInput {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pinCode: string;
  userId?: string;
}

export async function processCheckoutOrder(
  items: CheckoutItemInput[],
  customer: CheckoutCustomerInput
) {
  const supabase = createAdminClient();

  if (!items || items.length === 0) {
    throw new Error('Checkout cart cannot be empty');
  }

  // 1. Fetch variant pricing & current available inventory directly from Supabase
  const variantIds = items.map((i) => i.variantId);
  const quantities = items.map((i) => i.quantity);

  const { data: variants, error: vErr } = await supabase
    .from('product_variants')
    .select(`
      id,
      sku,
      size,
      colour_name,
      price_override,
      product:products(
        id,
        name,
        slug,
        base_price,
        status,
        images:product_images(storage_path, is_primary)
      ),
      inventory:inventory(quantity_on_hand, quantity_reserved)
    `)
    .in('id', variantIds);

  if (vErr || !variants || variants.length === 0) {
    throw new Error('Failed to load selected products for checkout');
  }

  // 2. Validate availability and calculate total server-side
  let subtotalPaise = 0;
  const orderItemsData = [];

  for (const itemInput of items) {
    const v = variants.find((v) => v.id === itemInput.variantId);
    if (!v) throw new Error(`Product variant not found: ${itemInput.variantId}`);

    const product = v.product as any;
    if (!product || product.status !== 'active') {
      throw new Error(`Product ${product?.name || ''} is no longer available`);
    }

    const inv = Array.isArray(v.inventory) ? v.inventory[0] : (v.inventory as any);
    const availableStock = (inv?.quantity_on_hand || 0) - (inv?.quantity_reserved || 0);
    if (availableStock < itemInput.quantity) {
      throw new Error(`Insufficient stock for ${product.name} (Size: ${v.size}). Only ${Math.max(0, availableStock)} available.`);
    }

    const unitPrice = v.price_override || product.base_price;
    const lineTotal = unitPrice * itemInput.quantity;
    subtotalPaise += lineTotal;

    const primaryImage = product.images?.find((img: any) => img.is_primary)?.storage_path || product.images?.[0]?.storage_path || null;

    orderItemsData.push({
      product_id: product.id,
      variant_id: v.id,
      product_name: product.name,
      product_slug: product.slug,
      sku: v.sku,
      size: v.size,
      colour: v.colour_name,
      unit_price: unitPrice,
      quantity: itemInput.quantity,
      line_total: lineTotal,
      image_url: primaryImage
    });
  }

  // 3. Shipping & Taxes (Shipping free above ₹2,999 / 299900 paise, else ₹149 / 14900 paise)
  const shippingTotalPaise = subtotalPaise >= 299900 ? 0 : 14900;
  const taxTotalPaise = 0;
  const discountTotalPaise = 0;
  const grandTotalPaise = subtotalPaise + shippingTotalPaise - discountTotalPaise;

  // 4. Call atomic reservation RPC
  const { data: reserveRes, error: reserveErr } = await supabase.rpc('reserve_inventory_for_order', {
    p_variant_ids: variantIds,
    p_quantities: quantities
  });

  if (reserveErr || (reserveRes && reserveRes[0]?.success === false)) {
    const msg = reserveRes?.[0]?.error_message || reserveErr?.message || 'Inventory reservation failed';
    throw new Error(msg);
  }

  // 5. Generate Order Number (TNV-YYYYMMDD-XXXX)
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `TNV-${dateStr}-${randomSuffix}`;

  // 6. Create Razorpay Order
  let razorpayOrder;
  try {
    razorpayOrder = await createRazorpayOrder(grandTotalPaise, orderNumber);
  } catch (err: any) {
    // Release inventory reservation if Razorpay API fails
    await supabase.rpc('release_inventory_reservation', {
      p_variant_ids: variantIds,
      p_quantities: quantities
    });
    throw new Error(`Razorpay Order Creation Failed: ${err.message}`);
  }

  // 7. Insert Order Record into Supabase
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: customer.userId || null,
      guest_email: customer.email,
      guest_phone: customer.phone,
      status: 'pending_payment',
      payment_status: 'created',
      fulfilment_status: 'unfulfilled',
      currency: 'INR',
      subtotal: subtotalPaise,
      discount_total: discountTotalPaise,
      shipping_total: shippingTotalPaise,
      tax_total: taxTotalPaise,
      grand_total: grandTotalPaise,
      shipping_address: {
        full_name: customer.fullName,
        phone: customer.phone,
        line1: customer.line1,
        line2: customer.line2 || '',
        city: customer.city,
        state: customer.state,
        pin_code: customer.pinCode
      },
      razorpay_order_id: razorpayOrder.id
    })
    .select()
    .single();

  if (orderErr || !order) {
    await supabase.rpc('release_inventory_reservation', {
      p_variant_ids: variantIds,
      p_quantities: quantities
    });
    throw new Error(`Failed to record order: ${orderErr?.message}`);
  }

  // 8. Insert Order Items
  const itemsToInsert = orderItemsData.map((item) => ({
    ...item,
    order_id: order.id
  }));

  await supabase.from('order_items').insert(itemsToInsert);

  // 9. Insert Initial Payment Record
  await supabase.from('payments').insert({
    order_id: order.id,
    provider: 'RAZORPAY',
    provider_order_id: razorpayOrder.id,
    amount: grandTotalPaise,
    currency: 'INR',
    status: 'created'
  });

  return {
    orderId: order.id,
    orderNumber: order.order_number,
    razorpayOrderId: razorpayOrder.id,
    amountPaise: grandTotalPaise,
    currency: 'INR',
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID
  };
}
