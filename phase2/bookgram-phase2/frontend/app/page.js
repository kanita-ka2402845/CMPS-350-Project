import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
      <section className="mx-auto max-w-5xl bg-[#f5f0e8] p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
          Bookgram
        </p>

        <h1 className="mt-2 text-5xl italic">Welcome to Bookgram</h1>

        <p className="mt-4 max-w-2xl text-sm text-[#3d3528]">
          A book-inspired social media platform where users can share posts,
          like, comment, follow others, and view platform statistics.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/posts"
            className="rounded bg-[#3d3528] px-4 py-2 text-sm text-white"
          >
            View Posts
          </Link>

          <Link
            href="/stats"
            className="rounded border border-[#3d3528] px-4 py-2 text-sm text-[#3d3528]"
          >
            View Statistics
          </Link>

          <Link
            href="/login"
            className="rounded border border-[#3d3528] px-4 py-2 text-sm text-[#3d3528]"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}