import { db } from "@/db/db";
import { chatTable, frameTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const {searchParams} = new URL(req.url);
        const frameId = searchParams.get('frameId');
        const projectId = searchParams.get('projectId');
        
    //@ts-ignore
        const frameResult = await db.select().from(frameTable).where(eq(frameTable.frameId, frameId));
    //@ts-ignore
        const chatResult = await db.select().from(chatTable).where(eq(chatTable.frameId, frameId));

        const finalResult = {
            ...frameResult[0],
            chatMessage: chatResult[0].chatMessage
        }

        return NextResponse.json(finalResult);
    } catch (error) {
        console.error("Error fetching frame data:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}