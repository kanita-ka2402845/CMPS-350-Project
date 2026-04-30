
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/src/lib/session.js";
import { getCommentsByPost, addComment } from "@/src/lib/repository.js";


export async function GET(_req, { params }) {
  try {
    const comments = await getCommentsByPost(parseInt(params.id, 10));
    return NextResponse.json({ comments });
  } catch (err) {
    console.error("GET /api/posts/[id]/comments error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

    const { content } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment cannot be empty." }, { status: 400 });
    }

    const comment = await addComment({
      userId,
      postId:  parseInt(params.id, 10),
      content: content.trim(),
    });
    return NextResponse.json({ comment }, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts/[id]/comments error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}