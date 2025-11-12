import { db } from "@/db/db";
import { chatTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest) {
  try {
    const { messages, frameId } = await req.json();

    if (!messages || !frameId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    await db.update(chatTable).set({ chatMessage: messages }).where(eq(chatTable.frameId, frameId));

    return NextResponse.json({ message: "Chat updated successfully" });
  } catch (error) {
    console.error("Error updating chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}