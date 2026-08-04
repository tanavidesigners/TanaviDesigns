# Tanavi by Deepika - Security & Compliance Review

## 1. Threat Matrix & Mitigation Controls

| Vulnerability Vector | Risk Level | Protection Control Implemented |
| :--- | :---: | :--- |
| **Client-side Price Manipulation** | CRITICAL | **Server-side Calculation**: Order grand totals are calculated server-side in integer paise directly from Supabase product/variant pricing and database coupon validation rules. Browser pricing inputs are strictly ignored. |
| **Payment Webhook Tampering** | CRITICAL | **HMAC-SHA256 Signature Verification**: Every Razorpay webhook payload is validated against `RAZORPAY_WEBHOOK_SECRET` using `crypto.timingSafeEqual` on the raw HTTP request body. |
| **Duplicate Payment Processing (Replay)** | HIGH | **Idempotent Ledger**: Webhook event IDs are stored in Supabase `payment_events` with a UNIQUE constraint. Duplicate deliveries return early with HTTP 200 without executing duplicate stock deductions or order state changes. |
| **Secret Key Leakage** | CRITICAL | **Strict Boundary Enforcement**: `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` are used exclusively in server-side API routes / Server Actions. Lint rules block importing server keys in client bundles. |
| **Unauthorized Data Access / Data Leakage** | HIGH | **Supabase Row Level Security (RLS)**: RLS enabled on all database tables. Customers can only read/update their own profile, addresses, cart, wishlist, and orders. |
| **Unauthorized Admin Actions** | CRITICAL | **Server-side Role Check**: All `/admin` endpoints and Server Actions verify user role (`admin` / `staff`) via Supabase Auth JWT claims & `profiles` lookup. |
| **Overselling / Race Conditions** | HIGH | **Atomic Inventory Reservation**: Stock deductions use PostgreSQL atomic functions / transactions (`SELECT FOR UPDATE` or conditional update `quantity_on_hand - quantity_reserved >= quantity`). |
| **Input Injection & Invalid Formats** | MEDIUM | **Zod Schema Validation**: All incoming requests (checkout, cart, contact, product creation, search) are validated with strict Zod schemas before processing. |

---

## 2. Environment Variables & Secret Management

```env
# Public Client Variables
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STORE_NAME="Tanavi by Deepika"
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
NEXT_PUBLIC_WHATSAPP_NUMBER=919482245679
NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE="Hello Tanavi, I would like to know more about your designer collection."

# Confidential Server-Only Secrets (NEVER expose to browser)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
ADMIN_BOOTSTRAP_EMAIL=admin@tanavidesigns.com
APP_TIMEZONE=Asia/Kolkata
```
