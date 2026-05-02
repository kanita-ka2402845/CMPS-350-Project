"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Could not load statistics.");
          return;
        }

        setStats(data);
      } catch {
        setError("Could not connect to the statistics API.");
      }
    }

    loadStats();
  }, []);

  return (
    <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
      <section className="mx-auto max-w-3xl bg-[#f5f0e8] p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
          Bookgram
        </p>

        <h1 className="mt-2 text-4xl italic">Platform Statistics</h1>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {!stats && !error && (
          <p className="mt-4 text-sm text-[#8a7e6e]">Loading...</p>
        )}

        {stats && (
          <div className="mt-6 space-y-6">
            <div className="bg-white p-4 shadow">
              <h2 className="text-xl italic">Total Users</h2>
              <p>{stats.totals.users}</p>
            </div>

            <div className="bg-white p-4 shadow">
              <h2 className="text-xl italic">Total Posts</h2>
              <p>{stats.totals.posts}</p>
            </div>

            <div className="bg-white p-4 shadow">
              <h2 className="text-xl italic">Total Likes</h2>
              <p>{stats.totals.likes}</p>
            </div>

            <div className="bg-white p-4 shadow">
              <h2 className="text-xl italic">Total Comments</h2>
              <p>{stats.totals.comments}</p>
            </div>

            <div className="bg-white p-4 shadow">
              <h2 className="text-xl italic">Average Followers per User</h2>
              <p>{stats.avgFollowersPerUser}</p>
            </div>

            <div className="bg-white p-4 shadow">
              <h2 className="text-xl italic">Average Posts per User</h2>
              <p>{stats.avgPostsPerUser}</p>
            </div>

            <div className="bg-white p-4 shadow">
              <h2 className="text-xl italic">Average Likes per Post</h2>
              <p>{stats.avgLikesPerPost}</p>
            </div>

            <div className="bg-white p-4 shadow">
              <h2 className="text-xl italic">Average Comments per Post</h2>
              <p>{stats.avgCommentsPerPost}</p>
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/posts"
            className="rounded bg-[#3d3528] px-4 py-2 text-white"
          >
            Back to Posts
          </Link>
        </div>
      </section>
    </main>
  );
}