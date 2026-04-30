
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/src/lib/session.js";
import { deleteComment } from "@/src/lib/repository.js";
 

export async function DELETE(_req, { params }) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
 
    await deleteComment(parseInt(params.id, 10), userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.message === "Forbidden")           return NextResponse.json({ error: "Forbidden." },           { status: 403 });
    if (err.message === "Comment not found")   return NextResponse.json({ error: "Comment not found." },   { status: 404 });
    console.error("DELETE /api/comments/[id] error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}