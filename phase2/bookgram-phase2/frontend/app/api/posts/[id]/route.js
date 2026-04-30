
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/src/lib/session.js";
import { getPostById, deletePost } from "@/src/lib/repository.js";


export async function GET(_req, { params }) {
  try {
    const post = await getPostById(parseInt(params.id, 10));
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    return NextResponse.json({ post });
  } catch (err) {
    console.error("GET /api/posts/[id] error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}


export async function DELETE(_req, { params }) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

    await deletePost(parseInt(params.id, 10), userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.message === "Forbidden")        return NextResponse.json({ error: "Forbidden." },        { status: 403 });
    if (err.message === "Post not found")   return NextResponse.json({ error: "Post not found." },   { status: 404 });
    console.error("DELETE /api/posts/[id] error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}