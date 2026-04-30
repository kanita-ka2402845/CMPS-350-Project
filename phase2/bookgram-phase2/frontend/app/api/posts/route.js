
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/src/lib/session.js";
import { getAllPosts, createPost } from "@/src/lib/repository.js";


export async function GET(req) {
  try {
    const requesterId = await getSessionUserId();
    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get("page")  ?? "1",  10));
    const limit = Math.min(20, parseInt(searchParams.get("limit") ?? "4", 10));

    const data = await getAllPosts({ page, limit, requesterId });
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

    const { content, imageUrl } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Post content cannot be empty." }, { status: 400 });
    }

    const post = await createPost({ userId, content: content.trim(), imageUrl: imageUrl ?? null });
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}