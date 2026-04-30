
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserByUsername, createUser } from "@/src/lib/repository.js";
import { setSession } from "@/src/lib/session.js";

export async function POST(req) {
  try {
    const { email, username, password, fullName } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Email, username and password are required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return NextResponse.json(
        { error: "Password must contain uppercase, lowercase, a number, and a special character." },
        { status: 400 }
      );
    }

    const [emailExists, usernameExists] = await Promise.all([
      getUserByEmail(email),
      getUserByUsername(username),
    ]);

    if (emailExists)    return NextResponse.json({ error: "Email already registered." },    { status: 409 });
    if (usernameExists) return NextResponse.json({ error: "Username already taken." },      { status: 409 });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ email, username, password: passwordHash, fullName });

    await setSession(user.id);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}