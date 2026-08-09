import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import {
  buildAdminOrderNotificationWhatsAppUrl,
  buildCustomerOrderConfirmationWhatsAppUrl
} from '../../../../lib/services/whatsapp-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, paymentMethod } = body;

    if (!items || !items.length || !customer || !customer.phone || !customer.email || !customer.fullName) {
      return NextResponse.json({ error: 'Missing required customer or item details' }, { status: 400 });
    }

    if (!['cod', 'pay_later'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Read Studio Configuration from site_settings (for admin phone & settings)
    const { data: settingRow } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'studio_config')
      .single();

    const config = settingRow?.value || {
      admin_work_mobile: '919482245679',
      admin_email: 'tanavidesigns@gmail.com',
      cod_enabled: true,
      pay_later_enabled: true
    };

    if (paymentMethod === 'cod' && config.cod_enabled === false) {
      return NextResponse.json({ error: 'Cash on Delivery is currently disabled by studio admin.' }, { status: 400 });
    }

    if (paymentMethod === 'pay_later' && config.pay_later_enabled === false) {
      return NextResponse.json({ error: 'Pay Later is currently disabled by studio admin.' }, { status: 400 });
    }

    // 2. Fetch Variant details & Calculate Prices
    const variantIds = items.map((i: any) => i.variantId);
    const { data: variants, error: varErr } = await supabase
      .from('product_variants')
      .select(`
        id,
        sku,
        size,
        price_override,
        product:products(id, name, base_price)
      `)
      .in('id', variantIds);

    if (varErr || !variants || variants.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch product details' }, { status: 400 });
    }

    let subtotalPaise = 0;
    const orderItemsToInsert: any[] = [];
    const itemSummaryParts: string[] = [];

    for (const item of items) {
      const v = variants.find((varObj: any) => varObj.id === item.variantId);
      if (!v) continue;

      const p = (v as any).product;
      const unitPricePaise = v.price_override || p.base_price;
      const lineTotalPaise = unitPricePaise * item.quantity;
      subtotalPaise += lineTotalPaise;

      orderItemsToInsert.push({
        variant_id: v.id,
        quantity: item.quantity,
        unit_price: unitPricePaise,
        total_price: lineTotalPaise
      });

      itemSummaryParts.push(`${p.name} (Size ${v.size}) × ${item.quantity}`);
    }

    const shippingPaise = subtotalPaise >= 299900 || subtotalPaise === 0 ? 0 : 14900;
    const totalPaise = subtotalPaise + shippingPaise;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TNV-${dateStr}-${randomSuffix}`;
    const paymentMethodLabel = paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Pay Later (Studio Reserve)';

    // 3. Create Address Record
    const { data: addr, error: addrErr } = await supabase
      .from('addresses')
      .insert({
        full_name: customer.fullName,
        phone: customer.phone,
        line1: customer.line1,
        line2: customer.line2 || '',
        city: customer.city,
        state: customer.state || 'Andhra Pradesh',
        pin_code: customer.pinCode
      })
      .select()
      .single();

    if (addrErr) {
      console.error('Address insertion error:', addrErr);
    }

    // 4. Create Order Record
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        shipping_address_id: addr?.id || null,
        subtotal: subtotalPaise,
        shipping_cost: shippingPaise,
        total_amount: totalPaise,
        order_status: 'pending_payment',
        fulfilment_status: 'unfulfilled',
        notes: `Placed via ${paymentMethodLabel}`
      })
      .select()
      .single();

    if (orderErr || !order) {
      console.error('Order creation error:', orderErr);
      return NextResponse.json({ error: orderErr?.message || 'Failed to create order record' }, { status: 500 });
    }

    // 5. Create Order Items
    for (const itemRow of orderItemsToInsert) {
      await supabase.from('order_items').insert({
        order_id: order.id,
        ...itemRow
      });
    }

    // 6. Create Payment Record
    await supabase.from('payments').insert({
      order_id: order.id,
      payment_method: paymentMethod,
      amount: totalPaise,
      currency: 'INR',
      status: 'pending'
    });

    // 7. Deduct Inventory
    for (const item of items) {
      const { data: inv } = await supabase
        .from('inventory')
        .select('id, quantity_on_hand')
        .eq('variant_id', item.variantId)
        .single();

      if (inv) {
        const newQty = Math.max(0, inv.quantity_on_hand - item.quantity);
        await supabase
          .from('inventory')
          .update({ quantity_on_hand: newQty })
          .eq('id', inv.id);
      }
    }

    // 8. Generate WhatsApp URLs
    const formattedTotal = (totalPaise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    const itemsSummary = itemSummaryParts.join(', ');
    const addressSummary = `${customer.line1}, ${customer.city}, ${customer.state} ${customer.pinCode}`;

    const adminWhatsAppUrl = buildAdminOrderNotificationWhatsAppUrl({
      adminPhone: config.admin_work_mobile || '919482245679',
      orderNumber,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      paymentMethod: paymentMethodLabel,
      totalFormatted: formattedTotal,
      itemsSummary,
      addressSummary
    });

    const customerWhatsAppUrl = buildCustomerOrderConfirmationWhatsAppUrl({
      customerPhone: customer.phone.replace(/[^0-9]/g, ''),
      orderNumber,
      customerName: customer.fullName,
      paymentMethod: paymentMethodLabel,
      totalFormatted: formattedTotal,
      itemsSummary
    });

    console.log(`[ORDER NOTIFICATION] New ${paymentMethodLabel} Order ${orderNumber} created! Total: ${formattedTotal}`);

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: order.id,
      paymentMethod: paymentMethodLabel,
      adminWhatsAppUrl,
      customerWhatsAppUrl
    });
  } catch (error: any) {
    console.error('Order creation handler error:', error);
    return NextResponse.json({ error: error.message || 'Server error creating order' }, { status: 500 });
  }
}
