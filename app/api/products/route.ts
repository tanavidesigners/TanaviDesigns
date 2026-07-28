import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { products, productImages, productVariants, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDb();
    const allProducts = await db.select().from(products).where(eq(products.status, "PUBLISHED"));
    const allCategories = await db.select().from(categories);
    const allImages = await db.select().from(productImages);
    const allVariants = await db.select().from(productVariants).where(eq(productVariants.active, true));

    const result = allProducts.map((p) => {
      const category = allCategories.find((c) => c.id === p.categoryId);
      const images = allImages.filter((img) => img.productId === p.id).map((img) => img.url);
      const variants = allVariants.filter((v) => v.productId === p.id);
      const minPrice = variants.length ? Math.min(...variants.map((v) => v.pricePaise)) / 100 : 0;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        subtitle: p.subtitle,
        description: p.description,
        fabric: p.fabric,
        occasion: p.occasion,
        category: category?.name ?? "Collection",
        price: minPrice,
        images: images.length ? images : ["/placeholder.jpg"],
        variants: variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          size: v.size,
          colour: v.colour,
          price: v.pricePaise / 100,
        })),
      };
    });

    return NextResponse.json({ products: result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products from Cloudflare D1", details: String(error) },
      { status: 500 }
    );
  }
}
