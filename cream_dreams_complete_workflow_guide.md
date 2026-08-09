# 📜 Complete Workflow Guide: Cream Dreams Kurta Dhoti

This document provides a complete end-to-end visual walkthrough for adding the **Cream Dreams Kurta Dhoti** set in the Admin Portal, searching and asking for enquiries on the customer storefront, and placing a live order.

---

## 📌 Product Specification Overview

| Attribute | Details |
| :--- | :--- |
| **Product Name** | `Cream Dreams Kurta Dhoti` |
| **URL Slug** | `cream-dreams-kurta-dhoti` |
| **SKU Code** | `TNV-CREAM-DHOTI-26` |
| **Price** | **₹2,624** (`262400` paise) |
| **Stock Quantity** | **10 Units** (Small: 3, Medium: 4, Large: 3) |
| **Fabric** | Premium Viscose |
| **Craft / Style** | Handcrafted Dhoti Silhouette & Subtle Golden Threadwork |
| **Occasion** | Festive & Celebrations |
| **Database Status** | **ACTIVE & PUBLISHED** (ID: `6a49b5a8-7106-4166-90a1-8f22787cd1fa`) |
| **Photo Storage** | **Hostinger VPS Disk Storage** (`/uploads/cream-dreams-kurta-dhoti.png`) |

---

## 📸 Step 1: Adding a Product (Admin Portal)

### 🔗 URL: `https://admin.tanavidesigns.com/admin/products/new`

![Step 1: Add Product UI](file:///Users/chowdary/.gemini/antigravity-ide/brain/dc49e6ed-6a3d-4734-a9c7-3ee20e7ba6b6/process_step1_add_product_ui.png)

### Action Walkthrough:
1. Open the Admin Portal at `https://admin.tanavidesigns.com/admin/products/new`.
2. Enter Title: **`Cream Dreams Kurta Dhoti`**.
3. Set Base Price: **`2624`**.
4. Set Fabric: **`Premium Viscose`** and Category: **`Kurta Sets`**.
5. Paste Description:
   > *"Elegant in cream, this kurta dhoti set smoothly combines traditional charm with contemporary style. Crafted from premium viscose for supreme comfort and fit, this ensemble is a perfect choice for festive occasions and celebrations. Wear it and turn every moment into a celebration."*
6. Click **`📁 Upload Image File from Device`** to save high-res photo to Hostinger VPS Disk (`/uploads/cream-dreams-kurta-dhoti.png`).
7. Click **`PUBLISH PRODUCT`**. The system automatically creates size variants (**S**, **M**, **L**) and sets total stock to **10 units**.

---

## 🔎 Step 2: Search Product on Storefront & Ask for Enquiry

### 🔗 Product Live URL: `https://tanavidesigns.com/products/cream-dreams-kurta-dhoti`
### 🔗 Category URL: `https://tanavidesigns.com/category/kurta-sets`

![Step 2: Search and Enquiry UI](file:///Users/chowdary/.gemini/antigravity-ide/brain/dc49e6ed-6a3d-4734-a9c7-3ee20e7ba6b6/process_step2_search_and_enquiry_ui.png)

### Action Walkthrough:
1. Open Storefront Catalogue at `https://tanavidesigns.com/shop` or search **"Cream Dreams"**.
2. Alternatively, navigate via menu to **Kurta Sets** (`https://tanavidesigns.com/category/kurta-sets`).
3. Click on the product card to view the Product Detail Page (PDP).
4. **WhatsApp Enquiry**:
   - Click the green **`💬 Chat on WhatsApp for Enquiry`** button.
   - Pre-fills WhatsApp message to studio team (`+91 94822 45679`):
     > *"Hello Tanavi by Deepika, I would like to inquire about Cream Dreams Kurta Dhoti (₹2,624)."*

---

## 🛒 Step 3: Placing the Order & Order Confirmation

### 🔗 Checkout URL: `https://tanavidesigns.com/checkout`

![Step 3: Order Confirmation UI](file:///Users/chowdary/.gemini/antigravity-ide/brain/dc49e6ed-6a3d-4734-a9c7-3ee20e7ba6b6/process_step3_order_confirmation_ui.png)

### Action Walkthrough:
1. Select Size **`M` (Medium)** and click **`ADD TO BAG`**.
2. Proceed to Checkout at `https://tanavidesigns.com/checkout`.
3. Enter Customer Delivery Address & Select Razorpay Payment.
4. On payment completion, order **`TNV-260809-9482`** is generated with status **`CAPTURED`**.
5. **Real-time Inventory Ledger Update**:
   - The Supabase database automatically decrements Medium size stock from **4 units to 3 units** (Total remaining inventory = 9 units).
   - Order details appear live in Admin Orders (`https://admin.tanavidesigns.com/admin/orders`).
