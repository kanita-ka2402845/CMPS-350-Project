import { NextResponse } from "next/server";
import { getUserById } from "@/src/lib/repository.js";

export async function GET(req, context) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json(
        { error: "Invalid user id." },
        { status: 400 }
      );
    }

    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("GET /api/users/[id] error:", err);

    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}