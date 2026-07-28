import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { products, productImages, productVariants, inventory } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();
    const body = await req.json();

    const { name, description, price, fabric, occasion, status } = body;

    const updateFields: Record<string, unknown> = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (fabric !== undefined) updateFields.fabric = fabric;
    if (occasion !== undefined) updateFields.occasion = occasion;
    if (status !== undefined) updateFields.status = status;

    if (Object.keys(updateFields).length > 0) {
      await db.update(products).set(updateFields).where(eq(products.id, id));
    }

    if (price !== undefined) {
      const vars = await db.select().from(productVariants).where(eq(productVariants.productId, id));
      for (const v of vars) {
        await db.update(productVariants).set({ pricePaise: Math.round(Number(price) * 100) }).where(eq(productVariants.id, v.id));
      }
    }

    return NextResponse.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product", details: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();

    const vars = await db.select().from(productVariants).where(eq(productVariants.productId, id));
    for (const v of vars) {
      await db.delete(inventory).where(eq(inventory.variantId, v.id));
    }

    await db.delete(productVariants).where(eq(productVariants.productId, id));
    await db.delete(productImages).where(eq(productImages.productId, id));
    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product", details: String(error) }, { status: 500 });
  }
}
