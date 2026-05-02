import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma.js";
import { getSessionUserId } from "@/src/lib/session.js";

export async function POST(req, context) {
  try {
    const params = await context.params;
    const postId = Number(params.id);
    const userId = (await getSessionUserId()) || 1;

    if (!postId) {
      return NextResponse.json({ error: "Invalid post id." }, { status: 400 });
    }

    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment cannot be empty." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId,
        postId,
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}