import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma.js";

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const id = Number(params.id);
    const currentUserId = 1;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid comment id." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }

    if (comment.userId !== currentUserId) {
      return NextResponse.json(
        { error: "You can only delete your own comments." },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}