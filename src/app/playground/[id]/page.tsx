"use client";

import { useParams, useSearchParams } from "next/navigation";
import ChatSection from "../_components/ChatSection";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import WebsiteDesign from "../_components/WebsiteDesign";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type Frame = {
  projectId: string;
  frameId: string;
  designCode: string;
  chatMessage: { role: string; content: string }[];
};

export type Messages = {
  role: string;
  content: string;
};

const Playground = () => {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");

  const [frameDetails, setFrameDetails] = useState<Frame>();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [generatedCode, setGeneratedCode] = useState<any>();
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (frameId) GetFrameDetails();
  }, [frameId]);

  const GetFrameDetails = async () => {
    try {
      const { data } = await axios.get(`/api/frames?frameId=${frameId}&projectId=${projectId}`);
      setFrameDetails(data);
      const designCode = data?.designCode;

      const index = designCode?.indexOf("```html") + 7;
      const formattedCode = designCode?.slice(index);
      setGeneratedCode(formattedCode);

      if (data?.chatMessage?.length === 1) {
        const userMsg = data.chatMessage[0].content;
        
        SendMessage(userMsg);
      } else {
        setMessages(data?.chatMessage ?? []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load frame details");
    }
  };

  const Prompt = `userInput: {userInput}

    Instructions:

    1. If the user input explicitly asks to generate HTML/CSS/JS or design, generate HTML Tailwind CSS (Flowbite components, blue theme, responsive, etc.)
    2. Otherwise, respond naturally as text.
  `;

  // ✅ Send user message to AI
  const SendMessage = async (userInput: string) => {
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    try {
      const res = await fetch("/api/ai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: Prompt.replace("{userInput}", userInput) }],
        }),
      });

      if (!res.body) throw new Error("No stream body found");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      let extractedCode = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiResponse += decoder.decode(value, { stream: true });

        // ✅ Extract HTML code dynamically
        if (aiResponse.includes("```html")) {
          const start = aiResponse.indexOf("```html") + 7;
          const end = aiResponse.indexOf("```", start);
          extractedCode =
            end !== -1 ? aiResponse.slice(start, end).trim() : aiResponse.slice(start).trim();
          setGeneratedCode(extractedCode);
        }

        setMessages((prev) => {
          const other = prev.filter((m) => m.role !== "assistant");
          const content = extractedCode ? "Your code is ready!" : aiResponse;
          return [...other, { role: "assistant", content }];
        });
      }

      
      if (extractedCode.length > 10) {
        await SaveGeneratedCode(extractedCode);
        await GetFrameDetails();
      }
    } catch (error) {
      console.error("AI Stream Error:", error);
      toast.error("AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (messages.length > 0) SaveMessages();
  }, [messages]);

  const SaveMessages = async () => {
    try {
      await axios.put("/api/chats", { messages, frameId });
    } catch (error) {
      console.error(error);
    }
  };

  
  const SaveGeneratedCode = async (code: string) => {
    try {
      
      setGeneratedCode(code);
  
      const { data } = await axios.put("/api/frames", { 
        designCode: code, 
        frameId, 
        projectId 
      });
  
      
      setFrameDetails(data);
      toast.success("Website is Ready!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save design");
    }
  };

  return (
    <div>
      <PlaygroundHeader />
      <div className="flex">
        <ChatSection loading={loading} messages={messages ?? []} onSend={SendMessage} />

        <WebsiteDesign
          generatedCode={(generatedCode || frameDetails?.designCode || "").replace("```", "")}
        />
      </div>
    </div>
  );
};

export default Playground;
