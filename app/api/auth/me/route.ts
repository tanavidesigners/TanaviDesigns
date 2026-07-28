import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("tanavi_session")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const sessionData = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    return NextResponse.json({
      authenticated: true,
      user: {
        email: sessionData.email,
        role: sessionData.role,
        name: sessionData.name,
      },
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
