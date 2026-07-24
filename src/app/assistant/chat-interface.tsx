"use client";

import { useState, useRef, useEffect } from "react";
import { generateAssistantResponse, type ChatMessage } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hello! I am the Agentic Devs Collective assistant. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const newMsg = inputValue.trim();
    setInputValue("");
    
    const userMessage: ChatMessage = { role: "user", text: newMsg };
    const currentHistory = [...messages];
    
    // Add user message to state
    setMessages([...currentHistory, userMessage]);
    setIsLoading(true);

    // Call server action
    const response = await generateAssistantResponse(currentHistory, newMsg);

    if (response.error) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: `Error: ${response.error}` },
      ]);
    } else if (response.text) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: response.text },
      ]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[800px] rounded-lg border border-white/[0.08] bg-card shadow-2xl shadow-black/50 overflow-hidden relative z-10">
      
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-2">
          ~/agentic-devs/assistant.exe
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary/10 border border-primary/20 text-primary-foreground"
                  : "bg-white/[0.03] border border-white/[0.06] text-muted-foreground font-mono leading-relaxed"
              }`}
            >
              {msg.role === "model" && (
                <div className="flex items-center gap-2 mb-1.5 opacity-60">
                  <span className="text-primary font-bold">{">_"}</span>
                  <span className="text-xs uppercase tracking-wider">Assistant</span>
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg px-4 py-3 text-sm bg-white/[0.03] border border-white/[0.06] text-muted-foreground font-mono">
              <div className="flex items-center gap-2 mb-1.5 opacity-60">
                <span className="text-primary font-bold">{">_"}</span>
                <span className="text-xs uppercase tracking-wider">Assistant</span>
              </div>
              <span className="inline-block w-2 h-4 bg-primary animate-pulse"></span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/[0.06] bg-white/[0.01]">
        <form onSubmit={handleSend} className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about events, chapters, or the collective..."
            className="flex-1 bg-white/[0.03] border-white/[0.08] focus:border-primary/50 focus:ring-primary/20"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary text-black font-semibold hover:bg-primary transition-colors duration-200 px-6"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
