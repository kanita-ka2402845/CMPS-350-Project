import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
      <section className="mx-auto max-w-md bg-[#f5f0e8] p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
          Bookgram
        </p>

        <h1 className="mt-2 text-4xl italic">Sign Up</h1>

        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="mt-1 w-full border border-[#d8cdbd] bg-white px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              className="mt-1 w-full border border-[#d8cdbd] bg-white px-3 py-2 outline-none"
            />
          </div>

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
              placeholder="Create a password"
              className="mt-1 w-full border border-[#d8cdbd] bg-white px-3 py-2 outline-none"
            />
          </div>

          <button
            type="button"
            className="w-full rounded bg-[#3d3528] px-4 py-2 text-sm text-white"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </p>

        <Link href="/" className="mt-4 inline-block text-sm underline">
          Back to Home
        </Link>
      </section>
    </main>
  );
}