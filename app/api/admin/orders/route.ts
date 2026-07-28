import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDb();
    const allOrders = await db.select().from(orders);
    const allItems = await db.select().from(orderItems);

    const result = allOrders.map((o) => {
      const items = allItems.filter((i) => i.orderId === o.id);
      return {
        id: o.id,
        orderNumber: o.orderNumber,
        email: o.email,
        phone: o.phone,
        status: o.status,
        total: o.totalPaise / 100,
        createdAt: o.createdAt,
        items: items.map((i) => ({
          id: i.id,
          productName: i.productName,
          sku: i.sku,
          size: i.size,
          colour: i.colour,
          quantity: i.quantity,
          unitPrice: i.unitPricePaise / 100,
        })),
      };
    });

    return NextResponse.json({ orders: result });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin orders", details: String(error) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const db = getDb();
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
    }

    await db.update(orders).set({ status }).where(eq(orders.id, orderId));

    return NextResponse.json({ success: true, message: `Order status updated to ${status}` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order status", details: String(error) }, { status: 500 });
  }
}
