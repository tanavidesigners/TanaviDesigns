import { createHmac, timingSafeEqual } from 'node:crypto';
import Razorpay from 'razorpay';
import { createAdminClient } from '../supabase/admin';

export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured on the server');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
}

export async function createRazorpayOrder(amountPaise: number, receiptOrderNumber: string) {
  const razorpay = getRazorpayClient();
  const options = {
    amount: amountPaise,
    currency: 'INR',
    receipt: receiptOrderNumber,
    payment_capture: 1
  };

  const razorpayOrder = await razorpay.orders.create(options);
  return razorpayOrder;
}

export function verifyRazorpaySignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const generatedSignature = createHmac('sha256', secret)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest('hex');

  const expectedBuffer = Buffer.from(generatedSignature, 'utf8');
  const suppliedBuffer = Buffer.from(params.razorpaySignature, 'utf8');

  if (expectedBuffer.length !== suppliedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expectedHex = createHmac('sha256', secret).update(rawBody).digest('hex');
  const expectedBuffer = Buffer.from(expectedHex, 'utf8');
  const suppliedBuffer = Buffer.from(signature, 'utf8');

  if (expectedBuffer.length !== suppliedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, suppliedBuffer);
}
