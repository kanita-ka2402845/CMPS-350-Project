import { NextResponse } from "next/server";
import { getSessionUserId } from "@/src/lib/session.js";
 
export async function GET() {
  const userId = await getSessionUserId();
  return userId
    ? NextResponse.redirect(new URL("/feed",  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"))
    : NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}
 