import { NextResponse } from "next/server";

import {
    getPlatformTotals,
    getAvgFollowersPerUser,
    getAvgPostsPerUser,
    getAvgLikesPerPost,
    getAvgCommentsPerPost,
    getTopLikedPosts,
    getMostActiveUsers,
    getMostFollowedUsers
} from "@/src/lib/repository.js";

export async function GET() {
    try {
        const totals = await getPlatformTotals();
        const avgFollowersPerUser = await getAvgFollowersPerUser();
        const avgPostsPerUser = await getAvgPostsPerUser();
        const avgLikesPerPost = await getAvgLikesPerPost();
        const avgCommentsPerPost = await getAvgCommentsPerPost();
        const topLikedPosts = await getTopLikedPosts(5);
        const mostActiveUsers = await getMostActiveUsers(5);
        const mostFollowedUsers = await getMostFollowedUsers(5);

        return NextResponse.json({
            totals,
            avgFollowersPerUser,
            avgPostsPerUser,
            avgLikesPerPost,
            avgCommentsPerPost,
            topLikedPosts,
            mostActiveUsers,
            mostFollowedUsers
        });
    } catch (err) {
        console.error("GET /api/stats error:", err);

        return NextResponse.json(
            { error: "Server error." },
            { status: 500 }
        );
    }
}