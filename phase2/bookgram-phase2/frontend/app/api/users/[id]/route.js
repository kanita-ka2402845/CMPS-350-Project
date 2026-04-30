
import { NextResponse } from "next/server";
import { getUserById } from "@/src/lib/repository.js";

export async function GET(_req, { params }) {
  try {
    const user = await getUserById(parseInt(params.id, 10));
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err) {
    console.error("GET /api/users/[id] error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}