import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
      <section className="mx-auto max-w-md bg-[#f5f0e8] p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
          Bookgram
        </p>
        <h1 className="mt-2 text-4xl italic">Sign Up</h1>
        <p className="mt-4 text-sm">
          Sign up functionality is connected through the backend API.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded bg-[#3d3528] px-4 py-2 text-sm text-white"
        >
          Home
        </Link>
      </section>
    </main>
  );
}