
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserById } from "@/src/lib/repository.js";
import { setSession, getSessionUserId } from "@/src/lib/session.js";



export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "No account found with this email." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    await setSession(user.id);

    
    const { password: _pw, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}


export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ user: null });

    const user = await getUserById(userId);
    return NextResponse.json({ user: user ?? null });
  } catch (err) {
    console.error("Session check error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}