import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { verifyWebhookSignature } from '../../../../lib/services/payment-service';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-razorpay-signature');
    const rawBody = await request.text();

    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id;
    const eventType = payload.event;

    if (!eventId || !eventType) {
      return NextResponse.json({ error: 'Malformed webhook event' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Idempotency Check: Insert event ID
    const { error: eventErr } = await supabase.from('payment_events').insert({
      provider: 'RAZORPAY',
      provider_event_id: eventId,
      event_type: eventType,
      payload: payload,
      processed: false
    });

    if (eventErr && eventErr.code === '23505') {
      // Event already processed previously (duplicate delivery)
      return NextResponse.json({ received: true, note: 'Duplicate event ignored' });
    }

    // 2. Process Relevant Events
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const razorpayOrderId = payload.payload?.payment?.entity?.order_id || payload.payload?.order?.entity?.id;
      const razorpayPaymentId = payload.payload?.payment?.entity?.id;

      if (razorpayOrderId) {
        const { data: order } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .eq('razorpay_order_id', razorpayOrderId)
          .single();

        if (order && order.status !== 'paid') {
          const variantIds = order.items?.map((item: any) => item.variant_id).filter(Boolean) || [];
          const quantities = order.items?.map((item: any) => item.quantity) || [];

          if (variantIds.length > 0) {
            await supabase.rpc('convert_reservation_to_sale', {
              p_variant_ids: variantIds,
              p_quantities: quantities,
              p_order_id: order.id
            });
          }

          await supabase
            .from('orders')
            .update({
              status: 'paid',
              payment_status: 'captured',
              placed_at: new Date().toISOString()
            })
            .eq('id', order.id);

          await supabase
            .from('payments')
            .update({
              provider_payment_id: razorpayPaymentId,
              status: 'captured',
              captured_at: new Date().toISOString()
            })
            .eq('order_id', order.id);
        }
      }
    } else if (eventType === 'payment.failed') {
      const razorpayOrderId = payload.payload?.payment?.entity?.order_id;
      if (razorpayOrderId) {
        const { data: order } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .eq('razorpay_order_id', razorpayOrderId)
          .single();

        if (order && order.status === 'pending_payment') {
          const variantIds = order.items?.map((item: any) => item.variant_id).filter(Boolean) || [];
          const quantities = order.items?.map((item: any) => item.quantity) || [];

          await supabase.rpc('release_inventory_reservation', {
            p_variant_ids: variantIds,
            p_quantities: quantities
          });

          await supabase
            .from('orders')
            .update({
              status: 'payment_failed',
              payment_status: 'failed'
            })
            .eq('id', order.id);
        }
      }
    }

    // Mark event as processed
    await supabase
      .from('payment_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('provider_event_id', eventId);

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Razorpay Webhook Handler Error:', err);
    return NextResponse.json({ error: err.message || 'Webhook error' }, { status: 500 });
  }
}
