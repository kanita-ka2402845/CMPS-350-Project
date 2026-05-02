import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma.js";

export async function POST(req, context) {
  try {
    const params = await context.params;
    const postId = Number(params.id);
    const userId = 1;

    if (!postId) {
      return NextResponse.json({ error: "Invalid post id." }, { status: 400 });
    }

    const existing = await prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existing) {
      await prisma.like.deleteMany({
        where: { userId, postId },
      });

      return NextResponse.json({ liked: false });
    }

    await prisma.like.create({
      data: { userId, postId },
    });

    return NextResponse.json({ liked: true });
  } catch (err) {
    console.error("LIKE ERROR:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}