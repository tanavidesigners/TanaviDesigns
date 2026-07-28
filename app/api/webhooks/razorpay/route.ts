import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(request:Request){
  const secret=process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature=request.headers.get("x-razorpay-signature");
  const raw=await request.text();
  if(!secret||!signature)return NextResponse.json({error:"Unauthorized"},{status:401});
  const expected=createHmac("sha256",secret).update(raw).digest();
  const supplied=Buffer.from(signature,"hex");
  if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected))return NextResponse.json({error:"Invalid signature"},{status:401});
  const event=JSON.parse(raw) as {event?:string;id?:string};
  const supported=new Set(["payment.authorized","payment.captured","payment.failed","order.paid","refund.created","refund.processed","refund.failed"]);
  if(!event.id||!event.event)return NextResponse.json({error:"Malformed event"},{status:400});
  if(!supported.has(event.event))return NextResponse.json({received:true});
  // Persist event.id behind a unique index before processing so delivery retries are idempotent.
  return NextResponse.json({received:true});
}
