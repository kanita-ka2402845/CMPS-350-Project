import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma.js";

export async function GET() {
  try {
    const [users, posts, likes, comments, follows] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.like.count(),
      prisma.comment.count(),
      prisma.follow.count(),
    ]);

    const avgFollowersPerUser =
      users === 0 ? 0 : Number((follows / users).toFixed(1));

    const avgPostsPerUser =
      users === 0 ? 0 : Number((posts / users).toFixed(1));

    const avgLikesPerPost =
      posts === 0 ? 0 : Number((likes / posts).toFixed(1));

    const avgCommentsPerPost =
      posts === 0 ? 0 : Number((comments / posts).toFixed(1));

    return NextResponse.json({
      totals: {
        users,
        posts,
        likes,
        comments,
      },
      avgFollowersPerUser,
      avgPostsPerUser,
      avgLikesPerPost,
      avgCommentsPerPost,
    });
  } catch (err) {
    console.error("GET /api/stats error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}