# Tanavi by Deepika

Production-oriented Indian designer clothing storefront with a responsive catalogue, product pages, cart persistence, guest checkout, order tracking, WhatsApp enquiries, a studio dashboard, Razorpay signature/webhook handlers, and a relational commerce schema.

## Local development

1. Copy `.env.example` to `.env.local` and add test credentials.
2. Run `npm install`.
3. Run `npm run dev`.

Never commit Razorpay secrets. Configure production variables in the hosting control plane. Register `/api/webhooks/razorpay` in Razorpay and use a distinct webhook secret. Seed verified product variants and inventory before enabling live checkout.

## Production checklist

- Replace sample imagery with licensed Cloudinary assets.
- Seed catalogue, shipping methods and admin allowlist.
- Complete the create-order database transaction and Razorpay Orders API call.
- Complete idempotent payment/webhook transactions before accepting money.
- Configure analytics consent, transactional email and monitoring.
- Validate the custom domain DNS and webhook URL after deployment.
