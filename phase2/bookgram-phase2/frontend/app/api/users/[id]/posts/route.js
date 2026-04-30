
import { NextResponse } from "next/server";
import { getPostsByUser } from "@/src/lib/repository.js";


export async function GET(_req, { params }) {
  try {
    const posts = await getPostsByUser(parseInt(params.id, 10));
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("GET /api/users/[id]/posts error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}