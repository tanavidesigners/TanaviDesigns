import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(()=>null) as Record<string,string>|null;
  const orderId=body?.razorpay_order_id, paymentId=body?.razorpay_payment_id, signature=body?.razorpay_signature;
  const secret=process.env.RAZORPAY_KEY_SECRET;
  if(!orderId||!paymentId||!signature||!secret) return NextResponse.json({error:"Invalid verification request"},{status:400});
  const expected=createHmac("sha256",secret).update(`${orderId}|${paymentId}`).digest();
  let supplied:Buffer; try{supplied=Buffer.from(signature,"hex")}catch{return NextResponse.json({error:"Invalid signature"},{status:400})}
  if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected)) return NextResponse.json({error:"Invalid signature"},{status:401});
  // A DB transaction must atomically enforce idempotency, capture payment, decrement inventory once,
  // append order history, and clear the cart. Webhook remains the source of truth.
  return NextResponse.json({verified:true,status:"AUTHORIZED"});
}
