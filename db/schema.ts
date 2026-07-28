import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  phone: text("phone"),
  role: text("role", { enum: ["CUSTOMER", "ADMIN", "STAFF"] }).notNull().default("CUSTOMER"),
  passwordHash: text("password_hash"),
  ...timestamps,
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
  ...timestamps,
});
export const addresses = sqliteTable("addresses", { id:text("id").primaryKey(), userId:text("user_id").references(()=>users.id), name:text("name").notNull(), phone:text("phone").notNull(), line1:text("line1").notNull(), line2:text("line2"), city:text("city").notNull(), state:text("state").notNull(), pinCode:text("pin_code").notNull(), ...timestamps });
export const categories = sqliteTable("categories", { id:text("id").primaryKey(), name:text("name").notNull(), slug:text("slug").notNull().unique(), description:text("description"), imageUrl:text("image_url"), ...timestamps });
export const collections = sqliteTable("collections", { id:text("id").primaryKey(), name:text("name").notNull(), slug:text("slug").notNull().unique(), description:text("description"), imageUrl:text("image_url"), ...timestamps });
export const products = sqliteTable("products", { id:text("id").primaryKey(), categoryId:text("category_id").references(()=>categories.id), name:text("name").notNull(), slug:text("slug").notNull().unique(), subtitle:text("subtitle"), description:text("description").notNull(), status:text("status").notNull().default("DRAFT"), fabric:text("fabric"), occasion:text("occasion"), seoTitle:text("seo_title"), seoDescription:text("seo_description"), ...timestamps });
export const productImages = sqliteTable("product_images", { id:text("id").primaryKey(), productId:text("product_id").notNull().references(()=>products.id,{onDelete:"cascade"}), url:text("url").notNull(), alt:text("alt").notNull(), position:integer("position").notNull().default(0) });
export const productVariants = sqliteTable("product_variants", { id:text("id").primaryKey(), productId:text("product_id").notNull().references(()=>products.id,{onDelete:"cascade"}), sku:text("sku").notNull().unique(), size:text("size").notNull(), colour:text("colour").notNull(), pricePaise:integer("price_paise").notNull(), compareAtPaise:integer("compare_at_paise"), active:integer("active",{mode:"boolean"}).notNull().default(true), ...timestamps });
export const inventory = sqliteTable("inventory", { id:text("id").primaryKey(), variantId:text("variant_id").notNull().unique().references(()=>productVariants.id,{onDelete:"cascade"}), available:integer("available").notNull().default(0), reserved:integer("reserved").notNull().default(0), version:integer("version").notNull().default(0), ...timestamps });
export const carts = sqliteTable("carts", { id:text("id").primaryKey(), userId:text("user_id").references(()=>users.id), sessionId:text("session_id"), ...timestamps });
export const cartItems = sqliteTable("cart_items", { id:text("id").primaryKey(), cartId:text("cart_id").notNull().references(()=>carts.id,{onDelete:"cascade"}), variantId:text("variant_id").notNull().references(()=>productVariants.id), quantity:integer("quantity").notNull(), ...timestamps });
export const wishlists = sqliteTable("wishlists", { id:text("id").primaryKey(), userId:text("user_id").notNull().unique().references(()=>users.id,{onDelete:"cascade"}), ...timestamps });
export const wishlistItems = sqliteTable("wishlist_items", { id:text("id").primaryKey(), wishlistId:text("wishlist_id").notNull().references(()=>wishlists.id,{onDelete:"cascade"}), productId:text("product_id").notNull().references(()=>products.id,{onDelete:"cascade"}), createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const coupons = sqliteTable("coupons", { id:text("id").primaryKey(), code:text("code").notNull().unique(), type:text("type").notNull(), value:integer("value").notNull(), minOrderPaise:integer("min_order_paise").default(0), active:integer("active",{mode:"boolean"}).notNull().default(true), startsAt:text("starts_at"), endsAt:text("ends_at"), usageLimit:integer("usage_limit"), usedCount:integer("used_count").notNull().default(0), ...timestamps });
export const orders = sqliteTable("orders", { id:text("id").primaryKey(), orderNumber:text("order_number").notNull().unique(), userId:text("user_id").references(()=>users.id), email:text("email").notNull(), phone:text("phone").notNull(), status:text("status").notNull().default("PENDING_PAYMENT"), subtotalPaise:integer("subtotal_paise").notNull(), discountPaise:integer("discount_paise").notNull().default(0), shippingPaise:integer("shipping_paise").notNull().default(0), taxPaise:integer("tax_paise").notNull().default(0), totalPaise:integer("total_paise").notNull(), shippingAddressJson:text("shipping_address_json").notNull(), couponCode:text("coupon_code"), ...timestamps });
export const orderItems = sqliteTable("order_items", { id:text("id").primaryKey(), orderId:text("order_id").notNull().references(()=>orders.id,{onDelete:"cascade"}), variantId:text("variant_id").references(()=>productVariants.id), productName:text("product_name").notNull(), sku:text("sku").notNull(), size:text("size").notNull(), colour:text("colour").notNull(), unitPricePaise:integer("unit_price_paise").notNull(), quantity:integer("quantity").notNull() });
export const payments = sqliteTable("payments", { id:text("id").primaryKey(), orderId:text("order_id").notNull().references(()=>orders.id), provider:text("provider").notNull().default("RAZORPAY"), providerOrderId:text("provider_order_id").unique(), providerPaymentId:text("provider_payment_id").unique(), status:text("status").notNull().default("CREATED"), amountPaise:integer("amount_paise").notNull(), verifiedAt:text("verified_at"), ...timestamps });
export const paymentEvents = sqliteTable("payment_events", { id:text("id").primaryKey(), providerEventId:text("provider_event_id").notNull(), type:text("type").notNull(), payloadHash:text("payload_hash").notNull(), processedAt:text("processed_at"), createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) },t=>({providerEvent:uniqueIndex("payment_event_provider_id").on(t.providerEventId)}));
export const orderStatusHistory = sqliteTable("order_status_history", { id:text("id").primaryKey(), orderId:text("order_id").notNull().references(()=>orders.id,{onDelete:"cascade"}), status:text("status").notNull(), note:text("note"), createdBy:text("created_by").references(()=>users.id), createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const shippingMethods = sqliteTable("shipping_methods", { id:text("id").primaryKey(), name:text("name").notNull(), ratePaise:integer("rate_paise").notNull(), freeAbovePaise:integer("free_above_paise"), active:integer("active",{mode:"boolean"}).notNull().default(true), minDays:integer("min_days").notNull(), maxDays:integer("max_days").notNull(), ...timestamps });
export const siteSettings = sqliteTable("site_settings", { key:text("key").primaryKey(), value:text("value").notNull(), updatedAt:text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const auditLogs = sqliteTable("audit_logs", { id:text("id").primaryKey(), actorId:text("actor_id").references(()=>users.id), action:text("action").notNull(), entityType:text("entity_type").notNull(), entityId:text("entity_id"), ipHash:text("ip_hash"), metadata:text("metadata"), createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
