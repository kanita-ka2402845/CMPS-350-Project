import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma.js";

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json(
        { error: "Invalid comment id." },
        { status: 400 }
      );
    }

    await prisma.comment.deleteMany({
      where: { id },
    });

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}