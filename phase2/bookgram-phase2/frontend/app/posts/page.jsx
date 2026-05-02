"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  async function loadPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data.posts || data || []);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
      <section className="mx-auto max-w-6xl bg-[#f5f0e8] p-6 shadow-2xl">
        <div className="mb-6 border-b border-[#d8cdbd] pb-4">
          <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
            Bookgram
          </p>

          <h1 className="text-4xl italic">Posts</h1>

          <div className="mt-4 flex gap-3">
            <Link
              href="/"
              className="rounded border border-[#3d3528] px-4 py-2 text-sm text-[#3d3528]"
            >
              Home
            </Link>

            <Link
              href="/stats"
              className="rounded bg-[#3d3528] px-4 py-2 text-sm text-white"
            >
              View Statistics
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="bg-white p-4 shadow">
                <p className="mb-2 text-sm text-[#8a7e6e]">
                  @{post.user?.username || "user"}
                </p>

                <p className="mb-4">{post.content}</p>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="h-72 w-full rounded object-cover"
                  />
                )}

                <div className="mt-3 flex justify-between text-sm text-[#8a7e6e]">
                  <span>{post.likeCount ?? post._count?.likes ?? 0} likes</span>
                  <span>
                    {post.commentCount ?? post._count?.comments ?? 0} comments
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}