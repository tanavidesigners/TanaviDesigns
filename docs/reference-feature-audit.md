# Tanavi by Deepika - Reference Feature Audit

Reference Website: `https://www.aanyasri.com/`

## Feature Audit & Gap Analysis

| Reference feature | Needed for Tanavi | Existing implementation | Required action |
| :--- | :---: | :---: | :--- |
| **Global Announcement Bar** | Yes | Partial (Hardcoded text in `storefront.tsx`) | Refactor: Fetch active announcements dynamically from Supabase `announcements` table. Hide bar when no announcement active. |
| **Header & Logo Layout** | Yes | Partial (Basic static header in `storefront.tsx`) | Refactor: Rebuild with accessible shadcn NavigationMenu, dynamic category navigation, search modal trigger, wishlist count badge, active cart drawer. |
| **Navigation Hierarchy** | Yes | Partial (Static links) | Refactor: Dynamic menu rendered from Supabase categories & collections. |
| **Product Categories** | Yes | Partial (Hardcoded arrays) | Build: Store categories in Supabase (Sarees, Kurta Sets, Co-ords, Dresses, Dupattas, Lehengas) with slug & hierarchy. |
| **Collection Structure** | Yes | Missing | Build: Supabase collections table (e.g. New Arrivals, Festive Edit, Monsoon Edition) mapped via `product_collections`. |
| **Search Behaviour** | Yes | Partial (Client-side simple text query) | Refactor: Server-side search API with debounced search input, category filters, and quick product result cards. |
| **Product Card Options** | Yes | Partial (Simple static card) | Refactor: Standardized responsive aspect ratio, hover secondary image, active badges (New, Low Stock based on actual inventory), server-backed wishlist toggle, price formatting. |
| **Product Detail Options** | Yes | Partial (Static PDP in `storefront.tsx`) | Refactor: Multi-image gallery with thumbnail switcher, image lightbox/zoom, variant selectors (size/colour), actual stock display, tax notice, size guide modal, dispatch timeline, accordions for craft/care/shipping. |
| **Variant Selectors** | Yes | Partial (Static state buttons) | Refactor: Dynamic size & colour selection tied to Supabase `product_variants` & `inventory`. Disable out-of-stock sizes. |
| **Cart Behaviour** | Yes | Partial (Local state cart) | Refactor: Persistent cart (Supabase auth for logged-in users, secure session tokens for guest users) with Cart Drawer + full Cart Page. Server-validated subtotal, shipping & tax recalculation. |
| **Wishlist Behaviour** | Yes | Partial (Client local state array) | Refactor: Server-backed Wishlist stored in Supabase `wishlists` & `wishlist_items` for registered users, saved locally for guests. |
| **Account Options** | Yes | Missing (Only dummy admin login existed) | Build: Full Supabase Auth implementation with Customer Register, Login, Password Reset, Profile Management, Saved Addresses, Order History & Status Tracking. |
| **Checkout Flow** | Yes | Partial (Mock checkout with setTimeout) | Refactor: Real multi-step/single-page checkout. Server-side price & tax calculation, internal order creation in Supabase, inventory reservation lock, Razorpay SDK integration. |
| **Footer Structure** | Yes | Partial (Static HTML layout) | Refactor: Brand story excerpt, dynamic collection links, customer support links, physical studio address, copyright & policy links, floating WhatsApp button. |
| **Policy Pages** | Yes | Missing (Hardcoded `#` anchors) | Build: Dedicated informational pages: Shipping Policy, Return & Refund Policy, Privacy Policy, Terms & Conditions, Size Guide, FAQs, Order Tracking. |
| **Contact Options** | Yes | Partial (Static email/location in footer) | Build: Dedicated `/contact` page with inquiry form saving to Supabase `contact_enquiries` table + direct WhatsApp trigger. |
| **WhatsApp Entry Points** | Yes | Partial (Static footer link) | Build: Configurable wa.me links on PDP (with SKU, title, size, price, URL), Cart, Order Detail, Floating FAB, and Admin Order Support. |
| **Product Recommendations** | Yes | Partial (Hardcoded products slice) | Refactor: Dynamic "You May Also Love" recommendations queried from Supabase based on same category/collection. |
| **Filters** | Yes | Partial (Dummy checkbox UI) | Refactor: Server-driven URL query param filters for category, price range, fabric, occasion, availability, and size with active filter chips. |
| **Sorting** | Yes | Partial (Client array sort) | Refactor: Dynamic server sorting (Newest, Price: Low to High, Price: High to Low, Featured, Best Selling computed from paid order items). |
| **Mobile Navigation** | Yes | Partial (Static CSS hidden elements) | Refactor: Responsive Sheet drawer navigation for mobile screen sizes with accordion category menus and touch-friendly controls. |
| **Delivery & Size Guide** | Yes | Missing | Build: Interactive size guide modal with standard Indian designer measurements and real-time pincode delivery availability estimation. |

---

## Intellectual Property & Branding Boundaries

To strictly comply with branding guidelines:

1. **Brand Identity**: Retain **Tanavi by Deepika** visual identity (soft rose, ivory, terracotta, charcoal, gold tones) with high-end editorial serif typography (Playfair Display / Cormorant Garamond) paired with clean sans-serif (Inter / Outfit).
2. **Content & Copy**: All product descriptions, fabric stories, and photography will be Tanavi-specific. No text or images will be copied from `aanyasri.com`.
3. **Legal Content**: Placeholder policy texts will be clearly formatted for business/legal review.
