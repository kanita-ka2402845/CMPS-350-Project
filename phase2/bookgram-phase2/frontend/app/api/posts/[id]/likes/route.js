import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma.js";
import { getSessionUserId } from "@/src/lib/session.js";

export async function POST(req, context) {
  try {
    const params = await context.params;
    const postId = Number(params.id);
    const userId = (await getSessionUserId()) || 1;

    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existing) {
      await prisma.like.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({ liked: false });
    }

    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    return NextResponse.json({ liked: true });
  } catch (err) {
    console.error("LIKE ERROR:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}