# Razorpay Integration Guide: Tanavi by Deepika

## 1. Environment Variables

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

---

## 2. Server Order Creation Endpoint

`POST /api/payments/razorpay/create-order`

- Calculates prices server-side in integer paise directly from Supabase.
- Locks stock using `reserve_inventory_for_order` PostgreSQL RPC.
- Calls Razorpay SDK `orders.create`.

---

## 3. Signature Verification Endpoint

`POST /api/payments/razorpay/verify`

- Performs timing-safe HMAC-SHA256 comparison on `razorpay_order_id | razorpay_payment_id`.
- Updates payment record status to `captured`.
- Converts inventory reservation to `sale`.

---

## 4. Idempotent Webhook Endpoint

`POST /api/webhooks/razorpay`

- Validates raw HTTP request body with `RAZORPAY_WEBHOOK_SECRET`.
- Inserts `event_id` into `payment_events` table with UNIQUE constraint.
- Processes `payment.captured`, `order.paid`, `payment.failed` idempotently.
