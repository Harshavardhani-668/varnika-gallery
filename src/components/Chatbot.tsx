import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to Varnika! 🌸 I'm your handmade gift curator. How can I help you discover the perfect piece today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { message: userMessage.content },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, I'm having trouble connecting. Please try again in a moment. 💫",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Reference gradient style */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 interactive-element",
          "bg-gradient-to-br from-pastel-rose to-pastel-lavender text-cream",
          "shadow-[0_4px_20px_rgba(159,129,205,0.3)] hover:shadow-[0_6px_25px_rgba(159,129,205,0.4)]",
          "hover:scale-110",
          isOpen && "opacity-0 pointer-events-none scale-90"
        )}
        aria-label="Open chat"
      >
        <span className="font-display text-2xl font-bold">V</span>
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-pastel-rose to-pastel-lavender animate-ping opacity-20" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] rounded-2xl overflow-hidden transition-all duration-500",
          "shadow-[0_10px_30px_rgba(0,0,0,0.2)]",
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
      >
        {/* Header - Reference gradient style */}
        <div
          className="p-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, hsl(350 90% 91%), hsl(270 40% 65%))",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cream/20 backdrop-blur-sm flex items-center justify-center">
              <span className="font-display text-lg font-bold text-cream">V</span>
            </div>
            <div>
              <h3 className="font-display text-lg text-cream">Varnika Curator</h3>
              <p className="text-xs text-cream/80">Your personal gift guide 🌸</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-11 h-11 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-full text-cream/80 hover:text-cream transition-colors interactive-element"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-[380px] overflow-y-auto p-4 space-y-4 bg-cream">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex animate-fade-in-up",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 font-body text-sm leading-relaxed",
                  message.role === "user"
                    ? "text-cream rounded-br-md"
                    : "bg-card border border-border text-espresso rounded-bl-md"
                )}
                style={
                  message.role === "user"
                    ? {
                        background: "linear-gradient(135deg, hsl(350 90% 91%), hsl(340 60% 80%))",
                        color: "white",
                      }
                    : undefined
                }
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our handmade gifts..."
              className="flex-1 font-body rounded-full px-4"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="rounded-full shrink-0"
              style={{
                background: "linear-gradient(135deg, hsl(350 90% 91%), hsl(270 40% 65%))",
                color: "white",
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chatbot;