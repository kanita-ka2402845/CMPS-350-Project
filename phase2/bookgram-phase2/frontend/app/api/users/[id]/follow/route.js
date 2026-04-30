
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/src/lib/session.js";
import { updateUser } from "@/src/lib/repository.js";


export async function PATCH(req, { params }) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

    const targetId = parseInt(params.id, 10);
    if (userId !== targetId) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { fullName, bio, profileImage } = await req.json();
    const user = await updateUser(userId, { fullName, bio, profileImage });
    return NextResponse.json({ user });
  } catch (err) {
    console.error("PATCH /api/users/[id]/profile error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}