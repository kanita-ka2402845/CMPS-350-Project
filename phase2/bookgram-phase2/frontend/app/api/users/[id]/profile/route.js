import { NextResponse } from "next/server";
import { getSessionUserId } from "@/src/lib/session.js";
import { getUserById, getPostsByUser } from "@/src/lib/repository.js";

export async function GET() {
  try {
    const userId = (await getSessionUserId()) || 1;

    const user = await getUserById(userId);
    const posts = await getPostsByUser(userId);

    return NextResponse.json({ user, posts });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}