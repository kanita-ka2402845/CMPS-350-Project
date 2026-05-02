import { NextResponse } from "next/server";
import { getSessionUserId } from "@/src/lib/session.js";
import { followUser, unfollowUser, isFollowing } from "@/src/lib/repository.js";

export async function POST(req, context) {
  try {
    const params = await context.params;
    const followingId = Number(params.id);
    const followerId = (await getSessionUserId()) || 1;

    if (!followingId) {
      return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
    }

    if (followerId === followingId) {
      return NextResponse.json(
        { error: "You cannot follow yourself." },
        { status: 400 }
      );
    }

    const followingBefore = await isFollowing({ followerId, followingId });

    if (followingBefore) {
      await unfollowUser({ followerId, followingId });
      return NextResponse.json({ following: false });
    }

    await followUser({ followerId, followingId });
    return NextResponse.json({ following: true });
  } catch (err) {
    console.error("Follow error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}