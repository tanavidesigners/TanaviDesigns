import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { products, productImages, productVariants, categories, inventory } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDb();
    const allProducts = await db.select().from(products);
    const allCategories = await db.select().from(categories);
    const allImages = await db.select().from(productImages);
    const allVariants = await db.select().from(productVariants);
    const allInventory = await db.select().from(inventory);

    const result = allProducts.map((p) => {
      const category = allCategories.find((c) => c.id === p.categoryId);
      const images = allImages.filter((img) => img.productId === p.id).map((img) => img.url);
      const variants = allVariants.filter((v) => v.productId === p.id);
      const totalStock = variants.reduce((sum, v) => {
        const inv = allInventory.find((i) => i.variantId === v.id);
        return sum + (inv ? inv.available : 0);
      }, 0);

      const minPrice = variants.length ? Math.min(...variants.map((v) => v.pricePaise)) / 100 : 0;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        subtitle: p.subtitle,
        description: p.description,
        status: p.status,
        fabric: p.fabric || "Cotton",
        occasion: p.occasion || "Everyday",
        category: category?.name || "Kurta sets",
        price: minPrice,
        stock: totalStock,
        images: images.length ? images : ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85"],
        variants: variants.map((v) => {
          const inv = allInventory.find((i) => i.variantId === v.id);
          return {
            id: v.id,
            sku: v.sku,
            size: v.size,
            colour: v.colour,
            price: v.pricePaise / 100,
            stock: inv ? inv.available : 0,
          };
        }),
      };
    });

    return NextResponse.json({ products: result });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin products", details: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();

    const { name, subtitle, description, fabric, occasion, categoryName, price, stock, image, status } = body;

    if (!name || !description || !price) {
      return NextResponse.json({ error: "Name, description, and price are required" }, { status: 400 });
    }

    const id = "prod_" + Date.now().toString(36);
    const slug = name.toLowerCase().replaceAll(" ", "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now().toString(36).slice(-4);

    let category = (await db.select().from(categories)).find(c => c.name.toLowerCase() === (categoryName || "Kurta sets").toLowerCase());
    if (!category) {
      const catId = "cat_" + Date.now().toString(36);
      const catSlug = (categoryName || "kurta-sets").toLowerCase().replaceAll(" ", "-");
      await db.insert(categories).values({
        id: catId,
        name: categoryName || "Kurta sets",
        slug: catSlug,
      });
      category = { id: catId, name: categoryName || "Kurta sets", slug: catSlug, description: null, imageUrl: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    }

    await db.insert(products).values({
      id,
      categoryId: category.id,
      name,
      slug,
      subtitle: subtitle || `${fabric || "Cotton"} ${categoryName || "Kurta set"}`,
      description,
      status: status || "PUBLISHED",
      fabric: fabric || "Cotton",
      occasion: occasion || "Everyday",
    });

    const imgId = "img_" + Date.now().toString(36);
    await db.insert(productImages).values({
      id: imgId,
      productId: id,
      url: image || "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85",
      alt: `${name} product image`,
      position: 0,
    });

    const sizes = ["S", "M", "L", "XL"];
    for (const sz of sizes) {
      const varId = "var_" + sz.toLowerCase() + "_" + Date.now().toString(36);
      const sku = `TNV-${slug.slice(0, 4).toUpperCase()}-${sz}-${Date.now().toString().slice(-4)}`;
      await db.insert(productVariants).values({
        id: varId,
        productId: id,
        sku,
        size: sz,
        colour: "Standard",
        pricePaise: Math.round(Number(price) * 100),
        active: true,
      });

      await db.insert(inventory).values({
        id: "inv_" + varId,
        variantId: varId,
        available: Math.max(0, Math.floor((Number(stock) || 4) / sizes.length)),
        reserved: 0,
        version: 1,
      });
    }

    return NextResponse.json({ success: true, product: { id, name, slug } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product post", details: String(error) }, { status: 500 });
  }
}
