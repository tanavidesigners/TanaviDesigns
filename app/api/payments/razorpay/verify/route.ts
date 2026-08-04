import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../../../lib/supabase/admin';
import { verifyRazorpaySignature } from '../../../../../lib/services/payment-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = body || {};

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
      return NextResponse.json({ error: 'Missing payment verification tokens' }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature verification' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Fetch Order & Order Items
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Update Payment Record to Captured
    await supabase
      .from('payments')
      .update({
        provider_payment_id: razorpayPaymentId,
        provider_signature: razorpaySignature,
        status: 'captured',
        captured_at: new Date().toISOString()
      })
      .eq('order_id', order.id);

    // 3. Convert Inventory Reservation to Sold if not already processed
    if (order.status !== 'paid') {
      const variantIds = order.items?.map((item: any) => item.variant_id).filter(Boolean) || [];
      const quantities = order.items?.map((item: any) => item.quantity) || [];

      if (variantIds.length > 0) {
        await supabase.rpc('convert_reservation_to_sale', {
          p_variant_ids: variantIds,
          p_quantities: quantities,
          p_order_id: order.id
        });
      }

      // Update Order Status to Paid
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_status: 'captured',
          placed_at: new Date().toISOString()
        })
        .eq('id', order.id);

      // Record Order History
      await supabase.from('order_status_history').insert({
        order_id: order.id,
        status: 'paid',
        note: `Payment verified via Razorpay Payment ID: ${razorpayPaymentId}`
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number
    });
  } catch (err: any) {
    console.error('Razorpay Signature Verification Error:', err);
    return NextResponse.json(
      { error: err.message || 'Payment signature verification failed' },
      { status: 500 }
    );
  }
}
