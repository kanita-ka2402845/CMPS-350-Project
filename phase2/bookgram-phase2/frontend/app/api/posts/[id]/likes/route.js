import { NextResponse } from "next/server";
import { getSessionUserId } from "@/src/lib/session.js";
import { toggleLike } from "@/src/lib/repository.js";

export async function POST(_req, context) {
  try {
    const { params } = context;

    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const postId = parseInt(params.id, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID." }, { status: 400 });
    }

    const result = await toggleLike(postId, userId);

    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/posts/[id]/like error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}