import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nvidia/nemotron-nano-9b-v2:free",
        messages,
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTERAIAPI}`,
          "Content-Type": "application/json",
        },
        responseType: "stream",
      }
    );

    const stream = response.data;
    const encoder = new TextEncoder();
    let closed = false;

    let buffer = "";

    const readable = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk: Buffer) => {
          buffer += chunk.toString();

          // Split by double newlines separating events
          const payloads = buffer.split("\n\n");
          buffer = payloads.pop() || "";

          for (const payload of payloads) {
            if (!payload.trim()) continue;

            if (payload.includes("[DONE]")) {
              if (!closed) {
                closed = true;
                controller.close();
              }
              return;
            }

            if (payload.startsWith("data:")) {
              const jsonStr = payload.slice(5).trim();
              try {
                const data = JSON.parse(jsonStr);
                const text = data.choices?.[0]?.delta?.content;
                if (text) controller.enqueue(encoder.encode(text));
              } catch (err) {
                // Don’t crash on partial JSON — keep buffer for next chunk
                console.warn("⚠️ Skipping incomplete JSON chunk:", jsonStr);
              }
            }
          }
        });

        stream.on("end", () => {
          if (!closed) {
            closed = true;
            controller.close();
          }
        });

        stream.on("error", (err: any) => {
          if (!closed) {
            closed = true;
            controller.error(err);
          }
        });
      },
      cancel() {
        stream.destroy();
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("API error:", error?.response?.data || error);
    return NextResponse.json(
      { error: "Something went wrong with OpenRouter API" },
      { status: 500 }
    );
  }
}
