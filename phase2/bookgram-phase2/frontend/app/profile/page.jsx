"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/users/1");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Could not load profile.");
          return;
        }

        setProfile(data);
      } catch {
        setError("Could not connect to profile API.");
      }
    }

    loadProfile();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
        <section className="mx-auto max-w-4xl bg-[#f5f0e8] p-6 shadow-2xl">
          <h1 className="text-4xl italic">Profile</h1>
          <p className="mt-4 text-red-700">{error}</p>
        </section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
        <section className="mx-auto max-w-4xl bg-[#f5f0e8] p-6 shadow-2xl">
          <h1 className="text-4xl italic">Profile</h1>
          <p className="mt-4">Loading profile...</p>
        </section>
      </main>
    );
  }

  const user = profile.user;
  const posts = profile.posts || [];

  return (
    <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
      <section className="mx-auto max-w-5xl bg-[#f5f0e8] p-6 shadow-2xl">
        <div className="mb-6 border-b border-[#d8cdbd] pb-4">
          <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
            Bookgram
          </p>

          <h1 className="text-4xl italic">Profile</h1>
        </div>

        <div className="flex items-center gap-5 bg-white p-5 shadow">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#3d3528] text-3xl text-white">
            👤
          </div>

          <div>
            <h2 className="text-3xl italic">{user?.fullName || "User"}</h2>
            <p className="text-[#8a7e6e]">@{user?.username}</p>
            <p className="text-sm">{user?.email}</p>
            <p className="mt-2 text-sm">{user?.bio || "No bio yet."}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="bg-white p-4 shadow">
            <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
              Posts
            </p>
            <p className="mt-2 text-3xl italic">{user?._count?.posts || 0}</p>
          </div>

          <div className="bg-white p-4 shadow">
            <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
              Followers
            </p>
            <p className="mt-2 text-3xl italic">
              {user?._count?.followers || 0}
            </p>
          </div>

          <div className="bg-white p-4 shadow">
            <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
              Following
            </p>
            <p className="mt-2 text-3xl italic">
              {user?._count?.following || 0}
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl italic">My Posts</h2>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="bg-white p-4 shadow">
                <p className="mb-3">{post.content}</p>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="h-64 w-full object-cover"
                  />
                )}

                <div className="mt-3 flex justify-between text-sm text-[#8a7e6e]">
                  <span>{post.likes?.length || 0} likes</span>
                  <span>{post.comments?.length || 0} comments</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}