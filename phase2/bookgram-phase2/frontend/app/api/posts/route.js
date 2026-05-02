import { NextResponse } from "next/server";
import { getSessionUserId } from "@/src/lib/session.js";
import { Repository } from "@/src/lib/repository.js";

const repo = new Repository();

export async function GET() {
  try {
    const posts = await repo.getAllPosts();
    return NextResponse.json(posts);
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = (await getSessionUserId()) || 1;

    const { content, imageUrl } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Post content cannot be empty." },
        { status: 400 }
      );
    }

    const post = await repo.createPost(
      userId,
      content.trim(),
      imageUrl || null
    );

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}