import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
      <section className="mx-auto max-w-md bg-[#f5f0e8] p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
          Bookgram
        </p>

        <h1 className="mt-2 text-4xl italic">Login</h1>

        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full border border-[#d8cdbd] bg-white px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-1 w-full border border-[#d8cdbd] bg-white px-3 py-2 outline-none"
            />
          </div>

          <Link
            href="/posts"
            className="block w-full rounded bg-[#3d3528] px-4 py-2 text-center text-sm text-white"
          >
            Login
          </Link>
        </form>

        <p className="mt-4 text-sm">
          Do not have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}