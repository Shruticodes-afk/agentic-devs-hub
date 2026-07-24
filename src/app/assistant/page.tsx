import { ChatInterface } from "./chat-interface";

export const metadata = {
  title: "AI Assistant - Agentic Devs Collective Hub",
  description: "Chat with the Agentic Devs Collective community assistant.",
};

export default function AssistantPage() {
  return (
    <div className="min-h-screen relative overflow-hidden p-6 md:p-10">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-sans font-bold text-foreground">
            <span className="text-primary">~/</span>assistant
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl">
            Have questions about the collective, events, or local chapters? Ask the community AI assistant.
          </p>
        </div>

        {/* Chat UI */}
        <ChatInterface />
      </div>
    </div>
  );
}
