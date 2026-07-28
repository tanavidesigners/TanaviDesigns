import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { items?: Array<{ variantId:string; quantity:number }>; email?:string } | null;
  if (!body?.items?.length || !body.email) return NextResponse.json({ error:"Invalid checkout" },{status:400});
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ error:"Payments are not configured" },{status:503});
  // Production flow: load variants + inventory from DB and calculate using integer paise.
  // Browser-supplied prices are intentionally ignored.
  return NextResponse.json({ error:"Catalogue seeding is required before live payment creation" },{status:503});
}
