import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma.js";

export async function POST(req, context) {
  try {
    const params = await context.params;
    const followingId = Number(params.id);
    const followerId = 1;

    if (!followingId) {
      return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
    }

    if (followerId === followingId) {
      return NextResponse.json(
        { error: "You cannot follow yourself." },
        { status: 400 }
      );
    }

    const existing = await prisma.follow.findFirst({
      where: { followerId, followingId },
    });

    if (existing) {
      await prisma.follow.deleteMany({
        where: { followerId, followingId },
      });

      return NextResponse.json({ following: false });
    }

    await prisma.follow.create({
      data: { followerId, followingId },
    });

    return NextResponse.json({ following: true });
  } catch (err) {
    console.error("FOLLOW ERROR:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}