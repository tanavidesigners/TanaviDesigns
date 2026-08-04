# Tanavi Studio Admin & Operations Guide

## 1. Accessing Admin Portal

Navigate to `/admin` in your browser.

- **Dashboard Overview (`/admin`)**: Real database metrics (Gross revenue, paid orders, pending orders, low stock count, sales by category). Zero-data empty states rendered when database has no records.
- **Products & Catalogue (`/admin/products`)**: Create new products, update prices, manage variants (sizes S/M/L), and set status (`active` / `draft`).
- **Inventory Ledger (`/admin/inventory`)**: Real stock control ledger with on-hand, reserved, and low-stock threshold alerts.
- **Orders & Fulfilment (`/admin/orders`)**: View orders, filter by status, update status (`pending_payment` -> `paid` -> `processing` -> `shipped` -> `delivered`), view customer address details, and contact customers directly via WhatsApp.
- **Payment Log (`/admin/payments`)**: Audit Razorpay transaction IDs and payment status.
