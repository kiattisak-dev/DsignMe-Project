import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/dashboard/categories/:path*",
    "/dashboard/projects/:path*",
    "/dashboard/servicesteps/:path*",
  ],
};

// Cache สำหรับผลการ verify token เพื่อลดการเรียก API
const tokenCache = new Map<string, { isValid: boolean; expiry: number }>();

async function verifyToken(token: string): Promise<boolean> {
  // ตรวจสอบ cache ก่อน
  const cached = tokenCache.get(token);
  if (cached && cached.expiry > Date.now()) {
    return cached.isValid;
  }

  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const isValid = response.ok;
    // Cache ผลลัพธ์ 5 นาที (300000 ms)
    tokenCache.set(token, { isValid, expiry: Date.now() + 300000 });
    return isValid;
  } catch (error) {
    console.error("Error verifying token:", error);
    tokenCache.set(token, { isValid: false, expiry: Date.now() + 300000 });
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const isValid = await verifyToken(token);

  if (!isValid) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    // ลบ cookie auth_token
    response.cookies.delete("auth_token");
    // ตั้ง query param redirect ให้หน้า login รู้ว่าต้องไปหน้าไหนต่อ
    response.headers.set(
      "set-cookie",
      `redirect=${encodeURIComponent(request.nextUrl.pathname)}; Path=/; HttpOnly; SameSite=Lax`
    );
    return response;
  }

  // อนุญาตให้เข้าถึงหน้า
  return NextResponse.next();
}
