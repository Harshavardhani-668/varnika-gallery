import { useState, useRef, useEffect, useMemo } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useProducts } from "@/hooks/useProducts";
import { FormattedProduct } from "@/types/product";
import OptimizedImage from "@/components/ui/optimized-image";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Array<{
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    customizable: boolean;
  }>;
}

const HISTORY_KEY = "varnika-chat-history";

const defaultGreeting: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I am your Varnika shopping assistant 😊 Who are you buying for, what is your budget, and what is the occasion?",
};

const QUICK_REPLIES = ["Birthday", "Anniversary", "Budget under ₹500", "Festival gifts"];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [defaultGreeting];
      const parsed = JSON.parse(raw) as Message[];
      return parsed.length > 0 ? parsed : [defaultGreeting];
    } catch {
      return [defaultGreeting];
    }
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState<Message | null>(null);
  const [showGreetingHint, setShowGreetingHint] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: products = [] } = useProducts();

  const hasUserMessages = useMemo(
    () => messages.some((msg) => msg.role === "user"),
    [messages]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage]);

  useEffect(() => {
    if (!isOpen && showGreetingHint) {
      const timeout = window.setTimeout(() => setShowGreetingHint(false), 7000);
      return () => window.clearTimeout(timeout);
    }
  }, [isOpen, showGreetingHint]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  const toChatProducts = (items: FormattedProduct[]) =>
    items.map((item) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.salePrice ?? item.regularPrice,
      customizable: item.customizable,
    }));

  const findProducts = (query: string, limit = 3) => {
    const q = query.toLowerCase();
    const filtered = products
      .filter((p) => p.stock > 0)
      .filter((p) => {
        const text = `${p.name} ${p.category} ${p.subcategory} ${p.shortDescription} ${p.tags.join(" ")}`.toLowerCase();
        return text.includes(q);
      })
      .slice(0, limit);

    if (filtered.length > 0) return filtered;
    return products.filter((p) => p.stock > 0).slice(0, limit);
  };

  const findByBudget = (budget: number, limit = 3) => {
    return products
      .filter((p) => p.stock > 0)
      .filter((p) => (p.salePrice ?? p.regularPrice) <= budget)
      .sort((a, b) => (a.salePrice ?? a.regularPrice) - (b.salePrice ?? b.regularPrice))
      .slice(0, limit);
  };

  const typeAssistantMessage = async (message: Omit<Message, "id" | "role">) => {
    const fullText = message.content;
    const id = `typing-${Date.now()}`;
    setTypingMessage({ id, role: "assistant", content: "", products: message.products });

    const step = Math.max(1, Math.ceil(fullText.length / 45));

    await new Promise<void>((resolve) => {
      let index = 0;
      const interval = window.setInterval(() => {
        index = Math.min(index + step, fullText.length);
        const next = fullText.slice(0, index);
        setTypingMessage({ id, role: "assistant", content: next, products: message.products });
        if (index >= fullText.length) {
          window.clearInterval(interval);
          resolve();
        }
      }, 22);
    });

    setTypingMessage(null);
    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: fullText,
        products: message.products,
      },
    ]);
  };

  const buildSmartReply = (rawText: string) => {
    const text = rawText.toLowerCase();
    const budgetMatch = text.match(/(?:₹|rs\.?|inr)?\s?(\d{2,6})/i);
    const budget = budgetMatch ? Number(budgetMatch[1]) : null;

    if (text.includes("birthday")) {
      return {
        content:
          "Lovely choice 🎉 Here are popular birthday picks. You may also like adding a personalized card to make a cute gift combo. Who are you buying for?",
        products: toChatProducts(findProducts("birthday")),
      };
    }

    if (text.includes("anniversary")) {
      return {
        content:
          "So sweet 💝 These anniversary gifts are customer favorites. Limited stock on some handmade pieces this week.",
        products: toChatProducts(findProducts("anniversary")),
      };
    }

    if (text.includes("festival") || text.includes("diwali") || text.includes("rakhi")) {
      return {
        content:
          "Great festive idea ✨ Here are trending festive options. Customers also buy gift boxes + mini keepsakes together.",
        products: toChatProducts(findProducts("festival")),
      };
    }

    if (budget && budget > 0) {
      return {
        content:
          `Perfect, I found handmade options within ₹${budget} 🎁 Do you want more aesthetic style or personalized style?`,
        products: toChatProducts(findByBudget(budget)),
      };
    }

    if (text.includes("gift") || text.includes("surprise")) {
      return {
        content:
          "I can help you pick the perfect one 😊 Here are a few bestsellers to start with. What is the occasion and budget?",
        products: toChatProducts(findProducts("gift")),
      };
    }

    return null;
  };

  const handleUserMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const localReply = buildSmartReply(trimmed);
    if (localReply) {
      await typeAssistantMessage(localReply);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          message: trimmed,
          system:
            "You are Varnika shopping assistant. Be warm, short, and helpful. Ask who the gift is for, budget, and occasion. Recommend products and combos naturally.",
        },
      });

      if (error) throw error;

      await typeAssistantMessage({
        content:
          data?.reply ||
          "I can help with gift ideas 🌸 Tell me the occasion, budget, and who you are buying for.",
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Chat error:", error);
      }
      await typeAssistantMessage({
        content:
          "Sorry, I had a tiny connection issue 💫 Please try again. Meanwhile, share your budget and occasion and I will suggest options.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleUserMessage(input);
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

      {!isOpen && showGreetingHint && (
        <div className="fixed bottom-24 right-6 z-50 max-w-[240px] rounded-2xl border border-border bg-card px-3 py-2 shadow-elevated animate-fade-in-up">
          <p className="text-xs font-body text-espresso">
            Hi! Need gift ideas? 🎁
          </p>
        </div>
      )}

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
          {[...messages, ...(typingMessage ? [typingMessage] : [])].map((message) => (
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
                <p>{message.content}</p>
                {message.products && message.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.products.slice(0, 3).map((product) => (
                      <div key={product.id} className="bg-cream border border-border rounded-xl p-2">
                        <div className="flex gap-2">
                          <OptimizedImage
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-14 h-14 rounded-lg object-cover"
                            containerClassName="w-14 h-14 shrink-0"
                            optimizeWidth={120}
                            optimizeHeight={120}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-espresso line-clamp-2">{product.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">₹{product.price}</p>
                            {product.customizable && (
                              <p className="text-[10px] text-gold mt-0.5">Customizable</p>
                            )}
                            <Button asChild size="sm" className="h-7 mt-1.5 rounded-full text-xs px-3">
                              <Link to={`/product/${product.id}`}>View Product</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

        {/* Quick replies */}
        <div className="px-4 pt-3 bg-card border-t border-border/70">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[11px] font-body text-muted-foreground">Quick picks</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(hasUserMessages ? QUICK_REPLIES.slice(0, 3) : QUICK_REPLIES).map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => void handleUserMessage(label)}
                className="px-3 py-1.5 rounded-full text-xs font-body border border-border bg-cream hover:bg-background transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-border/70 bg-card">
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