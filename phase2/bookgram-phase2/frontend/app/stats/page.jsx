"use client";

import { useEffect, useState } from "react";

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(function () {
    async function loadStats() {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();

        if (!response.ok) {
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

  if (error) {
    return (
      <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
        <section className="mx-auto max-w-5xl bg-[#f5f0e8] p-6 shadow-2xl">
          <h1 className="text-3xl italic">Bookgram Statistics</h1>
          <p className="mt-4 text-red-700">{error}</p>
        </section>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
        <section className="mx-auto max-w-5xl bg-[#f5f0e8] p-6 shadow-2xl">
          <h1 className="text-3xl italic">Bookgram Statistics</h1>
          <p className="mt-4">Loading statistics...</p>
        </section>
      </main>
    );
  }

  const totals = stats.totals || {};

  const cards = [
    { title: "Users", value: totals.users || 0 },
    { title: "Posts", value: totals.posts || 0 },
    { title: "Likes", value: totals.likes || 0 },
    { title: "Comments", value: totals.comments || 0 },
    { title: "Average Followers Per User", value: stats.avgFollowersPerUser || 0 },
    { title: "Average Posts Per User", value: stats.avgPostsPerUser || 0 },
    { title: "Average Likes Per Post", value: stats.avgLikesPerPost || 0 },
    { title: "Average Comments Per Post", value: stats.avgCommentsPerPost || 0 },
  ];

  return (
    <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
      <section className="mx-auto max-w-5xl bg-[#f5f0e8] p-6 shadow-2xl">
        <div className="mb-6 border-b border-[#d8cdbd] pb-4">
          <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
            Bookgram
          </p>

          <h1 className="text-4xl italic">Platform Statistics</h1>

          <p className="mt-2 max-w-2xl text-sm text-[#3d3528]">
            This page shows eight useful statistics about the Bookgram platform.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="bg-white p-4 shadow">
              <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
                {card.title}
              </p>

              <p className="mt-3 text-3xl italic">{card.value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}