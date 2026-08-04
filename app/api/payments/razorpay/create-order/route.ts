import { NextResponse } from 'next/server';
import { processCheckoutOrder } from '../../../../../lib/services/checkout-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer } = body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

    if (!customer || !customer.fullName || !customer.email || !customer.phone || !customer.line1 || !customer.city || !customer.state || !customer.pinCode) {
      return NextResponse.json({ error: 'Complete shipping address and contact details are required' }, { status: 400 });
    }

    const result = await processCheckoutOrder(items, customer);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Create Razorpay Order Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process checkout order' },
      { status: 500 }
    );
  }
}
