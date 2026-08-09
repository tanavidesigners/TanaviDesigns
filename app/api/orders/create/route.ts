import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import {
  buildAdminOrderNotificationWhatsAppUrl,
  buildCustomerOrderConfirmationWhatsAppUrl
} from '../../../../lib/services/whatsapp-service';
import { sendOrderConfirmationEmails } from '../../../../lib/services/email-service';

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

    // 1. Read Studio Configuration from site_settings
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
        colour_name,
        price_override,
        product:products(id, name, slug, base_price, product_images(storage_path, is_primary))
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
      const images = p?.product_images || [];
      const imgUrl = images.find((img: any) => img.is_primary)?.storage_path || images[0]?.storage_path || '';

      const unitPricePaise = v.price_override || p.base_price;
      const lineTotalPaise = unitPricePaise * item.quantity;
      subtotalPaise += lineTotalPaise;

      orderItemsToInsert.push({
        product_id: p.id,
        variant_id: v.id,
        product_name: p.name,
        product_slug: p.slug,
        sku: v.sku,
        size: v.size,
        colour: v.colour_name || 'Original',
        unit_price: unitPricePaise,
        quantity: item.quantity,
        line_total: lineTotalPaise,
        image_url: imgUrl
      });

      itemSummaryParts.push(`${p.name} (Size ${v.size}) × ${item.quantity}`);
    }

    const shippingPaise = subtotalPaise >= 299900 || subtotalPaise === 0 ? 0 : 14900;
    const totalPaise = subtotalPaise + shippingPaise;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TNV-${dateStr}-${randomSuffix}`;
    const paymentMethodLabel = paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Pay Later (Studio Reserve)';

    const shippingAddressObj = {
      fullName: customer.fullName,
      phone: customer.phone,
      line1: customer.line1,
      line2: customer.line2 || '',
      city: customer.city,
      state: customer.state || 'Andhra Pradesh',
      pinCode: customer.pinCode
    };

    // 3. Create Order Record in public.orders
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        guest_email: customer.email,
        guest_phone: customer.phone,
        status: 'pending_payment',
        payment_status: 'pending',
        fulfilment_status: 'unfulfilled',
        currency: 'INR',
        subtotal: subtotalPaise,
        shipping_total: shippingPaise,
        grand_total: totalPaise,
        shipping_address: shippingAddressObj,
        customer_notes: `Placed via ${paymentMethodLabel}`
      })
      .select()
      .single();

    if (orderErr || !order) {
      console.error('Order creation error:', orderErr);
      return NextResponse.json({ error: orderErr?.message || 'Failed to create order record' }, { status: 500 });
    }

    // 4. Create Order Items in public.order_items
    for (const itemRow of orderItemsToInsert) {
      await supabase.from('order_items').insert({
        order_id: order.id,
        ...itemRow
      });
    }

    // 5. Create Payment Record in public.payments
    await supabase.from('payments').insert({
      order_id: order.id,
      provider: paymentMethod.toUpperCase(),
      provider_order_id: orderNumber,
      amount: totalPaise,
      currency: 'INR',
      status: 'pending',
      method: paymentMethod
    });

    // 6. Deduct Inventory in public.inventory
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

    // 7. Generate WhatsApp Notification URLs & Email Payloads
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

    // 8. Trigger Email Notifications to Customer & Admin (tanavidesigns@gmail.com)
    const emailItemDetails = orderItemsToInsert.map((item) => ({
      name: item.product_name,
      size: item.size,
      quantity: item.quantity,
      priceFormatted: (item.line_total / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
      imageUrl: item.image_url
    }));

    sendOrderConfirmationEmails(
      {
        orderNumber,
        customerName: customer.fullName,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        paymentMethod: paymentMethodLabel,
        totalFormatted: formattedTotal,
        itemsSummary,
        addressSummary,
        items: emailItemDetails
      },
      config.admin_email || 'tanavidesigns@gmail.com'
    ).catch((e) => console.error('Background email notification error:', e));

    console.log(`[ORDER CREATED] ${paymentMethodLabel} Order ${orderNumber} created! Total: ${formattedTotal}`);

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
