

import { prisma } from "./prisma.js";


export async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}


export async function getUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
  });
}


export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id:           true,
      username:     true,
      fullName:     true,
      email:        true,
      bio:          true,
      profileImage: true,
      createdAt:    true,
      _count: {
        select: {
          posts:     true,
          followers: true,
          following: true,
        },
      },
    },
  });
}


export async function createUser({ email, username, password, fullName }) {
  return prisma.user.create({
    data: { email, username, password, fullName },
    select: { id: true, email: true, username: true, fullName: true },
  });
}


export async function updateUser(id, { fullName, bio, profileImage }) {
  return prisma.user.update({
    where: { id },
    data:  { fullName, bio, profileImage },
    select: {
      id: true, username: true, fullName: true, bio: true, profileImage: true,
    },
  });
}


export async function getAllPosts({ page = 1, limit = 4, requesterId = null } = {}) {
  const skip = (page - 1) * limit;

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      skip,
      take:     limit,
      orderBy:  { createdAt: "desc" },
      select: {
        id:        true,
        content:   true,
        imageUrl:  true,
        createdAt: true,
        user: {
          select: { id: true, username: true, fullName: true, profileImage: true },
        },
        _count: { select: { likes: true, comments: true } },
        // Fetch only the requesting user's like row — avoids transferring all likes
        likes: requesterId
          ? { where: { userId: requesterId }, select: { id: true } }
          : false,
      },
    }),
    prisma.post.count(),
  ]);

  return {
    posts: posts.map((p) => ({
      id:           p.id,
      content:      p.content,
      imageUrl:     p.imageUrl,
      createdAt:    p.createdAt,
      user:         p.user,
      likeCount:    p._count.likes,
      commentCount: p._count.comments,
      likedByMe:    requesterId ? (p.likes?.length ?? 0) > 0 : false,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}


export async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id },
    select: {
      id:        true,
      content:   true,
      imageUrl:  true,
      createdAt: true,
      user: {
        select: { id: true, username: true, fullName: true, profileImage: true },
      },
      _count: { select: { likes: true } },
      likes:    true,
      comments: {
        orderBy: { createdAt: "asc" },
        select: {
          id:        true,
          content:   true,
          createdAt: true,
          user: { select: { id: true, username: true } },
        },
      },
    },
  });
}


export async function getPostsByUser(userId) {
  return prisma.post.findMany({
    where:   { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id:        true,
      content:   true,
      imageUrl:  true,
      createdAt: true,
      _count:    { select: { likes: true, comments: true } },
    },
  });
}


export async function createPost({ userId, content, imageUrl }) {
  return prisma.post.create({
    data: { userId, content, imageUrl },
    select: { id: true, content: true, imageUrl: true, createdAt: true },
  });
}


export async function deletePost(postId, requesterId) {
  const post = await prisma.post.findUnique({
    where:  { id: postId },
    select: { userId: true },
  });
  if (!post)                    throw new Error("Post not found");
  if (post.userId !== requesterId) throw new Error("Forbidden");
  return prisma.post.delete({ where: { id: postId } });
}


export async function toggleLike(postId, userId) {
  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { userId, postId } });
  }

  
  
  const likeCount = await prisma.like.count({ where: { postId } });
  return { liked: !existing, likeCount };
}


export async function getCommentsByPost(postId) {
  return prisma.comment.findMany({
    where:   { postId },
    orderBy: { createdAt: "asc" },
    select: {
      id:        true,
      content:   true,
      createdAt: true,
      user: { select: { id: true, username: true } },
    },
  });
}


export async function addComment({ userId, postId, content }) {
  return prisma.comment.create({
    data: { userId, postId, content },
    select: {
      id:        true,
      content:   true,
      createdAt: true,
      user: { select: { id: true, username: true } },
    },
  });
}


export async function deleteComment(commentId, requesterId) {
  const comment = await prisma.comment.findUnique({
    where:  { id: commentId },
    select: { userId: true },
  });
  if (!comment)                       throw new Error("Comment not found");
  if (comment.userId !== requesterId) throw new Error("Forbidden");
  return prisma.comment.delete({ where: { id: commentId } });
}


export async function toggleFollow(followerId, followingId) {
  if (followerId === followingId) throw new Error("Cannot follow yourself");

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return { following: false };
  }
  await prisma.follow.create({ data: { followerId, followingId } });
  return { following: true };
}


export async function isFollowing(followerId, followingId) {
  const row = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  return row !== null;
}


export async function getPlatformTotals() {
  const [users, posts, likes, comments] = await prisma.$transaction([
    prisma.user.count(),
    prisma.post.count(),
    prisma.like.count(),
    prisma.comment.count(),
  ]);
  return { users, posts, likes, comments };
}


export async function getAvgFollowersPerUser() {
  const result = await prisma.$queryRaw`
    SELECT ROUND(CAST(COUNT(*) AS REAL) / NULLIF((SELECT COUNT(*) FROM "User"), 0), 2) AS avg_followers
    FROM "Follow"
  `;
  return Number(result[0]?.avg_followers ?? 0);
}


export async function getAvgPostsPerUser() {
  const result = await prisma.$queryRaw`
    SELECT ROUND(CAST(COUNT(*) AS REAL) / NULLIF((SELECT COUNT(*) FROM "User"), 0), 2) AS avg_posts
    FROM "Post"
  `;
  return Number(result[0]?.avg_posts ?? 0);
}


export async function getAvgLikesPerPost() {
  const result = await prisma.$queryRaw`
    SELECT ROUND(CAST(COUNT(*) AS REAL) / NULLIF((SELECT COUNT(*) FROM "Post"), 0), 2) AS avg_likes
    FROM "Like"
  `;
  return Number(result[0]?.avg_likes ?? 0);
}



export async function getAvgCommentsPerPost() {
  const result = await prisma.$queryRaw`
    SELECT ROUND(CAST(COUNT(*) AS REAL) / NULLIF((SELECT COUNT(*) FROM "Post"), 0), 2) AS avg_comments
    FROM "Comment"
  `;
  return Number(result[0]?.avg_comments ?? 0);
}


export async function getTopLikedPosts(limit = 5) {
  return prisma.post.findMany({
    orderBy: { likes: { _count: "desc" } },
    take:    limit,
    select: {
      id:        true,
      content:   true,
      createdAt: true,
      user:      { select: { username: true, fullName: true } },
      _count:    { select: { likes: true, comments: true } },
    },
  });
}


export async function getMostActiveUsers(limit = 5) {
  return prisma.user.findMany({
    orderBy: { posts: { _count: "desc" } },
    take:    limit,
    select: {
      id:       true,
      username: true,
      fullName: true,
      _count:   { select: { posts: true, followers: true } },
    },
  });
}


export async function getMostFollowedUsers(limit = 5) {
  return prisma.user.findMany({
    orderBy: { followers: { _count: "desc" } },
    take:    limit,
    select: {
      id:       true,
      username: true,
      fullName: true,
      _count:   { select: { followers: true, posts: true } },
    },
  });
}