"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Login failed.");
      return;
    }

    setMessage("Login successful!");
    router.push("/posts");
  }

  return (
    <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
      <section className="mx-auto max-w-md bg-[#f5f0e8] p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
          Bookgram
        </p>

        <h1 className="mt-2 text-4xl italic">Login</h1>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-[#d8cdbd] bg-white px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-[#d8cdbd] bg-white px-3 py-2 outline-none"
            />
          </div>

          {message && <p className="text-sm text-red-700">{message}</p>}

          <button
            type="submit"
            className="w-full rounded bg-[#3d3528] px-4 py-2 text-sm text-white"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm">
          Do not have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>

        <Link href="/" className="mt-4 inline-block text-sm underline">
          Back to Home
        </Link>
      </section>
    </main>
  );
}