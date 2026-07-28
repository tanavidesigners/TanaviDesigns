import { NextResponse } from "next/server";

const ADMIN_EMAIL = "admin@tanavidesigns.com";
const ADMIN_PASS = "TanaviAdmin2026!";
const STAFF_EMAIL = "staff@tanavidesigns.com";
const STAFF_PASS = "TanaviStaff2026!";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    let role: "ADMIN" | "STAFF" | null = null;
    let name = "";

    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS) {
      role = "ADMIN";
      name = "Deepika (Admin)";
    } else if (email.toLowerCase() === STAFF_EMAIL.toLowerCase() && password === STAFF_PASS) {
      role = "STAFF";
      name = "Studio Staff";
    }

    if (!role) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const sessionData = JSON.stringify({
      email,
      role,
      name,
      authenticatedAt: new Date().toISOString(),
    });

    const token = Buffer.from(sessionData).toString("base64");

    const response = NextResponse.json({
      success: true,
      user: { email, role, name },
    });

    response.cookies.set("tanavi_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Authentication failed", details: String(err) }, { status: 500 });
  }
}
