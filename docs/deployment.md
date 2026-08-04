# Production Deployment Guide: GitHub → Vercel → GoDaddy Domain → Supabase

## 1. Prerequisites & Environment Setup

1. **GitHub Repository**: Push code to your production GitHub repository.
2. **Vercel Project**: Import repository into Vercel.
3. **Environment Variables on Vercel**:

```env
NEXT_PUBLIC_SITE_URL=https://tanavibydeepika.com
NEXT_PUBLIC_STORE_NAME="Tanavi by Deepika"
NEXT_PUBLIC_SUPABASE_URL=https://wnbckffbhhmxxjbetzvs.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_nc4EgAvRw9x3jQIYXQ1-Jw_BBfHGSC8
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_nc4EgAvRw9x3jQIYXQ1-Jw_BBfHGSC8
DATABASE_URL=postgresql://postgres:SupaBase@2026@db.wnbckffbhhmxxjbetzvs.supabase.co:5432/postgres

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_live_key
RAZORPAY_KEY_ID=rzp_live_your_live_key
RAZORPAY_KEY_SECRET=your_live_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_live_webhook_secret

NEXT_PUBLIC_WHATSAPP_NUMBER=919482245679
```

---

## 2. GoDaddy DNS Configuration

1. Log into your GoDaddy Domain Control Center.
2. Navigate to DNS Management for `tanavibydeepika.com`.
3. Add the following records pointing to Vercel:
   - **A Record**: `@` → `76.76.21.21`
   - **CNAME Record**: `www` → `cname.vercel-dns.com`

---

## 3. Razorpay Live Mode Switch & Webhooks

1. Switch Razorpay Dashboard to **Live Mode**.
2. Copy Live Key ID & Live Key Secret into Vercel Environment Variables.
3. Register Webhook URL:
   `https://tanavibydeepika.com/api/webhooks/razorpay`
4. Select Webhook Events: `payment.authorized`, `payment.captured`, `payment.failed`, `order.paid`.
