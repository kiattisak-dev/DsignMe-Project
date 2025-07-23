import { NextRequest, NextResponse } from "next/server";

// กำหนดเส้นทางที่ต้องการ middleware
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
    const response = await fetch("http://localhost:8081/auth/verify", {
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
  // ใช้ request.cookies แทน cookies() เพื่อดึง auth_token
  const token = request.cookies.get("auth_token")?.value;

  // ถ้าไม่มี token ให้ redirect ไป /login
  if (!token) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // ตรวจสอบ token กับ backend
  const isValid = await verifyToken(token);

  if (!isValid) {
    // ลบ token ที่ไม่ถูกต้อง
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    response.headers.set(
      "set-cookie",
      `redirect=${encodeURIComponent(request.nextUrl.pathname)}; Path=/; HttpOnly`
    );
    return response;
  }

  // อนุญาตให้เข้าถึงหน้า
  return NextResponse.next();
}