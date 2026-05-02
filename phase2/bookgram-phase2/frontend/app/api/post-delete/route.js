import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma.js";

export async function DELETE(req) {
  try {
    const { postId } = await req.json();
    const id = Number(postId);

    if (!id) {
      return NextResponse.json({ error: "Invalid post id." }, { status: 400 });
    }

    await prisma.post.deleteMany({
      where: { id },
    });

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("DELETE /api/post-delete error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}