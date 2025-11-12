import { db } from "@/db/db";
import { chatTable, frameTable, projectTable } from "@/db/schema";
import { userData } from "@/server/users";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const {projectId, frameId, messages} = await req.json();

        const user = await userData();

        const projectResult = await db.insert(projectTable).values({
            id: projectId,
            projectId: projectId,
            createdBy: user?.user?.email
        });

        const frameResult = await db.insert(frameTable).values({
            id: frameId,
            frameId: frameId,
            projectId: projectId
        });

        const chatResult = await db.insert(chatTable).values({
            id: projectId,
            chatMessage: messages,
            createdBy: user?.user?.email,
            frameId: frameId
        });

        return NextResponse.json({
            success: true,
            projectId: projectId,
            frameId: frameId,
            messages: messages
        });
    } catch (error) {
        console.error("Error in POST API:", error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}